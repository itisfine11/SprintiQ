#!/usr/bin/env node

/**
 * SprintiQ SEO Monitoring Script
 *
 * This script monitors various SEO metrics and provides recommendations
 * for improving search engine rankings.
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

class SEOMonitor {
  constructor() {
    this.baseUrl = "https://www.sprintiq.ai";
    this.targetKeywords = [
      "sprintiq",
      "sprint planning",
      "ai agile",
      "agile project management",
      "user story generation",
      "sprint management",
      "ai project management",
      "agile development",
      "scrum tools",
      "backlog management",
      "sprint optimization",
      "AI-Native planning",
      "agile software development",
      "project management software",
      "sprint retrospective",
      "velocity tracking",
      "story point estimation",
      "agile methodology",
      "sprint backlog",
      "product backlog",
    ];

    this.pages = [
      "/",
      "/features",
      "/pricing",
      "/about",
      "/contact",
      "/faq",
      "/sprint-planning-guide",
      "/agile-methodology",
      "/sprintiq-vs-jira",
      "/insights",
    ];
  }

  async checkPageSEO(url) {
    return new Promise((resolve, reject) => {
      const fullUrl = `${this.baseUrl}${url}`;

      https
        .get(fullUrl, (res) => {
          let data = "";

          res.on("data", (chunk) => {
            data += chunk;
          });

          res.on("end", () => {
            const seoData = this.analyzePageSEO(data, url);
            resolve(seoData);
          });
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  }

  analyzePageSEO(html, url) {
    const analysis = {
      url,
      title: this.extractTitle(html),
      description: this.extractDescription(html),
      keywords: this.extractKeywords(html),
      h1Count: this.countH1Tags(html),
      h2Count: this.countH2Tags(html),
      h3Count: this.countH3Tags(html),
      imageCount: this.countImages(html),
      imageAltCount: this.countImagesWithAlt(html),
      internalLinks: this.countInternalLinks(html),
      externalLinks: this.countExternalLinks(html),
      wordCount: this.countWords(html),
      loadTime: null, // Would need actual timing
      mobileFriendly: this.checkMobileFriendly(html),
      structuredData: this.checkStructuredData(html),
      socialTags: this.checkSocialTags(html),
    };

    analysis.score = this.calculateSEOScore(analysis);
    analysis.recommendations = this.generateRecommendations(analysis);

    return analysis;
  }

  extractTitle(html) {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return titleMatch ? titleMatch[1].trim() : null;
  }

  extractDescription(html) {
    const descMatch = html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i
    );
    return descMatch ? descMatch[1].trim() : null;
  }

  extractKeywords(html) {
    const keywordsMatch = html.match(
      /<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["']/i
    );
    return keywordsMatch
      ? keywordsMatch[1].split(",").map((k) => k.trim())
      : [];
  }

  countH1Tags(html) {
    const h1Matches = html.match(/<h1[^>]*>/gi);
    return h1Matches ? h1Matches.length : 0;
  }

  countH2Tags(html) {
    const h2Matches = html.match(/<h2[^>]*>/gi);
    return h2Matches ? h2Matches.length : 0;
  }

  countH3Tags(html) {
    const h3Matches = html.match(/<h3[^>]*>/gi);
    return h3Matches ? h3Matches.length : 0;
  }

  countImages(html) {
    const imgMatches = html.match(/<img[^>]*>/gi);
    return imgMatches ? imgMatches.length : 0;
  }

  countImagesWithAlt(html) {
    const imgAltMatches = html.match(/<img[^>]*alt=["'][^"']+["'][^>]*>/gi);
    return imgAltMatches ? imgAltMatches.length : 0;
  }

  countInternalLinks(html) {
    const internalLinkMatches = html.match(/href=["']\/[^"']+["']/gi);
    return internalLinkMatches ? internalLinkMatches.length : 0;
  }

  countExternalLinks(html) {
    const externalLinkMatches = html.match(/href=["']https?:\/\/[^"']+["']/gi);
    return externalLinkMatches ? externalLinkMatches.length : 0;
  }

  countWords(html) {
    // Remove HTML tags and count words
    const textContent = html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return textContent.split(" ").length;
  }

  checkMobileFriendly(html) {
    const viewportMatch = html.match(/<meta[^>]*name=["']viewport["'][^>]*>/i);
    return !!viewportMatch;
  }

  checkStructuredData(html) {
    const structuredDataMatches = html.match(
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>/gi
    );
    return structuredDataMatches ? structuredDataMatches.length : 0;
  }

  checkSocialTags(html) {
    const ogTags = html.match(/<meta[^>]*property=["']og:[^"']+["'][^>]*>/gi);
    const twitterTags = html.match(
      /<meta[^>]*name=["']twitter:[^"']+["'][^>]*>/gi
    );
    return {
      openGraph: ogTags ? ogTags.length : 0,
      twitter: twitterTags ? twitterTags.length : 0,
    };
  }

  calculateSEOScore(analysis) {
    let score = 0;

    // Title (20 points)
    if (
      analysis.title &&
      analysis.title.length > 10 &&
      analysis.title.length < 60
    ) {
      score += 20;
    } else if (analysis.title) {
      score += 10;
    }

    // Description (15 points)
    if (
      analysis.description &&
      analysis.description.length > 50 &&
      analysis.description.length < 160
    ) {
      score += 15;
    } else if (analysis.description) {
      score += 8;
    }

    // Keywords (10 points)
    if (analysis.keywords.length > 0) {
      score += 10;
    }

    // Headings (15 points)
    if (analysis.h1Count === 1) score += 5;
    if (analysis.h2Count > 0) score += 5;
    if (analysis.h3Count > 0) score += 5;

    // Images (10 points)
    if (analysis.imageCount > 0) {
      const altRatio = analysis.imageAltCount / analysis.imageCount;
      score += Math.round(altRatio * 10);
    }

    // Links (10 points)
    if (analysis.internalLinks > 0) score += 5;
    if (analysis.externalLinks > 0) score += 5;

    // Content (10 points)
    if (analysis.wordCount > 300) score += 10;
    else if (analysis.wordCount > 150) score += 5;

    // Mobile friendly (5 points)
    if (analysis.mobileFriendly) score += 5;

    // Structured data (5 points)
    if (analysis.structuredData > 0) score += 5;

    // Social tags (5 points)
    if (analysis.socialTags.openGraph > 0 || analysis.socialTags.twitter > 0) {
      score += 5;
    }

    return Math.min(score, 100);
  }

  generateRecommendations(analysis) {
    const recommendations = [];

    if (!analysis.title) {
      recommendations.push("Add a title tag");
    } else if (analysis.title.length < 10 || analysis.title.length > 60) {
      recommendations.push(
        "Optimize title length (should be 10-60 characters)"
      );
    }

    if (!analysis.description) {
      recommendations.push("Add a meta description");
    } else if (
      analysis.description.length < 50 ||
      analysis.description.length > 160
    ) {
      recommendations.push(
        "Optimize meta description length (should be 50-160 characters)"
      );
    }

    if (analysis.keywords.length === 0) {
      recommendations.push("Add meta keywords");
    }

    if (analysis.h1Count === 0) {
      recommendations.push("Add an H1 tag");
    } else if (analysis.h1Count > 1) {
      recommendations.push("Use only one H1 tag per page");
    }

    if (analysis.h2Count === 0) {
      recommendations.push("Add H2 tags for better structure");
    }

    if (
      analysis.imageCount > 0 &&
      analysis.imageAltCount < analysis.imageCount
    ) {
      recommendations.push("Add alt text to all images");
    }

    if (analysis.internalLinks === 0) {
      recommendations.push("Add internal links");
    }

    if (analysis.wordCount < 300) {
      recommendations.push("Add more content (aim for 300+ words)");
    }

    if (!analysis.mobileFriendly) {
      recommendations.push("Add viewport meta tag for mobile optimization");
    }

    if (analysis.structuredData === 0) {
      recommendations.push("Add structured data (JSON-LD)");
    }

    if (
      analysis.socialTags.openGraph === 0 &&
      analysis.socialTags.twitter === 0
    ) {
      recommendations.push("Add Open Graph and Twitter Card meta tags");
    }

    return recommendations;
  }

  async runFullAnalysis() {
    console.log("🚀 Starting SprintiQ SEO Analysis...\n");

    const results = [];
    let totalScore = 0;

    for (const page of this.pages) {
      try {
        console.log(`📄 Analyzing: ${page}`);
        const analysis = await this.checkPageSEO(page);
        results.push(analysis);
        totalScore += analysis.score;

        console.log(`   Score: ${analysis.score}/100`);
        console.log(
          `   Title: ${
            analysis.title ? analysis.title.substring(0, 50) + "..." : "Missing"
          }`
        );
        console.log(`   Words: ${analysis.wordCount}`);
        console.log(
          `   H1: ${analysis.h1Count}, H2: ${analysis.h2Count}, H3: ${analysis.h3Count}`
        );
        console.log(
          `   Images: ${analysis.imageCount} (${analysis.imageAltCount} with alt)`
        );
        console.log(
          `   Links: ${analysis.internalLinks} internal, ${analysis.externalLinks} external`
        );
        console.log(`   Structured Data: ${analysis.structuredData} schemas`);
        console.log(
          `   Social Tags: ${analysis.socialTags.openGraph} OG, ${analysis.socialTags.twitter} Twitter`
        );

        if (analysis.recommendations.length > 0) {
          console.log(
            `   Recommendations: ${analysis.recommendations.join(", ")}`
          );
        }
        console.log("");
      } catch (error) {
        console.error(`❌ Error analyzing ${page}:`, error.message);
      }
    }

    const averageScore = totalScore / results.length;

    console.log("📊 SEO Analysis Summary");
    console.log("========================");
    console.log(`Average Score: ${averageScore.toFixed(1)}/100`);
    console.log(`Pages Analyzed: ${results.length}`);
    console.log(`Target Keywords: ${this.targetKeywords.length}`);

    // Generate overall recommendations
    const overallRecommendations = this.generateOverallRecommendations(results);
    console.log("\n🎯 Overall Recommendations:");
    overallRecommendations.forEach((rec) => console.log(`   • ${rec}`));

    // Save results to file
    const reportPath = path.join(
      __dirname,
      "../reports/seo-analysis-report.json"
    );
    const report = {
      date: new Date().toISOString(),
      baseUrl: this.baseUrl,
      targetKeywords: this.targetKeywords,
      averageScore,
      pagesAnalyzed: results.length,
      results,
      overallRecommendations,
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);

    return report;
  }

  generateOverallRecommendations(results) {
    const recommendations = [];

    // Check for common issues across pages
    const pagesWithoutTitle = results.filter((r) => !r.title).length;
    const pagesWithoutDescription = results.filter(
      (r) => !r.description
    ).length;
    const pagesWithoutH1 = results.filter((r) => r.h1Count === 0).length;
    const pagesWithLowWordCount = results.filter(
      (r) => r.wordCount < 300
    ).length;
    const pagesWithoutStructuredData = results.filter(
      (r) => r.structuredData === 0
    ).length;

    if (pagesWithoutTitle > 0) {
      recommendations.push(`Add title tags to ${pagesWithoutTitle} pages`);
    }

    if (pagesWithoutDescription > 0) {
      recommendations.push(
        `Add meta descriptions to ${pagesWithoutDescription} pages`
      );
    }

    if (pagesWithoutH1 > 0) {
      recommendations.push(`Add H1 tags to ${pagesWithoutH1} pages`);
    }

    if (pagesWithLowWordCount > 0) {
      recommendations.push(
        `Add more content to ${pagesWithLowWordCount} pages (aim for 300+ words)`
      );
    }

    if (pagesWithoutStructuredData > 0) {
      recommendations.push(
        `Add structured data to ${pagesWithoutStructuredData} pages`
      );
    }

    // Check average scores
    const averageScore =
      results.reduce((sum, r) => sum + r.score, 0) / results.length;

    if (averageScore < 70) {
      recommendations.push(
        "Overall SEO score is low - focus on basic on-page optimization"
      );
    } else if (averageScore < 85) {
      recommendations.push(
        "SEO score is good but can be improved - focus on advanced optimization"
      );
    } else {
      recommendations.push(
        "Excellent SEO score - focus on content marketing and link building"
      );
    }

    return recommendations;
  }

  async checkKeywordRankings() {
    console.log("\n🔍 Checking keyword rankings...");
    console.log(
      "Note: This would require integration with SEO APIs like SEMrush, Ahrefs, or Google Search Console"
    );
    console.log("Target keywords to monitor:");
    this.targetKeywords.forEach((keyword) => {
      console.log(`   • ${keyword}`);
    });
  }

  async generateSEOActions() {
    console.log("\n📋 SEO Action Plan");
    console.log("==================");
    console.log("1. Technical SEO:");
    console.log("   • Submit sitemap to Google Search Console");
    console.log("   • Verify Google Analytics tracking");
    console.log("   • Check mobile responsiveness");
    console.log("   • Optimize page load speed");
    console.log("");
    console.log("2. On-Page SEO:");
    console.log("   • Optimize title tags and meta descriptions");
    console.log("   • Add structured data markup");
    console.log("   • Improve heading structure");
    console.log("   • Add alt text to images");
    console.log("");
    console.log("3. Content SEO:");
    console.log("   • Create more content targeting long-tail keywords");
    console.log("   • Add internal linking strategy");
    console.log("   • Optimize for featured snippets");
    console.log("   • Create FAQ sections");
    console.log("");
    console.log("4. Off-Page SEO:");
    console.log("   • Build quality backlinks");
    console.log("   • Create shareable content");
    console.log("   • Engage in social media marketing");
    console.log("   • Guest posting on relevant blogs");
  }
}

// Run the SEO monitor
async function main() {
  const monitor = new SEOMonitor();

  try {
    await monitor.runFullAnalysis();
    await monitor.checkKeywordRankings();
    await monitor.generateSEOActions();
  } catch (error) {
    console.error("❌ Error running SEO analysis:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = SEOMonitor;
