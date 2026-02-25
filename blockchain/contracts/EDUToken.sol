// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title EDUToken
 * @dev Learn2Earn ERC20 Token with capped supply, burnable, pausable, and admin-mint functionality.
 *      Owner (admin) starts with 1,000,000 EDU. Max supply is 100,000,000 EDU.
 */
contract EDUToken is ERC20, ERC20Burnable, ERC20Capped, Ownable, ReentrancyGuard, Pausable {
    // Events
    event TokensMinted(address indexed to, uint256 amount, string reason);
    event TokensBurned(address indexed from, uint256 amount);
    event RewardSent(address indexed admin, address indexed student, uint256 amount, string reason);

    /**
     * @dev Constructor mints 1,000,000 EDU tokens to the deployer (admin).
     *      Max cap is 100,000,000 EDU.
     */
    constructor()
        ERC20("Learn2Earn", "EDU")
        ERC20Capped(100_000_000 * 10 ** 18)
        Ownable(msg.sender)
    {
        // Mint initial 1M tokens to admin
        _mint(msg.sender, 1_000_000 * 10 ** 18);
    }

    /**
     * @dev Admin-only function to mint tokens to a student wallet.
     * @param to Recipient address
     * @param amount Token amount (in wei)
     * @param reason Description of why the tokens are minted
     */
    function mint(address to, uint256 amount, string calldata reason) external onlyOwner whenNotPaused nonReentrant {
        require(to != address(0), "EDU: mint to zero address");
        require(amount > 0, "EDU: amount must be > 0");
        _mint(to, amount);
        emit TokensMinted(to, amount, reason);
    }

    /**
     * @dev Admin sends reward tokens to a student from admin balance.
     * @param student Student wallet address
     * @param amount Token amount (in wei)
     * @param reason Description for the reward
     */
    function rewardStudent(address student, uint256 amount, string calldata reason) external onlyOwner whenNotPaused nonReentrant {
        require(student != address(0), "EDU: reward to zero address");
        require(amount > 0, "EDU: amount must be > 0");
        require(balanceOf(msg.sender) >= amount, "EDU: insufficient admin balance");
        _transfer(msg.sender, student, amount);
        emit RewardSent(msg.sender, student, amount, reason);
    }

    /**
     * @dev Pause token operations. Only owner.
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause token operations. Only owner.
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    // ─── Required Overrides ─────────────────────────────

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Capped)
    {
        super._update(from, to, value);
    }
}
