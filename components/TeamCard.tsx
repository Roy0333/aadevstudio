"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import { useScaleIn } from "@/hooks/useScaleIn";

type TeamMember = {
  name: string;
  role: string;
  bio: string[];
  linkedin: string;
  /** Figma crops each photo differently: its size and offset behind the 97.8px blob mask. */
  photo: { src: string; width: number; height: number; x: number; y: number };
};

export default function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const cardRef = useRef<HTMLElement>(null);
  const { photo } = member;

  // Cards animate on their own, so offset each one by its column to keep the row staggered.
  useScaleIn(cardRef, { delay: (index % 3) * 0.15 });

  return (
    <article ref={cardRef} className="team-card" data-scale-in>
      <div className="team-person">
        <div className="team-photo">
          <Image src="/images/team/photo-shadow.svg" alt="" width={97.8234} height={97.8234} className="team-photo-shadow" />
          <div
            className="team-photo-mask"
            style={
              {
                "--photo-w": `${photo.width}px`,
                "--photo-h": `${photo.height}px`,
                "--photo-x": `${photo.x}px`,
                "--photo-y": `${photo.y}px`,
              } as CSSProperties
            }
          >
            {/* The name is right beside the photo, so the image itself is decorative. */}
            <Image src={photo.src} alt="" width={photo.width} height={photo.height} />
          </div>
        </div>

        <div className="team-name">
          <h3 className="text-[20px] font-medium leading-[normal]">{member.name}</h3>
          <p className="text-[18px] leading-[normal]">{member.role}</p>
        </div>

        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="team-social"
          aria-label={`${member.name} on LinkedIn`}
        >
          <Image src="/images/team/icon-linkedin.svg" alt="" width={34} height={34} />
        </a>
      </div>

      <Image src="/images/team/divider.svg" alt="" width={317} height={1} className="team-divider" />

      <div className="team-bio text-[18px] leading-[normal]">
        {member.bio.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </article>
  );
}
