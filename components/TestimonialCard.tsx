import Image from "next/image";

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

/** Speech bubble with the quote, and the client's name and role under its tail. */
export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="testimonial-card">
      <blockquote className="testimonial-bubble">
        <Image src="/images/testimonials/bubble.svg" alt="" width={606} height={266} className="testimonial-bubble-bg" />
        <p className="testimonial-quote">{testimonial.quote}</p>
      </blockquote>
      <figcaption className="testimonial-author">
        <cite className="testimonial-name">{testimonial.name}</cite>
        <span className="testimonial-role">{testimonial.role}</span>
      </figcaption>
    </figure>
  );
}
