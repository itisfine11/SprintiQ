import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/provider/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { LoadingProvider } from "@/contexts/loading-context";
import { Toaster } from "@/components/ui/toaster";
import { CookieConsentBanner } from "@/components/ui/cookie-consent-banner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "SprintiQ - AI-Native Agile Planning Tool & Agile Manage",
    template: "%s | SprintiQ - AI Native Agile Planning",
  },
  description:
    "SprintiQ is the AI-Native agile planning tool. Transform agile development with intelligent user story generation, AI project management, and sprint planning.",
  keywords: [
    // Primary Brand Keywords
    "SprintiQ",
    "sprintiq",
    "SprintiQ AI",
    "sprintiq ai",
    "SprintiQ ai",
    "sprintiq AI",
    "SprintiQ AI",
    "AI Native Project management",
    "AI Native Project Management",
    "ai native project management",

    // Enhanced Brand + Feature Combinations
    "SprintiQ AI Native",
    "sprintiq ai native",
    "SprintiQ AI Native Tool",
    "sprintiq ai native tool",
    "SprintiQ AI Native Agile Planning",
    "sprintiq ai native agile planning",
    "SprintiQ AI Native Agile Planning Tool",
    "sprintiq ai native agile planning tool",
    "SprintiQ AI Project Management",
    "sprintiq ai project management",
    "SprintiQ AI Project Management Tool",
    "sprintiq ai project management tool",

    // Core Product Keywords
    "SprintiQ AI Tool",
    "sprintiq ai tool",
    "SprintiQ AI Sprint Planning",
    "sprintiq ai sprint planning",
    "SprintiQ AI Sprint Planning Tool",
    "sprintiq ai sprint planning tool",
    "SprintiQ app",
    "sprintiq app",
    "SprintiQ tool",
    "sprintiq tool",
    "SprintiQ software",
    "sprintiq software",
    "SprintiQ platform",
    "sprintiq platform",

    // Feature-Specific Keywords
    "SprintiQ sprint planning",
    "sprintiq sprint planning",
    "SprintiQ agile",
    "sprintiq agile",
    "SprintiQ project management",
    "sprintiq project management",
    "SprintiQ user stories",
    "sprintiq user stories",
    "SprintiQ AI tool",
    "sprintiq ai tool",

    // Action Keywords
    "SprintiQ free",
    "sprintiq free",
    "SprintiQ beta",
    "sprintiq beta",
    "SprintiQ signup",
    "sprintiq signup",
    "SprintiQ login",
    "sprintiq login",

    // Industry Keywords
    "sprint planning",
    "ai agile",
    "agile project management",
    "AI project management",
    "ai project management",
    "user story generation",
    "sprint management",
    "agile development",
    "scrum tools",
    "backlog management",
    "sprint optimization",
    "AI-native planning",
    "ai-native planning",
    "agile software development",
    "project management software",
    "sprint retrospective",
    "velocity tracking",
    "story point estimation",
    "agile methodology",
    "sprint backlog",
    "product backlog",

    // Competitive Keywords
    "jira alternative",
    "asana alternative",
    "trello alternative",
    "monday.com alternative",
    "clickup alternative",
    "notion alternative",

    // Long-tail Keywords
    "agile sprint planning",
    "scrum sprint planning",
    "sprint planning guide",
    "agile methodology guide",
    "user story examples",
    "sprint retrospective tips",
    "velocity tracking guide",
    "ai sprint planning tool",
    "free sprint planning software",
    "agile project management tool",
    "scrum master tools",
    "product owner tools",
    "development team tools",

    // AI-Specific Keywords
    "AI agile planning",
    "ai agile planning",
    "AI native agile",
    "ai native agile",
    "AI native project management",
    "ai native project management",
    "AI project management tool",
    "ai project management tool",
    "AI sprint planning",
    "ai sprint planning",
    "AI user story generation",
    "ai user story generation",
    "AI agile development",
    "ai agile development",
    "AI scrum tools",
    "ai scrum tools",
    "AI backlog management",
    "ai backlog management",
    "AI sprint optimization",
    "ai sprint optimization",
    "AI agile software development",
    "ai agile software development",
    "AI project management software",
    "ai project management software",
    "AI sprint retrospective",
    "ai sprint retrospective",
    "AI velocity tracking",
    "ai velocity tracking",
    "AI story point estimation",
    "ai story point estimation",
    "AI agile methodology",
    "ai agile methodology",
    "AI sprint backlog",
    "ai sprint backlog",
    "AI product backlog",
    "ai product backlog",
  ],
  authors: [{ name: "SprintiQ Team" }],
  creator: "SprintiQ",
  publisher: "SprintiQ",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.sprintiq.ai"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.sprintiq.ai",
    title:
      "SprintiQ - AI Native Agile Product Planning | Your PM Tool Intelligence Layer",
    description:
      "SprintiQ is the #1 AI-Native agile planning tool. Transform agile development with intelligent user story generation, AI project management, and sprint planning. Free early access for agile teams.",
    siteName: "SprintiQ",
    images: [
      {
        url: "/images/google-view.png",
        width: 1200,
        height: 630,
        alt: "SprintiQ - AI-Native Agile Planning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "SprintiQ - AI Native Agile Product Planning | Your PM Tool Intelligence Layer",
    description:
      "SprintiQ is the #1 AI-Native agile planning tool. Transform agile development with intelligent user story generation, AI project management, and sprint planning. Free early access for agile teams.",
    images: ["/images/sprintiq-turbo.png"],
    creator: "@sprintiq_ai",
    site: "@sprintiq_ai",
  },
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
  verification: {
    google: "G-JMDJ21YPS1", // Google Analytics 4 Measurement ID
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="G-JMDJ21YPS1" />

        {/* Google Analytics 4 */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-JMDJ21YPS1"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              
              // Initialize with consent mode
              gtag('consent', 'default', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied',
                'functionality_storage': 'denied',
                'personalization_storage': 'denied',
                'security_storage': 'granted'
              });
              
              gtag('config', 'G-JMDJ21YPS1', {
                'consent_mode': 'advanced',
                'page_title': 'SprintiQ - AI-Native Agile Planning',
                'page_location': window.location.href,
                'send_page_view': true
              });
            `,
          }}
        />

        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-T73L5JCH');`,
          }}
        />

        {/* Enhanced Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "SprintiQ - AI-Native Agile Planning Tool",
              description:
                "#1 AI-native agile planning and agile project management platform. Free early access for agile teams.",
              url: "https://www.sprintiq.ai",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
                description: "Free early access - join 10,000+ agile teams",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                ratingCount: "250",
                bestRating: "5",
                worstRating: "1",
              },
              author: {
                "@type": "Organization",
                name: "SprintiQ",
                url: "https://www.sprintiq.ai",
              },
              featureList: [
                "AI-Native user story generation",
                "Intelligent sprint planning",
                "Agile project management",
                "Real-time team collaboration",
                "Jira, GitHub, Slack integrations",
                "Free early access",
                "Story point estimation",
                "Velocity tracking",
                "Sprint retrospective tools",
                "Backlog management",
              ],
              screenshot: "https://www.sprintiq.ai/images/sprintiq-turbo.png",
              downloadUrl: "https://www.sprintiq.ai/signup",
              softwareVersion: "1.0",
              releaseNotes: "Free early access with all features included",
            }),
          }}
        />

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "SprintiQ",
              url: "https://www.sprintiq.ai",
              logo: "https://www.sprintiq.ai/favicon.ico",
              description:
                "AI-native agile planning and agile project management platform",
              sameAs: [
                "https://x.com/SprintiQAI",
                "https://www.linkedin.com/company/sprintiq-ai",
                "https://www.facebook.com/SprintiQ/",
                "https://www.instagram.com/sprintiq.ai/",
                "https://sprintiq.medium.com",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                email: "support@sprintiq.ai",
                url: "https://www.sprintiq.ai/contact",
              },
            }),
          }}
        />

        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://www.sprintiq.ai",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Features",
                  item: "https://www.sprintiq.ai/features",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "Pricing",
                  item: "https://www.sprintiq.ai/pricing",
                },
                {
                  "@type": "ListItem",
                  position: 4,
                  name: "About",
                  item: "https://www.sprintiq.ai/about",
                },
                {
                  "@type": "ListItem",
                  position: 5,
                  name: "Insights",
                  item: "https://www.sprintiq.ai/insights",
                },
                {
                  "@type": "ListItem",
                  position: 6,
                  name: "Contact",
                  item: "https://www.sprintiq.ai/contact",
                },
                {
                  "@type": "ListItem",
                  position: 7,
                  name: "Product Guide",
                  item: "https://www.sprintiq.ai/support",
                },
              ],
            }),
          }}
        />

        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What is SprintiQ?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "SprintiQ is an AI-native agile planning tool that helps agile teams create user stories, plan sprints, and manage projects more efficiently.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Is SprintiQ free?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, SprintiQ offers free early access with all features included for agile teams.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How does AI help with sprint planning?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "SprintiQ's AI automatically generates user stories, estimates story points, and optimizes sprint planning based on team capacity and historical data.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What makes SprintiQ different from Jira?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "SprintiQ uses AI to automatically generate user stories and optimize sprint planning, while Jira requires manual story creation and planning.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I integrate SprintiQ with other tools?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, SprintiQ integrates with Jira, GitHub, Slack, and other popular development tools.",
                  },
                },
              ],
            }),
          }}
        />

        {/* WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "SprintiQ",
              url: "https://www.sprintiq.ai",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://www.sprintiq.ai/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* LocalBusiness Schema for better local SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "SprintiQ",
              description:
                "AI-native agile planning and agile project management platform",
              url: "https://www.sprintiq.ai",
              telephone: "+1-800-SPRINTIQ",
              email: "support@sprintiq.ai",
              address: {
                "@type": "PostalAddress",
                addressCountry: "US",
                addressLocality: "San Francisco",
                addressRegion: "CA",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "37.7749",
                longitude: "-122.4194",
              },
              openingHours: "Mo-Fr 09:00-17:00",
              priceRange: "Free",
            }),
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T73L5JCH"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <LoadingProvider>{children}</LoadingProvider>
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
