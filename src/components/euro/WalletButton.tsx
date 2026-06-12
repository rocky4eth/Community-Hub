import { useEffect, useState } from "react";
import { createClientOnlyFn } from "@tanstack/react-start";

const loadWalletButton = createClientOnlyFn(() =>
  import("./WalletButton.client")
);

export function WalletButton() {
  const [Button, setButton] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    loadWalletButton()?.then((mod) => {
      setButton(() => mod.WalletButton);
    });
  }, []);

  if (!Button) return null;

  return <Button />;
}