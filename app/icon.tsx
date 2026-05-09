import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 14,
          boxShadow: "inset 0 0 0 1px rgba(251,191,36,0.4)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontWeight: 900,
          fontSize: 44,
          letterSpacing: -2,
          color: "transparent",
          backgroundImage:
            "radial-gradient(circle at 30% 20%, #134e4a 0%, #050507 70%)",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #fbbf24 0%, #fef3c7 50%, #d97706 100%)",
            backgroundClip: "text",
            color: "transparent",
            display: "flex",
            filter: "drop-shadow(0 2px 6px rgba(251,191,36,0.5))",
          }}
        >
          M
        </div>
      </div>
    ),
    size
  );
}
