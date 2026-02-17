"use client";

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useSpring,
} from "framer-motion";
import Navbar from "@/components/landing/layout/navbar";
import Footer from "@/components/landing/layout/footer";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Zap,
  Users,
  BarChart3,
  Target,
  Clock,
  Shield,
  ArrowRight,
  Sparkles,
  Plus,
} from "lucide-react";
import Link from "next/link";
import JiraSvg from "@/components/svg/apps/JiraSvg";
import AsanaSvg from "@/components/svg/apps/AsanaSvg";
import { ClickUpSvg } from "@/components/svg/apps/ClickUpSvg";
import TrelloSvg from "@/components/svg/apps/TrelloSvg";
import { MondaySvg } from "@/components/svg/apps/MondaySvg";
import { AirtableSvg } from "@/components/svg/apps/AirtableSvg";
import { useState, useRef } from "react";
import { AiBrainSvg } from "@/components/svg/AiBrainSvg";
import { InventiveSvg } from "@/components/svg/InventiveSvg";
import { TimeEffeciencySvg } from "@/components/svg/TimeEffeciencySvg";
import { DataAnalyticsSvg } from "@/components/svg/DataAnalyticsSvg";
import { ErrorsSvg } from "@/components/svg/ErrorsSvg";
import { AISvg } from "@/components/svg/AISvg";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import SprintiQSvg from "@/components/svg/SprintiQSvg";
import ScrollToTop from "@/components/ui/scroll-to-top";

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

