"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle,
  XCircle,
  Zap,
  Users,
  Target,
  Clock,
  TrendingUp,
  Star,
  Award,
  Shield,
  Globe,
} from "lucide-react";
import ScrollToTop from "@/components/ui/scroll-to-top";
import Navbar from "@/components/landing/layout/navbar";
import Footer from "@/components/landing/layout/footer";

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

export default function SprintiQvsJiraPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const comparisonData = [
    {
      feature: "AI-Native User Story Generation",
      sprintiq: true,
      jira: false,
      description:
        "Automatically generate well-formed user stories with acceptance criteria",
    },
    {
      feature: "Intelligent Sprint Forecasting",
      sprintiq: true,
      jira: false,
      description:
        "Predict sprint capacity based on historical data and team availability",
    },
    {
      feature: "Automated Story Point Estimation",
      sprintiq: true,
      jira: false,
      description: "AI-driven story point estimation for accurate planning",
    },
    {
      feature: "Real-time Team Collaboration",
      sprintiq: true,
      jira: true,
      description: "Live collaboration features for team coordination",
    },
    {
      feature: "Customizable Workflows",
      sprintiq: true,
      jira: true,
      description: "Flexible workflow customization options",
    },
    {
      feature: "Integrations (Slack, GitHub, etc.)",
      sprintiq: true,
      jira: true,
      description: "Third-party integrations for seamless workflows",
    },
    {
      feature: "Ease of Use / Intuitive UI",
      sprintiq: true,
      jira: false,
      description: "Modern, intuitive interface designed for productivity",
    },
    {
      feature: "Pricing Model",
      sprintiq: "Free Early Access",
      jira: "Tiered (Paid)",
      description: "Cost-effective pricing for teams of all sizes",
    },
  ];

  const advantages = [
    {
      icon: <Zap className="w-6 h-6 text-white" />,
      title: "AI-Native Approach",
      description:
        "Unlike Jira, which has bolted on AI features, SprintiQ is designed from the ground up with AI at its core.",
    },
    {
      icon: <Users className="w-6 h-6 text-white" />,
      title: "Focus on Productivity",
      description:
        "We eliminate busywork, allowing your team to focus on creativity and delivering value.",
    },
    {
      icon: <Target className="w-6 h-6 text-white" />,
      title: "Simplicity & Power",
      description:
        "Get powerful features without the overwhelming complexity often found in traditional tools.",
    },
    {
      icon: <Clock className="w-6 h-6 text-white" />,
      title: "Faster Onboarding",
      description:
        "Get your team up and running quickly with an intuitive interface and AI assistance.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.2, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
          <motion.div
            className="absolute top-40 left-40 w-60 h-60 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>

        <div className="relative container mx-auto px-4 pt-16 z-10">
          <div className="max-w-6xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-6 py-3 bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium mb-8 animate-pulse-glow"
            >
              <Star className="w-4 h-4 mr-2" />
              AI-Native vs Traditional
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.span
                className="bg-gradient-to-r from-white via-emerald-100 to-emerald-200 bg-clip-text text-transparent animate-gradient-shift"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                SprintiQ
              </motion.span>
              <br />
              <motion.span
                className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent animate-gradient-shift"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                vs Jira
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl text-emerald-100/90 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Discover why SprintiQ's AI-native agile planning is the modern
              alternative to traditional Jira workflows.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div variants={cardVariant}>
                <Link href="/signup">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 group animate-pulse-glow">
                      Try SprintiQ Free
                      <motion.div
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </motion.div>
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
              <motion.div variants={cardVariant}>
                <Link href="/sprint-planning-guide">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm"
                    >
                      Learn Sprint Planning
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Feature{" "}
              <span className="text-emerald-400 animate-gradient-shift">
                Comparison
              </span>
            </h2>
            <p className="text-xl text-emerald-100/90 max-w-3xl mx-auto">
              See how SprintiQ's AI-Native approach compares to traditional Jira
              workflows
            </p>
          </motion.div>

          <motion.div
            className="max-w-6xl mx-auto bg-white/10 backdrop-blur-xl border border-emerald-500/20 rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-300">
                <thead className="bg-white/5 border-b border-emerald-500/20">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-lg font-semibold text-white"
                    >
                      Feature
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-lg font-semibold text-white text-center"
                    >
                      SprintiQ
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-lg font-semibold text-white text-center"
                    >
                      Jira
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((item, index) => (
                    <motion.tr
                      key={index}
                      className={`border-b border-emerald-500/10 ${
                        index % 2 === 0 ? "bg-white/5" : ""
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{
                        backgroundColor: "rgba(16, 185, 129, 0.05)",
                      }}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-white">
                            {item.feature}
                          </div>
                          <div className="text-sm text-emerald-200/70 mt-1">
                            {item.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {typeof item.sprintiq === "boolean" ? (
                          item.sprintiq ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              whileInView={{ scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ type: "spring", stiffness: 200 }}
                            >
                              <CheckCircle className="h-6 w-6 mx-auto text-emerald-400" />
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ scale: 0 }}
                              whileInView={{ scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ type: "spring", stiffness: 200 }}
                            >
                              <XCircle className="h-6 w-6 mx-auto text-red-400" />
                            </motion.div>
                          )
                        ) : (
                          <span className="text-emerald-400 font-medium">
                            {item.sprintiq}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {typeof item.jira === "boolean" ? (
                          item.jira ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              whileInView={{ scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ type: "spring", stiffness: 200 }}
                            >
                              <CheckCircle className="h-6 w-6 mx-auto text-emerald-400" />
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ scale: 0 }}
                              whileInView={{ scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ type: "spring", stiffness: 200 }}
                            >
                              <XCircle className="h-6 w-6 mx-auto text-red-400" />
                            </motion.div>
                          )
                        ) : (
                          <span className="text-gray-400">{item.jira}</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose SprintiQ? */}
      <section className="py-24 px-4 bg-white/5 backdrop-blur-xl">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose{" "}
              <span className="text-emerald-400 animate-gradient-shift">
                SprintiQ
              </span>
              ?
            </h2>
            <p className="text-xl text-emerald-100/90 max-w-3xl mx-auto">
              SprintiQ is built for the modern agile team, focusing on
              efficiency, intelligence, and user experience.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {advantages.map((advantage, index) => (
              <motion.div key={index} variants={cardVariant}>
                <Card className="group p-8 hover:shadow-2xl h-full transition-all duration-500 border-0 bg-white/10 backdrop-blur-xl cursor-pointer relative overflow-hidden border border-emerald-500/20 hover:border-emerald-400/40 animate-fade-in-up">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <CardContent className="p-0 relative z-10 text-center">
                      <motion.div
                        className="w-16 h-16 p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center mb-6 mx-auto animate-pulse-glow"
                        whileHover={{
                          scale: 1.2,
                          rotate: 360,
                          boxShadow: "0 0 30px rgba(16, 185, 129, 0.6)",
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        {advantage.icon}
                      </motion.div>
                      <motion.h3
                        className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors"
                        whileHover={{ scale: 1.05 }}
                      >
                        {advantage.title}
                      </motion.h3>
                      <p className="text-emerald-100/80 leading-relaxed">
                        {advantage.description}
                      </p>
                    </CardContent>
                  </motion.div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <motion.div
          className="relative container mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-5xl md:text-6xl font-bold text-white mb-8 animate-gradient-shift"
            whileHover={{ scale: 1.02 }}
          >
            Ready to Experience the SprintiQ Difference?
          </motion.h2>
          <motion.p
            className="text-xl text-emerald-100 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Join thousands of agile teams who have already revolutionized their
            development process.
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
                  <Button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 group animate-pulse-glow">
                    Start Your Free Trial
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <ArrowRight className="ml-2 h-5 w-5" />
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
  );
}
