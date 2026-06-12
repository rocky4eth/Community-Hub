import { useEffect, useState } from "react";
import { createClientOnlyFn } from "@tanstack/react-start";

const loadWalletProvider = createClientOnlyFn(() =>
  import("./WalletProvider.client")
);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [Provider, setProvider] = useState<any>(null);

  useEffect(() => {
    loadWalletProvider()?.then((mod) => {
      setProvider(() => mod.WalletProvider);
    });
  }, []);

  if (!Provider) return <>{children}</>;

  return <Provider>{children}</Provider>;
}
