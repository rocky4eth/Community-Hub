import { useCallback, useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { cities } from "@/lib/mockData";
import { ApeAvatar } from "./ApeAvatar";
import { X } from "lucide-react";
import { CreateProfileButton } from "./CreateProfileButton";
import { SubmitProfileButton } from "./SubmitProfileButton";
import { supabase } from "@/lib/supabase";
import {fetchNftMetadataImage} from "@/lib/metadata.ts";
import { getAllProfiles } from "@/services/profile";


function goldDot(count: number) {
  return L.divIcon({
    className: "",
    html: `<div style="position:relative;transform:translate(-50%,-50%);">
      <div style="width:14px;height:14px;border-radius:9999px;background:#C9A84C;box-shadow:0 0 0 3px rgba(201,168,76,0.25),0 0 12px rgba(201,168,76,0.6);"></div>
      <div style="position:absolute;top:-10px;left:14px;background:#1A1916;border:1px solid #2E2C29;color:#F2EFE9;font-size:10px;padding:2px 6px;border-radius:9999px;font-family:'DM Sans',sans-serif;">${count}</div>
    </div>`,
  });
}

function Recenter() {
  const map = useMap();
  map.setView([50, 10], 4);
  return null;
}

export function MapScreen() {
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [profiles, setProfiles] = useState<any[]>([]);

  const fetchProfiles = useCallback(async () => {
    const data = await getAllProfiles();
    setProfiles(data);
  }, []);

  useEffect(() => {
    fetchProfiles();

    // Listen for real-time inserts/updates on the profiles table
    const channel = supabase.channel('public:profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchProfiles();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProfiles]);

  const cityMembers = useMemo(() => {
    const m: Record<string, any[]> = {};
    for (const c of cities) m[c.name] = profiles.filter((mem) => mem.city === c.name);
    return m;
  }, [profiles]);

  const active = cities.find((c) => c.name === activeCity);

  return (
    <div className="relative flex-1 animate-fade-up">
      <div className="h-[calc(100dvh-180px)] overflow-hidden rounded-t-2xl mx-3 border border-border">
        <MapContainer
          center={[50, 10]}
          zoom={4}
          scrollWheelZoom={false}
          zoomControl={false}
          style={{ height: "100%", width: "100%" }}
        >
          <Recenter />
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {cities.filter((c) => cityMembers[c.name]?.length > 0).map((c) => (
            <Marker
              key={c.name}
              position={[c.lat, c.lng]}
              icon={goldDot(cityMembers[c.name].length)}
              eventHandlers={{ click: () => setActiveCity(c.name) }}
            />
          ))}
        </MapContainer>
      </div>

      {active && (
        <div className="absolute inset-x-0 bottom-0 z-[1000] animate-fade-up">
          <div className="mx-3 mb-3 card-surface p-5 grain relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{active.flag} {active.country}</p>
                <h2 className="font-display text-3xl text-foreground mt-1">{active.name}</h2>
                <p className="text-sm text-gold mt-1">{cityMembers[active.name].length} EuroApes</p>
              </div>
              <button onClick={() => setActiveCity(null)} className="text-muted-foreground hover:text-foreground p-1">
                <X size={18} />
              </button>
            </div>
            <ul className="mt-4 space-y-2 max-h-64 overflow-y-auto pr-1">
              {cityMembers[active.name]?.map((m) => (
                <MemberListItem key={m.id} member={m} />
              ))}
            </ul>
          </div>
        </div>
      )}

      {!active && (
        <CreateProfileButton
          onClick={() => setComposeOpen(true)}
        />
      )}

      {composeOpen && (
        <Compose
          onClose={() => setComposeOpen(false)}
          onSubmit={async (profileData) => {
            const { error } = await supabase.from("profiles").insert({
              wallet_address: profileData.wallet_address,
              city: profileData.city,
              country: profileData.country,
              bio: profileData.bio,
              metadata_uri: profileData.metadata_uri,
            });

            if (error) {
              console.error("Error saving profile to Supabase:", error);
            } else {
              // Manually trigger a refresh for instant feedback
              fetchProfiles();
            }

            setComposeOpen(false);
          }}
        />
      )}
    </div>
  );
}

export type ProfileSubmissionData = {
  city: string;
  country: string;
  bio: string;
  wallet_address: string;
  metadata_uri: string;
};

function MemberListItem({ member }: { member: any }) {
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    const loadAvatar = async () => {
      if (!member.metadata_uri) return;
      const url = await fetchNftMetadataImage(member.metadata_uri);
      if (isMounted) setAvatarUrl(url);
    };
    loadAvatar();
    return () => { isMounted = false; };
  }, [member.metadata_uri]);

  return (
    <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-2/60 transition">
      <ApeAvatar imageUrl={avatarUrl} size={36} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate font-mono">{member.wallet_address.slice(0, 6)}...{member.wallet_address.slice(-4)}</p>
        <p className="text-[11px] text-muted-foreground truncate">{member.bio || "No bio provided"}</p>
      </div>
      {member.verified && (
        <span className="text-[10px] px-2 py-0.5 rounded-full border border-gold/50 text-gold uppercase tracking-wider">Verified</span>
      )}
    </li>
  );
}

function Compose({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: ProfileSubmissionData) => void }) {
  const [city, setCity] = useState(cities[0]?.name || "London");
  const [bio, setBio] = useState("");

  const selectedCityData = cities.find((c) => c.name === city);
  const country = selectedCityData?.country || "Unknown";

  return (
    <div className="fixed inset-0 z-[5000] bg-background/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-[400px] card-surface p-5 animate-fade-up grain relative">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl text-gold">Create Profile</h3>
          <button onClick={onClose} className="text-muted-foreground"><X size={18} /></button>
        </div>
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
        <SubmitProfileButton
          city={city}
          country={country}
          bio={bio}
          onComplete={onSubmit}
        />
      </div>
    </div>
  );
}
