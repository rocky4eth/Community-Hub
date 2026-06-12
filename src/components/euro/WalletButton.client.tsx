import { useAppKit } from "@reown/appkit/react";
import { useAccount } from "wagmi";

export function WalletButton() {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();

  const formatAddress = (addr?: string) =>
    addr ? `${addr.slice(0, 4)}…${addr.slice(-4)}` : "";

  return (
    <button
      onClick={() => open()}
      className="font-mono text-[11px] px-3 py-1.5 rounded-full border border-border bg-surface text-foreground/80 hover:border-gold/60 transition gold-glow"
    >
      {isConnected ? formatAddress(address) : "Connect Wallet"}
    </button>
  );
}