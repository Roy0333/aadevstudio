"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SectionHeading from "./SectionHeading";
import { iconForeground, techIcons } from "./tech-icons";

gsap.registerPlugin(useGSAP);

type TechGroup = {
  title: string;
  /** Slugs from components/tech-icons.ts */
  icons: string[];
};

type TechnologiesProps = {
  heading: string;
  intro: string;
  items: TechGroup[];
};

// Fallback if transitionend never fires; a bit longer than the 0.6s bar transition.
const BAR_OPEN_FALLBACK = 900;

// The drop animation currently running in each pile, so a re-stack can replace it cleanly.
const pileTimelines = new WeakMap<HTMLElement, gsap.core.Timeline>();

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Packs the balls into the box like balls in a crate: rows filled left to right with the
 * balls touching, each row above sitting in the dips of the row below (offset by half a
 * ball). The ball size shrinks from --ball-max until every ball fits inside the box.
 */
function layoutPile(pile: HTMLElement, animate: boolean) {
  const items = Array.from(pile.querySelectorAll<HTMLElement>(".tech-ball-item"));
  const width = pile.clientWidth;
  const height = pile.clientHeight;
  if (!items.length || !width || !height) return;

  const count = items.length;
  const rowStep = Math.sqrt(3) / 2; // vertical distance between rows, as a fraction of a ball

  // Balls per row: full rows of `perRow`, offset rows of one fewer.
  const rowsNeeded = (perRow: number) => {
    let rows = 0;
    for (let placed = 0; placed < count; rows++) placed += perRow > 1 && rows % 2 ? perRow - 1 : perRow;
    return rows;
  };

  let size = parseFloat(getComputedStyle(pile).getPropertyValue("--ball-max")) || 76;
  let perRow = 1;
  for (; size > 30; size -= 1) {
    perRow = Math.max(1, Math.floor(width / size));
    if (size + (rowsNeeded(perRow) - 1) * size * rowStep <= height) break;
  }
  pile.style.setProperty("--ball", `${size}px`);

  const radius = size / 2;
  const offsetX = (width - perRow * size) / 2; // centre the pack in the box
  const positions: { x: number; y: number }[] = [];

  let row = 0;
  let col = 0;
  items.forEach((_, i) => {
    const inRow = perRow > 1 && row % 2 ? perRow - 1 : perRow;
    const shift = perRow > 1 && row % 2 ? radius : 0;
    positions[i] = {
      x: offsetX + shift + col * size,
      y: height - size - row * size * rowStep,
    };
    if (++col === inRow) {
      col = 0;
      row++;
    }
  });

  const order = items.map((_, i) => i); // bottom-left first, in data order

  pileTimelines.get(pile)?.kill();
  pileTimelines.delete(pile);

  if (animate) {
    // Lowest balls first, each falling in from above the bar and bouncing to rest.
    const drop = gsap.timeline();
    order.forEach((i, k) => {
      const { x, y } = positions[i];
      drop.fromTo(
        items[i],
        { x, y: -size - Math.random() * height * 0.4 },
        { y, duration: 0.9 + Math.random() * 0.4, ease: "bounce.out" },
        k * 0.07,
      );
    });
    pileTimelines.set(pile, drop);
  } else {
    order.forEach((i) => gsap.set(items[i], positions[i]));
  }

  pile.classList.add("is-ready");
  pile.dataset.layoutWidth = String(width);
}

