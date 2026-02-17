"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LoadingLink } from "@/components/ui/loading-link";
import {
  HelpCircle,
  MessageCircle,
  Search,
  Sparkles,
  Shield,
  Target,
  Link,
  DollarSign,
  Wrench,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/landing/layout/navbar";
import Footer from "@/components/landing/layout/footer";
import ScrollToTop from "@/components/ui/scroll-to-top";

const faqData = [
  {
    category: "Getting Started",
    icon: <Target className="h-5 w-5" />,
    questions: [
      {
        question: "What is SprintiQ.ai?",
        answer:
          "<a href='https://www.sprintiq.ai' target='_blank' rel='noopener noreferrer' class='text-emerald-400 hover:text-emerald-300'><u><b>SprintiQ.ai</b></u></a> is an AI-native agile planning and story generation platform that helps agile teams create user stories, prioritize backlogs, and plan sprints more efficiently. Using advanced AI technology, we transform manual planning processes into intelligent, automated workflows that save time and improve story quality.",
      },
      {
        question: "How do I get started with SprintiQ.ai?",
        answer:
          "Getting started is easy: <br/>" +
          "<ul class='list-disc list-inside'><li> Sign up for a free account on our website</li>" +
          "<li> Create your first project and define user personas</li>" +
          "<li> Input your project requirements</li>" +
          "<li> Let our AI generate comprehensive user stories</li>" +
          "<li> Review, edit, and prioritize your backlog</li>" +
          "<li> Connect with your favorite project management tools</li></ul>" +
          "Our guided onboarding process will walk you through each step.",
      },
      {
        question: "Do I need any technical knowledge to use SprintiQ.ai?",
        answer:
          "No technical expertise required! SprintiQ.ai is designed for product managers, scrum masters, and development teams of all skill levels. Our intuitive interface and AI-Native features make it easy for anyone to create professional user stories and manage sprints effectively.",
      },
    ],
  },
  {
    category: "AI Features",
    icon: <Sparkles className="h-5 w-5" />,
    questions: [
      {
        question: "How does AI story generation work?",
        answer:
          "Our AI uses advanced language models to analyze your project requirements and user personas, then generates comprehensive user stories in the standard 'As a [user], I want [goal], so that [benefit]' format. The AI considers:<br/>" +
          "<ul class='list-disc list-inside'><li> Project context and requirements </li>" +
          "<li> User personas and tech-savviness levels </li>" +
          "<li> Industry best practices </li>" +
          "<li> Acceptance criteria suggestions </li>" +
          "<li> Story dependencies and relationships </li></ul>" +
          "You can always edit and refine the generated stories to match your specific needs.",
      },
      {
        question: "How accurate are AI-generated stories?",
        answer:
          "Our AI generates high-quality stories based on industry best practices and your specific inputs. However, we always recommend human review and validation. The AI provides a strong starting point that typically saves 75% of the time compared to manual story creation, while you maintain full control over final content.<br/><br/> " +
          "<b>Best Practice:</b> Use AI-generated stories as a foundation and customize them based on your team's specific needs and domain expertise.",
      },
      {
        question: "What is Intelligent prioritizations?",
        answer:
          "Our intelligent prioritization system automatically scores and ranks your user stories based on five key criteria:<br/>" +
          "<ul class='list-disc list-inside'><li> Business Value (30%): Impact on business goals </li>" +
          "<li> User Impact (25%): Effect on user experience </li>" +
          "<li> Complexity (20%): Development effort required </li>" +
          "<li> Risk (15%): Technical and business risks </li>" +
          "<li> Dependencies (10%): Prerequisite relationships </li></ul>" +
          "You can adjust these weights to match your team's priorities and methodology.",
      },
    ],
  },
  {
    category: "Integrations",
    icon: <Link className="h-5 w-5" />,
    questions: [
      {
        question: "Which Platforms does SprintiQ.ai integrate with?",
        answer:
          "SprintiQ.ai integrates with all major project management platforms:<br/>" +
          "<ul class='list-disc list-inside'><li> Jira (Atlassian) </li>" +
          "<li> Azure DevOps (Microsoft) </li>" +
          "<li> Linear </li>" +
          "<li> Asana </li>" +
          "<li> GitHub Issues </li>" +
          "<li> ClickUp </li>" +
          "<li> Trello </li>" +
          "<li> Monday.com </li></ul>" +
          "We're continuously adding new integrations based on user feedback.",
      },
      {
        question: "How do I connect my existing project management tool?",
        answer:
          "Connecting your PM tool is simple:<br/>" +
          "<ul class='list-disc list-inside'><li> Go to the 'API Sync' tab in your project </li>" +
          "<li> Select your platform and enter your API credentials </li>" +
          "<li> Test the connection to ensure it's working </li>" +
          "<li> Choose which stories to sync </li>" +
          "<li> Click 'Sync Stories' to push your data </li></ul><br/>" +
          "<b>Security Note:</b> All API credentials are encrypted and stored securely. You can disconnect integrations at any time.",
      },
      {
        question: "Can I sync data both ways (import and export)?",
        answer:
          "Currently, SprintiQ.ai focuses on exporting your generated stories to connected platforms. We're working on bi-directional sync capabilities that will allow you to import existing stories for AI enhancement and analysis. This feature is planned for a future release.",
      },
    ],
  },
  {
    category: "Pricing & Plans",
    icon: <DollarSign className="h-5 w-5" />,
    questions: [
      {
        question: "What are the different pricing tiers?",
        answer:
          "We offer four <a href='https://www.sprintiq.ai/pricing' target='_blank' rel='noopener noreferrer' class='text-emerald-400 hover:text-emerald-300'><u>pricing</u></a> tiers to fit teams of all sizes:<br/>" +
          "<ul class='list-disc list-inside'><li> Free: $0 - 50 stories/month, basic features </li>" +
          "<li> Starter: $19/user/month - 500 stories/month, integrations </li>" +
          "<li> Professional: $49/user/month - Unlimited stories, advanced AI </li>" +
          "<li> Enterprise: $99/user/month - Custom features, SSO, dedicated support </li></ul>" +
          "All paid plans include a 30-day free trial with no credit card required.",
      },
      {
        question: "Can I change my plan later?",
        answer:
          "Yes! You can upgrade or downgrade your plan at any time. Upgrades take effect immediately, while downgrades take effect at the end of your current billing cycle. When downgrading, you'll retain access to premium features until the end of your paid period.",
      },
      {
        question: "Do you offer annual discounts?",
        answer:
          "Yes! Annual subscriptions receive a 20% discount compared to monthly billing. You can switch to annual billing from your account settings at any time, and we'll prorate your current monthly subscription.",
      },
    ],
  },
  {
    category: "Security & Privacy",
    icon: <Shield className="h-5 w-5" />,
    questions: [
      {
        question: "How secure is my data?",
        answer:
          "We take security seriously and implement industry-standard protections: <br/>" +
          "<ul class='list-disc list-inside'><li> AES-256 encryption for data at rest and in transit </li>" +
          "<li> Regular security audits and penetration testing </li>" +
          "<li> Multi-factor authentication options </li>" +
          "<li> SOC 2 Type II compliance (in progress) </li>" +
          "<li> GDPR and CCPA compliance </li>" +
          "<li> Regular security training for all employees </li></ul>" +
          "Your project data is never shared with other users or used for training AI models that serve other customers.",
      },
      {
        question: "Is my data used to train AI models?",
        answer:
          "We only use aggregated and anonymized data to improve our AI models. Your specific project information, user stories, and personal data are never used to train models that serve other customers. You can opt out of contributing anonymized data to model improvement in your privacy settings.<br/><br/>" +
          "<b>Privacy First:</b> All personal identifiers and sensitive project details are excluded from any training data.",
      },
      {
        question: "Can I delete my data?",
        answer:
          "Absolutely! You have complete control over your data: <br/>" +
          "<ul class='list-disc list-inside'><li> Export all your data at any time in JSON or CSV format </li>" +
          "<li> Delete individual projects or stories </li>" +
          "<li> Request complete account deletion </li>" +
          "<li> Data is permanently deleted within 30 days of account closure </li></ul>" +
          "Contact our support team if you need assistance with data deletion requests.",
      },
    ],
  },
  {
    category: "Troubleshooting",
    icon: <Wrench className="h-5 w-5" />,
    questions: [
      {
        question: "Why is AI story generation taking a long time?",
        answer:
          "AI story generation typically takes 10-30 seconds. Longer delays might be due to:<br/>" +
          "<ul class='list-disc list-inside'><li> High server load during peak hours </li>" +
          "<li> Complex requirements requiring more processing </li>" +
          "<li> Temporary AI service maintenance </li></ul>" +
          "If generation takes longer than 2 minutes, try refreshing and generating again. Contact our <a href='https://www.sprintiq.ai/contact' target='_blank' rel='noopener noreferrer' class='text-emerald-400 hover:text-emerald-300'><u>support team</u></a> if the issue persists.",
      },
      {
        question: "My integration isn't connecting, what should I do?",
        answer:
          "Common integration issues and solutions:<br/>" +
          "<ul class='list-disc list-inside'><li> Invalid credentials: Double-check your API tokens and permissions </li>" +
          "<li> Expired tokens: Regenerate your API credentials in your PM platform </li>" +
          "<li> Network issues: Try disconnecting and reconnecting </li>" +
          "<li> Platform maintenance: Check if your PM platform is experiencing downtime </li></ul>" +
          "Use the 'Test Connection' button to diagnose issues. Our <a href='https://www.sprintiq.ai/contact' target='_blank' rel='noopener noreferrer' class='text-emerald-400 hover:text-emerald-300'><u>support team</u></a> can help with platform-specific setup.",
      },
      {
        question:
          "I'm not seeing the AI suggestions I expect. How can I improve them?",
        answer:
          "To get better AI suggestions:<br/>" +
          "<ul class='list-disc list-inside'><li> Be specific: Provide detailed project requirements and context </li>" +
          "<li> Define user personas: Clear personas help AI understand your users </li>" +
          "<li> Use examples: Include sample stories or acceptance criteria </li>" +
          "<li> Iterate: Regenerate stories with refined inputs </li>" +
          "<li> Provide feedback: Use the thumbs up/down to improve future suggestions </li></ul>" +
          "Remember that AI suggestions are a starting point - always review and customize for your specific needs.",
      },
    ],
  },
];

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariant = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const filteredFaqData = faqData
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 overflow-y-auto custom-scrollbar">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* Mobile Quick Navigation - Visible only on Mobile */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
        <motion.div
          className="bg-white/10 backdrop-blur-xl border border-emerald-500/20 rounded-2xl shadow-2xl shadow-emerald-500/20 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="p-4 max-h-32 overflow-x-auto">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {faqData.map((category, index) => (
                <motion.button
                  key={category.category}
                  onClick={() => {
                    const element = document.querySelector(
                      `[data-category="${category.category}"]`
                    );
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg transition-all duration-200 text-xs font-medium ${
                    index === 0
                      ? "bg-emerald-500/30 text-emerald-200 border border-emerald-500/40"
                      : "bg-white/5 text-emerald-100/80 hover:bg-emerald-500/20 hover:text-emerald-200"
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  {category.category.split(" ")[0]}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-32 pb-12 sm:pb-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 text-emerald-300 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8 animate-pulse-glow"
            >
              <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Frequently Asked Questions
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight px-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-white via-emerald-100 to-emerald-300 bg-clip-text text-transparent">
                Frequently Asked
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-green-400 bg-clip-text text-transparent">
                Questions
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-emerald-100/90 max-w-4xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Find answers to common questions about SprintiQ's AI-Native
              project management platform
            </motion.p>

            {/* Search Bar */}
            <motion.div
              className="max-w-lg mx-auto relative group px-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative flex items-center">
                <Search className="absolute left-4 h-4 w-4 sm:h-5 sm:w-5 text-emerald-400 z-10" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/10 backdrop-blur-xl border border-emerald-500/30 rounded-2xl text-white placeholder-emerald-300/70 focus:outline-none focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 text-base sm:text-lg"
                />
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mt-8 sm:mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-emerald-400">
                  21
                </div>
                <div className="text-xs sm:text-sm text-emerald-200/70">
                  Questions
                </div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-emerald-500/30"></div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-emerald-400">
                  7
                </div>
                <div className="text-xs sm:text-sm text-emerald-200/70">
                  Categories
                </div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-emerald-500/30"></div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-emerald-400">
                  24/7
                </div>
                <div className="text-xs sm:text-sm text-emerald-200/70">
                  Support
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* FAQ Content */}
      <section className="relative py-12 sm:py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {filteredFaqData.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                data-category={category.category}
                variants={cardVariant}
                className="mb-12 sm:mb-16"
              >
                {/* Category Header */}
                <motion.div
                  className="flex flex-col sm:flex-row items-start sm:items-center mb-6 sm:mb-8"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                >
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl border border-emerald-500/30 mr-3 sm:mr-4 mb-3 sm:mb-0">
                    <div className="text-emerald-400 flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6">
                      {category.icon}
                    </div>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                    {category.category}
                  </h2>
                </motion.div>

                {/* FAQ Cards */}
                <Card className="bg-white/5 backdrop-blur-xl border border-emerald-500/20 shadow-2xl shadow-emerald-500/10 overflow-hidden">
                  <CardContent className="p-0">
                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((item, index) => (
                        <AccordionItem
                          key={index}
                          value={`item-${categoryIndex}-${index}`}
                          className="border-b border-emerald-500/10 last:border-b-0 group"
                        >
                          <AccordionTrigger className="px-4 sm:px-8 py-4 sm:py-6 text-left text-white hover:text-emerald-300 hover:no-underline group-hover:bg-emerald-500/5 transition-all duration-300">
                            <div className="flex items-start space-x-3 sm:space-x-4">
                              <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500/20 rounded-full flex items-center justify-center mt-1">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full"></div>
                              </div>
                              <span className="font-semibold text-base sm:text-lg leading-relaxed">
                                {item.question}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 sm:px-8 pb-4 sm:pb-6">
                            <div className="pl-6 sm:pl-10">
                              <div className="bg-emerald-500/5 rounded-xl p-4 sm:p-6 border border-emerald-500/10">
                                <div
                                  className="text-emerald-100/90 leading-relaxed text-sm sm:text-base"
                                  dangerouslySetInnerHTML={{
                                    __html: item.answer,
                                  }}
                                />
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* No Results */}
          {filteredFaqData.length === 0 && searchTerm && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 sm:py-20 px-4"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-2xl mb-4 sm:mb-6 border border-emerald-500/30">
                <HelpCircle className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                No questions found
              </h3>
              <p className="text-emerald-100/80 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
                Try searching with different keywords or contact our support
                team for personalized help.
              </p>
              <LoadingLink
                href="/contact"
                loadingMessage="Loading contact page..."
              >
                <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg rounded-xl shadow-lg shadow-emerald-500/25">
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Contact Support
                </Button>
              </LoadingLink>
            </motion.div>
          )}
        </div>
      </section>
      {/* CTA Section */}
      <section className="pb-16 md:pb-24 px-4 sm:px-6 lg:px-8">
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
                  <LoadingLink href="/signup">
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
                  </LoadingLink>
                </motion.div>
                <motion.div variants={cardVariant}>
                  <LoadingLink href="/contact">
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
                  </LoadingLink>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
