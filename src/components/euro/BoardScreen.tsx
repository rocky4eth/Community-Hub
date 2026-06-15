import { useMemo, useState } from "react";
import { posts as seed, members, cities, me, timeAgo, type Post } from "@/lib/mockData";
import { ApeAvatar } from "./ApeAvatar";
import { Plus, Bot, X } from "lucide-react";

type Filter = "ALL" | "REQUESTS" | "OFFERS" | "MY CITY";

export function BoardScreen() {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [posts, setPosts] = useState<Post[]>(seed);
  const [composeOpen, setComposeOpen] = useState(false);
  const [agentOpen, setAgentOpen] = useState(false);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (filter === "REQUESTS") return p.type === "REQUEST";
      if (filter === "OFFERS") return p.type === "OFFER";
      if (filter === "MY CITY") return p.city === me.city;
      return true;
    });
  }, [posts, filter]);

  return (
    <div className="flex-1 flex flex-col animate-fade-up pb-24">
      <div className="px-4 flex gap-2 overflow-x-auto no-scrollbar pb-3">
        {(["ALL", "REQUESTS", "OFFERS", "MY CITY"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-[11px] tracking-[0.14em] uppercase border whitespace-nowrap transition ${
              filter === f
                ? "border-gold text-gold bg-gold/10"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="px-4 space-y-3">
        {filtered.map((p, i) => {
          const m = members.find((x) => x.id === p.memberId)!;
          const isReq = p.type === "REQUEST";
          return (
            <li
              key={p.id}
              className="card-surface p-4 animate-fade-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <ApeAvatar imageUrl={m.avatar} size={38} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{m.name}</p>
                  <p className="text-[11px] text-muted-foreground">{timeAgo(p.postedAt)}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30">{p.city}</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span
                  className="text-[10px] tracking-[0.18em] uppercase font-semibold px-2 py-0.5 rounded"
                  style={{
                    color: isReq ? "var(--request)" : "var(--offer)",
                    background: isReq ? "color-mix(in oklab, var(--request) 12%, transparent)" : "color-mix(in oklab, var(--offer) 12%, transparent)",
                    border: `1px solid ${isReq ? "color-mix(in oklab, var(--request) 35%, transparent)" : "color-mix(in oklab, var(--offer) 35%, transparent)"}`,
                  }}
                >
                  {p.type}
                </span>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-foreground/90">{p.message}</p>
              <div className="mt-4 flex justify-end">
                <button className="text-xs tracking-[0.16em] uppercase border border-gold/50 text-gold px-3 py-1.5 rounded-full hover:bg-gold/10 transition">
                  Respond
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Floating buttons */}
      <button
        onClick={() => setAgentOpen((v) => !v)}
        className="fixed bottom-24 left-4 z-30 h-11 w-11 rounded-full bg-surface border border-border flex items-center justify-center text-gold hover:border-gold/60 transition"
        aria-label="ApeAgent"
        style={{ maxWidth: 430, marginLeft: "max(0px, calc((100vw - 430px)/2))" }}
      >
        <Bot size={18} />
      </button>
      {agentOpen && (
        <div
          className="fixed bottom-40 left-4 z-30 max-w-[260px] card-surface p-4 animate-fade-up"
          style={{ marginLeft: "max(0px, calc((100vw - 430px)/2))" }}
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] tracking-[0.18em] uppercase text-gold">ApeAgent · Live</p>
            <button onClick={() => setAgentOpen(false)} className="text-muted-foreground"><X size={14} /></button>
          </div>
          <p className="text-xs text-foreground/80 mt-2 leading-relaxed">
            Monitoring the noticeboard and matching your requests to the right Apes automatically. Badge mints trigger when thresholds are met.
          </p>
        </div>
      )}

      <button
        onClick={() => setComposeOpen(true)}
        className="fixed bottom-24 right-4 z-30 h-12 w-12 rounded-full bg-gold text-background flex items-center justify-center gold-glow pulse-gold"
        aria-label="New post"
        style={{ marginRight: "max(0px, calc((100vw - 430px)/2))" }}
      >
        <Plus size={22} />
      </button>

      {composeOpen && (
        <Compose
          onClose={() => setComposeOpen(false)}
          onSubmit={(p) => {
            setPosts((prev) => [{ ...p, id: `p${Date.now()}`, memberId: me.id, postedAt: new Date().toISOString() }, ...prev]);
            setComposeOpen(false);
          }}
        />
      )}
    </div>
  );
}

function Compose({ onClose, onSubmit }: { onClose: () => void; onSubmit: (p: Omit<Post, "id" | "memberId" | "postedAt">) => void }) {
  const [type, setType] = useState<"REQUEST" | "OFFER">("REQUEST");
  const [city, setCity] = useState(me.city);
  const [message, setMessage] = useState("");
  return (
    <div className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-[400px] card-surface p-5 animate-fade-up grain relative">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl text-gold">New post</h3>
          <button onClick={onClose} className="text-muted-foreground"><X size={18} /></button>
        </div>
        <div className="mt-4 inline-flex rounded-full border border-border p-1 bg-background">
          {(["REQUEST", "OFFER"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-3 py-1 text-[11px] tracking-[0.18em] uppercase rounded-full transition ${
                type === t ? "bg-gold text-background" : "text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <label className="block mt-4 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">City</label>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
        >
          {cities.map((c) => <option key={c.name}>{c.name}</option>)}
        </select>
        <label className="block mt-4 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2 text-sm resize-none"
          placeholder="What do you need / what are you offering?"
        />
        <button
          disabled={!message.trim()}
          onClick={() => onSubmit({ type, city, message: message.trim() })}
          className="mt-5 w-full bg-gold text-background font-semibold text-sm tracking-[0.14em] uppercase py-3 rounded-full disabled:opacity-40 gold-glow"
        >
          Post to Noticeboard
        </button>
      </div>
    </div>
  );
}
