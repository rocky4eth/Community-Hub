// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract EuroApeProfile is Ownable {
    struct Profile {
        bool exists;
        bool verified;
        string city;
        string country;
        string metadataURI; // IPFS/Arweave JSON profile
        uint256 createdAt;
        uint256 updatedAt;
    }

    mapping(address => Profile) public profiles;
    mapping(address => bool) public verifiers;

    event ProfileCreated(address indexed user, string city, string country, string metadataURI);
    event ProfileUpdated(address indexed user, string city, string country, string metadataURI);
    event ProfileVerified(address indexed user, bool verified);
    event VerifierUpdated(address indexed verifier, bool active);

    modifier onlyVerifier() {
        require(verifiers[msg.sender] || msg.sender == owner(), "Not verifier");
        _;
    }

    constructor() Ownable(msg.sender) {}

    function setVerifier(address verifier, bool active) external onlyOwner {
        verifiers[verifier] = active;
        emit VerifierUpdated(verifier, active);
    }

    function createProfile(
        string calldata city,
        string calldata country,
        string calldata metadataURI
    ) external {
        require(!profiles[msg.sender].exists, "Profile already exists");

        profiles[msg.sender] = Profile({
            exists: true,
            verified: false,
            city: city,
            country: country,
            metadataURI: metadataURI,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });

        emit ProfileCreated(msg.sender, city, country, metadataURI);
    }

    function updateProfile(
        string calldata city,
        string calldata country,
        string calldata metadataURI
    ) external {
        require(profiles[msg.sender].exists, "Profile does not exist");

        Profile storage profile = profiles[msg.sender];

        profile.city = city;
        profile.country = country;
        profile.metadataURI = metadataURI;
        profile.updatedAt = block.timestamp;

        emit ProfileUpdated(msg.sender, city, country, metadataURI);
    }

    function setVerified(address user, bool verified) external onlyVerifier {
        require(profiles[user].exists, "Profile does not exist");

        profiles[user].verified = verified;
        profiles[user].updatedAt = block.timestamp;

        emit ProfileVerified(user, verified);
    }

    function getProfile(address user) external view returns (Profile memory) {
        return profiles[user];
    }

    function hasVerifiedProfile(address user) external view returns (bool) {
        return profiles[user].exists && profiles[user].verified;
    }
}