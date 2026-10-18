import { ImageResponse } from "next/og";

export const alt = "👋 Hello.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#15151C",
          backgroundImage:
            "radial-gradient(circle at 50% 46%, rgba(245, 166, 118, 0.08) 0%, rgba(245, 166, 118, 0.02) 40%, rgba(21, 21, 28, 0) 70%)",
          padding: "60px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 76,
              fontWeight: 650,
              color: "rgba(255, 255, 255, 0.96)",
              letterSpacing: "-0.03em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1.15,
            }}
          >
            👋 Hello.
          </div>

          <div
            style={{
              width: 48,
              height: 2,
              borderRadius: 1,
              background:
                "linear-gradient(90deg, rgba(245, 166, 118, 0.1), rgba(245, 166, 118, 0.75), rgba(245, 166, 118, 0.1))",
              marginTop: 24,
              marginBottom: 20,
            }}
          />

          <div
            style={{
              fontSize: 26,
              fontWeight: 400,
              color: "rgba(255, 255, 255, 0.64)",
              letterSpacing: "0.02em",
              lineHeight: 1.4,
            }}
          >
            A little something, just for you.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
