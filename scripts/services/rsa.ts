import { ethers } from "ethers";
import { ECCValue } from "./vault";
import { abi, provider } from "../config";

export const signMessage = async (to: string, signatureTimestamp: number, eccValue: ECCValue): Promise<string> => {

  // NFC chip should be registered only in one contract
  const contractAddress = eccValue.contract
  const chipAddress = eccValue.address;
  const chainId = eccValue.chainId;

  const wallet = new ethers.Wallet(eccValue.private_key, provider);
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  const nonce = await contract.chipNonce(chipAddress);

  // Compute the Solidity-equivalent message hash
  const messageHash = ethers.solidityPackedKeccak256(
      ["address", "uint256", "address", "uint256", "address", "uint256"],
      [contractAddress, chainId, chipAddress, nonce, to, signatureTimestamp]
  );

  // Convert to Ethereum Signed Message Hash
  const ethSignedMessageHash = ethers.hashMessage(ethers.getBytes(messageHash));

  // Sign the hash using the private key
  const chipSignature = await wallet.signMessage(ethers.getBytes(messageHash));
  console.log("Generated signature: ", { chipAddress, nonce, chipSignature})

  return chipSignature;
}
