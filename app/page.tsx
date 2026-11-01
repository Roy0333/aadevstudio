import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/Layout";
import Banner from "@/components/Banner";
import LogoMarquee from "@/components/LogoMarquee";
import About from "@/components/About";
import Services from "@/components/Services";
import Technologies from "@/components/Technologies";
import Cta from "@/components/Cta";
import SectionHeading from "@/components/SectionHeading";
import Faq from "@/components/Faq";
import Pricing from "@/components/Pricing";
import TeamCard from "@/components/TeamCard";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import StructuredData from "@/components/StructuredData";
import home from "@/data/home.json";
import testimonials from "@/data/testimonial.json";

export default function Home() {
  const { caseStudies, team } = home;

  return (
    <Layout>
      <StructuredData />
      <Banner />
      <LogoMarquee />
      <About {...home.about} />
      <Services {...home.services} />
      <Technologies {...home.technologies} />
      <Cta {...home.cta} />

      {/* ================= Case Studies ================= */}
      <section id="use-cases" className="case-sec pt-[100px] max-md:pt-14" aria-labelledby="case-title">
        <div className="site-container">
          <SectionHeading id="case-title" title={caseStudies.heading} text={caseStudies.intro} />

          <ul className="case-list">
            {caseStudies.items.map((item, index) => (
              <li key={index} className="case-item">
                <p className="text-[18px] leading-[normal]">{item.text}</p>
                <Link href={item.link.href} className="case-link">
                  {item.link.label}
                  <span className="case-link-icon">
                    <Image src="/images/case-studies/arrow.svg" alt="" width={20.3211} height={19.5348} />
                  </span>
                  <span className="sr-only"> about case study {index + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Pricing {...home.pricing} />

      <Faq {...home.faq} />

      {/* ================= Team ================= */}
      <section id="team" className="team-sec pt-[100px] max-md:pt-14" aria-labelledby="team-title">
        <div className="site-container">
          <SectionHeading id="team-title" title={team.heading} text={team.intro} textClassName="w-[473px]" />

          <ul className="team-grid grid grid-cols-3 gap-10 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-[30px]">
            {team.items.map((member, index) => (
              <li key={member.name}>
                <TeamCard member={member} index={index} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Testimonials {...testimonials} />
      <Contact />
    </Layout>
  );
}
