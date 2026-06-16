import { useEffect, useState } from "react";
import { createClientOnlyFn } from "@tanstack/react-start";
import { ProfileSubmissionData } from "./ProfilePopup.tsx"

export interface SubmitProfileButtonProps {
  isEditing: boolean,
  data: ProfileSubmissionData,
  onComplete: (data: ProfileSubmissionData) => void;
}

const loadSubmitProfileButton = createClientOnlyFn(() =>
  import("./SubmitProfileButton.client")
);

export function SubmitProfileButton(props: SubmitProfileButtonProps) {
  const [Button, setButton] = useState<React.ComponentType<SubmitProfileButtonProps> | null>(null);

  useEffect(() => {
    loadSubmitProfileButton()?.then((mod) => {
      setButton(() => mod.SubmitProfileButton);
    });
  }, []);

  if (!Button) return null;

  return <Button {...props} />;
}