import { useState, useEffect } from "react";
import { cities } from "@/lib/mockData";
import { ApeAvatar } from "./ApeAvatar";
import {Copy, MapPin, Handshake, X} from "lucide-react";
import { useEuroApeProfile } from "@/hooks/useEuroApeProfile";
import {getProfileByAddress, ProfileRow} from "@/services/profile";

type ProfileViewProps = {
  address: string,
  onClose: () => void
}

export function ProfileView({ address, onClose }: ProfileViewProps) {
  const [copied, setCopied] = useState(false);
  const [profile, setProfile] = useState({} as ProfileRow);

  // Fetch profile data from your custom hook
  const { profile: contractProfile } = useEuroApeProfile(address as any);

  const [city, setCity] = useState(contractProfile?.city || "Berlin");
  const [country, setCountry] = useState(contractProfile?.country || "DE");

  useEffect(() => {
    const fetchSupabaseProfile = async () => {
      if (!address) return;

      const profileFromDb = await getProfileByAddress(address);
      setProfile(profileFromDb as ProfileRow)
    };

    fetchSupabaseProfile();
  }, [address]);

  const displayCity = cities.find((c) => c.name === city) || { name: city, country, flag: "🌍" };
  const displayAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected";

  return (
    <div className="absolute inset-x-0 bottom-0 z-1000 animate-fade-up">
      <div className="mx-3 mb-3 card-surface p-5 grain relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <ApeAvatar imageUrl={profile.avatar_url || ""} size={52} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate font-mono">{profile.name}</p>
              <p className="text-[11px] text-muted-foreground truncate">
                <button
                  onClick={() => { if (address) { navigator.clipboard?.writeText(address); setCopied(true); setTimeout(() => setCopied(false), 1500); } }}
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-gold"
                >
                  {displayAddress} <Copy size={12} /> {copied && <span className="text-gold">copied</span>}
                </button>
              </p>
              <p className="text-sm text-foreground/80">{displayCity.flag} {displayCity.name}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1">
              <X size={18} />
            </button>
            {profile.verified && (
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-gold/50 text-gold uppercase tracking-wider">Verified</span>
            )}
          </div>
        </div>
        <div className="flex-1 animate-fade-up ">
          {/*<div className="flex flex-col items-center text-center mt-2">*/}
          {/*  <div className="flex gap-3 mt-4">*/}
          {/*    <span className="h-9 w-9 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold"><MapPin size={16} /></span>*/}
          {/*    <span className="h-9 w-9 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold"><Handshake size={16} /></span>*/}
          {/*  </div>*/}
          {/*</div>*/}

          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">City Guide</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Opt in as a local contact for {displayCity.name}</p>
            </div>
            <button
              disabled={true}
              className={`relative w-12 h-7 rounded-full transition ${profile.guide ? "bg-gold" : "bg-surface-2"}`}
            >
              <span
                className="absolute top-0.5 h-6 w-6 rounded-full bg-background transition"
                style={{ left: profile.guide ? "22px" : "2px" }}
              />
            </button>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium">Bio</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{profile.bio}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { label: "Connections", value: profile.connections || 0 },
              { label: "Answered", value: profile.answered || 0 },
              { label: "Cities", value: profile.cities || 0 },
            ].map((s) => (
              <div key={s.label} className="card-surface p-3 text-center">
                <p className="font-display text-2xl text-gold">{s.value}</p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
