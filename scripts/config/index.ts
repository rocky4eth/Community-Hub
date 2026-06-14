import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : `.env` });

export const provider = new ethers.JsonRpcProvider(`${process.env.JSON_RPC_PROVIDER}`);
export const contractAddress: string = `${process.env.CONTRACT_ADDRESS}`
export const databaseFilePath: string = `${process.env.DATABASE_FILE_PATH}`
export const claimPrivateKey: string = `${process.env.CLAIM_PRIVATE_KEY}`

export const abi = [
    "function mint(address to, address chipId, bytes chipSignature, uint256 signatureTimestamp) external returns (uint256)",
    "function chipNonce(address chipId) view returns (uint256)",
    "function transferToken(address to, address chipId, bytes memory chipSignature, uint256 signatureTimestamp, bool useSafeTransfer) returns (uint256 tokenId)",
    "function balanceOf(address owner) view returns (uint256)",
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function tokenIdFor(address chipId) view returns (uint256)",
    "function tokenURI(uint256 tokenId) view returns (string)",
    "function tokenURIFor(address chipId) external view returns (string memory)",
    "function totalSupply() external view returns (uint256)",
    "function listToken(uint256 tokenId, uint256 price)",
    "function cancelListing(uint256 tokenId) external",
    "function buyToken(address chipId, bytes memory chipSignature, uint256 signatureTimestamp, bool useSafeTransfer) external payable",
    "function listings(uint256 tokenId) view returns (address seller, uint256 price)",
];

// NXP configuration
export const maxDurationWindow = Number(process.env.MAX_DURATION_WINDOW)
export const nxpStaticPrefix = "3CC300010080"; // this is static value from NXP
