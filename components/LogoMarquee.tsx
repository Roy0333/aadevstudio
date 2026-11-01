"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const logos = [
  { name: "Amazon", src: "/images/logos/amazon.svg", w: 124.113 },
  { name: "Dribbble", src: "/images/logos/dribbble.svg", w: 126.369 },
  { name: "HubSpot", src: "/images/logos/hubspot.svg", w: 128.626 },
  { name: "Notion", src: "/images/logos/notion.svg", w: 145.551 },
  { name: "Netflix", src: "/images/logos/netflix.svg", w: 125.241 },
  { name: "Zoom", src: "/images/logos/zoom.svg", w: 110.573 },
];

const SPEED = 60; // px per second at rest
const SCROLL_FACTOR = 100; // every 100px/s of scroll speed adds one more SPEED
const MAX_BOOST = 15; // fastest speed while scrolling, as a multiple of SPEED

export default function LogoMarquee() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const track = trackRef.current!;

        // The track holds two identical lists, so sliding it by half its width loops seamlessly.
        const loop = gsap.to(track, {
          xPercent: -50,
          duration: track.offsetWidth / 2 / SPEED,
          ease: "none",
          repeat: -1,
        });

        // Scrolling either way speeds the loop up in proportion to the scroll speed
        // (still right to left), then it eases back once scrolling stops.
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            const boost = gsap.utils.clamp(1, MAX_BOOST, 1 + Math.abs(self.getVelocity()) / SCROLL_FACTOR);
            gsap.to(loop, {
              timeScale: boost,
              duration: 0.25,
              ease: "power1.out",
              overwrite: true,
              onComplete: () => {
                gsap.to(loop, { timeScale: 1, duration: 0.8, ease: "power1.out" });
              },
            });
          },
        });
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="logos pt-[70px] max-md:pt-10">
      <div className="site-container">
        <div className="logos-viewport overflow-hidden">
          <div ref={trackRef} className="logos-track flex w-max">
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                className="logos-list flex shrink-0 items-center"
                aria-label={copy === 0 ? "Companies we work with" : undefined}
                aria-hidden={copy === 1 ? true : undefined}
              >
                {logos.map((logo) => (
                  <li key={logo.name} className="logos-item shrink-0">
                    <Image
                      src={logo.src}
                      alt={copy === 0 ? logo.name : ""}
                      width={logo.w}
                      height={48}
                      className="h-12 w-auto grayscale max-md:h-9"
                    />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
