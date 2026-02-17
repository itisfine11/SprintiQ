#!/usr/bin/env node

/**
 * Sitemap Generator for SprintiQ
 *
 * This script automatically generates both HTML and XML sitemaps
 * based on your project structure. Run it whenever you add new pages.
 *
 * Usage: node scripts/generate-sitemap.js
 */

const fs = require("fs");
const path = require("path");

// Configuration
const config = {
  baseUrl: "https://sprintiq.ai",
  outputDir: "./public",
  pages: [
    // Main Pages
    { url: "/", priority: 1.0, changefreq: "daily" },
    { url: "/about", priority: 0.8, changefreq: "monthly" },
    { url: "/features", priority: 0.9, changefreq: "weekly" },
    { url: "/pricing", priority: 0.8, changefreq: "monthly" },
    { url: "/contact", priority: 0.7, changefreq: "monthly" },
    { url: "/support", priority: 0.7, changefreq: "weekly" },
    { url: "/faq", priority: 0.7, changefreq: "weekly" },
    { url: "/insights", priority: 0.8, changefreq: "weekly" },

    // Product & Solutions
    { url: "/use-case", priority: 0.8, changefreq: "monthly" },
    { url: "/sprintiq-vs-jira", priority: 0.8, changefreq: "monthly" },
    { url: "/sla", priority: 0.6, changefreq: "monthly" },

    // Business
    { url: "/investor-relations", priority: 0.6, changefreq: "monthly" },
    { url: "/join", priority: 0.7, changefreq: "monthly" },
    { url: "/dashboard", priority: 0.6, changefreq: "daily" },

    // Legal & Policies
    { url: "/privacy", priority: 0.5, changefreq: "yearly" },
    { url: "/terms", priority: 0.5, changefreq: "yearly" },

    // Authentication
    { url: "/signin", priority: 0.6, changefreq: "monthly" },
    { url: "/signup", priority: 0.9, changefreq: "monthly" },
    { url: "/setup-workspace", priority: 0.7, changefreq: "monthly" },

    // Get Started & Support
    { url: "/contact", priority: 0.8, changefreq: "monthly" },
    { url: "/support", priority: 0.7, changefreq: "weekly" },
    { url: "/faq", priority: 0.7, changefreq: "weekly" },

    // Sitemap
    { url: "/sitemap", priority: 0.5, changefreq: "weekly" },
  ],
};

