import {MapContainer, TileLayer, Marker, Popup, useMap} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {cities} from "@/lib/mockData.ts";
import L from "leaflet";
import {MapProps} from "@/components/euro/Map.tsx";

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

export function Map({ cityMembers, onClick }: MapProps) {
    return (
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
                // url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {cities.filter((c) => cityMembers[c.name]?.length > 0).map((c) => (
                <Marker
                    key={c.name}
                    position={[c.lat, c.lng]}
                    icon={goldDot(cityMembers[c.name].length)}
                    eventHandlers={{ click: () => onClick(c.name) }}
                />
            ))}
        </MapContainer>
    );
}