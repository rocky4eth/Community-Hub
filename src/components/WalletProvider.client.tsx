import { WagmiProvider } from "wagmi";
import { arbitrumSepolia } from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import {useEffect, useState} from "react";

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID || "00000000000000000000000000000000";
const networks = [arbitrumSepolia] as [typeof arbitrumSepolia];

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      const { createAppKit } = await import("@reown/appkit/react");

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

      setReady(true);
    }

    init().catch(console.error);
  }, []);

  if (!ready) return null;

  return <WagmiProvider config={wagmiAdapter.wagmiConfig}>{children}</WagmiProvider>;
}
