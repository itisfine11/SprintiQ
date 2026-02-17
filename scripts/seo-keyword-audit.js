#!/usr/bin/env node

/**
 * SprintiQ Strategic Keyword SEO Audit Script
 *
 * This script audits the implementation of strategic keywords across the SprintiQ website
 * to ensure proper SEO optimization for target keywords like:
 * - sprintiq, SprintiQ, sprintiq ai, SprintiQ ai, sprintiq AI, SprintiQ AI
 * - AI Native Project management, AI Native Project Management, ai native project management
 * - AI project management, ai project management, AI agile planning, ai agile planning
 */

const fs = require("fs");
const path = require("path");

// Strategic keywords to audit
const STRATEGIC_KEYWORDS = {
  primary: [
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
  ],
  secondary: [
    "AI project management",
    "ai project management",
    "AI agile planning",
    "ai agile planning",
    "AI native agile",
    "ai native agile",
  ],
  features: [
    "AI sprint planning",
    "ai sprint planning",
    "AI user story generation",
    "ai user story generation",
    "AI native agile planning",
    "ai native agile planning",
  ],
};

// Files to audit
const AUDIT_FILES = [
  "app/layout.tsx",
  "app/page.tsx",
  "app/features/layout.tsx",
  "app/about/layout.tsx",
  "app/signin/layout.tsx",
  "app/signup/layout.tsx",
  "app/faq/layout.tsx",
  "app/pricing/layout.tsx",
  "app/contact/layout.tsx",
  "public/robots.txt",
  "public/sitemap.xml",
  "app/api/sitemap/route.ts",
];

class SEOKeywordAudit {
  constructor() {
    this.results = {
      totalFiles: 0,
      auditedFiles: 0,
      keywordFindings: {},
      recommendations: [],
      score: 0,
    };

    // Initialize keyword findings
    STRATEGIC_KEYWORDS.primary.forEach((keyword) => {
      this.results.keywordFindings[keyword] = { found: false, locations: [] };
    });

    STRATEGIC_KEYWORDS.secondary.forEach((keyword) => {
      this.results.keywordFindings[keyword] = { found: false, locations: [] };
    });

    STRATEGIC_KEYWORDS.features.forEach((keyword) => {
      this.results.keywordFindings[keyword] = { found: false, locations: [] };
    });
  }

  /**
   * Run the complete SEO audit
   */
  async runAudit() {
    console.log("🔍 Starting SprintiQ Strategic Keyword SEO Audit...\n");

    this.results.totalFiles = AUDIT_FILES.length;

    for (const filePath of AUDIT_FILES) {
      await this.auditFile(filePath);
    }

    this.calculateScore();
    this.generateRecommendations();
    this.printResults();
  }

  /**
   * Audit a single file for strategic keywords
   */
  async auditFile(filePath) {
    try {
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${filePath}`);
        return;
      }

      const content = fs.readFileSync(filePath, "utf8");
      this.results.auditedFiles++;

      console.log(`📄 Auditing: ${filePath}`);

      // Check each strategic keyword
      Object.keys(this.results.keywordFindings).forEach((keyword) => {
        const regex = new RegExp(
          keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "gi"
        );
        const matches = content.match(regex);

        if (matches) {
          this.results.keywordFindings[keyword].found = true;
          this.results.keywordFindings[keyword].locations.push({
            file: filePath,
            count: matches.length,
          });

          console.log(`  ✅ Found "${keyword}" ${matches.length} time(s)`);
        }
      });
    } catch (error) {
      console.log(`❌ Error auditing ${filePath}: ${error.message}`);
    }
  }

  /**
   * Calculate overall SEO score
   */
  calculateScore() {
    const totalKeywords = Object.keys(this.results.keywordFindings).length;
    const foundKeywords = Object.values(this.results.keywordFindings).filter(
      (k) => k.found
    ).length;

    this.results.score = Math.round((foundKeywords / totalKeywords) * 100);
  }

  /**
   * Generate recommendations based on audit results
   */
  generateRecommendations() {
    const missingKeywords = Object.entries(this.results.keywordFindings)
      .filter(([keyword, data]) => !data.found)
      .map(([keyword]) => keyword);

    if (missingKeywords.length > 0) {
      this.results.recommendations.push(
        `Add missing strategic keywords: ${missingKeywords.join(", ")}`
      );
    }

    // Check for keyword density issues
    Object.entries(this.results.keywordFindings).forEach(([keyword, data]) => {
      if (data.found && data.locations.length > 0) {
        const totalCount = data.locations.reduce(
          (sum, loc) => sum + loc.count,
          0
        );
        if (totalCount < 2) {
          this.results.recommendations.push(
            `Increase usage of "${keyword}" - currently found ${totalCount} time(s)`
          );
        }
      }
    });

    // General recommendations
    this.results.recommendations.push(
      "Ensure strategic keywords are naturally integrated in content",
      "Use keywords in title tags, meta descriptions, and headings",
      "Include keywords in internal linking anchor text",
      "Monitor keyword performance in Google Search Console"
    );
  }

  /**
   * Print audit results
   */
  printResults() {
    console.log("\n📊 SEO Audit Results Summary");
    console.log("=".repeat(50));

    console.log(
      `\n📁 Files Audited: ${this.results.auditedFiles}/${this.results.totalFiles}`
    );
    console.log(`🎯 Overall Score: ${this.results.score}%`);

    console.log("\n🔍 Keyword Implementation Status:");
    console.log("-".repeat(40));

    Object.entries(this.results.keywordFindings).forEach(([keyword, data]) => {
      const status = data.found ? "✅" : "❌";
      const count = data.found
        ? data.locations.reduce((sum, loc) => sum + loc.count, 0)
        : 0;
      console.log(
        `${status} ${keyword}: ${
          data.found ? `${count} occurrence(s)` : "Not found"
        }`
      );
    });

    console.log("\n💡 Recommendations:");
    console.log("-".repeat(40));
    this.results.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });

    console.log("\n🚀 Next Steps:");
    console.log("-".repeat(40));
    console.log("1. Implement missing keywords in content");
    console.log("2. Optimize existing content with strategic keywords");
    console.log("3. Monitor keyword performance in search analytics");
    console.log("4. Create content around long-tail keyword opportunities");
    console.log("5. Regular keyword performance review and optimization");

    console.log("\n✨ Audit Complete!");
  }
}

// Run the audit if this script is executed directly
if (require.main === module) {
  const audit = new SEOKeywordAudit();
  audit.runAudit().catch(console.error);
}

module.exports = SEOKeywordAudit;
