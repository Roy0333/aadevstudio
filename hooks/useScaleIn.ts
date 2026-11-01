"use client";

import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ScaleInOptions = {
  /** Selector for the elements to animate, resolved inside the scope. */
  targets?: string;
  /** Starting scale. */
  from?: number;
  /** ScrollTrigger start position for each element. */
  start?: string;
  /** Delay between elements that enter the viewport together. */
  stagger?: number;
  /** Extra delay before growing in, e.g. to offset cards that animate on their own. */
  delay?: number;
  /** Runs once before anything is hidden, to set up extra starting states. */
  prepare?: () => void;
  /** Runs for each element as it starts growing in, for extra animations. */
  onReveal?: (el: HTMLElement, index: number) => void;
};

/**
 * Elements start small and hidden, then grow to full size as they scroll into view.
 * Visitors who prefer reduced motion see them at full size straight away.
 */
export function useScaleIn(
  scope: RefObject<HTMLElement | null>,
  { targets = "[data-scale-in]", from = 0.6, start = "top 85%", stagger = 0.15, delay = 0, prepare, onReveal }: ScaleInOptions = {},
) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The scope itself can be the target, so a single card can animate itself.
        const root = scope.current;
        const items = root?.matches(targets) ? [root] : gsap.utils.toArray<HTMLElement>(targets);
        if (!items.length) return;

        prepare?.();
        gsap.set(items, { scale: from, autoAlpha: 0 });

        ScrollTrigger.batch(items, {
          start,
          once: true,
          onEnter: (batch) => {
            gsap.to(batch, { scale: 1, autoAlpha: 1, duration: 0.8, ease: "back.out(1.4)", stagger, delay });
            batch.forEach((el, i) => onReveal?.(el as HTMLElement, i));
          },
        });
      });
    },
    { scope },
  );
}