export default function FeaturesPage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: timelineScrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"],
  });

  // Transform scroll progress to timeline height and icon position
  const timelineHeight = useTransform(
    timelineScrollYProgress,
    [0, 1],
    ["-5%", "104%"]
  );
  const timelineHeightSpring = useSpring(timelineHeight, {
    stiffness: 100,
    damping: 30,
  });
  const iconY = useTransform(timelineScrollYProgress, [0, 1], ["-5%", "104%"]);
  const springIconY = useSpring(iconY, { stiffness: 100, damping: 30 });

  // Calculate when each card should appear based on scroll progress
  const getCardOpacity = (index: number) => {
    return useTransform(
      timelineScrollYProgress,
      [index * 0.15, (index + 1) * 0.15],
      [0, 1]
    );
  };

  const getCardScale = (index: number) => {
    return useTransform(
      timelineScrollYProgress,
      [index * 0.15, (index + 1) * 0.15],
      [0.8, 1]
    );
  };
  const features = [
    {
      icon: <AiBrainSvg color="#fff" />,
      title: "AI-Native Story Generation",
      description:
        "Turn scattered feature requests into detailed, actionable user stories with AI trained on real-world project successes and failures.",
      benefits: [
        "Professional agile format (As a/I want/So that)",
        "Detailed acceptance criteria generation",
        "Multiple story variations per feature",
        "Persona-based story customization",
      ],
    },
    {
      icon: <InventiveSvg color="#fff" />,
      title: "Intelligent Prioritization",
      description:
        "Let your data drive your backlog. Our AI analyzes business value, complexity, dependencies, and risk to recommend optimal story ordering and backlog prioritization.",
      benefits: [
        "Multi-factor weighted scoring",
        "Dynamic priority updates",
        "Dependency-aware sequencing",
        "Value vs. effort optimization",
      ],
    },
    {
      icon: <ErrorsSvg color="#fff" />,
      title: "Sprint Risk Intelligence",
      description:
        "Identify and mitigate sprint risks before they impact delivery. Our AI analyzes patterns to predict potential bottlenecks and suggests preventative actions.",
      benefits: [
        "Early risk detection algorithms",
        "AI-Native mitigation strategies",
        "Sprint health dashboards",
        "Velocity-based predictions",
      ],
    },
    {
      icon: <AISvg color="#fff" />,
      title: "AI-Native Agile Planning",
      description:
        "Intelligent recommendations for sprint capacity, task estimation, and resource allocation based on your historical data, team performance, and our AI Agent's analysis of real-world projects with 87-89% completion rates and failure prevention patterns.",
      benefits: [
        "Automated story point estimation",
        "Capacity planning",
        "Risk assessment",
        "Performance predictions",
      ],
    },
    {
      icon: <DataAnalyticsSvg color="#fff" />,
      title: "Advanced Analytics",
      description:
        "Comprehensive reporting and analytics dashboard with customizable metrics, burndown charts, and performance insights.",
      benefits: [
        "Custom dashboards",
        "Burndown charts",
        "Velocity tracking",
        "Team performance metrics",
      ],
    },
    {
      icon: <TimeEffeciencySvg color="#fff" />,
      title: "Time Management",
      description:
        "Built-in time tracking, automated timesheets, and productivity insights to optimize your team's workflow.",
      benefits: [
        "Time tracking",
        "Automated timesheets",
        "Productivity insights",
        "Billing integration",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* Animated Background Elements */}
      <motion.div
        className="fixed inset-0 overflow-hidden pointer-events-none"
        style={{ y }}
      >
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </motion.div>

      {/* Hero Section */}
      <section className="pt-20 md:pt-32 pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center px-6 py-3 bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium mb-8 animate-pulse-glow"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Native Features
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight animate-gradient-shift"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
          >
            Everything you need to
            <motion.span
              className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-500 to-teal-600"
              animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {" "}
              build amazing products
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-white/50 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Discover how SprintiQ's cutting-edge features can transform your
            project management workflow and boost your team's productivity.
            <br />
            <motion.span
              className="text-emerald-600 font-medium"
              whileHover={{ color: "#10b981" }}
            >
              Built for modern teams that move fast.
            </motion.span>
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center"
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
                  <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group animate-pulse-glow">
                    Get Early Access
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                    </motion.div>
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid lg:grid-cols-2 gap-8 md:gap-12"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariant}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 lg:p-10 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 group animate-bounce-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                  <motion.div
                    className="w-12 h-12 md:w-16 md:h-16 p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-emerald-500/30 transition-all duration-300 mx-auto md:mx-0"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    variants={iconVariant}
                  >
                    {feature.icon}
                  </motion.div>
                  <div className="flex-1 text-center md:text-left">
                    <motion.h3
                      className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 group-hover:text-emerald-300 transition-colors duration-300"
                      whileHover={{ x: 5 }}
                    >
                      {feature.title}
                    </motion.h3>
                    <motion.p
                      className="text-sm md:text-base text-white/50 mb-4 md:mb-6 leading-relaxed"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      {feature.description}
                    </motion.p>
                    <motion.ul
                      className="space-y-3"
                      variants={staggerContainer}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true }}
                    >
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <motion.li
                          key={benefitIndex}
                          variants={cardVariant}
                          className="flex items-center space-x-3 group/item"
                        >
                          <motion.div
                            whileHover={{ scale: 1.2 }}
                            className="animate-check-bounce"
                            style={{ animationDelay: `${benefitIndex * 0.1}s` }}
                          >
                            <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                          </motion.div>
                          <motion.span
                            className="text-white/50 group-hover/item:text-white/70 transition-colors duration-200"
                            whileHover={{ x: 3 }}
                          >
                            {benefit}
                          </motion.span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        className="py-16 md:py-24 px-4"
        aria-labelledby="ecosystem-heading"
      >
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-12 md:mb-16 px-4"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 animate-gradient-shift"
              whileHover={{ scale: 1.02 }}
            >
              Shipyard Ecosystem:{" "}
              <span className="text-emerald-600">
                Complete Workflow Automation
              </span>
            </motion.h2>
            <motion.p
              className="text-lg sm:text-xl text-emerald-100/90 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              The Shopify of Agile Product Development
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto px-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                category: "Solution",
                title: "Building the 6-Agent AI Development Ecosystem",
                description: "The Shopify of Agile Product Development",
              },
              {
                category: "Advantages",
                title:
                  "Full-stack automation radically reduces development time",
                description:
                  "From concept validation to production deployment, every process is automated with AI agents",
              },
              {
                category: "Differentiators",
                title:
                  "First production-ready AI-native platform in the market",
                description:
                  "AI-native agile planning and project management platform Beta is complete",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={cardVariant}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group"
              >
                <Card className="h-full bg-white/10 backdrop-blur-xl border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 hover:shadow-emerald-500/20 hover:shadow-xl">
                  <CardContent className="p-6 md:p-8">
                    <div className="mb-3 md:mb-4">
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-sm font-semibold rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm md:text-base text-emerald-100/80 leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        className="py-16 md:py-24 px-4 bg-white/5 backdrop-blur-xl"
        aria-labelledby="platform-heading"
      >
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h3
              className="text-2xl font-semibold text-emerald-400 mb-4"
              whileHover={{ scale: 1.02 }}
            >
              SprintiQ Inc. - Pioneering AI-Native Agile Product Development
            </motion.h3>
            <motion.p
              className="text-lg text-emerald-100/90 mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              From Concept to Deployment in Days, Not Months
            </motion.p>
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 animate-gradient-shift px-4"
              whileHover={{ scale: 1.02 }}
            >
              The World's First Complete{" "}
              <span className="text-emerald-600">
                AI-Native Product Development Platform
              </span>
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl text-emerald-100/90 max-w-3xl mx-auto px-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Automate the entire product development workflow from concept to
              deployment
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section
        className="py-16 md:py-24 px-4"
        aria-labelledby="problem-heading"
      >
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-12 md:mb-16 px-4"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 animate-gradient-shift"
              whileHover={{ scale: 1.02 }}
            >
              The Agile Product Development{" "}
              <span className="text-red-400">Problem</span>
            </motion.h2>
            <motion.p
              className="text-lg sm:text-xl text-emerald-100/90 max-w-3xl mx-auto mb-6 md:mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Average product takes 6-18 months to develop & deploy
            </motion.p>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {[
                {
                  phase: "Concept & Planning",
                  problem:
                    "Over 40% of time consumed with market research, business model validation, and story creation.",
                  impact:
                    "Significant bottlenecks in foundational work and upfront analysis.",
                },
                {
                  phase: "Design & Prototyping",
                  problem:
                    "Stories don't translate to consistent designs with design-to-development handoff breaking workflows.",
                  impact:
                    "Disconnect between design specifications and implementation.",
                },
                {
                  phase: "Development & Coding",
                  problem:
                    "Backend/frontend development disconnected and designs rarely match implementation.",
                  impact: "Lack of synchronization between development teams.",
                },
                {
                  phase: "Deployment & Monitoring",
                  problem:
                    "Platform-specific deployment requires expertise and scaling is based on intuition.",
                  impact:
                    "Lack of standardized deployment processes and subjective scaling decisions.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={cardVariant}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/5 backdrop-blur-lg rounded-xl border border-red-500/20 p-4 md:p-6 hover:border-red-400/40 transition-all duration-300"
                >
                  <h3 className="text-lg md:text-xl font-bold text-red-400 mb-2 md:mb-3">
                    {item.phase}
                  </h3>
                  <p className="text-sm md:text-base text-emerald-100/80 mb-2 md:mb-3">
                    {item.problem}
                  </p>
                  <p className="text-xs md:text-sm text-emerald-100/60 italic">
                    {item.impact}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Real-World Impact */}
            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <div className="bg-red-500/10 backdrop-blur-xl rounded-xl border border-red-500/30 p-8">
                <h3 className="text-2xl font-bold text-red-400 mb-4">
                  Real-World Impact
                </h3>
                <p className="text-xl text-emerald-100/90">
                  <span className="text-red-400 font-bold">
                    68% of software projects fail
                  </span>{" "}
                  from poor coordination, wasting hundreds of millions of
                  dollars.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Solution Preview Section */}
      <section
        className="py-16 md:py-24 px-4 bg-white/5 backdrop-blur-xl"
        aria-labelledby="solution-heading"
      >
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-12 md:mb-16 px-4"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 animate-gradient-shift"
              whileHover={{ scale: 1.02 }}
            >
              The SprintiQ <span className="text-emerald-600">Solution</span>
            </motion.h2>
            <motion.p
              className="text-lg sm:text-xl text-emerald-100/90 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              AI-Native automation that transforms months into days
            </motion.p>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {[
                {
                  title: "AI-Native Story Generation",
                  description:
                    "Transform scattered requirements into detailed, actionable user stories in seconds",
                  benefit: "Reduces planning time by 80%",
                },
                {
                  title: "Intelligent Sprint Planning",
                  description:
                    "Automated capacity estimation and risk assessment based on team performance",
                  benefit: "Improves sprint success rate by 95%",
                },
                {
                  title: "Seamless Team Collaboration",
                  description:
                    "Real-time collaboration tools that keep everyone aligned and productive",
                  benefit: "Eliminates coordination bottlenecks",
                },
                {
                  title: "Automated Workflow Integration",
                  description:
                    "Connect with existing tools and automate the entire development pipeline",
                  benefit: "Reduces deployment time by 90%",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={cardVariant}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/10 backdrop-blur-lg rounded-xl border border-emerald-500/20 p-4 md:p-6 hover:border-emerald-400/40 transition-all duration-300"
                >
                  <h3 className="text-lg md:text-xl font-bold text-emerald-400 mb-2 md:mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base text-emerald-100/80 mb-2 md:mb-3">
                    {item.description}
                  </p>
                  <p className="text-emerald-300 text-xs md:text-sm font-semibold">
                    {item.benefit}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section
        className="py-16 md:py-24 px-4 sm:px-6 lg:px-8"
        aria-labelledby="roadmap-heading"
        ref={timelineRef}
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-12 md:mb-16 px-4"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 animate-gradient-shift"
              whileHover={{ scale: 1.02 }}
            >
              Product <span className="text-emerald-600">Roadmap</span>
            </motion.h2>
            <motion.p
              className="text-lg sm:text-xl text-emerald-100/90 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              See what's coming next and help shape the future of SprintiQ
            </motion.p>
          </motion.div>

          <motion.div
            className="max-w-6xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {/* Timeline Container */}
            <div className="relative min-h-[600px] md:min-h-[800px]">
              {/* Animated Timeline Line - Hidden on mobile */}
              <motion.div
                className="hidden md:block absolute left-1/2 transform -translate-x-px w-0.5 bg-gradient-to-b from-emerald-500 via-emerald-400 to-emerald-300 h-full"
                style={{ height: timelineHeightSpring }}
              />

              {/* SprintiQ Icon that moves along timeline - Hidden on mobile */}
              <motion.div
                className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-12 h-12 z-20"
                style={{ top: springIconY }}
              >
                <div className="relative w-full h-full">
                  {/* Rotating animation around the icon */}
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-400 border-r-emerald-300 animate-spin-slow"></div>
                  <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-green-400 border-l-green-300 animate-spin-slow-reverse"></div>

                  {/* Main SprintiQ Icon */}
                  <div className="relative w-full h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-400 p-1 animate-pulse-glow">
                    <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                      <SprintiQSvg />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Roadmap Items */}
              {[
                {
                  phase: "Concept Validation",
                  status: "completed",
                  title: "Radar",
                  description:
                    "Automated market research, validating business models quickly and efficiently",
                  features: [
                    "Market analysis: $47B local food market validation",
                    "Competitor analysis: 12 direct competitors with strategic positioning",
                    "Target personas: 3 validated user segments with pain points",
                    "MVP prioritization: 8 features ranked by impact/effort matrix",
                  ],
                  img: "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/avatars/agents/sOTZtOA.jpeg",
                },
                {
                  phase: "Agile Planning",
                  status: "in-progress",
                  title: "Turbo",
                  description:
                    "Generate user persona based user stories and optimizes and de-risks the sprint planning",
                  features: [
                    "24 enterprise-grade user stories in proper agile format",
                    "AI-optimized sprint planning with velocity predictions",
                    "Automated risk assessment and mitigation strategies",
                  ],
                  img: "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/avatars/agents/JibWlzP.png",
                },
                {
                  phase: "AI Agents",
                  status: "planned",
                  title: "Nova",
                  description:
                    "Master AI agent coordinator, orchestrating all other agents",
                  features: [
                    "Master AI agent coordinator, orchestrating all other agents",
                    "AI-Native decision-making and workflow automation",
                    "Voice command integration for hands-free interaction",
                  ],
                  img: "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/avatars/agents/ant.png",
                },
                {
                  phase: "UI/UX Generation",
                  status: "upcoming",
                  title: "Zen",
                  description:
                    "Generate ready-to-use designs, streamlining UI/UX design and development",
                  features: [
                    "Complete design system with brand-aware guidelines",
                    "12 responsive screen designs with accessibility compliance",
                    "Interactive prototype with validated user flows",
                  ],
                  img: "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/avatars/agents/HcGO6RB.jpeg",
                },
                {
                  phase: "Development",
                  status: "upcoming",
                  title: "Sync",
                  description:
                    "Converts designs to full-stack applications, reducing coding time",
                  features: [
                    "Production-ready React/Node.js application",
                    "Optimized database schema with secure API endpoints",
                    "Integrated payment processing and authentication",
                  ],
                  img: "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/avatars/agents/mcFsodi.jpeg",
                },
                {
                  phase: "Deployment",
                  status: "planned",
                  title: "Glide",
                  description:
                    "Automates deployment, ensuring fast and reliable product launches",
                  features: [
                    "Automated production deployment on multiple platforms",
                    "CI/CD pipeline with monitoring and alerting",
                    "Performance optimization and auto-scaling configuration",
                  ],
                  img: "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/avatars/agents/x5HEHNO.jpeg",
                },
              ].map((item, index) => {
                const cardOpacity = getCardOpacity(index);
                const cardScale = getCardScale(index);

                return (
                  <motion.div
                    key={index}
                    className={`relative flex flex-col md:flex-row items-center mb-8 md:mb-12 ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                    style={{
                      opacity: cardOpacity,
                      scale: cardScale,
                    }}
                  >
                    {/* Mobile Divider - Hidden on desktop */}
                    <div className="md:hidden w-full h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent mb-6"></div>
                    {/* Timeline Dot - Hidden on mobile */}
                    <div
                      className={`hidden md:block absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full border-4 border-white z-10 ${
                        item.status === "completed"
                          ? "bg-emerald-500"
                          : item.status === "in-progress"
                          ? "bg-yellow-500"
                          : item.status === "upcoming"
                          ? "bg-blue-500"
                          : "bg-gray-500"
                      }`}
                    >
                      <Image
                        src={item.img}
                        alt={item.title}
                        width={20}
                        height={20}
                        className="rounded-full w-full h-full object-cover"
                      />
                    </div>

                    {/* Content Card */}
                    <div
                      className={`w-full md:w-5/12 ${
                        index % 2 === 0 ? "md:pr-8" : "md:pl-8"
                      }`}
                    >
                      <motion.div
                        className="bg-white/10 backdrop-blur-xl rounded-xl border border-emerald-500/20 p-4 md:p-6 hover:border-emerald-400/40 transition-all duration-300 hover:shadow-emerald-500/20 hover:shadow-lg"
                        whileHover={{ scale: 1.02, y: -5 }}
                      >
                        <div className="flex flex-col md:flex-row items-center md:justify-between mb-4 text-center md:text-left">
                          <div className="mb-4 md:mb-0">
                            <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">
                              {item.title}
                            </h3>
                            <div className="flex items-center justify-center md:justify-start space-x-2 mb-2 md:mb-0">
                              <span className="text-emerald-400 font-semibold text-sm md:text-base">
                                {item.phase}
                              </span>
                            </div>
                          </div>
                          <div className="relative mb-4 md:mb-6 flex justify-center items-center w-20 h-20 md:w-28 md:h-28">
                            {/* Rotating Line Animation */}
                            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-400 border-r-emerald-300 animate-spin-slow"></div>
                            <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-green-400 border-l-green-300 animate-spin-slow-reverse"></div>

                            {/* Main Avatar Container */}
                            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-emerald-400 to-green-400 p-1 animate-pulse-glow">
                              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                                <img
                                  src={item.img}
                                  alt={item.title}
                                  className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover"
                                />
                              </div>
                            </div>

                            {/* Additional Rotating Elements */}
                            <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-spin-slow"></div>
                          </div>
                        </div>

                        <p className="text-sm md:text-base text-emerald-100/80 mb-3 md:mb-4">
                          {item.description}
                        </p>

                        <div className="space-y-2">
                          {item.features.map((feature, featureIndex) => (
                            <div
                              key={featureIndex}
                              className="flex items-start text-xs md:text-sm text-emerald-100/70"
                            >
                              <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-emerald-400 rounded-full mr-2 md:mr-3 mt-1.5 md:mt-0 flex-shrink-0"></div>
                              <span className="leading-relaxed">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            className="mb-12 md:mb-16 px-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6 animate-gradient-shift"
              whileHover={{ scale: 1.02 }}
            >
              Seamless
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600"
                animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {" "}
                integrations
              </motion.span>
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl text-white/50 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Connect SprintiQ with your favorite tools and platforms for a
              unified workflow experience. No more context switching.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { name: "ClickUp", icon: <ClickUpSvg /> },
              { name: "Jira", icon: <JiraSvg /> },
              { name: "Asana", icon: <AsanaSvg /> },
              { name: "Trello", icon: <TrelloSvg /> },
              { name: "Monday.com", icon: <MondaySvg /> },
              { name: "Airtable", icon: <AirtableSvg /> },
            ].map((tool, index) => (
              <motion.div
                key={tool.name}
                variants={cardVariant}
                whileHover={{ scale: 1.1, y: -10 }}
                className="group bg-transparent backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-500/20 hover:border-emerald-400/40 animate-bounce-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <motion.div
                  className="h-12 w-12 mx-auto rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 animate-float"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {tool.icon}
                </motion.div>
                <motion.h3
                  className="font-semibold text-white text-sm group-hover:text-emerald-300 transition-colors duration-200"
                  whileHover={{ y: -2 }}
                >
                  {tool.name}
                </motion.h3>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <motion.p
              className="text-white/50 mb-6"
              whileHover={{ color: "#ffffff80" }}
            >
              100+ integrations available for professionals
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6 animate-gradient-shift"
              whileHover={{ scale: 1.02 }}
            >
              Discover the Future of
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600"
                animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {" "}
                Agile Planning
              </motion.span>
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { number: "75%", label: "Time Saved on Planning " },
              { number: "5x", label: "Faster Backlog Creation" },
              { number: "99.9%", label: "Uptime" },
              { number: "24/7", label: "Support" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center animate-bounce-in bg-white/5 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10 hover:border-emerald-500/30 transition-all duration-300"
                style={{ animationDelay: `${index * 0.2}s` }}
                variants={cardVariant}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <motion.div
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-3 animate-float"
                  style={{ animationDelay: `${index * 0.3}s` }}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    delay: index * 0.1 + 0.5,
                  }}
                >
                  {stat.number}
                </motion.div>
                <motion.div
                  className="text-xs sm:text-sm md:text-base text-white/50 font-medium leading-tight"
                  whileHover={{ color: "#ffffff80" }}
                >
                  {stat.label}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            className="bg-gradient-to-br from-emerald-600 to-green-600 rounded-3xl p-8 md:p-12 lg:p-16 text-white relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"
              animate={{
                background: [
                  "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
                  "linear-gradient(225deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
                  "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
                ],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <div className="relative z-10">
              <motion.h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 animate-gradient-shift"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Ready to transform your workflow?
              </motion.h2>
              <motion.p
                className="text-lg md:text-xl mb-6 md:mb-8 text-emerald-50 max-w-2xl mx-auto px-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                Be among the first to experience AI-native agile planning with
                intelligent user story creation, automatic acceptance criteria,
                and persona-based customization.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
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
                      <Button className="bg-white text-emerald-600 hover:bg-gray-50 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-glow">
                        Request Early Access
                        <motion.div
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                        </motion.div>
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
                <motion.div variants={cardVariant}>
                  <Link href="/contact">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        className="bg-transparent border-2 border-white hover:border-white text-white hover:bg-white/10 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-2xl transition-all duration-300 animate-shimmer"
                      >
                        Contact Us
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
      <ScrollToTop isMenuOpen={isMenuOpen} />
    </div>
  );
}
