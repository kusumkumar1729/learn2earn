// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/**
 * @title CourseMarketplace
 * @dev Handles course enrollment using EDU tokens.
 *      Admin creates courses with a price. Students approve & pay EDU tokens to enroll.
 */
contract CourseMarketplace is Ownable, ReentrancyGuard, Pausable {
    IERC20 public eduToken;

    struct Course {
        uint256 id;
        string name;
        uint256 price;      // in EDU (wei)
        uint256 spots;       // max spots (0 = unlimited)
        uint256 enrolled;    // current enrollments
        bool active;
    }

    uint256 public nextCourseId;
    mapping(uint256 => Course) public courses;
    mapping(uint256 => mapping(address => bool)) public enrollments; // courseId => student => enrolled

    // Revenue tracking
    uint256 public totalRevenue;

    // Events
    event CourseCreated(uint256 indexed courseId, string name, uint256 price, uint256 spots);
    event CourseUpdated(uint256 indexed courseId, uint256 price, bool active);
    event StudentEnrolled(uint256 indexed courseId, address indexed student, uint256 price);
    event RevenueWithdrawn(address indexed to, uint256 amount);

    constructor(address _eduToken) Ownable(msg.sender) {
        require(_eduToken != address(0), "Marketplace: invalid token address");
        eduToken = IERC20(_eduToken);
    }

    /**
     * @dev Admin creates a new course.
     */
    function createCourse(string calldata name, uint256 price, uint256 spots) external onlyOwner whenNotPaused {
        require(price > 0, "Marketplace: price must be > 0");

        uint256 courseId = nextCourseId++;
        courses[courseId] = Course({
            id: courseId,
            name: name,
            price: price,
            spots: spots,
            enrolled: 0,
            active: true
        });

        emit CourseCreated(courseId, name, price, spots);
    }

    /**
     * @dev Admin updates course price or active status.
     */
    function updateCourse(uint256 courseId, uint256 price, bool active) external onlyOwner {
        require(courseId < nextCourseId, "Marketplace: course does not exist");
        courses[courseId].price = price;
        courses[courseId].active = active;
        emit CourseUpdated(courseId, price, active);
    }

    /**
     * @dev Student enrolls in a course by paying EDU tokens.
     *      Student must approve this contract to spend their tokens first.
     */
    function enroll(uint256 courseId) external whenNotPaused nonReentrant {
        Course storage course = courses[courseId];

        require(courseId < nextCourseId, "Marketplace: course does not exist");
        require(course.active, "Marketplace: course not active");
        require(!enrollments[courseId][msg.sender], "Marketplace: already enrolled");
        require(course.spots == 0 || course.enrolled < course.spots, "Marketplace: course full");

        // Transfer tokens from student to this contract
        bool success = eduToken.transferFrom(msg.sender, address(this), course.price);
        require(success, "Marketplace: token transfer failed");

        enrollments[courseId][msg.sender] = true;
        course.enrolled++;
        totalRevenue += course.price;

        emit StudentEnrolled(courseId, msg.sender, course.price);
    }

    /**
     * @dev Check if a student is enrolled in a course.
     */
    function isEnrolled(uint256 courseId, address student) external view returns (bool) {
        return enrollments[courseId][student];
    }

    /**
     * @dev Get course details.
     */
    function getCourse(uint256 courseId) external view returns (Course memory) {
        require(courseId < nextCourseId, "Marketplace: course does not exist");
        return courses[courseId];
    }

    /**
     * @dev Get total number of courses.
     */
    function getCourseCount() external view returns (uint256) {
        return nextCourseId;
    }

    /**
     * @dev Admin withdraws accumulated revenue.
     */
    function withdrawRevenue(address to) external onlyOwner nonReentrant {
        uint256 balance = eduToken.balanceOf(address(this));
        require(balance > 0, "Marketplace: no revenue to withdraw");
        bool success = eduToken.transfer(to, balance);
        require(success, "Marketplace: withdrawal failed");
        emit RevenueWithdrawn(to, balance);
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }
}
