// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IEuroApeProfile {
    function hasVerifiedProfile(address user) external view returns (bool);
}

contract EuroApeNoticeboard is Ownable {
    enum NoticeType {
        Request,
        Offer,
        Event,
        General
    }

    struct Notice {
        uint256 id;
        address author;
        NoticeType noticeType;
        string city;
        string metadataURI; // IPFS/Arweave JSON with title, description, links, images
        bool active;
        uint256 createdAt;
        uint256 updatedAt;
    }

    IEuroApeProfile public profileContract;

    uint256 public nextNoticeId = 1;

    mapping(uint256 => Notice) public notices;
    mapping(address => uint256[]) public userNotices;
    mapping(string => uint256[]) private cityNotices;

    event NoticeCreated(
        uint256 indexed id,
        address indexed author,
        NoticeType noticeType,
        string city,
        string metadataURI
    );

    event NoticeUpdated(
        uint256 indexed id,
        string city,
        string metadataURI,
        bool active
    );

    event NoticeClosed(uint256 indexed id, address indexed author);

    constructor(address _profileContract) Ownable(msg.sender) {
        profileContract = IEuroApeProfile(_profileContract);
    }

    modifier onlyVerifiedEuroApe() {
        require(
            profileContract.hasVerifiedProfile(msg.sender),
            "Not verified EuroApe"
        );
        _;
    }

    modifier onlyNoticeAuthor(uint256 noticeId) {
        require(notices[noticeId].author == msg.sender, "Not notice author");
        _;
    }

    function createNotice(
        NoticeType noticeType,
        string calldata city,
        string calldata metadataURI
    ) external onlyVerifiedEuroApe returns (uint256) {
        uint256 noticeId = nextNoticeId++;

        notices[noticeId] = Notice({
            id: noticeId,
            author: msg.sender,
            noticeType: noticeType,
            city: city,
            metadataURI: metadataURI,
            active: true,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });

        userNotices[msg.sender].push(noticeId);
        cityNotices[city].push(noticeId);

        emit NoticeCreated(
            noticeId,
            msg.sender,
            noticeType,
            city,
            metadataURI
        );

        return noticeId;
    }

    function updateNotice(
        uint256 noticeId,
        string calldata city,
        string calldata metadataURI,
        bool active
    ) external onlyNoticeAuthor(noticeId) {
        require(notices[noticeId].id != 0, "Notice does not exist");

        Notice storage notice = notices[noticeId];

        notice.city = city;
        notice.metadataURI = metadataURI;
        notice.active = active;
        notice.updatedAt = block.timestamp;

        cityNotices[city].push(noticeId);

        emit NoticeUpdated(noticeId, city, metadataURI, active);
    }

    function closeNotice(
        uint256 noticeId
    ) external onlyNoticeAuthor(noticeId) {
        require(notices[noticeId].id != 0, "Notice does not exist");

        notices[noticeId].active = false;
        notices[noticeId].updatedAt = block.timestamp;

        emit NoticeClosed(noticeId, msg.sender);
    }

    function getNotice(uint256 noticeId) external view returns (Notice memory) {
        return notices[noticeId];
    }

    function getUserNotices(
        address user
    ) external view returns (uint256[] memory) {
        return userNotices[user];
    }

    function getCityNotices(
        string calldata city
    ) external view returns (uint256[] memory) {
        return cityNotices[city];
    }

    function setProfileContract(address _profileContract) external onlyOwner {
        profileContract = IEuroApeProfile(_profileContract);
    }
}
