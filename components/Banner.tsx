"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Figma illustration frame is 601 × 516; every position below is in that space.
const STAGE_WIDTH = 601;
// The laptop sits 30px right of the Figma megaphone spot; the icons orbit its centre.
const LAPTOP_CENTER = { x: 354.29, y: 201.2 };
// One shared oval, wide and flat like the rings. Icons on the upper half pass behind the
// laptop (smaller, as if further away) and on the lower half in front of it, so they read
// as circling round it in 3D.
const ORBIT = { rx: 250, ry: 170 };

const orbitIcons = [
  { name: "heart", src: "/images/banner/icon-heart.svg", x: 408.88, y: 0, w: 98.716, h: 98.624, scrollX: 10, scrollY: -80 },
  { name: "share", src: "/images/banner/icon-share.svg", x: 505.55, y: 12.38, w: 94.91, h: 94.948, scrollX: 40, scrollY: -140 },
  { name: "play", src: "/images/banner/icon-play.svg", x: 496.3, y: 115.32, w: 94.049, h: 93.988, scrollX: 60, scrollY: -60 },
  { name: "location", src: "/images/banner/icon-location-circle.svg", x: 475.39, y: 214.52, w: 101.967, h: 101.791, scrollX: 30, scrollY: -110 },
];

export default function Banner() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<gsap.core.Tween | null>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Big round cursor over the headline, text and button (mouse users only). It is white
  // with mix-blend-mode: difference, so it looks black on the white page and shows
  // whatever it covers as a negative: black text turns white. It shrinks away on leave
  // and the normal cursor comes back.
  useGSAP(
    () => {
      const content = sectionRef.current?.querySelector<HTMLElement>(".banner-content");
      const cursor = cursorRef.current;
      if (!content || !cursor || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

      gsap.set(cursor, { xPercent: -50, yPercent: -50, scale: 0 });
      const moveX = gsap.quickTo(cursor, "x", { duration: 0.25, ease: "power3.out" });
      const moveY = gsap.quickTo(cursor, "y", { duration: 0.25, ease: "power3.out" });

      let active = false;
      let pointer: { x: number; y: number } | null = null;

      const show = (x: number, y: number) => {
        if (!active) gsap.set(cursor, { x, y });
        active = true;
        moveX(x);
        moveY(y);
        gsap.to(cursor, { scale: 1, duration: 0.35, ease: "back.out(1.7)", overwrite: "auto" });
      };
      const hide = () => {
        active = false;
        gsap.to(cursor, { scale: 0, duration: 0.25, ease: "power2.in", overwrite: "auto" });
      };

      // Track the mouse anywhere, so a scroll can tell what is under it.
      const track = (e: PointerEvent) => {
        pointer = { x: e.clientX, y: e.clientY };
        if (active) {
          moveX(e.clientX);
          moveY(e.clientY);
        }
      };
      const enter = (e: PointerEvent) => show(e.clientX, e.clientY);

      // Scrolling moves the page under a still mouse without any pointer events, so
      // pointerleave would only fire on the next mouse move. Check on every scroll instead.
      const onScroll = () => {
        if (!pointer) return;
        const under = document.elementFromPoint(pointer.x, pointer.y);
        const inside = !!under && content.contains(under);
        if (inside && !active) show(pointer.x, pointer.y);
        else if (!inside && active) hide();
      };

      window.addEventListener("pointermove", track, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      content.addEventListener("pointerenter", enter);
      content.addEventListener("pointerleave", hide);
      return () => {
        window.removeEventListener("pointermove", track);
        window.removeEventListener("scroll", onScroll);
        content.removeEventListener("pointerenter", enter);
        content.removeEventListener("pointerleave", hide);
      };
    },
    { scope: sectionRef },
  );

  useGSAP(
    () => {
      const stage = stageRef.current!;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>(".banner-orbit-item");
        const floats = gsap.utils.toArray<HTMLElement>(".banner-orbit-float");

        // ----- Laptop: entrance, then an idle float -----
        gsap
          .timeline()
          .from(".banner-laptop", { autoAlpha: 0, scale: 0.8, rotation: -12, duration: 1, ease: "back.out(1.6)" })
          .to(".banner-laptop", { y: -14, rotation: -3, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1 });

        // ----- Icons: pop in -----
        gsap.from(floats, { autoAlpha: 0, scale: 0, duration: 0.6, ease: "back.out(2)", stagger: 0.12, delay: 0.4 });

        // ----- Icons: orbit the laptop -----
        // Every icon rides the same oval, starting at the angle of its Figma position so
        // they keep their order and grouping. dx / dy are its offset from its CSS spot.
        const paths = orbitIcons.map((icon) => {
          const dx = icon.x + icon.w / 2 - LAPTOP_CENTER.x;
          const dy = icon.y + icon.h / 2 - LAPTOP_CENTER.y;
          return { start: Math.atan2(dy / ORBIT.ry, dx / ORBIT.rx), dx, dy };
        });
        const setters = items.map((el) => ({
          x: gsap.quickSetter(el, "x", "px"),
          y: gsap.quickSetter(el, "y", "px"),
          scale: gsap.quickSetter(el, "scale"),
        }));

        let scale = stage.offsetWidth / STAGE_WIDTH;
        const resize = new ResizeObserver(() => (scale = stage.offsetWidth / STAGE_WIDTH));
        resize.observe(stage);

        const orbit = { angle: 0 };
        orbitRef.current = gsap.to(orbit, {
          angle: Math.PI * 2,
          duration: 24,
          ease: "none",
          repeat: -1,
          onUpdate: () => {
            paths.forEach((p, i) => {
              const a = p.start + orbit.angle;
              const depth = Math.sin(a); // -1 at the back (top), 1 at the front (bottom)
              setters[i].x((Math.cos(a) * ORBIT.rx - p.dx) * scale);
              setters[i].y((depth * ORBIT.ry - p.dy) * scale);
              setters[i].scale(0.85 + 0.15 * depth);
              items[i].style.zIndex = depth < 0 ? "0" : "2";
            });
          },
        });

        // Stop the orbit while the banner is off screen.
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? orbitRef.current?.play() : orbitRef.current?.pause()),
        });

        // ----- Icons: drift apart on scroll -----
        floats.forEach((el, i) => {
          gsap.to(el, {
            x: orbitIcons[i].scrollX,
            y: orbitIcons[i].scrollY,
            rotation: i % 2 ? 12 : -12,
            ease: "none",
            scrollTrigger: { trigger: sectionRef.current, start: 0, end: "bottom top", scrub: 1 },
          });
        });

        return () => {
          resize.disconnect();
          orbitRef.current = null;
        };
      });

      // ----- Icons: grow on hover and slow the orbit so they are easy to follow -----
      const icons = gsap.utils.toArray<HTMLElement>(".banner-orbit-icon");
      const enter = (e: MouseEvent) => {
        gsap.to(e.currentTarget, { scale: 1.15, duration: 0.35, ease: "back.out(2)" });
        if (orbitRef.current) gsap.to(orbitRef.current, { timeScale: 0.15, duration: 0.4 });
      };
      const leave = (e: MouseEvent) => {
        gsap.to(e.currentTarget, { scale: 1, duration: 0.35, ease: "power2.out" });
        if (orbitRef.current) gsap.to(orbitRef.current, { timeScale: 1, duration: 0.6 });
      };
      icons.forEach((el) => {
        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);
      });

      return () => {
        icons.forEach((el) => {
          el.removeEventListener("mouseenter", enter);
          el.removeEventListener("mouseleave", leave);
        });
      };
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="banner overflow-x-clip pt-[55px] max-md:pt-[25px]" aria-labelledby="banner-title">
      <div className="site-container flex items-start justify-between gap-10 max-lg:flex-col max-lg:items-center">
        <div className="banner-content flex w-[531px] max-w-full shrink-0 flex-col items-start gap-[35px] max-lg:w-full">
          <h1 id="banner-title" className="text-[60px] font-medium leading-[normal] max-xl:text-[46px] max-md:text-[40px]">
            Your idea deserves to reach millions
          </h1>
          <p className="w-[498px] max-w-full text-[20px] leading-7 max-md:text-[18px]">
            We are an AI-first web solutions company with real craftsmanship. We build your online presence and
            enhance it with AI so your business can grow, with no extra charges and no extra time.
          </p>
          <Link href="#contact" className="btn btn-dark">
            Book a consultation
          </Link>
        </div>

        <div ref={stageRef} className="banner-stage" aria-hidden="true">
          <span className="banner-piece banner-star-small">
            <Image src="/images/banner/star-small.svg" alt="" width={36} height={36} />
          </span>
          <span className="banner-piece banner-star-large">
            <Image src="/images/banner/star-large.svg" alt="" width={70.326} height={70.326} />
          </span>
          {["banner-ring-1", "banner-ring-2", "banner-ring-3"].map((ring) => (
            <span key={ring} className={`banner-piece banner-ring ${ring}`}>
              <Image src="/images/banner/orbit-ring.svg" alt="" width={566.261} height={118.948} />
            </span>
          ))}
          <span className="banner-piece banner-dot-31">
            <Image src="/images/banner/dot-31.svg" alt="" width={31} height={31} />
          </span>
          <span className="banner-piece banner-dot-20">
            <Image src="/images/banner/dot-20.svg" alt="" width={20} height={20} />
          </span>
          <span className="banner-piece banner-dot-47">
            <Image src="/images/banner/dot-47.svg" alt="" width={47} height={47} />
          </span>

          <span className="banner-piece banner-laptop">
            <Image src="/images/banner/laptop.svg" alt="" width={340.58} height={367.589} priority />
          </span>

          {orbitIcons.map((icon) => (
            <span key={icon.name} className={`banner-piece banner-orbit-item banner-icon-${icon.name}`}>
              <span className="banner-orbit-float">
                <span className="banner-orbit-icon">
                  <Image src={icon.src} alt="" width={icon.w} height={icon.h} />
                  {icon.name === "location" && (
                    <span className="banner-location-pin">
                      <Image src="/images/banner/icon-location-pin.svg" alt="" width={39.18} height={57.789} />
                    </span>
                  )}
                </span>
              </span>
            </span>
          ))}
        </div>
      </div>

      <div ref={cursorRef} className="banner-cursor" aria-hidden="true" />
    </section>
  );
}
