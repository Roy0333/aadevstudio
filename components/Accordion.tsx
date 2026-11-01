"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { useScaleIn } from "@/hooks/useScaleIn";

export type AccordionItem = {
  title: string;
  content: string;
};

type AccordionProps = {
  items: AccordionItem[];
  /** Index of the panel open on load; null starts with all closed. */
  defaultOpen?: number | null;
};

/** One panel open at a time. Each item grows in as it scrolls into view. */
export default function Accordion({ items, defaultOpen = 0 }: AccordionProps) {
  const rootRef = useRef<HTMLUListElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);
  const baseId = useId();

  useScaleIn(rootRef, { from: 0.8, stagger: 0.1 });

  return (
    <ul ref={rootRef} className="accordion flex flex-col gap-[30px]">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${baseId}-button-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <li key={index} className={`accordion-item ${isOpen ? "is-open" : ""}`} data-scale-in>
            <h3>
              <button
                type="button"
                id={buttonId}
                className="accordion-trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span className="accordion-label">
                  <span className="accordion-number">{String(index + 1).padStart(2, "0")}</span>{" "}
                  <span className="accordion-title">{item.title}</span>
                </span>
                <span className="accordion-icon" aria-hidden="true">
                  <Image src="/images/faq/icon-plus.svg" alt="" width={58} height={58} className="accordion-icon-plus" />
                  <Image src="/images/faq/icon-minus.svg" alt="" width={58} height={58} className="accordion-icon-minus" />
                </span>
              </button>
            </h3>

            <div id={panelId} role="region" aria-labelledby={buttonId} className="accordion-panel" inert={!isOpen}>
              <div className="accordion-panel-inner">
                <Image src="/images/faq/divider.svg" alt="" width={1114} height={1} className="accordion-divider" />
                <p className="text-[18px] leading-[normal]">{item.content}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
