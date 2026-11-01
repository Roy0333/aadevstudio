import Accordion, { type AccordionItem } from "./Accordion";
import SectionHeading from "./SectionHeading";

type FaqProps = {
  heading: string;
  intro: string;
  items: AccordionItem[];
};

export default function Faq({ heading, intro, items }: FaqProps) {
  return (
    <section id="process" className="faq-sec pt-[100px] max-md:pt-14" aria-labelledby="faq-title">
      <div className="site-container">
        <SectionHeading id="faq-title" title={heading} text={intro} textClassName="w-[292px]" />
        <Accordion items={items} />
      </div>
    </section>
  );
}
