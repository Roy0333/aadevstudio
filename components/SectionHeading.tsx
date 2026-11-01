type SectionHeadingProps = {
  /** id for the <h2>, so the section can point aria-labelledby at it. */
  id: string;
  title: string;
  text?: string;
  /** Width of the intro text; Figma varies it per section. */
  textClassName?: string;
};

/** Figma "Heading & Subheading": highlighted h2 with a short intro beside it. */
export default function SectionHeading({ id, title, text, textClassName = "w-[580px]" }: SectionHeadingProps) {
  return (
    <div className="section-heading mb-20 flex items-center gap-10 max-md:mb-10 max-md:flex-col max-md:gap-7 max-md:text-center">
      <h2 id={id} className="highlight shrink-0 text-[40px] font-medium leading-[normal] max-md:text-[36px]">
        {title}
      </h2>
      {text && <p className={`${textClassName} max-w-full text-[18px] leading-[normal]`}>{text}</p>}
    </div>
  );
}
