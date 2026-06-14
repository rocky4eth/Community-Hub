const hre = require("hardhat");

async function main() {
    const EuroApeProfile = await hre.ethers.getContractFactory("EuroApeProfile");

    // Deploy EuroApeProfile
    const profileContract = await EuroApeProfile.deploy();
    await profileContract.waitForDeployment();
    console.log("EuroApeProfile deployed to:", await profileContract.getAddress());

    // Deploy EuroApeNoticeboard
    const EuroApeNoticeboard = await hre.ethers.getContractFactory("EuroApeNoticeboard");
    const noticeboardContract = await EuroApeNoticeboard.deploy(await profileContract.getAddress());
    await noticeboardContract.waitForDeployment();
    console.log("EuroApeNoticeboard deployed to:", await noticeboardContract.getAddress());

    // Deploy EuroApeBadges
     const EuroApeBadges = await hre.ethers.getContractFactory("EuroApeBadges");
     const defaultBadgeURI = "ipfs://YOUR_DEFAULT_URI_HERE/{id}.json"; // Replace with actual URI
     const badgesContract = await EuroApeBadges.deploy(await profileContract.getAddress(), defaultBadgeURI);
     await badgesContract.waitForDeployment();
     console.log("EuroApeBadges deployed to:", await badgesContract.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
