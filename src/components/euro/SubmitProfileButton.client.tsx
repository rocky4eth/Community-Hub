import { useAppKit } from "@reown/appkit/react";
import { useAccount } from "wagmi";
import { useEuroApeProfile } from "../../hooks/useEuroApeProfile";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { SubmitProfileButtonProps } from './SubmitProfileButton.tsx'


export function SubmitProfileButton({
  city,
  country,
  message,
  onComplete
}: SubmitProfileButtonProps) {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { createProfile, isPending, isConfirming, isConfirmed, profile, isProfileLoading } = useEuroApeProfile(address);

  const formatAddress = (addr?: string) =>
    addr ? `${addr.slice(0, 4)}…${addr.slice(-4)}` : "";

  // If your contract reverts for non-existent profiles, `profile` will be undefined.
  // If it returns an empty struct, you might need to check a specific field like:
  // const hasProfile = profile && (profile as any).city !== "";
  const hasProfile = profile && profile.exists;

  // Close the modal automatically when the transaction finishes successfully
  useEffect(() => {
    if (isConfirmed) {
      onComplete();
    }
  }, [isConfirmed, onComplete]);

  const handleClick = () => {
    if (!isConnected) {
      open(); // Prompt user to connect wallet first if they aren't
      return;
    }

    // TODO: In a production app, you would upload the `message` (bio) to IPFS
    // or your backend here and pass the resulting CID as the metadataURI.
    const metadataURI = "ipfs://YOUR_METADATA_URI_HERE";

    createProfile(country, city, metadataURI);
  };

  return (
    <button
      disabled={!message.trim()}
      onClick={handleClick}
      disabled={isPending || isConfirming}
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