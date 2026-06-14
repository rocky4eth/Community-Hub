import pinataSDK from "@pinata/sdk";
import fs from "fs";
import { config } from "dotenv";
import path from "path";

// Load .env variables
config();

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;
const pinata = new pinataSDK(PINATA_API_KEY, PINATA_SECRET_API_KEY);

const uploadMetadataToIPFS = async (jsonData, filePath) => {
  fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
  const fileName = path.basename(filePath);
  const fileStream = fs.createReadStream(filePath);

  const options = {
    pinataMetadata: {
        name: fileName,
    },
    pinataOptions: {
        cidVersion: 0,
    },
  };

  return await pinata.pinFileToIPFS(fileStream, options);
}

const uploadFileToIPFS = async (filePath) => {
  const fileStream = fs.createReadStream(filePath);
  const fileName = path.basename(filePath);

  console.log("📂 Uploading file:", fileName);

  const options = {
      pinataMetadata: {
          name: fileName,
      },
      pinataOptions: {
          cidVersion: 0,
      },
  };

  return await pinata.pinFileToIPFS(fileStream, options);
};

const uploadAssetsToIPFS = async (folderPath) => {
  const files = fs.readdirSync(folderPath);
  const pngFiles = files
    .filter((file) => path.extname(file).toLowerCase() === ".png");

  const ipfsArray = [];
  
  for (const [index, fileName] of pngFiles.entries()) {
    const fullPath = path.join(folderPath, fileName);
    console.log(`Processing: ${fullPath}, index: ${index}`);
    const name = fileName.replace(".png", "");
    const jsonFile = fullPath.replace(".png", ".json");
    const data = fs.readFileSync(jsonFile, "utf-8");
    const jsonDataFromFile = JSON.parse(data);

    const resultImage = await uploadFileToIPFS(fullPath);
    const cid = resultImage.IpfsHash;
    console.log(`Uploaded image ${fullPath}, ipfs://${cid}`);

    const jsonDataUpdated = {
      ...jsonDataFromFile,
      name: `#${name}`,
      image: `ipfs://${cid}`,
      edition: Number(name)
    }

    const resultMetadata = await uploadMetadataToIPFS(jsonDataUpdated, jsonFile);
    ipfsArray.push(`ipfs://${resultMetadata.IpfsHash}`);
    console.log(`Uploaded metadata ${jsonFile}, ipfs://${resultMetadata.IpfsHash}`);
  };    

  return ipfsArray;
}


async function main() {
  try {

    // const result = await uploadToIPFS("./images/1.png");
    // console.log(`https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`);
    // await uploadMetadataToIPFS(result.IpfsHash)

    const ipfsArray = await uploadAssetsToIPFS("./ipfs");
    console.log("Uploaded assets: ", ipfsArray);

  } catch (error) {
    console.error("Error uploading to IPFS:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
