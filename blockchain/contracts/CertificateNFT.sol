// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title CertificateNFT
 * @dev ERC721 NFT for verified academic certificates.
 *      Only the admin (owner) can mint certificates.
 *      Metadata (title, description, image) is stored on IPFS; only CID is stored on-chain.
 */
contract CertificateNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard, Pausable {
    uint256 private _nextTokenId;

    // Events
    event CertificateIssued(uint256 indexed tokenId, address indexed student, string uri, string title);
    event CertificateRevoked(uint256 indexed tokenId);

    // Certificate metadata stored on-chain for quick lookups
    struct CertificateData {
        string title;
        string category;
        address student;
        uint256 issuedAt;
        bool revoked;
    }

    mapping(uint256 => CertificateData) public certificates;

    constructor() ERC721("Learn2Earn Certificate", "L2ECERT") Ownable(msg.sender) {}

    /**
     * @dev Mint a new certificate NFT to a student.
     * @param student The student's wallet address
     * @param uri IPFS URI for the certificate metadata
     * @param title Certificate title
     * @param category Certificate category (e.g., "Course Completion", "Achievement")
     */
    function safeMint(
        address student,
        string calldata uri,
        string calldata title,
        string calldata category
    ) external onlyOwner whenNotPaused nonReentrant returns (uint256) {
        require(student != address(0), "CertificateNFT: mint to zero address");

        uint256 tokenId = _nextTokenId++;
        _safeMint(student, tokenId);
        _setTokenURI(tokenId, uri);

        certificates[tokenId] = CertificateData({
            title: title,
            category: category,
            student: student,
            issuedAt: block.timestamp,
            revoked: false
        });

        emit CertificateIssued(tokenId, student, uri, title);
        return tokenId;
    }

    /**
     * @dev Revoke a certificate (marks as revoked, does NOT burn).
     * @param tokenId The certificate token ID
     */
    function revokeCertificate(uint256 tokenId) external onlyOwner {
        require(tokenId < _nextTokenId, "CertificateNFT: token does not exist");
        certificates[tokenId].revoked = true;
        emit CertificateRevoked(tokenId);
    }

    /**
     * @dev Get the total number of minted certificates.
     */
    function totalSupply() external view returns (uint256) {
        return _nextTokenId;
    }

    /**
     * @dev Get certificate data by token ID.
     */
    function getCertificate(uint256 tokenId) external view returns (CertificateData memory) {
        require(tokenId < _nextTokenId, "CertificateNFT: token does not exist");
        return certificates[tokenId];
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    // ─── Required Overrides ─────────────────────────────

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
