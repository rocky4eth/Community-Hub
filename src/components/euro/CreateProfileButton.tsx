import { useEffect, useState } from "react";
import { createClientOnlyFn } from "@tanstack/react-start";

interface CreateProfileButtonProps {
  onClick: () => void;
}

const loadCreateProfileButton = createClientOnlyFn(() =>
  import("./CreateProfileButton.client")
);

export function CreateProfileButton(props: CreateProfileButtonProps) {
  const [Button, setButton] = useState<React.ComponentType<CreateProfileButtonProps> | null>(null);

  useEffect(() => {
    loadCreateProfileButton()?.then((mod) => {
      setButton(() => mod.CreateProfileButton);
    });
  }, []);

  if (!Button) return null;

  return <Button {...props} />;
}