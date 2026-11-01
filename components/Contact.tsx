"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SectionHeading from "./SectionHeading";

gsap.registerPlugin(useGSAP);

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

type Status = "idle" | "sending" | "sent" | "error";

const statusMessages: Record<Status, string> = {
  idle: "",
  sending: "Sending…",
  sent: "Thanks! Your message is on its way, we'll be in touch soon.",
  error: "Something went wrong. Please try again in a moment.",
};

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<Status>("idle");

  // Stars float up and down while gently growing and shrinking, out of step with each other.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(".contact-star-dark", { y: -24, scale: 1.12, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.to(".contact-star-purple", { y: 18, scale: 0.82, duration: 1.9, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0.4 });
      });
    },
    { scope: sectionRef },
  );

  // Posts straight to Web3Forms, which emails the message to the inbox tied to the access key.
  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    data.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "");
    data.append("subject", `New message from ${data.get("name") || "the website"}`);
    data.append("from_name", "AA Dev Studio website");

    setStatus("sending");
    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, { method: "POST", body: data });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section ref={sectionRef} id="contact" className="contact-sec pt-[100px] max-md:pt-14" aria-labelledby="contact-title">
      <div className="site-container">
        <SectionHeading
          id="contact-title"
          title="Contact Us"
          text="Connect with Us: Let’s Discuss Your Idea and Your Next Project"
          textClassName="w-[323px]"
        />

        <div className="contact-card">
          <form
            className="contact-form"
            onSubmit={onSubmit}
            onChange={() => status !== "sending" && setStatus("idle")}
          >
            {/* Web3Forms honeypot: bots tick it, people never see it. */}
            <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

            <div className="contact-fields">
              <div className="contact-field">
                <label htmlFor="contact-name">Name</label>
                <input id="contact-name" name="name" type="text" placeholder="Name" autoComplete="name" />
              </div>
              <div className="contact-field">
                <label htmlFor="contact-email">Email*</label>
                <input id="contact-email" name="email" type="email" placeholder="Email" autoComplete="email" required />
              </div>
              <div className="contact-field">
                <label htmlFor="contact-message">Message*</label>
                <textarea id="contact-message" name="message" placeholder="Message" required />
              </div>
            </div>

            <div className="contact-actions">
              <button type="submit" className="btn btn-dark contact-submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send Message"}
              </button>
              <p className="contact-status" role="status">
                {status !== "sending" && statusMessages[status]}
              </p>
            </div>
          </form>

          {/* Figma illustration, split into layers so the stars can move on their own. */}
          <div className="contact-art" aria-hidden="true">
            <Image src="/images/contact/starburst.svg" alt="" width={649.922} height={648.251} className="contact-starburst" />
            <span className="contact-star contact-star-purple">
              <Image src="/images/contact/star-purple.svg" alt="" width={100} height={100} />
            </span>
            <span className="contact-star contact-star-dark">
              <Image src="/images/contact/star-dark.svg" alt="" width={178.693} height={178.693} />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