export default function Technologies({ heading, intro, items }: TechnologiesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const firstLayout = useRef(true);
  const [active, setActive] = useState(0);
  const baseId = useId();

  // Each time a bar opens, empty its pile and drop the balls in once the bar has
  // finished opening (its width, or its height when stacked, has stopped changing).
  useEffect(() => {
    const bar = sectionRef.current?.querySelectorAll<HTMLElement>(".tech-bar")[active];
    const pile = bar?.querySelector<HTMLElement>(".tech-pile");
    if (!bar || !pile) return;

    let dropped = false;
    const drop = () => {
      if (dropped) return;
      dropped = true;
      layoutPile(pile, !prefersReducedMotion());
    };

    const onTransitionEnd = (e: TransitionEvent) => {
      const opened = e.target === bar && e.propertyName.startsWith("flex");
      const openedStacked = (e.target as HTMLElement).classList.contains("tech-bar-panel") && e.propertyName === "grid-template-rows";
      if (opened || openedStacked) drop();
    };

    let timer = 0;
    if (firstLayout.current) {
      firstLayout.current = false;
      drop();
    } else {
      pile.classList.remove("is-ready");
      bar.addEventListener("transitionend", onTransitionEnd);
      timer = window.setTimeout(drop, BAR_OPEN_FALLBACK);
    }

    // Window resizes re-stack the heap in place (no drop). Tiny changes are ignored.
    let resizeTimer = 0;
    const resize = new ResizeObserver(() => {
      if (!pile.classList.contains("is-ready")) return;
      if (Math.abs(pile.clientWidth - Number(pile.dataset.layoutWidth)) < 2) return;
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => layoutPile(pile, false), 150);
    });
    resize.observe(pile);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(resizeTimer);
      bar.removeEventListener("transitionend", onTransitionEnd);
      resize.disconnect();
    };
  }, [active]);

  // Hover: the ball jumps off in a random direction, spinning, then bounces back to its spot.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(hover: hover) and (prefers-reduced-motion: no-preference)", () => {
        const balls = gsap.utils.toArray<HTMLElement>(".tech-ball");

        const hop = (e: MouseEvent) => {
          const ball = e.currentTarget as HTMLElement;
          if (gsap.isTweening(ball)) return;

          // A different random jump every time: any direction, some spin, then a bounce home.
          gsap
            .timeline()
            .to(ball, {
              x: gsap.utils.random(-45, 45),
              y: gsap.utils.random(-60, -12),
              rotation: gsap.utils.random(-200, 200),
              duration: gsap.utils.random(0.25, 0.4),
              ease: "power2.out",
            })
            .to(ball, { x: 0, y: 0, rotation: 0, duration: gsap.utils.random(0.7, 1), ease: "bounce.out" });
        };

        balls.forEach((ball) => ball.addEventListener("mouseenter", hop));
        return () => balls.forEach((ball) => ball.removeEventListener("mouseenter", hop));
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="technologies" className="tech-sec pt-[100px] max-md:pt-14" aria-labelledby="tech-title">
      <div className="site-container">
        <SectionHeading id="tech-title" title={heading} text={intro} textClassName="w-[473px]" />

        {/* One bar open at a time: hovering, focusing or tapping a bar opens it. */}
        <ul className="tech-bars">
          {items.map((group, index) => {
            const isOpen = index === active;
            const buttonId = `${baseId}-button-${index}`;
            const panelId = `${baseId}-panel-${index}`;

            return (
              <li key={group.title} className={`tech-bar ${isOpen ? "is-open" : ""}`} onMouseEnter={() => setActive(index)}>
                <h3 className="tech-bar-head">
                  <button
                    type="button"
                    id={buttonId}
                    className="tech-bar-trigger"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setActive(index)}
                    onFocus={() => setActive(index)}
                  >
                    <span className="tech-bar-number">{String(index + 1).padStart(2, "0")}</span>{" "}
                    <span className="tech-bar-title">{group.title}</span>
                  </button>
                </h3>

                <div id={panelId} role="region" aria-labelledby={buttonId} className="tech-bar-panel" inert={!isOpen}>
                  <div className="tech-bar-panel-inner">
                    <ul className="tech-pile">
                      {group.icons.map((slug) => {
                        const icon = techIcons[slug];
                        if (!icon) return null;

                        return (
                          <li key={slug} className="tech-ball-item">
                            <span
                              className="tech-ball"
                              style={{ "--brand": `#${icon.hex}`, "--fg": iconForeground(icon.hex) } as CSSProperties}
                            >
                              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                <path d={icon.path} />
                              </svg>
                            </span>
                            <span className="tech-ball-label">{icon.title}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
