import Image from "next/image";
import Link from "next/link";

export type Service = {
  title: string[];
  art: string;
  image: string;
  link: { label: string; href: string };
};

// One style per position in the Figma grid. Card 7 reuses style 1, card 8 style 2, and so on.
const cardStyles = [
  { card: "grey", label: "purple", arrow: "dark" },
  { card: "purple", label: "white", arrow: "dark" },
  { card: "dark", label: "white", arrow: "light" },
  { card: "grey", label: "purple", arrow: "dark" },
  { card: "purple", label: "white", arrow: "dark" },
  { card: "dark", label: "purple", arrow: "light" },
] as const;

export default function ServiceCard({ service, index }: { service: Service; index: number }) {
  const style = cardStyles[index % cardStyles.length];
  const title = service.title.join(" ");

  return (
    <article className={`service-card service-card-${style.card}`}>
      <div className="service-card-body flex flex-col justify-center gap-[93px] max-sm:contents">
        <h3 className="service-card-title text-[30px] font-medium leading-[normal] max-sm:text-[24px]">
          {service.title.map((line, i) => (
            <span key={i} className={`highlight highlight-${style.label} block w-fit whitespace-nowrap`}>
              {line}
              {i < service.title.length - 1 && " "}
            </span>
          ))}
        </h3>
        <Link href={service.link.href} className="service-link">
          <Image
            src={`/images/services/arrow-${style.arrow}.svg`}
            alt=""
            width={41}
            height={41}
            className="service-link-icon"
          />
          <span className="max-sm:sr-only">{service.link.label}</span>
          <span className="sr-only"> about {title}</span>
        </Link>
      </div>

      <div className={`service-art service-art-${service.art}`}>
        <div className="service-art-crop">
          <Image src={service.image} alt="" width={256} height={256} />
        </div>
      </div>
    </article>
  );
}
