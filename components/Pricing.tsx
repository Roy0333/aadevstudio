"use client";

import { useRef, type CSSProperties } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionHeading from "./SectionHeading";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Plan = {
  title: string;
  /** Small line above the price, e.g. "Starting from". */
  from: string;
  price: string;
  /** Unit after the price, e.g. "/ template". Optional. */
  unit?: string;
  text: string;
  features: string[];
  button: { label: string; href: string };
};

type PricingProps = {
  heading: string;
  intro: string;
  items: Plan[];
  note: { title: string; text: string; button: { label: string; href: string } };
};

// One style per card position, matching the Services grid: grey, purple, dark.
const cardStyles = [
  { card: "grey", label: "purple", button: "btn-dark" },
  { card: "purple", label: "white", button: "btn-dark" },
  { card: "dark", label: "purple", button: "btn-purple" },
] as const;

/**
 * Pricing cards that stack as you scroll: each card sticks near the top (a little lower
 * than the one before, so earlier cards peek out) and the next slides up over it, while
 * the covered card shrinks back slightly. On phones the cards simply follow each other.
 */
export default function Pricing({ heading, intro, items, note }: PricingProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".pricing-card");
        const slots = gsap.utils.toArray<HTMLElement>(".pricing-slot");

        // Shrink each card slightly while the next one slides over it.
        cards.slice(0, -1).forEach((card, i) => {
          gsap.to(card, {
            scale: 0.92 + i * 0.02,
            ease: "none",
            scrollTrigger: {
              trigger: slots[i + 1],
              start: "top bottom",
              end: () => `top ${parseFloat(getComputedStyle(slots[i + 1]).top) || 0}px`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="pricing" className="pricing-sec pt-[100px] max-md:pt-14" aria-labelledby="pricing-title">
      <div className="site-container">
        <SectionHeading id="pricing-title" title={heading} text={intro} textClassName="w-[420px]" />

        <ul className="pricing-stack">
          {items.map((plan, index) => {
            const style = cardStyles[index % cardStyles.length];
            return (
              <li key={plan.title} className="pricing-slot" style={{ "--i": index } as CSSProperties}>
                <article className={`pricing-card pricing-card-${style.card}`}>
                  {/* ----- Plan and price ----- */}
                  <div className="pricing-main flex flex-col items-start gap-6">
                    <div className="flex w-full items-center justify-between gap-4">
                      <h3 className="text-[30px] font-medium leading-[normal] max-md:text-[26px]">
                        <span className={`highlight highlight-${style.label}`}>{plan.title}</span>
                      </h3>
                      <span className="pricing-index">{String(index + 1).padStart(2, "0")}</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-[18px] opacity-80">{plan.from}</span>
                      <p className="flex items-baseline gap-2">
                        <span className="text-[64px] font-medium leading-none max-lg:text-[52px] max-md:text-[44px]">
                          {plan.price}
                        </span>
                        {plan.unit && <span className="text-[20px] opacity-80">{plan.unit}</span>}
                      </p>
                    </div>

                    <p className="max-w-[420px] text-[18px] leading-7">{plan.text}</p>

                    <Link href={plan.button.href} className={`btn ${style.button} mt-auto max-md:w-full`}>
                      {plan.button.label}
                    </Link>
                  </div>

                  {/* ----- What's included ----- */}
                  <div className="pricing-included">
                    <h4 className="mb-6 text-[20px] font-medium">What’s included</h4>
                    <ul className="pricing-features flex flex-col gap-4 text-[18px]">
                      {plan.features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        <div className="pricing-note">
          <div className="flex flex-col gap-2">
            <h3 className="text-[26px] font-medium leading-[normal]">{note.title}</h3>
            <p className="text-[18px] leading-7">{note.text}</p>
          </div>
          <Link href={note.button.href} className="btn btn-dark shrink-0">
            {note.button.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
