import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { cities, members } from "@/lib/mockData";
import { ApeAvatar } from "./ApeAvatar";
import { X } from "lucide-react";

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

  const cityMembers = useMemo(() => {
    const m: Record<string, typeof members> = {};
    for (const c of cities) m[c.name] = members.filter((mem) => mem.city === c.name);
    return m;
  }, []);

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
          {cities.map((c) => (
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
        <div className="absolute inset-x-0 bottom-0 z-30 animate-fade-up">
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
              {cityMembers[active.name].map((m) => (
                <li key={m.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-2/60 transition">
                  <ApeAvatar emoji={m.avatar} size={36} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{m.name}</p>
                    <p className="text-[11px] font-mono text-muted-foreground">{m.wallet}</p>
                  </div>
                  {m.isCityGuide && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full border border-gold/50 text-gold uppercase tracking-wider">Guide</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
