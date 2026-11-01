"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { navItems } from "./nav-items";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  // Frosted background once the page has scrolled.
  useEffect(() => {
    const onScroll = () => setIsSticky(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on Escape and when returning to desktop width.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    const desktop = window.matchMedia("(min-width: 1200px)");
    const onResize = () => desktop.matches && setIsOpen(false);

    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, []);

  return (
    <header className={`site-header ${isSticky ? "is-sticky" : ""}`}>
      <div className="site-container relative flex items-center justify-between">
        <Link
          href="/"
          className="header-logo shrink-0"
          aria-label="AA DEV STUDIO home"
        >
          <Image
            src="/images/aa-logo.png"
            alt="AA DEV STUDIO"
            width={100}
            height={60}
            priority
            className="h-[60px] w-auto"
          />
        </Link>

        <button
          type="button"
          className="nav-toggle hidden flex-col gap-[6px] p-2 max-xl:flex"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-controls="main-nav"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span
            className={`block h-[2px] w-7 bg-black transition-all duration-300 ${isOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-[2px] w-7 bg-black transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-[2px] w-7 bg-black transition-all duration-300 ${isOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>

        <nav
          id="main-nav"
          aria-label="Main"
          className={`header-nav flex items-center gap-10 max-xl:absolute max-xl:inset-x-10 max-xl:top-full max-xl:z-20 max-xl:mt-4 max-xl:flex-col max-xl:items-start max-xl:gap-6 max-xl:rounded-[14px] max-xl:border max-xl:border-dark max-xl:bg-white max-xl:p-8 max-md:inset-x-4 ${isOpen ? "" : "max-xl:hidden"}`}
        >
          <ul className="nav-list flex items-center gap-10 max-xl:flex-col max-xl:items-start max-xl:gap-5">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="nav-link"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="#contact"
            className="btn"
            onClick={() => setIsOpen(false)}
          >
            Request a quote
          </Link>
        </nav>
      </div>
    </header>
  );
}
