import { useMemo, useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { cities, timeAgo } from "@/lib/mockData";
import { ApeAvatar } from "./ApeAvatar";
import { Plus, X } from "lucide-react";
import { getPosts, savePost } from "@/services/post";
import { getAllProfiles } from "@/services/profile";
import { fetchNftMetadataImage } from "@/lib/metadata";
import {NoticeType, useEuroApeNoticeboard} from "@/hooks/useEuroApeNoticeboard";

type Filter = "ALL" | "REQUESTS" | "OFFERS" | "MY CITY";

export function BoardScreen() {
  const { address } = useAccount();
  const [filter, setFilter] = useState<Filter>("ALL");
  const [posts, setPosts] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [composeOpen, setComposeOpen] = useState(false);
  const [userCity, setUserCity] = useState("London");
  const { createNotice, isPending, isConfirming, isConfirmed, error, hash } = useEuroApeNoticeboard();
  const [pendingPost, setPendingPost] = useState<{ type: string; city: string; message: string } | null>(null);

  const loadData = useCallback(async () => {
    const fetchedPosts = await getPosts();
    const fetchedProfiles = await getAllProfiles();

    const profileMap: Record<string, any> = {};
    fetchedProfiles.forEach((p: any) => {
      if (p.wallet_address) {
        profileMap[p.wallet_address.toLowerCase()] = p;
      }
    });

    setPosts(fetchedPosts);
    setProfiles(profileMap);

    if (address && profileMap[address.toLowerCase()]?.city) {
      setUserCity(profileMap[address.toLowerCase()].city);
    }
  }, [address]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle database save after successful blockchain confirmation
  useEffect(() => {
    if (isConfirmed && pendingPost && address && hash) {
      const saveToDb = async () => {
        const { error: dbError, data } = await savePost({
          author_address: address,
          type: pendingPost.type as "REQUEST" | "OFFER",
          city: pendingPost.city,
          message: pendingPost.message,
          txid: hash
        });
        
        if (!dbError && data) {
          setPosts((prev) => [data, ...prev]);
          setComposeOpen(false);
        } else {
          console.error(dbError);
          alert("Failed to create post in database.");
        }
        setPendingPost(null);
      };
      saveToDb();
    }
  }, [isConfirmed, pendingPost, address]);

  // Handle blockchain transaction error or cancellation
  useEffect(() => {
    if (error && pendingPost) {
      console.error("Blockchain transaction failed:", error);
      setPendingPost(null);
    }
  }, [error, pendingPost]);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (filter === "REQUESTS") return p.type === "REQUEST";
      if (filter === "OFFERS") return p.type === "OFFER";
      if (filter === "MY CITY") return p.city === userCity;
      return true;
    });
  }, [posts, filter, userCity]);

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
          const profile = profiles[p.author_address?.toLowerCase()] || {};
          return (
            <PostItem key={p.id} post={p} profile={profile} index={i} />
          );
        })}
      </ul>

      <button
        onClick={() => setComposeOpen(true)}
        className="fixed bottom-4 left-4 z-30 h-12 w-12 rounded-full bg-gold text-background flex items-center justify-center gold-glow pulse-gold"
        aria-label="New post"
      >
        <Plus size={22} />
      </button>

      {composeOpen && (
        <Compose
          defaultCity={userCity}
          onClose={() => setComposeOpen(false)}
          isSubmitting={isPending || isConfirming || pendingPost !== null}
          onSubmit={(p) => {
            if (!address) {
              alert("Please connect your wallet to post.");
              return;
            }
            
            const noticeType = p.type === "REQUEST" ? NoticeType.REQUEST : NoticeType.OFFER;
            createNotice(noticeType, p.city, ""); // Empty string for metadataURI for now
            setPendingPost(p);
          }}
        />
      )}
    </div>
  );
}

function PostItem({ post, profile, index }: { post: any; profile: any; index: number }) {
  const isReq = post.type === "REQUEST";
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    let isMounted = true;
    const loadAvatar = async () => {
      if (!profile?.metadata_uri) return;
      const url = await fetchNftMetadataImage(profile.metadata_uri);
      if (isMounted) setAvatarUrl(url);
    };
    loadAvatar();
    return () => { isMounted = false; };
  }, [profile?.metadata_uri]);

  return (
    <li
      className="card-surface p-4 animate-fade-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center gap-3">
        <ApeAvatar imageUrl={avatarUrl} size={38} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{profile?.name || "Anonymous Ape"}</p>
          <p className="text-[11px] text-muted-foreground">{timeAgo(post.created_at)}</p>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30">{post.city}</span>
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
          {post.type}
        </span>
      </div>
      <p className="mt-3 text-[15px] leading-relaxed text-foreground/90">{post.message}</p>
      <div className="mt-4 flex justify-end">
        <button className="text-xs tracking-[0.16em] uppercase border border-gold/50 text-gold px-3 py-1.5 rounded-full hover:bg-gold/10 transition">
          Respond
        </button>
      </div>
    </li>
  );
}

function Compose({ 
  onClose, 
  onSubmit,
  defaultCity,
  isSubmitting
}: { 
  onClose: () => void; 
  onSubmit: (p: { type: "REQUEST" | "OFFER", city: string, message: string }) => void;
  defaultCity: string;
  isSubmitting?: boolean;
}) {
  const [type, setType] = useState<"REQUEST" | "OFFER">("REQUEST");
  const [city, setCity] = useState(defaultCity);
  const [message, setMessage] = useState("");
  return (
    <div className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-[400px] card-surface p-5 animate-fade-up grain relative">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl text-gold">New post</h3>
          <button onClick={onClose} disabled={isSubmitting} className="text-muted-foreground disabled:opacity-50">
            <X size={18} />
          </button>
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
          disabled={!message.trim() || isSubmitting}
          onClick={() => onSubmit({ type, city, message: message.trim() })}
          className="mt-5 w-full bg-gold text-background font-semibold text-sm tracking-[0.14em] uppercase py-3 rounded-full disabled:opacity-40 gold-glow"
        >
          {isSubmitting ? "Processing..." : "Post to Noticeboard"}
        </button>
      </div>
    </div>
  );
}
