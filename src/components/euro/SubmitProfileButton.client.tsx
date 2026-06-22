import { useAppKit } from "@reown/appkit/react";
import { useAccount } from "wagmi";
import { useEuroApeProfile } from "@/hooks/useEuroApeProfile.ts";
import { useEffect } from "react";
import { SubmitProfileButtonProps } from './SubmitProfileButton.tsx'


export function SubmitProfileButton({
  isEditing = false,
  data,
  onComplete
}: SubmitProfileButtonProps) {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { createProfile, updateProfile, isPending, isConfirming, isConfirmed, profile, hash } = useEuroApeProfile(address);

  // TODO: In a production app, you would upload the `message` (bio) to IPFS
  // or your backend here and pass the resulting CID as the metadataURI.
  const metadataURI = "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/1898";

  // If your contract reverts for non-existent profiles, `profile` will be undefined.
  // If it returns an empty struct, you might need to check a specific field like:
  // const hasProfile = profile && (profile as any).city !== "";
  const hasProfile = profile && profile.exists;

  // Close the modal automatically when the transaction finishes successfully
  useEffect(() => {
    if (isConfirmed && hash) {
      onComplete({
        ...data,
        metadata_uri: metadataURI,
        wallet_address: address || "",
        avatar_url: "https://assets.boredapeyachtclub.com/bayc/1898.png",
        txid: hash || ""
      });
    }
  }, [isConfirmed, hash, onComplete]);

  const handleClick = () => {
    if (!isConnected) {
      open(); // Prompt user to connect wallet first if they aren't
      return;
    }

    if (isEditing) {
      updateProfile(data.city, data.country, metadataURI)
    } else {
      createProfile(data.city, data.country, metadataURI);
    }
  };

  return (
    <button
      disabled={!data.bio.trim() || isPending || isConfirming}
      onClick={handleClick}
      className="mt-5 w-full bg-gold text-background font-semibold text-sm tracking-[0.14em] uppercase py-3 rounded-full disabled:opacity-40 gold-glow"
    >
    {!isConnected
      ? "Connect Wallet"
      : isConfirming
      ? "Confirming..."
      : isPending
      ? "Check Wallet..."
      : "Submit Profile"}
    </button>
  );
}