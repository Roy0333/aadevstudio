import { site } from "@/lib/site";
import home from "@/data/home.json";

/**
 * Schema.org structured data (JSON-LD) for search engines: the organisation behind the
 * site, the website itself, and the services it offers (read from data/home.json).
 * Check it with https://search.google.com/test/rich-results after deploying.
 */
export default function StructuredData() {
  const orgId = `${site.url}/#organization`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": orgId,
        name: site.name,
        description: site.description,
        url: site.url,
        logo: `${site.url}/images/logo.svg`,
        image: `${site.url}/opengraph-image`,
        email: site.email,
        telephone: site.phone.href,
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.street,
          addressLocality: site.address.city,
          addressRegion: site.address.region,
          postalCode: site.address.postalCode,
          addressCountry: site.address.country,
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: site.email,
          telephone: site.phone.href,
        },
        sameAs: Object.values(site.social),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Web development and AI solutions",
          itemListElement: home.services.items.map((service) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: service.title.join(" ") },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        description: site.description,
        inLanguage: "en",
        publisher: { "@id": orgId },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Escape "<" so nothing in the data can close the script tag (per the Next.js JSON-LD guide).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
}
