import dotenv from 'dotenv';
dotenv.config();

export const fetchImageUrl = async (tokenURI: string): Promise<string> => {
  try {
      const metadataURL = tokenURI.replace("ipfs://", process.env.IPFS_GATEWAY_URL!);
      const response = await fetch(metadataURL);
      const data = await response.json()
      return data.image.replace("ipfs://", process.env.IPFS_GATEWAY_URL);
  } catch (error) {
      console.error("Error to get image url", error);
  }

  return "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";
}
