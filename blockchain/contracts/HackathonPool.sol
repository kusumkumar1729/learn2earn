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
 * @title HackathonPool
 * @dev Manages hackathon registrations with EDU token entry fees and prize distribution.
 */
contract HackathonPool is Ownable, ReentrancyGuard, Pausable {
    IERC20 public eduToken;

    struct Hackathon {
        uint256 id;
        string name;
        uint256 entryFee;        // in EDU (wei)
        uint256 maxParticipants;
        uint256 participantCount;
        bool active;
        bool rewardsDistributed;
    }

    uint256 public nextHackathonId;
    mapping(uint256 => Hackathon) public hackathons;
    mapping(uint256 => mapping(address => bool)) public registrations;
    mapping(uint256 => address[]) public participantLists;

    // Events
    event HackathonCreated(uint256 indexed hackathonId, string name, uint256 entryFee, uint256 maxParticipants);
    event StudentRegistered(uint256 indexed hackathonId, address indexed student, uint256 entryFee);
    event RewardsDistributed(uint256 indexed hackathonId, address[] winners, uint256[] amounts);

    constructor(address _eduToken) Ownable(msg.sender) {
        require(_eduToken != address(0), "HackathonPool: invalid token");
        eduToken = IERC20(_eduToken);
    }

    /**
     * @dev Admin creates a hackathon.
     */
    function createHackathon(string calldata name, uint256 entryFee, uint256 maxParticipants) external onlyOwner whenNotPaused {
        uint256 hackathonId = nextHackathonId++;
        hackathons[hackathonId] = Hackathon({
            id: hackathonId,
            name: name,
            entryFee: entryFee,
            maxParticipants: maxParticipants,
            participantCount: 0,
            active: true,
            rewardsDistributed: false
        });
        emit HackathonCreated(hackathonId, name, entryFee, maxParticipants);
    }

    /**
     * @dev Student registers for a hackathon by paying the entry fee.
     */
    function register(uint256 hackathonId) external whenNotPaused nonReentrant {
        Hackathon storage h = hackathons[hackathonId];
        require(hackathonId < nextHackathonId, "HackathonPool: does not exist");
        require(h.active, "HackathonPool: not active");
        require(!registrations[hackathonId][msg.sender], "HackathonPool: already registered");
        require(h.maxParticipants == 0 || h.participantCount < h.maxParticipants, "HackathonPool: full");

        if (h.entryFee > 0) {
            bool success = eduToken.transferFrom(msg.sender, address(this), h.entryFee);
            require(success, "HackathonPool: payment failed");
        }

        registrations[hackathonId][msg.sender] = true;
        participantLists[hackathonId].push(msg.sender);
        h.participantCount++;

        emit StudentRegistered(hackathonId, msg.sender, h.entryFee);
    }

    /**
     * @dev Admin distributes prize rewards to winners.
     */
    function distributeRewards(
        uint256 hackathonId,
        address[] calldata winners,
        uint256[] calldata amounts
    ) external onlyOwner nonReentrant {
        require(hackathonId < nextHackathonId, "HackathonPool: does not exist");
        require(winners.length == amounts.length, "HackathonPool: length mismatch");
        require(!hackathons[hackathonId].rewardsDistributed, "HackathonPool: already distributed");

        for (uint256 i = 0; i < winners.length; i++) {
            require(winners[i] != address(0), "HackathonPool: zero address winner");
            bool success = eduToken.transfer(winners[i], amounts[i]);
            require(success, "HackathonPool: transfer failed");
        }

        hackathons[hackathonId].rewardsDistributed = true;
        emit RewardsDistributed(hackathonId, winners, amounts);
    }

    /**
     * @dev Check if registered.
     */
    function isRegistered(uint256 hackathonId, address student) external view returns (bool) {
        return registrations[hackathonId][student];
    }

    /**
     * @dev Get participant list.
     */
    function getParticipants(uint256 hackathonId) external view returns (address[] memory) {
        return participantLists[hackathonId];
    }

    /**
     * @dev Get hackathon count.
     */
    function getHackathonCount() external view returns (uint256) {
        return nextHackathonId;
    }

    /**
     * @dev Deactivate a hackathon.
     */
    function deactivateHackathon(uint256 hackathonId) external onlyOwner {
        require(hackathonId < nextHackathonId, "HackathonPool: does not exist");
        hackathons[hackathonId].active = false;
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }
}
