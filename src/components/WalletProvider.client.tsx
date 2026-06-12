import { createAppKit } from "@reown/appkit/react";
import { WagmiProvider } from "wagmi";
import { arbitrumSepolia } from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID || "00000000000000000000000000000000";
const networks = [arbitrumSepolia] as [typeof arbitrumSepolia];

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata: {
    name: "EuroApes Connect",
    description: "Community Hub for EuroApes",
    url: "https://community-hub-sigma.vercel.app/",
    icons: ["https://avatars.githubusercontent.com/u/179229932"],
  },
  features: {
    swaps: false,
    onramp: false,
    send: false,
    history: false,
  },
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return <WagmiProvider config={wagmiAdapter.wagmiConfig}>{children}</WagmiProvider>;
}
