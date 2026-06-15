import { useAppKit } from "@reown/appkit/react";
import { useAccount } from "wagmi";
import { useEuroApeProfile } from "../../hooks/useEuroApeProfile";
import { useEffect } from "react";
import { SubmitProfileButtonProps } from './SubmitProfileButton.tsx'
import { ProfileSubmissionData } from "./MapScreen.tsx"


export function SubmitProfileButton({
  city,
  country,
  bio,
  onComplete
}: SubmitProfileButtonProps) {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { createProfile, isPending, isConfirming, isConfirmed, profile } = useEuroApeProfile(address);

  const formatAddress = (addr?: string) =>
    addr ? `${addr.slice(0, 4)}…${addr.slice(-4)}` : "";

  // TODO: In a production app, you would upload the `message` (bio) to IPFS
  // or your backend here and pass the resulting CID as the metadataURI.
  const metadataURI = "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/1898";

  // If your contract reverts for non-existent profiles, `profile` will be undefined.
  // If it returns an empty struct, you might need to check a specific field like:
  // const hasProfile = profile && (profile as any).city !== "";
  const hasProfile = profile && profile.exists;

  // Close the modal automatically when the transaction finishes successfully
  useEffect(() => {
    if (isConfirmed) {
      onComplete({
        city,
        country,
        bio,
        wallet_address: address,
        metadata_uri: metadataURI
      } as ProfileSubmissionData);
    }
  }, [isConfirmed, onComplete]);

  const handleClick = () => {
    if (!isConnected) {
      open(); // Prompt user to connect wallet first if they aren't
      return;
    }

    createProfile(city, country, metadataURI);
  };

  return (
    <button
      disabled={!bio.trim() || isPending || isConfirming}
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