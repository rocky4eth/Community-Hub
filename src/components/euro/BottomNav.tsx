import { Map as MapIcon, ClipboardList, Trophy, User } from "lucide-react";

export type Tab = "map" | "board" | "rep" | "profile";

const items: { id: Tab; label: string; Icon: any }[] = [
  { id: "map", label: "Map", Icon: MapIcon },
  { id: "board", label: "Board", Icon: ClipboardList },
  { id: "rep", label: "Rep", Icon: Trophy },
  { id: "profile", label: "Profile", Icon: User },
];

export function BottomNav({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  return (
    <nav className="sticky bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t border-border">
      <ul className="grid grid-cols-4">
        {items.map(({ id, label, Icon }) => {
          const active = tab === id;
          return (
            <li key={id}>
              <button
                onClick={() => setTab(id)}
                className="w-full flex flex-col items-center gap-1 py-2.5 transition"
              >
                <Icon size={20} className={active ? "text-gold" : "text-muted-foreground"} strokeWidth={active ? 2.2 : 1.6} />
                <span className={`text-[10px] tracking-[0.16em] uppercase ${active ? "text-gold" : "text-muted-foreground"}`}>{label}</span>
                <span className={`h-1 w-1 rounded-full ${active ? "bg-gold" : "bg-transparent"}`} />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
