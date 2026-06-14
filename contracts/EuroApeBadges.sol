// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IEuroApeProfile {
    function hasVerifiedProfile(address user) external view returns (bool);
}

contract EuroApeBadges is ERC1155, Ownable {
    uint256 public constant CITY_GUIDE = 1;
    uint256 public constant CONNECTOR = 2;
    uint256 public constant FREQUENT_FLYER = 3;
    uint256 public constant TOP_HOST = 4;

    IEuroApeProfile public profileContract;

    mapping(address => bool) public badgeIssuers;
    mapping(uint256 => string) private badgeURIs;

    event BadgeIssued(address indexed to, uint256 indexed badgeId);
    event BadgeRevoked(address indexed from, uint256 indexed badgeId);
    event BadgeIssuerUpdated(address indexed issuer, bool active);
    event BadgeURIUpdated(uint256 indexed badgeId, string uri);

    modifier onlyBadgeIssuer() {
        require(badgeIssuers[msg.sender] || msg.sender == owner(), "Not badge issuer");
        _;
    }

    constructor(address _profileContract, string memory defaultURI)
    ERC1155(defaultURI)
    Ownable(msg.sender)
    {
        profileContract = IEuroApeProfile(_profileContract);
    }

    function setBadgeIssuer(address issuer, bool active) external onlyOwner {
        badgeIssuers[issuer] = active;
        emit BadgeIssuerUpdated(issuer, active);
    }

    function setBadgeURI(uint256 badgeId, string calldata newURI) external onlyOwner {
        badgeURIs[badgeId] = newURI;
        emit BadgeURIUpdated(badgeId, newURI);
    }

    function uri(uint256 badgeId) public view override returns (string memory) {
        string memory customURI = badgeURIs[badgeId];

        if (bytes(customURI).length > 0) {
            return customURI;
        }

        return super.uri(badgeId);
    }

    function issueBadge(address to, uint256 badgeId) external onlyBadgeIssuer {
        require(profileContract.hasVerifiedProfile(to), "User not verified");
        require(balanceOf(to, badgeId) == 0, "Badge already issued");
        require(isValidBadge(badgeId), "Invalid badge");

        _mint(to, badgeId, 1, "");
        emit BadgeIssued(to, badgeId);
    }

    function revokeBadge(address from, uint256 badgeId) external onlyBadgeIssuer {
        require(balanceOf(from, badgeId) > 0, "Badge not owned");

        _burn(from, badgeId, 1);
        emit BadgeRevoked(from, badgeId);
    }

    function hasBadge(address user, uint256 badgeId) external view returns (bool) {
        return balanceOf(user, badgeId) > 0;
    }

    function setProfileContract(address _profileContract) external onlyOwner {
        profileContract = IEuroApeProfile(_profileContract);
    }

    function isValidBadge(uint256 badgeId) public pure returns (bool) {
        return
                badgeId == CITY_GUIDE ||
                badgeId == CONNECTOR ||
                badgeId == FREQUENT_FLYER ||
                badgeId == TOP_HOST;
    }

    // Soulbound: disable transfers between users.
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override {
        require(
            from == address(0) || to == address(0),
            "Soulbound: transfers disabled"
        );

        super._update(from, to, ids, values);
    }
}