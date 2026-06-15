/**
 * Fetches and resolves the actual image URL from an NFT metadata URI.
 * Converts IPFS protocols to a Pinata HTTP gateway.
 */
export async function fetchNftMetadataImage(uri: string): Promise<string> {
  if (!uri) return "";

  const gatewayUrl = uri.startsWith("ipfs://")
    ? uri.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
    : uri;

  try {
    const response = await fetch(gatewayUrl);
    const contentType = response.headers.get("content-type");

    // If the URL returns a JSON, it's a standard NFT metadata file
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      if (data.image) {
        return data.image.startsWith("ipfs://")
          ? data.image.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
          : data.image;
      }
    }
  } catch (err) {
    console.error("Failed to fetch NFT metadata:", err);
  }
  
  // Fallback in case it's a direct image, doesn't have an image field, or fetch failed (e.g., CORS)
  return gatewayUrl;
}