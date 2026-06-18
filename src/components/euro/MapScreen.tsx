import { useCallback, useEffect, useMemo, useState } from "react";
import { cities } from "@/lib/mockData";
import { ApeAvatar } from "./ApeAvatar";
import { X } from "lucide-react";
import { CreateProfileButton } from "./CreateProfileButton";
import { supabase } from "@/lib/supabase";
import { getAllProfiles, saveProfile } from "@/services/profile";
import { ProfilePopup } from "./ProfilePopup";
import { ProfileView } from "@/components/euro/ProfileView.tsx";
import {Map} from "@/components/euro/Map.tsx";

export function MapScreen() {
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [showProfile, setShowProfile] = useState<string | null>(null);

  const fetchProfiles: () => Promise<void> = useCallback(async (): Promise<void> => {
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
        <Map cityMembers={cityMembers} onClick={(city) => setActiveCity(city)} />
        {/*<MapContainer*/}
        {/*  center={[50, 10]}*/}
        {/*  zoom={4}*/}
        {/*  scrollWheelZoom={false}*/}
        {/*  zoomControl={false}*/}
        {/*  style={{ height: "100%", width: "100%" }}*/}
        {/*>*/}
        {/*  <Recenter />*/}
        {/*  <TileLayer*/}
        {/*    attribution='&copy; OpenStreetMap'*/}
        {/*    // url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"*/}
        {/*    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"*/}
        {/*  />*/}
        {/*  {cities.filter((c) => cityMembers[c.name]?.length > 0).map((c) => (*/}
        {/*    <Marker*/}
        {/*      key={c.name}*/}
        {/*      position={[c.lat, c.lng]}*/}
        {/*      icon={goldDot(cityMembers[c.name].length)}*/}
        {/*      eventHandlers={{ click: () => setActiveCity(c.name) }}*/}
        {/*    />*/}
        {/*  ))}*/}
        {/*</MapContainer>*/}
      </div>

      {active && (
        <div className="absolute inset-x-0 bottom-0 z-1000 animate-fade-up">
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
                <MemberListItem 
                  key={m.id} 
                  member={m} 
                  onClick={() => {
                    setShowProfile(m.wallet_address);
                    setActiveCity(null);
                  }} 
                />
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
        <ProfilePopup
          onClose={() => setComposeOpen(false)}
          onSubmit={async (submittedData) => {
            await saveProfile({
              name: submittedData.name,
              city: submittedData.city,
              country: submittedData.country,
              bio: submittedData.bio,
              guide: submittedData.guide,
              wallet_address: submittedData.wallet_address?.toLowerCase() || "",
              metadata_uri: submittedData.metadata_uri || "",
              avatar_url: submittedData.avatar_url
            });

            fetchProfiles();
            setComposeOpen(false);
            setActiveCity(null);
            setShowProfile(null);
          }}
        />
      )}

      {showProfile && (
        <ProfileView
            address={showProfile}
            onClose={() => {
              setActiveCity(null);
              setShowProfile(null);
            }}
        />
      )}

    </div>
  );
}

function MemberListItem({ member, onClick }: { member: any; onClick?: () => void }) {
  return (
    <li 
      onClick={onClick}
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-2/60 transition cursor-pointer"
    >
      <ApeAvatar imageUrl={member.avatar_url} size={36} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate font-mono">{member.name || "No bio provided"}</p>
        <p className="text-[11px] text-muted-foreground truncate">{member.wallet_address.slice(0, 6)}...{member.wallet_address.slice(-4)}</p>
      </div>
      {member.verified && (
        <span className="text-[10px] px-2 py-0.5 rounded-full border border-gold/50 text-gold uppercase tracking-wider">Verified</span>
      )}
    </li>
  );
}
