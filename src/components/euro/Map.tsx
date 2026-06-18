import { useEffect, useState } from "react";
import { createClientOnlyFn } from "@tanstack/react-start";

export interface MapProps {
    cityMembers: Record<string, any[]>,
    onClick: (city: string) => void
}

const loadMap = createClientOnlyFn(() =>
    import("./Map.client")
);

export function Map(mapProps: MapProps) {
    const [MapComponent, setMapComponent] = useState<React.ComponentType<MapProps> | null>(null);

    useEffect(() => {
        loadMap()?.then((mod) => {
            setMapComponent(() => mod.Map);
        });
    }, []);

    if (!MapComponent) {
        return <div style={{ height: "100vh" }}>Loading map...</div>;
    }

    return <MapComponent {...mapProps} />;
}