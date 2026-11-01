"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionHeading from "./SectionHeading";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type AboutProps = {
  heading: string;
  /** Wrap key phrases in **double asterisks** to give them the purple highlight. */
  text: string;
};

/**
 * About Us: one large paragraph that reads itself in as the visitor scrolls.
 * Each word goes from faint, blurred grey to sharp black, and key phrases get the purple
 * highlight wiped in once their last word is reached. Scrolling back reverses it.
 * Reduced-motion visitors see the finished paragraph straight away.
 */
export default function About({ heading, text }: AboutProps) {
  const sectionRef = useRef<HTMLElement>(null);

  // "plain **key phrase** plain" -> segments; odd segments are key phrases.
  const segments = text.split("**").map((part, i) => ({ words: part.trim().split(/\s+/).filter(Boolean), key: i % 2 === 1 }));

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const words = gsap.utils.toArray<HTMLElement>(".about-word");
        const marks = gsap.utils.toArray<HTMLElement>(".about-mark");
        const step = 0.12;

        gsap.set(words, { color: "#c9c9ce", opacity: 0.35, y: 10, filter: "blur(4px)" });
        gsap.set(marks, { "--hl-size": "0%" });

        const tl = gsap.timeline({
          defaults: { ease: "power1.out" },
          scrollTrigger: {
            trigger: ".about-text",
            start: "top 85%",
            end: "bottom 55%",
            scrub: 0.6,
          },
        });

        words.forEach((word, i) => {
          tl.to(word, { color: "#000000", opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4 }, i * step);
        });

        // Wipe each highlight in as the reader reaches the end of its phrase.
        marks.forEach((mark) => {
          const last = mark.querySelectorAll(".about-word");
          const index = words.indexOf(last[last.length - 1] as HTMLElement);
          tl.to(mark, { "--hl-size": "100%", duration: 0.5, ease: "power2.inOut" }, index * step);
        });
      });
    },
    { scope: sectionRef },
  );

  const renderWords = (words: string[], keyPrefix: string) =>
    words.map((word, i) => (
      <span key={`${keyPrefix}-${i}`} className="about-word inline-block">
        {word}
        {i < words.length - 1 && " "}
      </span>
    ));

  return (
    <section ref={sectionRef} id="about" className="about-sec pt-[70px] max-md:pt-14" aria-labelledby="about-title">
      <div className="site-container">
        <SectionHeading id="about-title" title={heading} />

        <p className="about-text text-[40px] font-medium leading-[1.45] max-lg:text-[32px] max-md:text-[24px]">
          {segments.map((segment, s) =>
            segment.words.length === 0 ? null : (
              <span key={s}>
                {segment.key ? (
                  <span className="about-mark highlight [box-decoration-break:clone]">{renderWords(segment.words, `k${s}`)}</span>
                ) : (
                  renderWords(segment.words, `p${s}`)
                )}{" "}
              </span>
            ),
          )}
        </p>
      </div>
    </section>
  );
}
