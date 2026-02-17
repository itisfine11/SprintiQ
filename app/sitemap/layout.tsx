import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sitemap - SprintiQ",
  description:
    "Complete sitemap of SprintiQ website for easy navigation and SEO optimization",
  openGraph: {
    title: "Sitemap - SprintiQ",
    description:
      "Complete sitemap of SprintiQ website for easy navigation and SEO optimization",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sitemap - SprintiQ",
    description:
      "Complete sitemap of SprintiQ website for easy navigation and SEO optimization",
  },
};

export default function SitemapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="sitemap-layout">{children}</div>;
}
