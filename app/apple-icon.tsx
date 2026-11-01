import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

// Home-screen icon for iOS: the logo mark on a purple tile (the old app/icon.svg design).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const mark = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path d="M17.9986 5.53472L35.5997 0.349121L30.464 18.0001L35.5997 35.6012L17.9986 30.4655L0.347656 35.6012L5.53325 18.0001L0.347656 0.349121L17.9986 5.53472Z" fill="black"/></svg>',
)}`;

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: site.colors.purple }}>
        <img src={mark} width={118} height={118} alt="" />
      </div>
    ),
    size,
  );
}
