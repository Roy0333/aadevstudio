"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useScaleIn } from "@/hooks/useScaleIn";

type CtaProps = {
  heading: string;
  text: string;
  button: { label: string; href: string };
};

export default function Cta({ heading, text, button }: CtaProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useScaleIn(sectionRef);

  return (
    <section ref={sectionRef} className="cta-sec pt-[100px] max-md:pt-14" aria-labelledby="cta-title">
      <div className="site-container">
        <div className="cta-card" data-scale-in>
          <div className="cta-content flex w-[500px] max-w-full flex-col items-start gap-[26px]">
            <h2 id="cta-title" className="text-[30px] font-medium leading-[normal] max-sm:text-[26px]">
              {heading}
            </h2>
            <p className="text-[18px] leading-[normal]">{text}</p>
            <Link href={button.href} className="btn btn-dark">
              {button.label}
            </Link>
          </div>

          <div className="cta-art" aria-hidden="true">
            <Image src="/images/cta/illustration.svg" alt="" width={359} height={394.269} />
          </div>
        </div>
      </div>
    </section>
  );
}
