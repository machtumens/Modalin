"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const icon = new L.DivIcon({
  className: "modalin-marker",
  html: `<div style="background:#0f766e;border:3px solid white;border-radius:50%;width:14px;height:14px;box-shadow:0 0 0 3px rgba(15,118,110,0.25)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

export function BPRMapClient({
  partners,
}: {
  partners: { city: string; name: string; lat: number; lng: number; umkm: number }[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <MapContainer
        center={[-2.5, 117]}
        zoom={4}
        scrollWheelZoom={false}
        style={{ height: 420, width: "100%" }}
        attributionControl
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {partners.map((p) => (
          <Marker key={p.city} position={[p.lat, p.lng]} icon={icon}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{p.name}</div>
                <div className="text-zinc-500">{p.city}</div>
                <div className="mt-1">{p.umkm} UMKM dilayani · Status: Aktif</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
