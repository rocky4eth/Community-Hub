import { createFileRoute } from "@tanstack/react-router";
import { useState, lazy, Suspense } from "react";
import { Header } from "@/components/euro/Header";
import { BottomNav, type Tab } from "@/components/euro/BottomNav";
import { BoardScreen } from "@/components/euro/BoardScreen";
import { RepScreen } from "@/components/euro/RepScreen";
import { ProfileScreen } from "@/components/euro/ProfileScreen";

const MapScreen = lazy(() => import("@/components/euro/MapScreen").then(m => ({ default: m.MapScreen })));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EuroApes — Community Hub" },
      { name: "description", content: "The official coordination platform for European BAYC holders. Find Apes, share offers, earn reputation." },
      { property: "og:title", content: "EuroApes — Community Hub" },
      { property: "og:description", content: "Find Apes across Europe. Members-only coordination for the BAYC community." },
    ],
  }),
  component: Index,
});

const subtitle: Record<Tab, string> = {
  map: "🌍 Europe",
  board: "Noticeboard",
  rep: "Reputation",
  profile: "My Profile",
};

function Index() {
  const [tab, setTab] = useState<Tab>("map");
  return (
    <div className="min-h-dvh bg-background flex justify-center">
      <div
        className="relative w-full max-w-[430px] min-h-dvh flex flex-col bg-background"
        style={{ boxShadow: "0 40px 120px -30px rgba(0,0,0,0.8)" }}
      >
        <div className="absolute inset-0 grain pointer-events-none" />
        <Header subtitle={subtitle[tab]} />
        <main key={tab} className="flex-1 flex flex-col animate-fade-up">
          {tab === "map" && (
            <Suspense fallback={<div className="flex-1 grid place-items-center text-muted-foreground text-sm">Loading map…</div>}>
              <MapScreen />
            </Suspense>
          )}
          {tab === "board" && <BoardScreen />}
          {tab === "rep" && <RepScreen />}
          {tab === "profile" && <ProfileScreen />}
        </main>
        <BottomNav tab={tab} setTab={setTab} />
      </div>
    </div>
  );
}
