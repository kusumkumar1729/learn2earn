// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title TaskController
 * @dev Manages tasks and automatic verification for Learn2Earn.
 *      Handles conditional verification and automatic token distribution.
 */
contract TaskController is Ownable, ReentrancyGuard {
    using ECDSA for bytes32;

    IERC20 public eduToken;

    enum VerificationType {
        INSTANT,        // No condition, just claim (for testing/simple tasks)
        TOKEN_BALANCE,  // User must hold >= X amount of tokens
        SIGNATURE,      // Off-chain verification (Quiz, File, etc) signed by admin
        EXTERNAL_CONTRACT // Check external contract state (placeholder)
    }

    struct Task {
        uint256 id;
        string title;
        string condition;   // New: Condition string (e.g. "Attendance > 90%")
        uint256 reward;
        VerificationType verificationType;
        uint256 minTokenBalance;
        bool isActive;
    }

    // Task ID -> Task
    mapping(uint256 => Task) public tasks;
    uint256 public nextTaskId;

    // Task ID -> User -> Completed
    mapping(uint256 => mapping(address => bool)) public hasCompletedTask;

    event TaskCreated(uint256 indexed taskId, string title, string condition, uint256 reward, VerificationType verificationType);
    event TaskUpdated(uint256 indexed taskId, bool isActive);
    event TaskVerified(uint256 indexed taskId, address indexed student, uint256 reward);

    constructor(address _eduToken) Ownable(msg.sender) {
        require(_eduToken != address(0), "Invalid token address");
        eduToken = IERC20(_eduToken);
        nextTaskId = 1;
    }

    /**
     * @dev Admin creates a new task.
     */
    function createTask(
        string calldata _title,
        string calldata _condition,
        uint256 _reward,
        VerificationType _verificationType,
        uint256 _minTokenBalance
    ) external onlyOwner {
        tasks[nextTaskId] = Task({
            id: nextTaskId,
            title: _title,
            condition: _condition,
            reward: _reward,
            verificationType: _verificationType,
            minTokenBalance: _minTokenBalance,
            isActive: true
        });

        emit TaskCreated(nextTaskId, _title, _condition, _reward, _verificationType);
        nextTaskId++;
    }

    /**
     * @dev Admin updates task status.
     */
    function setTaskStatus(uint256 _taskId, bool _isActive) external onlyOwner {
        require(tasks[_taskId].id != 0, "Task does not exist");
        tasks[_taskId].isActive = _isActive;
        emit TaskUpdated(_taskId, _isActive);
    }

    /**
     * @dev Student verifies task completion and claims reward.
     * @param _taskId Task ID to verify
     * @param _signature Signature from admin (if required), or empty bytes
     */
    function verifyTask(uint256 _taskId, bytes calldata _signature) external nonReentrant {
        Task memory task = tasks[_taskId];

        require(task.id != 0, "Task does not exist");
        require(task.isActive, "Task is not active");
        require(!hasCompletedTask[_taskId][msg.sender], "Task already completed");

        // Verify based on type
        if (task.verificationType == VerificationType.INSTANT) {
            // No check needed
        } 
        else if (task.verificationType == VerificationType.TOKEN_BALANCE) {
            require(eduToken.balanceOf(msg.sender) >= task.minTokenBalance, "Insufficient token balance");
        } 
        else if (task.verificationType == VerificationType.SIGNATURE) {
            // Reconstruct the signed message: hash(taskId, studentAddress)
            bytes32 messageHash = keccak256(abi.encodePacked(_taskId, msg.sender));
            bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(messageHash);
            
            address signer = ECDSA.recover(ethSignedMessageHash, _signature);
            require(signer == owner(), "Invalid signature");
        }
        else {
            revert("Unsupported verification type");
        }

        // Mark as completed
        hasCompletedTask[_taskId][msg.sender] = true;

        // Distribute Reward
        // Transfer from Admin (Owner) to Student
        // Requires Admin to have approved this contract!
        require(eduToken.transferFrom(owner(), msg.sender, task.reward), "Transfer failed. Admin/Contract allowance?");

        emit TaskVerified(_taskId, msg.sender, task.reward);
    }

    /**
     * @dev Check if a user has completed a task.
     */
    function isTaskCompleted(uint256 _taskId, address _user) external view returns (bool) {
        return hasCompletedTask[_taskId][_user];
    }
}
