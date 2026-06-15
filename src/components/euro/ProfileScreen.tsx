import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { cities } from "@/lib/mockData";
import { ApeAvatar } from "./ApeAvatar";
import { Copy, MapPin, Handshake } from "lucide-react";
import { useEuroApeProfile } from "@/hooks/useEuroApeProfile"; // Adjust import path if needed
import { fetchNftMetadataImage } from "@/lib/metadata";
import { getProfileByAddress } from "@/services/profile"; // Adjust import path if needed

export function ProfileScreen() {
  const { address } = useAccount();
  const [guide, setGuide] = useState(true);
  const [bio, setBio] = useState("");
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ connections: 0, answered: 0, cities: 0 });
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Fetch profile data from your custom hook
  const { profile: contractProfile } = useEuroApeProfile(address);

  const profileName = name || "Anonymous Ape";
  const profileCity = contractProfile?.city || "Berlin";
  const profileAvatar = avatarUrl || "🦍";

  useEffect(() => {
    const loadAvatar = async () => {
      const uri = contractProfile?.metadataURI;
      if (!uri) return;

      const imageUrl = await fetchNftMetadataImage(uri);
      setAvatarUrl(imageUrl);
    };

    loadAvatar();
  }, [contractProfile?.metadataURI]);

  useEffect(() => {
    const fetchSupabaseProfile = async () => {
      if (!address) return;

      const data = await getProfileByAddress(address);
      if (data) {
        setName(data.name || "");
        setBio(data.bio || "");
        setGuide(data.guide ?? true);
        setStats({
          connections: data.connections || 0,
          answered: data.answered || 0,
          cities: data.cities || 0,
        });
      }
    };

    fetchSupabaseProfile();
  }, [address]);

  const city = cities.find((c) => c.name === profileCity) || { name: profileCity, flag: "🌍" };
  const displayAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected";

  return (
    <div className="flex-1 animate-fade-up pb-24 px-4">
      <div className="flex flex-col items-center text-center mt-2">
        <ApeAvatar imageUrl={profileAvatar} size={96} />
        <h2 className="font-display text-3xl mt-4">{profileName}</h2>
        <button
          onClick={() => { if (address) { navigator.clipboard?.writeText(address); setCopied(true); setTimeout(() => setCopied(false), 1500); } }}
          className="mt-2 inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-gold"
        >
          {displayAddress} <Copy size={12} /> {copied && <span className="text-gold">copied</span>}
        </button>
        <p className="mt-1 text-sm text-foreground/80">{city.flag} {profileCity} · Member since Apr 2024</p>
        <div className="flex gap-3 mt-4">
          <span className="h-9 w-9 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold"><MapPin size={16} /></span>
          <span className="h-9 w-9 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold"><Handshake size={16} /></span>
        </div>
      </div>

      <div className="card-surface p-4 mt-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">City Guide</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Opt in as a local contact for {profileCity}</p>
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

      <div className="card-surface p-4 mt-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Bio</p>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about yourself..."
          rows={3}
          className="mt-2 w-full bg-transparent text-sm resize-none focus:outline-none"
        />
      </div>

      {/* NFC Card */}
      <div className="mt-5">
        <div
          className="relative aspect-[1.6/1] rounded-2xl p-5 card-shine overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1A1916 0%, #0E0E0E 60%, #1A1916 100%)",
            border: "1px solid color-mix(in oklab, var(--gold) 30%, transparent)",
            boxShadow: "0 20px 60px -20px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <div className="absolute inset-0 grain opacity-50" />
          <div className="relative flex items-start justify-between h-full">
            <div className="flex flex-col justify-between h-full">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold">EuroApes</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-0.5">Member ID</p>
              </div>
              <div>
                <p className="font-display text-lg text-foreground leading-none">{profileName}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{city.flag} {profileCity}</p>
              </div>
            </div>
            <div className="flex flex-col items-end justify-between h-full">
              <ApeAvatar imageUrl={profileAvatar} size={48} />
              <div className="h-8 w-8 rounded border border-gold/40 flex items-center justify-center text-gold font-display text-sm">E</div>
            </div>
          </div>
        </div>
        <button className="mt-3 w-full text-xs tracking-[0.16em] uppercase border border-gold/50 text-gold py-3 rounded-full hover:bg-gold/10 transition">
          Your EuroApe ID — tap to link NFC chip
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mt-5">
        {[
          { label: "Connections", value: stats.connections },
          { label: "Answered", value: stats.answered },
          { label: "Cities", value: stats.cities },
        ].map((s) => (
          <div key={s.label} className="card-surface p-3 text-center">
            <p className="font-display text-2xl text-gold">{s.value}</p>
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
