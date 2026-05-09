import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 30% 20%, #134e4a 0%, #050507 70%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontWeight: 900,
          fontSize: 130,
          letterSpacing: -6,
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #fbbf24 0%, #fef3c7 50%, #d97706 100%)",
            backgroundClip: "text",
            color: "transparent",
            display: "flex",
            filter: "drop-shadow(0 6px 18px rgba(251,191,36,0.5))",
          }}
        >
          M
        </div>
      </div>
    ),
    size
  );
}
