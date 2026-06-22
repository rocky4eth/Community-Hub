import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";

// IMPORTANT: Replace this with your deployed EuroApeNoticeboard contract address
export const EURO_APE_NOTICEBOARD_ADDRESS = "0xeA3A88d36Ba4699c26ac9D44EEe5A1b34890D7eb";

// IMPORTANT: Replace this with your actual compiled ABI from Hardhat!
// You can find this in artifacts/contracts/EuroApeNoticeboard.sol/EuroApeNoticeboard.json
export const EURO_APE_NOTICEBOARD_ABI = [
  {
    inputs: [
      {
        "internalType": "enum EuroApeNoticeboard.NoticeType",
        "name": "noticeType",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "city",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "metadataURI",
        "type": "string"
      }
    ],
    name: "createNotice",
    outputs: [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        "internalType": "uint256",
        "name": "noticeId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "city",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "metadataURI",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "active",
        "type": "bool"
      }
    ],
    name: "updateNotice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        "internalType": "uint256",
        "name": "noticeId",
        "type": "uint256"
      }
    ],
    name: "getNotice",
    outputs: [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "author",
            "type": "address"
          },
          {
            "internalType": "enum EuroApeNoticeboard.NoticeType",
            "name": "noticeType",
            "type": "uint8"
          },
          {
            "internalType": "string",
            "name": "city",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "metadataURI",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "active",
            "type": "bool"
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
        "internalType": "struct EuroApeNoticeboard.Notice",
        "name": "",
        "type": "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
] as const;

export enum NoticeType {
  OFFER = 0,
  REQUEST = 1,
  EVENT = 2,
  GENERAL = 3
}

export function useEuroApeNoticeboard() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const handleCreateNotice = (noticeType: NoticeType, city: string, metadataURI: string) => {
    // Fallbacks to prevent smart contract reverts if it forbids empty strings
    const safeMetadataURI = metadataURI && metadataURI.trim() !== "" ? metadataURI : "ipfs://placeholder";
    const safeCity = city && city.trim() !== "" ? city : "Unknown";

    writeContract({
      address: EURO_APE_NOTICEBOARD_ADDRESS,
      abi: EURO_APE_NOTICEBOARD_ABI,
      functionName: "createNotice",
      args: [noticeType, safeCity, safeMetadataURI],
    });
  };

  const handleUpdateNotice = (noticeId: bigint, city: string, metadataURI: string, active: boolean) => {
    writeContract({
      address: EURO_APE_NOTICEBOARD_ADDRESS,
      abi: EURO_APE_NOTICEBOARD_ABI,
      functionName: "updateNotice",
      args: [noticeId, city, metadataURI, active],
    });
  };

  return {
    createNotice: handleCreateNotice,
    updateNotice: handleUpdateNotice,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
  };
}

export function useEuroApeNotice(noticeId?: bigint) {
  return useReadContract({
    address: EURO_APE_NOTICEBOARD_ADDRESS,
    abi: EURO_APE_NOTICEBOARD_ABI,
    functionName: "getNotice",
    args: noticeId !== undefined ? [noticeId] : undefined,
    query: {
      enabled: noticeId !== undefined,
    }
  });
}