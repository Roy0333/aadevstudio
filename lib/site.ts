/**
 * Business details used for SEO (metadata, structured data, sitemap) and the footer.
 * Change them here once and every place that shows them updates.
 */

// The live domain. Set NEXT_PUBLIC_SITE_URL in the deployment environment
// (e.g. https://www.example.com) so canonical, Open Graph and sitemap URLs are correct.
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const site = {
  url: siteUrl,
  name: "AA DEV STUDIO",
  title: "AA DEV STUDIO | AI-First Web Development & Web Solutions Company",
  description:
    "AA DEV STUDIO is an AI-first web solutions company. Our experienced IT team builds your online presence with real craftsmanship and enhances it with AI so your business can grow.",
  keywords: [
    "web development company",
    "web solutions company",
    "AI-first web development",
    "website development",
    "custom web applications",
    "AI integration",
    "e-commerce development",
    "UI/UX design",
    "SEO and performance optimization",
    "Next.js development",
  ],
  locale: "en_US",
  email: "info@aadevstudio.com",
  phone: { display: "555-567-8901", href: "+15555678901" },
  address: {
    street: "1234 Main St",
    city: "Moonstone City",
    region: "Stardust State",
    postalCode: "12345",
    country: "US",
  },
  social: {
    linkedin: "https://www.linkedin.com",
    facebook: "https://www.facebook.com",
    twitter: "https://twitter.com",
  },
  colors: { dark: "#191A23", purple: "#BC13FE" },
} as const;
