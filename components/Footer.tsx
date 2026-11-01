import Image from "next/image";
import Link from "next/link";
import { navItems } from "./nav-items";
import { site } from "@/lib/site";

// The three icons ship as one Figma asset (130×30); each link is a 30px hotspot over its circle.
const socialLinks = [
  { label: "LinkedIn", href: site.social.linkedin, left: "left-0" },
  { label: "Facebook", href: site.social.facebook, left: "left-[50px]" },
  { label: "Twitter", href: site.social.twitter, left: "left-[100px]" },
];

export default function Footer() {
  return (
    <footer className="site-footer mt-[140px] max-md:mt-20">
      <div className="site-container max-md:px-0">
        <div className="footer-inner flex flex-col gap-[50px] rounded-t-[45px] bg-dark px-[60px] pt-[55px] pb-[50px] text-white max-lg:px-10 max-md:px-6 max-md:pt-10">
          <div className="footer-main flex flex-col gap-[66px] max-md:gap-10">
            <div className="footer-top flex items-center justify-between gap-10 max-lg:flex-col max-lg:items-center">
              <Link
                href="/"
                className="footer-logo shrink-0"
                aria-label="AA DEV STUDIO home"
              >
                {/* Same logo as the header, inverted so it shows white on the dark footer. */}
                <Image
                  src="/images/aa-logo.png"
                  alt="AA DEV STUDIO"
                  width={1604}
                  height={992}
                  className="h-[70px] w-auto invert"
                />
              </Link>

              <nav aria-label="Footer">
                <ul className="footer-nav flex flex-wrap gap-10 max-md:flex-col max-md:items-center max-md:gap-4">
                  {navItems.map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className="footer-link">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="footer-social relative h-[30px] w-[130px] shrink-0">
                <Image
                  src="/images/social-icons.svg"
                  alt=""
                  width={130}
                  height={30}
                />
                <ul>
                  {socialLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.label}
                        className={`absolute top-0 ${link.left} size-[30px] rounded-full transition-all duration-300 hover:bg-purple/40`}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact details spread across the full width: three columns on desktop,
                stacked (and centred on phones, like the row above) on smaller screens. */}
            <div className="footer-contact flex flex-col gap-[27px] max-md:items-center max-md:text-center">
              <h2 className="highlight self-start text-[20px] font-medium max-md:self-center">
                Contact us:
              </h2>
              <address className="grid grid-cols-3 gap-10 text-[18px] leading-7 not-italic max-lg:grid-cols-1 max-lg:gap-5">
                <p className="flex flex-col gap-1">
                  <span className="opacity-60">Email</span>
                  <a href={`mailto:${site.email}`} className="footer-link self-start max-md:self-center">
                    {site.email}
                  </a>
                </p>
                <p className="flex flex-col gap-1">
                  <span className="opacity-60">Phone</span>
                  <a href={`tel:${site.phone.href}`} className="footer-link self-start max-md:self-center">
                    {site.phone.display}
                  </a>
                </p>
                <p className="flex flex-col gap-1">
                  <span className="opacity-60">Address</span>
                  <span>
                    {site.address.street}, {site.address.city}, {site.address.region} {site.address.postalCode}
                  </span>
                </p>
              </address>
            </div>
          </div>

          <div className="footer-bottom flex flex-col gap-[50px] max-md:gap-8">
            <Image
              src="/images/footer-line.svg"
              alt=""
              width={1120}
              height={1}
              className="h-px w-full"
            />
            <div className="footer-legal flex gap-10 text-[18px] leading-7 max-md:flex-col max-md:items-center max-md:gap-3 max-md:text-center">
              <p>© 2023 AA DEV STUDIO. All Rights Reserved.</p>
              <Link href="#privacy" className="footer-link">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
