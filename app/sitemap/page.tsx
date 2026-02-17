import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sitemap - SprintiQ | Complete Website Navigation",
  description:
    "Complete sitemap of SprintiQ website. Find all pages, features, and sections organized for easy navigation and SEO optimization.",
  robots: "index, follow",
};

export default function SitemapPage() {
  const mainSections = [
    {
      title: "Main Pages",
      links: [
        { href: "/", label: "Home", description: "Main landing page" },
        {
          href: "/about",
          label: "About Us",
          description: "Company information and mission",
        },
        {
          href: "/features",
          label: "Features",
          description: "Product features and capabilities",
        },
        {
          href: "/pricing",
          label: "Pricing",
          description: "Subscription plans and pricing",
        },
        {
          href: "/contact",
          label: "Contact",
          description: "Get in touch with our team",
        },
        {
          href: "/support",
          label: "Support",
          description: "Customer support and help",
        },
        {
          href: "/faq",
          label: "FAQ",
          description: "Frequently asked questions",
        },
      ],
    },
    {
      title: "Product & Solutions",
      links: [
        {
          href: "/use-case",
          label: "Use Cases",
          description: "Industry-specific solutions",
        },
        {
          href: "/sprintiq-vs-jira",
          label: "SprintiQ vs Jira",
          description: "Feature comparison",
        },
        { href: "/sla", label: "SLA", description: "Service level agreements" },
        {
          href: "/insights",
          label: "Insights",
          description: "Product insights and analytics",
        },
      ],
    },
    {
      title: "Business",
      links: [
        {
          href: "/investor-relations",
          label: "Investor Relations",
          description: "Financial information",
        },
      ],
    },
    {
      title: "Legal & Policies",
      links: [
        {
          href: "/privacy",
          label: "Privacy Policy",
          description: "Data protection and privacy",
        },
        {
          href: "/terms",
          label: "Terms of Service",
          description: "Terms and conditions",
        },
      ],
    },
    {
      title: "Authentication",
      links: [
        { href: "/signin", label: "Sign In", description: "User login" },
        {
          href: "/signup",
          label: "Sign Up",
          description: "Create new account",
        },
      ],
    },
    {
      title: "Get Started & Support",
      links: [
        {
          href: "/signup",
          label: "Get Started",
          description: "Create your free account and start using SprintiQ",
        },
        {
          href: "/contact",
          label: "Contact Us",
          description: "Get in touch with our team for support and inquiries",
        },
        {
          href: "/support",
          label: "Support Center",
          description: "Find help articles and troubleshooting guides",
        },
        {
          href: "/faq",
          label: "FAQ",
          description: "Frequently asked questions and answers",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SprintiQ Website Sitemap
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete navigation guide for all pages and features. This sitemap
            helps search engines discover our content and provides easy
            navigation for users.
          </p>
        </div>

        {/* Sitemap Content */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {mainSections.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <h2 className="text-2xl font-semibold text-emerald-600 mb-4 border-b border-emerald-200 pb-2">
                {section.title}
              </h2>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="block p-3 rounded-md hover:bg-emerald-50 transition-colors group"
                    >
                      <div className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {link.label}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {link.description}
                      </div>
                      <div className="text-xs text-emerald-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {link.href}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-gray-600">
          <p>
            This sitemap is automatically maintained and updated with the latest
            page structure. For the most current information, please visit our{" "}
            <Link href="/" className="text-emerald-600 hover:underline">
              SpriniQ.ai
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
