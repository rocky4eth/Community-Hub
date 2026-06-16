import { useAccount } from "wagmi";
import { useEuroApeProfile } from "@/hooks/useEuroApeProfile.ts";
import { Plus } from "lucide-react";
import { CreateProfileButtonProps } from './CreateProfileButton.tsx'


export function CreateProfileButton({
  onClick
}: CreateProfileButtonProps) {
  const { address, isConnected } = useAccount();
  const { isConfirmed, profile } = useEuroApeProfile(address);

  // If your contract reverts for non-existent profiles, `profile` will be undefined.
  // If it returns an empty struct, you might need to check a specific field like:
  // const hasProfile = profile && (profile as any).city !== "";
  const hasProfile = profile && profile.exists;

  return (
    <>
      {isConnected && !hasProfile && !isConfirmed && (
        <button
          onClick={() => onClick()}
          className="absolute bottom-12 left-6 z-1000 h-12 w-12 rounded-full bg-gold text-background flex items-center justify-center gold-glow pulse-gold"
          aria-label="Create profile"
        >
          <Plus size={22} />
        </button>
      )}
    </>
  );
}