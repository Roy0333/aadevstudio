"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import SectionHeading from "./SectionHeading";
import TestimonialCard, { type Testimonial } from "./TestimonialCard";

type TestimonialsProps = {
  heading: string;
  intro: string;
  items: Testimonial[];
};

// Where a slide sits relative to the active one, wrapped so the carousel loops:
// with 5 slides the offsets run -2 … 2, and only -1, 0 and 1 are on screen.
function slideOffset(index: number, active: number, total: number) {
  const half = Math.floor(total / 2);
  return ((index - active + total + half) % total) - half;
}

const AUTOPLAY_DELAY = 4000; // ms between automatic slides

export default function Testimonials({ heading, intro, items }: TestimonialsProps) {
  const total = items.length;
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState(0);
  const [paused, setPaused] = useState(false);
  const swipeStart = useRef<number | null>(null);

  const goTo = (index: number) => {
    setPrevious(active);
    setActive((index + total) % total);
  };

  // Auto-advance every 4s. The timer restarts whenever the slide changes, so a manual
  // click or swipe always gets a full 4s. Paused while hovered or focused, and off for
  // visitors who prefer reduced motion.
  useEffect(() => {
    if (paused || total < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setTimeout(() => {
      setPrevious(active);
      setActive((active + 1) % total);
    }, AUTOPLAY_DELAY);

    return () => window.clearTimeout(timer);
  }, [active, paused, total]);

  const onPointerDown = (e: React.PointerEvent) => {
    swipeStart.current = e.clientX;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (swipeStart.current === null) return;
    const distance = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(distance) > 50) goTo(distance < 0 ? active + 1 : active - 1);
  };

  return (
    <section id="testimonials" className="testimonials-sec pt-[100px] max-md:pt-14" aria-labelledby="testimonials-title">
      <div className="site-container">
        <SectionHeading id="testimonials-title" title={heading} text={intro} textClassName="w-[473px]" />

        <div
          className="testimonials-block"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
          }}
        >
          <ul className="testimonials-track" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
            {items.map((testimonial, index) => {
              const offset = slideOffset(index, active, total);
              // A slide wrapping from one end to the other jumps instead of sliding across.
              const jumps = Math.abs(offset - slideOffset(index, previous, total)) > 1;

              return (
                <li
                  key={index}
                  className={`testimonials-slide ${offset === 0 ? "is-active" : ""} ${jumps ? "is-jumping" : ""}`}
                  style={{ "--offset": offset } as CSSProperties}
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${total}`}
                  aria-hidden={offset !== 0}
                  inert={offset !== 0}
                >
                  <TestimonialCard testimonial={testimonial} />
                </li>
              );
            })}
          </ul>

          <div className="testimonials-nav">
            <button type="button" className="testimonials-arrow" aria-label="Previous testimonial" onClick={() => goTo(active - 1)}>
              <Image src="/images/testimonials/arrow.svg" alt="" width={23} height={22.0919} />
            </button>

            {/* The stars asset is a mask; the background paints the active star purple. */}
            <div className="testimonials-dots" style={{ "--active": active } as CSSProperties}>
              {items.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className="testimonials-dot"
                  aria-label={`Show testimonial ${index + 1}`}
                  aria-current={index === active}
                  onClick={() => goTo(index)}
                />
              ))}
            </div>

            <button type="button" className="testimonials-arrow testimonials-arrow-next" aria-label="Next testimonial" onClick={() => goTo(active + 1)}>
              <Image src="/images/testimonials/arrow.svg" alt="" width={23} height={22.0919} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
