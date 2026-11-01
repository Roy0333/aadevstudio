"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useScaleIn } from "@/hooks/useScaleIn";
import SectionHeading from "./SectionHeading";
import ServiceCard, { type Service } from "./ServiceCard";

type ServicesProps = {
  heading: string;
  intro: string;
  items: Service[];
};

export default function Services({ heading, intro, items }: ServicesProps) {
  const sectionRef = useRef<HTMLElement>(null);

  // Cards grow in as they scroll into view, then their title highlights wipe in from the left.
  useScaleIn(sectionRef, {
    prepare: () => gsap.set(".service-card .highlight", { "--hl-size": "0%" }),
    onReveal: (card, i) => {
      gsap.to(card.querySelectorAll(".highlight"), {
        "--hl-size": "100%",
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.15,
        delay: 0.45 + i * 0.15,
      });
    },
  });

  return (
    <section ref={sectionRef} id="services" className="services-sec pt-[70px] max-md:pt-14" aria-labelledby="services-title">
      <div className="site-container">
        <SectionHeading id="services-title" title={heading} text={intro} />

        <ul className="services-grid grid grid-cols-2 gap-10 max-lg:grid-cols-1 max-md:gap-[30px]">
          {items.map((service, index) => (
            <li key={`${index}-${service.art}`} className="services-item" data-scale-in>
              <ServiceCard service={service} index={index} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
