import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Use Cases & Success Stories - SprintiQ AI-Powered Agile Management",
  description:
    "Discover real-world use cases and success stories of SprintiQ. See how teams use AI-powered agile management to streamline story creation, sprint planning, and project delivery. Learn from actual implementations across different industries.",
  keywords: [
    "SprintiQ use cases",
    "agile management success stories",
    "AI-powered project management",
    "sprint planning software",
    "user story creation tools",
    "agile team productivity",
    "scrum master tools",
    "product owner software",
    "agile transformation examples",
    "project management case studies",
    "team collaboration tools",
    "agile workflow automation",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Use Cases & Success Stories - SprintiQ AI-Powered Agile Management",
    description:
      "Discover real-world use cases and success stories of SprintiQ. See how teams use AI-powered agile management to streamline story creation, sprint planning, and project delivery.",
    url: "https://www.sprintiq.ai/use-case",
    siteName: "SprintiQ",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SprintiQ Use Cases and Success Stories",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Use Cases & Success Stories - SprintiQ AI-Powered Agile Management",
    description:
      "Discover real-world use cases and success stories of SprintiQ. See how teams use AI-powered agile management to streamline story creation, sprint planning, and project delivery.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://www.sprintiq.ai/use-case",
  },
  authors: [{ name: "SprintiQ Team" }],
  category: "Software & Technology",
  other: {
    "application-name": "SprintiQ",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "SprintiQ Use Cases",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
    "msapplication-config": "/browserconfig.xml",
    "msapplication-TileColor": "#10b981",
    "msapplication-tap-highlight": "no",
    "theme-color": "#10b981",
  },
};

export default function UseCaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
