import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Modalin — Invest. Grow. Impact.";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background:
            "radial-gradient(900px circle at 20% 20%, rgba(20,184,166,0.25), transparent 60%), radial-gradient(800px circle at 90% 80%, rgba(245,158,11,0.20), transparent 60%), #050507",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "radial-gradient(circle at 30% 20%, #134e4a 0%, #050507 70%)",
              boxShadow: "inset 0 0 0 1px rgba(251,191,36,0.4)",
              fontWeight: 900,
              fontSize: 44,
              letterSpacing: -2,
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #fbbf24 0%, #fef3c7 50%, #d97706 100%)",
                backgroundClip: "text",
                color: "transparent",
                display: "flex",
              }}
            >
              M
            </div>
          </div>
          <div style={{ fontWeight: 800, fontSize: 32, letterSpacing: -1, color: "white" }}>
            modalin
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontWeight: 800,
              fontSize: 84,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 1000,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <span>Modal untuk </span>
            <span
              style={{
                background: "linear-gradient(135deg, #fbbf24 0%, #fef3c7 50%, #d97706 100%)",
                backgroundClip: "text",
                color: "transparent",
                fontStyle: "italic",
                display: "flex",
              }}
            >
              UMKM bertumbuh
            </span>
            <span>, akses untuk </span>
            <span
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #d4d4d8 50%, #a1a1aa 100%)",
                backgroundClip: "text",
                color: "transparent",
                fontStyle: "italic",
                display: "flex",
              }}
            >
              investor baru
            </span>
            <span>.</span>
          </div>
          <div style={{ fontSize: 28, color: "#a1a1aa", maxWidth: 900 }}>
            ECF pertama Indonesia · min Rp100.000 · 100% bagi hasil ekuitas
          </div>
        </div>

        <div style={{ display: "flex", gap: 40, fontSize: 22, color: "#71717a", letterSpacing: 4, textTransform: "uppercase" }}>
          <span>Invest</span>
          <span style={{ color: "#fbbf24" }}>·</span>
          <span>Grow</span>
          <span style={{ color: "#fbbf24" }}>·</span>
          <span>Impact</span>
        </div>
      </div>
    ),
    size
  );
}