// Generate XML Sitemap
function generateXMLSitemap() {
  const now = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${config.pages
  .map(
    (page) => `  <url>
    <loc>${config.baseUrl}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  const outputPath = path.join(config.outputDir, "sitemap.xml");
  fs.writeFileSync(outputPath, xml);
  console.log(`✅ XML sitemap generated: ${outputPath}`);
}

// Generate HTML Sitemap
function generateHTMLSitemap() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SprintiQ Sitemap</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 { color: #2563eb; border-bottom: 2px solid #dbeafe; padding-bottom: 10px; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #1e40af; margin-bottom: 15px; }
        .links { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .link-item { padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
        .link-item:hover { border-color: #3b82f6; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1); }
        .link-item a { color: #1f2937; text-decoration: none; font-weight: 500; }
        .link-item a:hover { color: #2563eb; }
        .description { color: #6b7280; font-size: 14px; margin-top: 5px; }
        .url { color: #3b82f6; font-size: 12px; margin-top: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>SprintiQ Website Sitemap</h1>
        <p>Complete navigation guide for all pages and features. This sitemap helps search engines discover our content and provides easy navigation for users.</p>
        
        <div class="section">
            <h2>Main Pages</h2>
            <div class="links">
                <div class="link-item">
                    <a href="${config.baseUrl}/">Home</a>
                    <div class="description">Main landing page</div>
                    <div class="url">${config.baseUrl}/</div>
                </div>
                <div class="link-item">
                    <a href="${config.baseUrl}/about">About Us</a>
                    <div class="description">Company information and mission</div>
                    <div class="url">${config.baseUrl}/about</div>
                </div>
                <div class="link-item">
                    <a href="${config.baseUrl}/features">Features</a>
                    <div class="description">Product features and capabilities</div>
                    <div class="url">${config.baseUrl}/features</div>
                </div>
                <div class="link-item">
                    <a href="${config.baseUrl}/pricing">Pricing</a>
                    <div class="description">Subscription plans and pricing</div>
                    <div class="url">${config.baseUrl}/pricing</div>
                </div>
                <div class="link-item">
                    <a href="${config.baseUrl}/contact">Contact</a>
                    <div class="description">Get in touch with our team</div>
                    <div class="url">${config.baseUrl}/contact</div>
                </div>
                <div class="link-item">
                    <a href="${config.baseUrl}/support">Support</a>
                    <div class="description">Customer support and help</div>
                    <div class="url">${config.baseUrl}/support</div>
                </div>
                <div class="link-item">
                    <a href="${config.baseUrl}/faq">FAQ</a>
                    <div class="description">Frequently asked questions</div>
                    <div class="url">${config.baseUrl}/faq</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>Product & Solutions</h2>
            <div class="links">
                <div class="link-item">
                    <a href="${config.baseUrl}/use-case">Use Cases</a>
                    <div class="description">Industry-specific solutions</div>
                    <div class="url">${config.baseUrl}/use-case</div>
                </div>
                <div class="link-item">
                    <a href="${
                      config.baseUrl
                    }/sprintiq-vs-jira">SprintiQ vs Jira</a>
                    <div class="description">Feature comparison</div>
                    <div class="url">${config.baseUrl}/sprintiq-vs-jira</div>
                </div>
                <div class="link-item">
                    <a href="${config.baseUrl}/sla">SLA</a>
                    <div class="description">Service level agreements</div>
                    <div class="url">${config.baseUrl}/sla</div>
                </div>
                <div class="link-item">
                    <a href="${config.baseUrl}/insights">Insights</a>
                    <div class="description">Product insights and analytics</div>
                    <div class="url">${config.baseUrl}/insights</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>Business</h2>
            <div class="links">
                <div class="link-item">
                    <a href="${
                      config.baseUrl
                    }/investor-relations">Investor Relations</a>
                    <div class="description">Financial information</div>
                    <div class="url">${config.baseUrl}/investor-relations</div>
                </div>
                <div class="link-item">
                    <a href="${config.baseUrl}/join">Join Us</a>
                    <div class="description">Career opportunities</div>
                    <div class="url">${config.baseUrl}/join</div>
                </div>
                <div class="link-item">
                    <a href="${config.baseUrl}/dashboard">Dashboard</a>
                    <div class="description">User dashboard access</div>
                    <div class="url">${config.baseUrl}/dashboard</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>Legal & Policies</h2>
            <div class="links">
                <div class="link-item">
                    <a href="${config.baseUrl}/privacy">Privacy Policy</a>
                    <div class="description">Data protection and privacy</div>
                    <div class="url">${config.baseUrl}/privacy</div>
                </div>
                <div class="link-item">
                    <a href="${config.baseUrl}/terms">Terms of Service</a>
                    <div class="description">Terms and conditions</div>
                    <div class="url">${config.baseUrl}/terms</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>Authentication</h2>
            <div class="links">
                <div class="link-item">
                    <a href="${config.baseUrl}/signin">Sign In</a>
                    <div class="description">User login</div>
                    <div class="url">${config.baseUrl}/signin</div>
                </div>
                <div class="link-item">
                    <a href="${config.baseUrl}/signup">Sign Up</a>
                    <div class="description">Create new account</div>
                    <div class="url">${config.baseUrl}/signup</div>
                </div>
                <div class="link-item">
                    <a href="${
                      config.baseUrl
                    }/setup-workspace">Setup Workspace</a>
                    <div class="description">Workspace configuration</div>
                    <div class="url">${config.baseUrl}/setup-workspace</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>Get Started & Support</h2>
            <div class="links">
                <div class="link-item">
                    <a href="${config.baseUrl}/signup">Get Started</a>
                    <div class="description">Create your free account and start using SprintiQ</div>
                    <div class="url">${config.baseUrl}/signup</div>
                </div>
                <div class="link-item">
                    <a href="${config.baseUrl}/contact">Contact Us</a>
                    <div class="description">Get in touch with our team for support and inquiries</div>
                    <div class="url">${config.baseUrl}/contact</div>
                </div>
                <div class="link-item">
                    <a href="${config.baseUrl}/support">Support Center</a>
                    <div class="description">Find help articles and troubleshooting guides</div>
                    <div class="url">${config.baseUrl}/support</div>
                </div>
                <div class="link-item">
                    <a href="${config.baseUrl}/faq">FAQ</a>
                    <div class="description">Frequently asked questions and answers</div>
                    <div class="url">${config.baseUrl}/faq</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>SEO Benefits</h2>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                <h3 style="margin-top: 0; color: #1e40af;">For Search Engines</h3>
                <ul>
                    <li>Helps discover all pages quickly</li>
                    <li>Improves crawling efficiency</li>
                    <li>Shows website structure clearly</li>
                    <li>Provides internal linking opportunities</li>
                </ul>
                <h3 style="color: #1e40af;">For Users</h3>
                <ul>
                    <li>Easy navigation to all sections</li>
                    <li>Quick access to specific features</li>
                    <li>Better understanding of site structure</li>
                    <li>Improved user experience</li>
                </ul>
            </div>
        </div>

        <div style="text-align: center; margin-top: 40px; padding: 20px; border-top: 1px solid #e5e7eb; color: #6b7280;">
            <p>This sitemap is automatically generated and updated. Last updated: ${new Date().toLocaleDateString()}</p>
            <p>For the most current information, visit our <a href="${
              config.baseUrl
            }" style="color: #3b82f6;">homepage</a>.</p>
        </div>
    </div>
</body>
</html>`;

  const outputPath = path.join(config.outputDir, "sitemap.html");
  fs.writeFileSync(outputPath, html);
  console.log(`✅ HTML sitemap generated: ${outputPath}`);
}

// Main execution
function main() {
  console.log("🚀 Generating SprintiQ sitemaps...\n");

  try {
    // Ensure output directory exists
    if (!fs.existsSync(config.outputDir)) {
      fs.mkdirSync(config.outputDir, { recursive: true });
    }

    generateXMLSitemap();
    generateHTMLSitemap();

    console.log("\n🎉 Sitemap generation completed successfully!");
    console.log("\n📋 Next steps:");
    console.log("1. Submit your sitemap to Google Search Console");
    console.log("2. Submit your sitemap to Bing Webmaster Tools");
    console.log("3. Add the sitemap URL to your robots.txt (already done)");
    console.log("4. Run this script whenever you add new pages");
  } catch (error) {
    console.error("❌ Error generating sitemaps:", error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateXMLSitemap, generateHTMLSitemap };
