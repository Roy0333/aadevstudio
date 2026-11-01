import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

// Share card for social media / chat apps (also used for the Twitter card).
export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const star =
  "M17.9986 5.53472L35.5997 0.349121L30.464 18.0001L35.5997 35.6012L17.9986 30.4655L0.347656 35.6012L5.53325 18.0001L0.347656 0.349121L17.9986 5.53472Z";

const markSvg = (fill: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path d="${star}" fill="${fill}"/></svg>`,
  )}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: site.colors.dark,
          color: "#ffffff",
          position: "relative",
        }}
      >
        <img src={markSvg(site.colors.purple)} width={360} height={360} style={{ position: "absolute", right: -60, bottom: -60, opacity: 0.9 }} alt="" />

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <img src={markSvg("#ffffff")} width={56} height={56} alt="" />
          <span style={{ fontSize: 52, fontWeight: 600 }}>{site.name}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 860 }}>
          <span
            style={{
              display: "flex",
              alignSelf: "flex-start",
              padding: "4px 14px",
              fontSize: 30,
              color: "#000000",
              background: site.colors.purple,
              borderRadius: 10,
            }}
          >
            AI-first web solutions
          </span>
          <span style={{ fontSize: 74, fontWeight: 600, lineHeight: 1.1 }}>Your idea deserves to reach millions</span>
          <span style={{ fontSize: 30, color: "#d6d6dc" }}>Web development · AI solutions · E-commerce · UI/UX · SEO</span>
        </div>
      </div>
    ),
    size,
  );
}
