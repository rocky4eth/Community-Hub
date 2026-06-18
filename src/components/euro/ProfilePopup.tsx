import { useState } from "react";
import { cities } from "@/lib/mockData";
import { X } from "lucide-react";
import { SubmitProfileButton } from "./SubmitProfileButton";

export type ProfileSubmissionData = {
  name: string;
  city: string;
  country: string;
  bio: string;
  guide: boolean;
  wallet_address?: string;
  metadata_uri?: string;
  avatar_url?: string;
};

type ProfilePopupParams = {
  isEditing?: boolean,
  existingData?: ProfileSubmissionData,
  onClose: () => void;
  onSubmit: (data: ProfileSubmissionData) => void
}

export function ProfilePopup({ isEditing = false, existingData, onClose, onSubmit }: ProfilePopupParams) {
  const [city, setCity] = useState(existingData?.city || cities[0]?.name || "London");
  const [bio, setBio] = useState(existingData?.bio || "");
  const [guide, setGuide] = useState(existingData?.guide ?? false);
  const [name, setName] = useState(existingData?.name || "");

  const selectedCityData = cities.find((c) => c.name === city);
  const country = selectedCityData?.country || "Unknown";

  return (
    <div className="fixed inset-0 z-[5000] bg-background/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-[400px] card-surface p-5 animate-fade-up grain relative">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl text-gold">{isEditing ? "Edit Profile" : "Create Profile"}</h3>
          <button onClick={onClose} className="text-muted-foreground"><X size={18} /></button>
        </div>
        <label className="block mt-4 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Name</label>
        <textarea
            value={name}
            onChange={(e) => setName(e.target.value)}
            rows={1}
            className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2 text-sm resize-none"
            placeholder="Tell us your nickname..."
        />
        <label className="block mt-4 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">City</label>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
        >
          {cities.map((c) => <option key={c.name}>{c.name}</option>)}
        </select>
        <label className="block mt-4 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2 text-sm resize-none"
          placeholder="Tell us a bit about yourself..."
        />
        <div className="card-surface p-4 mt-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">City Guide</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Opt in as a local contact for {city}</p>
          </div>
          <button
              onClick={() => setGuide((v) => !v)}
              className={`relative w-12 h-7 rounded-full transition ${guide ? "bg-gold" : "bg-surface-2"}`}
          >
          <span
              className="absolute top-0.5 h-6 w-6 rounded-full bg-background transition"
              style={{ left: guide ? "22px" : "2px" }}
          />
          </button>
        </div>
        <SubmitProfileButton
          isEditing={isEditing}
          data={{
            city,
            country,
            bio,
            guide,
            name
          }}
          onComplete={onSubmit}
        />
      </div>
    </div>
  );
}