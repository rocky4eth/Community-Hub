import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";

export const EURO_APE_PROFILE_ADDRESS = "0xa50a2CdD0dC80b9D2544068EB8a36da13Ce56e18";

// IMPORTANT: Replace this with your actual compiled ABI from Hardhat!
// You can find this in artifacts/contracts/EuroApeProfile.sol/EuroApeProfile.json
export const EURO_APE_PROFILE_ABI = [
  {
    inputs: [
      {
        "internalType": "string",
        "name": "city",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "country",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "metadataURI",
        "type": "string"
      }
    ],
    name: "createProfile",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    name: "getProfile",
    outputs: [
      {
        "components": [
          {
            "internalType": "bool",
            "name": "exists",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "verified",
            "type": "bool"
          },
          {
            "internalType": "string",
            "name": "city",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "country",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "metadataURI",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "createdAt",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "updatedAt",
            "type": "uint256"
          }
        ],
        "internalType": "struct EuroApeProfile.Profile",
        "name": "",
        "type": "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
] as const;

export function useEuroApeProfile(userAddress?: `0x${string}`) {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const handleCreateProfile = (city: string, country: string, metadataURI: string) => {
    writeContract({
      address: EURO_APE_PROFILE_ADDRESS,
      abi: EURO_APE_PROFILE_ABI,
      functionName: "createProfile", // Match the function name in your ABI
      args: [city, country, metadataURI], 
    });
  };

  // Reactive hook to fetch the profile data automatically when userAddress is provided
  const {
    data: profile,
    isLoading: isProfileLoading,
    refetch: handleGetProfile,
  } = useReadContract({
    address: EURO_APE_PROFILE_ADDRESS,
    abi: EURO_APE_PROFILE_ABI,
    functionName: "getProfile",
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress, // Only fetch if an address is provided
    },
  });

  return {
    createProfile: handleCreateProfile,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    profile,
    isProfileLoading,
    handleGetProfile,
  };
}