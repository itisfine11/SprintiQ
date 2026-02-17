"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  ArrowRight,
  Plus,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Navbar from "@/components/landing/layout/navbar";
import Footer from "@/components/landing/layout/footer";
import ScrollToTop from "@/components/ui/scroll-to-top";
import GithubSvg from "@/components/svg/apps/GithubSvg";
import SlackSvg from "@/components/svg/apps/SlackSvg";
import NotionSvg from "@/components/svg/apps/NotionSvg";
import JiraSvg from "@/components/svg/apps/JiraSvg";
import TrelloSvg from "@/components/svg/apps/TrelloSvg";
import AsanaSvg from "@/components/svg/apps/AsanaSvg";
import HeroSection from "@/components/landing/HeroSection";
import { AiBrainSvg } from "@/components/svg/AiBrainSvg";
import { TeamSvg } from "@/components/svg/TeamSvg";
import { BadgeSvg } from "@/components/svg/BadgeSvg";
import { IntegrationSvg } from "@/components/svg/IntegrationSvg";
import { InventiveSvg } from "@/components/svg/InventiveSvg";
import { PlanningSvg } from "@/components/svg/PlanningSvg";
import Head from "next/head";

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariant = {
  initial: { opacity: 0, y: 30, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const iconVariant = {
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0 },
  transition: { duration: 0.6, ease: "easeOut", delay: 0.2 },
};

export default function HomePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <>
      <Head>
        {/* Enhanced SEO Meta Tags with Strategic Keywords */}
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />

        {/* Strategic Keyword Meta Tags */}
        <meta
          name="keywords"
          content="SprintiQ, sprintiq, SprintiQ AI, sprintiq ai, SprintiQ ai, sprintiq AI, SprintiQ AI, AI Native Project management, AI Native Project Management, ai native project management, AI project management, ai project management, AI agile planning, ai agile planning, AI native agile, ai native agile"
        />
        <meta name="author" content="SprintiQ Team" />
        <meta
          name="application-name"
          content="SprintiQ - AI Native Agile Planning"
        />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />

        {/* Mobile Optimization */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SprintiQ" />

        {/* Enhanced Open Graph Tags with Strategic Keywords */}
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="SprintiQ" />
        <meta
          property="og:title"
          content="SprintiQ - AI Native Agile Product Planning | Your PM Tool Intelligence Layer"
        />
        <meta
          property="og:description"
          content="SprintiQ is the #1 AI-Native agile planning tool. Transform agile development with intelligent user story generation, AI project management, and sprint planning."
        />

        {/* Enhanced Twitter Card Tags with Strategic Keywords */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@sprintiq_ai" />
        <meta name="twitter:creator" content="@sprintiq_ai" />
        <meta
          name="twitter:title"
          content="SprintiQ - AI Native Agile Product Planning | Your PM Tool Intelligence Layer"
        />
        <meta
          name="twitter:description"
          content="SprintiQ is the #1 AI-Native agile planning tool. Transform agile development with intelligent user story generation, AI project management, and sprint planning."
        />

        {/* Enhanced Schema.org Structured Data with Strategic Keywords */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "SprintiQ - AI-Native Agile Planning Tool",
              description:
                "#1 AI-Native agile planning and AI project management platform. Transform agile development with intelligent user story generation and sprint planning. Free early access for agile teams.",
              url: "https://www.sprintiq.ai",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
                description:
                  "Free early access - join 10,000+ agile teams using AI project management",
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
                "AI sprint planning",
                "AI project management",
                "AI agile planning",
                "AI native agile development",
                "Real-time team collaboration",
                "Jira, GitHub, Slack integrations",
                "Free early access",
              ],
              screenshot: "https://www.sprintiq.ai/images/sprintiq-turbo.png",
              downloadUrl: "https://www.sprintiq.ai/signup",
              softwareVersion: "1.0",
              releaseNotes:
                "Free early access with all AI project management features included",
            }),
          }}
        />

        {/* Enhanced Organization Schema with Strategic Keywords */}
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
                "#1 AI-Native agile planning and AI project management platform. Transform agile development with intelligent user story generation and sprint planning.",
              sameAs: [
                "https://x.com/SprintiQAI",
                "https://www.linkedin.com/company/sprintiq-ai",
                "https://www.facebook.com/SprintiQ/",
                "https://www.instagram.com/sprintiq.ai/",
                "https://sprintiq.medium.com",
              ],
              knowsAbout: [
                "AI-Native Agile Planning",
                "AI Project Management",
                "AI Sprint Planning",
                "AI User Story Generation",
                "Agile Development",
                "Scrum Tools",
                "Sprint Management",
                "Backlog Management",
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
                  name: "How does the Beta access work?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Our Beta program gives you early access to all features of SprintiQ. Sign up now to get exclusive access and help shape the future of sprint planning. No credit card required.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What features are included in the Beta?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Beta users get access to core features including AI-Native story generation, sprint planning, team collaboration, and integrations with essential tools like Jira, GitHub, and Slack. We're constantly adding new features based on user feedback.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Is there a limit to how many projects I can create?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "No, Beta users can create unlimited projects, tasks, and sprints to manage their work effectively.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How secure is my data with SprintiQ?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "We take security very seriously. SprintiQ uses bank-level encryption for all data, both in transit and at rest. We're SOC 2 compliant and regularly undergo security audits.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I import data from other project management tools?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, SprintiQ supports importing data from popular tools like Jira, Asana, and Trello. Our import wizard makes it easy to bring over your projects, tasks, and team members with just a few clicks.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What kind of support do you offer during Beta?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Beta users get priority access to our support team and direct communication channels with our product team. We value your feedback and are committed to helping you succeed with SprintiQ.",
                  },
                },
              ],
            }),
          }}
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 overflow-y-auto custom-scrollbar">
        <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <section
          className="py-16 sm:py-20 lg:py-24"
          aria-labelledby="features-heading"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12 sm:mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 animate-gradient-shift"
                whileHover={{ scale: 1.02 }}
              >
                Transform Your{" "}
                <span className="text-emerald-600">Agile Planning</span>
              </motion.h2>
              <motion.p
                className="text-lg sm:text-xl text-emerald-100/90 max-w-3xl mx-auto mb-6 sm:mb-8 px-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                AI-native agile planning that reduces planning time by 80% and
                improves sprint success rates by 95%
              </motion.p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {[
                {
                  icon: <AiBrainSvg color="#fff" />,
                  title: "AI Story Generation",
                  description:
                    "Transform scattered requirements into detailed, actionable user stories in seconds with AI trained on real-world project successes.",
                  benefit: "80% faster story creation",
                },
                {
                  icon: <TeamSvg color="#fff" />,
                  title: "Smart Sprint Planning",
                  description:
                    "Intelligent capacity estimation and risk assessment based on team performance and historical data.",
                  benefit: "95% sprint success rate",
                },
                {
                  icon: <PlanningSvg color="#fff" />,
                  title: "Backlog Prioritization",
                  description:
                    "AI-Native prioritization that considers business value, complexity, and dependencies automatically.",
                  benefit: "3x faster prioritization",
                },
                {
                  icon: <InventiveSvg color="#fff" />,
                  title: "Real-time Collaboration",
                  description:
                    "Keep everyone aligned with real-time updates, comments, and progress tracking across all sprints.",
                  benefit: "Eliminate coordination delays",
                },
                {
                  icon: <BadgeSvg color="#fff" />,
                  title: "Enterprise Security",
                  description:
                    "Bank-level security with SOC 2 compliance, data encryption, and enterprise-grade reliability.",
                  benefit: "99.9% uptime guarantee",
                },
                {
                  icon: <IntegrationSvg color="#fff" />,
                  title: "Core Integrations",
                  description:
                    "Connect with Jira, GitHub, Slack, and 100+ tools for a unified agile workflow experience.",
                  benefit: "Zero setup time",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={cardVariant}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="group"
                >
                  <Card className="h-full bg-white/10 backdrop-blur-xl border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 hover:shadow-emerald-500/20 hover:shadow-xl animate-bounce-in">
                    <CardContent className="p-6 sm:p-8">
                      <motion.div
                        className="w-12 h-12 sm:w-16 sm:h-16 p-2 sm:p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300"
                        variants={iconVariant}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        {feature.icon}
                      </motion.div>
                      <motion.h3
                        className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 group-hover:text-emerald-400 transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        {feature.title}
                      </motion.h3>
                      <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed mb-3 sm:mb-4">
                        {feature.description}
                      </p>
                      <div className="inline-block px-2 sm:px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs sm:text-sm font-semibold rounded-full">
                        {feature.benefit}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Integrations Section */}
        <section
          className="py-16 sm:py-20 lg:py-24 px-4 bg-white/5 backdrop-blur-xl"
          aria-labelledby="integrations-heading"
        >
          <div className="container mx-auto">
            <motion.div
              className="text-center mb-12 sm:mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 animate-gradient-shift"
                whileHover={{ scale: 1.02 }}
              >
                Works with Your{" "}
                <span className="text-emerald-600">Agile Tools</span>
              </motion.h2>
              <motion.p
                className="text-lg sm:text-xl text-emerald-100/90 max-w-3xl mx-auto mb-6 sm:mb-8 px-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Connect SprintiQ with your existing agile workflow tools. No
                disruption to your current process.
              </motion.p>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {[
                { icon: <JiraSvg />, name: "Jira" },
                { icon: <GithubSvg />, name: "Github" },
                { icon: <SlackSvg />, name: "Slack" },
                { icon: <TrelloSvg />, name: "Trello" },
                { icon: <AsanaSvg />, name: "Asana" },
                { icon: <NotionSvg />, name: "Notion" },
              ].map((IconComponent, index) => (
                <motion.div
                  key={index}
                  variants={cardVariant}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="flex items-center justify-center p-4 sm:p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 hover:shadow-emerald-500/20 hover:shadow-lg animate-bounce-in group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex items-center justify-center flex-col gap-2 sm:gap-3"
                  >
                    <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center">
                      {IconComponent.icon}
                    </div>
                    <span className="text-xs sm:text-sm text-emerald-100/80">
                      {IconComponent.name}
                    </span>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          className="py-16 sm:py-20 lg:py-24 px-4"
          aria-labelledby="faq-heading"
        >
          <div className="container mx-auto">
            <motion.div
              className="text-center mb-12 sm:mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 animate-gradient-shift"
                whileHover={{ scale: 1.02 }}
              >
                Frequently Asked{" "}
                <span className="text-emerald-600">Questions</span>
              </motion.h2>
              <motion.p
                className="text-lg sm:text-xl text-emerald-100/90 max-w-3xl mx-auto mb-6 sm:mb-8 px-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Get answers to common questions about SprintiQ's AI-Native agile
                planning platform
              </motion.p>
            </motion.div>

            <motion.div
              className="max-w-3xl mx-auto space-y-3 sm:space-y-4"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {[
                {
                  question: "How does SprintiQ improve my sprint planning?",
                  answer:
                    "SprintiQ uses AI to analyze your team's historical performance, automatically estimate story points, identify risks, and optimize sprint capacity. This reduces planning time by 80% and improves sprint success rates by 95%.",
                },
                {
                  question:
                    "What makes SprintiQ different from other agile tools?",
                  answer:
                    "Unlike traditional tools, SprintiQ is AI-native. It learns from your team's patterns, automatically generates user stories from requirements, prioritizes backlogs intelligently, and provides real-time risk assessment. It's like having an expert agile coach for every sprint.",
                },
                {
                  question:
                    "Can I import my existing projects from Jira/Trello?",
                  answer:
                    "Yes! SprintiQ supports seamless imports from Jira, Trello, Asana, and 100+ other tools. Your existing projects, tasks, and team members transfer automatically with zero data loss. Setup takes just 2 minutes.",
                },
                {
                  question: "Is SprintiQ suitable for my team size?",
                  answer:
                    "SprintiQ works for teams of any size - from 2-person startups to 500+ enterprise teams. Our AI scales with your team and adapts to your specific agile methodology (Scrum, Kanban, etc.).",
                },
                {
                  question: "What's included in the free beta access?",
                  answer:
                    "Beta users get full access to all features: AI story generation, smart sprint planning, backlog prioritization, team collaboration, 100+ integrations, and enterprise security. No credit card required, no limits on projects or team members.",
                },
                {
                  question: "How secure is my team's data?",
                  answer:
                    "SprintiQ uses bank-level encryption (SOC 2 compliant) for all data. We never access your content, and you can export your data anytime. Enterprise-grade security with 99.9% uptime guarantee.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  variants={cardVariant}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden group hover:border-white/20 transition-all duration-300 animate-bounce-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <motion.button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left p-4 sm:p-6 flex justify-between items-center"
                    whileHover={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    <motion.h3
                      className="text-lg sm:text-xl font-medium text-white"
                      whileHover={{ color: "#10b981" }}
                    >
                      {faq.question}
                    </motion.h3>
                    <motion.div
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center"
                      animate={{
                        rotate: openFaqIndex === index ? 225 : 0,
                        backgroundColor:
                          openFaqIndex === index ? "#10b981" : "transparent",
                      }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </motion.div>
                  </motion.button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: openFaqIndex === index ? "auto" : 0,
                      opacity: openFaqIndex === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <motion.div
                      className="px-4 sm:px-6 pb-4 text-white/70"
                      initial={{ y: -10 }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-base sm:text-lg">{faq.answer}</p>
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>

            {/* FAQ CTA */}
            <motion.div
              className="text-center mt-8 sm:mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <a
                href="https://www.sprintiq.ai/insights"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 text-emerald-300 hover:text-emerald-200 border border-emerald-400/30 hover:border-emerald-400 rounded-lg transition-all duration-300 group hover:bg-emerald-500/10 text-sm sm:text-base"
              >
                <span>View Complete Documentation</span>
                <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="py-16 sm:py-20 lg:py-24 px-4 bg-white/5 backdrop-blur-xl"
          aria-labelledby="cta-heading"
        >
          <motion.div
            className="relative container mx-auto text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 sm:mb-8 animate-gradient-shift px-4"
              whileHover={{ scale: 1.02 }}
            >
              Ready to Transform Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">
                Agile Planning?
              </span>
            </motion.h2>
            <motion.p
              className="text-lg sm:text-xl text-emerald-100 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Join thousands of agile teams who've already reduced their sprint
              planning time by 80% and improved success rates by 95%.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-6 sm:mb-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.div variants={cardVariant}>
                <Link href="/signup">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="bg-white text-emerald-600 hover:bg-gray-50 px-6 sm:px-8 lg:px-12 py-4 sm:py-5 lg:py-6 text-lg sm:text-xl lg:text-2xl font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 group animate-pulse-glow">
                      Start Free Beta Access
                      <motion.div
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
                      </motion.div>
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        <Footer />

        <ScrollToTop isMenuOpen={isMenuOpen} />
      </div>
    </>
  );
}
