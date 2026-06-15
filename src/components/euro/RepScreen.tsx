import { useState } from "react";
import { members } from "@/lib/mockData";
import { ApeAvatar } from "./ApeAvatar";
import { Lock, MapPin, Handshake, Plane, Crown } from "lucide-react";

const badgeMeta: Record<string, { icon: any; label: string }> = {
  "city-guide": { icon: MapPin, label: "City Guide" },
  "connector": { icon: Handshake, label: "Connector" },
  "frequent-flyer": { icon: Plane, label: "Frequent Flyer" },
  "top-host": { icon: Crown, label: "Top Host" },
};

export function RepScreen() {
  const [sub, setSub] = useState<"LEADERBOARD" | "MY BADGES">("LEADERBOARD");
  return (
    <div className="flex-1 animate-fade-up pb-24">
      <div className="px-4 mb-4 flex gap-2">
        {(["LEADERBOARD", "MY BADGES"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSub(s)}
            className={`flex-1 py-2 rounded-full text-[11px] tracking-[0.16em] uppercase border transition ${
              sub === s ? "bg-gold text-background border-gold" : "border-border text-muted-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      {sub === "LEADERBOARD" ? <Leaderboard /> : <MyBadges />}
    </div>
  );
}

function Leaderboard() {
  const ranked = [...members].sort((a, b) => b.rep - a.rep).slice(0, 10);
  const medal = ["#C9A84C", "#C0C0C0", "#CD7F32"];
  return (
    <ul className="px-4 space-y-2">
      {ranked.map((m, i) => {
        const isTop = i < 3;
        return (
          <li
            key={m.id}
            className="card-surface p-3 flex items-center gap-3 animate-fade-up relative overflow-hidden"
            style={{
              animationDelay: `${i * 40}ms`,
              boxShadow: isTop ? `inset 0 0 0 1px ${medal[i]}55, 0 8px 30px -16px ${medal[i]}66` : undefined,
            }}
          >
            <div
              className="w-8 text-center font-display text-xl"
              style={{ color: isTop ? medal[i] : "var(--muted-foreground)" }}
            >
              {i + 1}
            </div>
            <ApeAvatar imageUrl={m.avatar} size={40} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{m.name}</p>
              <p className="text-[11px] text-muted-foreground">{m.city}</p>
            </div>
            <div className="flex items-center gap-1.5">
              {m.badges.slice(0, 3).map((b) => {
                const Icon = badgeMeta[b]?.icon;
                return Icon ? <Icon key={b} size={13} className="text-gold" /> : null;
              })}
            </div>
            <div className="font-mono text-sm text-gold ml-2 tabular-nums">{m.rep}</div>
          </li>
        );
      })}
    </ul>
  );
}

function MyBadges() {
  const cards = [
    { id: "city-guide", icon: MapPin, name: "City Guide", desc: "Active local contact for your city", earned: true, progress: null },
    { id: "connector", icon: Handshake, name: "Connector", desc: "Answered 5+ community requests", earned: false, progress: [3, 5] as [number, number] },
    { id: "frequent-flyer", icon: Plane, name: "Frequent Flyer", desc: "Checked in across 3+ European cities", earned: false, progress: [1, 3] as [number, number] },
    { id: "top-host", icon: Crown, name: "Top Host", desc: "Hosted 3+ visiting Apes", earned: false, progress: null },
  ];
  return (
    <ul className="px-4 grid grid-cols-2 gap-3">
      {cards.map((b, i) => {
        const Icon = b.icon;
        return (
          <li
            key={b.id}
            className={`card-surface p-4 relative overflow-hidden animate-fade-up ${b.earned ? "gold-glow" : "opacity-60"}`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {b.earned && <div className="absolute inset-0 shimmer pointer-events-none opacity-30" />}
            <div className="relative">
              <div
                className="h-12 w-12 rounded-full flex items-center justify-center"
                style={{
                  background: b.earned ? "color-mix(in oklab, var(--gold) 18%, transparent)" : "var(--surface-2)",
                  color: b.earned ? "var(--gold)" : "var(--muted-foreground)",
                }}
              >
                {b.earned ? <Icon size={22} /> : <Lock size={18} />}
              </div>
              <p className="mt-3 font-display text-base">{b.name}</p>
              <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{b.desc}</p>
              {b.progress && (
                <div className="mt-3">
                  <div className="h-1 bg-surface-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full"
                      style={{ width: `${(b.progress[0] / b.progress[1]) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 font-mono">{b.progress[0]}/{b.progress[1]}</p>
                </div>
              )}
              {!b.progress && (
                <p className={`text-[10px] tracking-[0.18em] uppercase mt-3 ${b.earned ? "text-gold" : "text-muted-foreground"}`}>
                  {b.earned ? "Earned" : "Locked"}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
