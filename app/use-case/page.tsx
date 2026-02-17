"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/landing/layout/navbar";
import Footer from "@/components/landing/layout/footer";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Users,
  Target,
  Clock,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Globe,
  Star,
  Menu,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AiBrainSvg } from "@/components/svg/AiBrainSvg";
import { InventiveSvg } from "@/components/svg/InventiveSvg";
import { DataAnalyticsSvg } from "@/components/svg/DataAnalyticsSvg";
import { RocketSvg } from "@/components/svg/RocketSvg";
import { AgileSvg } from "@/components/svg/AgileSvg";
import { GearSvg } from "@/components/svg/GearSvg";
import { WebSvg } from "@/components/svg/WebSvg";
import { TeamSvg } from "@/components/svg/TeamSvg";
import ScrollToTop from "@/components/ui/scroll-to-top";
import { BarChartDollarSvg } from "@/components/svg/BarChartDollarSvg";
import { IndividualSvg } from "@/components/svg/IndividualSvg";
import { ScrollArea } from "@/components/ui/scroll-area";

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

export default function UseCasePage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const useCases = [
    {
      id: "overwhelmed-product-managers",
      icon: <AiBrainSvg color="#fff" />,
      title: "Overwhelmed Product Managers",
      description:
        "Stop wasting 50% of your time writing user stories. SprintiQ's patent-pending AI algorithms analyze your historical data to generate accurate, detailed stories in minutes, not hours, eliminating planning debt.",
      image:
        "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/use-case/stress-product.jpg",
      benefits: [
        "87% more accurate story point estimation using patent-pending algorithms",
        "Generate 5 user stories in the time it takes to write 1",
        "Automated acceptance criteria that actually make sense",
        "Predict sprint velocity with 94% accuracy",
        "Eliminate planning debt with AI-Native backlog management",
      ],
      stats: {
        timeSaved: "75%",
        efficiency: "5x faster",
        accuracy: "87%",
      },
      painPoint:
        "Tired of spending entire afternoons writing user stories and accumulating planning debt?",
      solution:
        "AI generates professional stories in 2 minutes using your team's historical data.",
    },
    {
      id: "frustrated-development-teams",
      icon: <WebSvg color="#fff" />,
      title: "Frustrated Development Teams",
      description:
        "End the guessing game of story points. SprintiQ's patent-pending AI algorithms learn from your team's actual performance to provide accurate estimates that reflect reality and prevent planning debt.",
      image:
        "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/use-case/frustrated-development-teams.jpg",
      benefits: [
        "Story point accuracy improved by 89% using patent-pending algorithms",
        "Automated dependency detection prevents 73% of blockers",
        "Clear task breakdowns eliminate scope creep",
        "Real-time progress tracking with predictive analytics",
        "Reduce planning debt with intelligent sprint optimization",
      ],
      stats: {
        timeSaved: "60%",
        efficiency: "3x faster",
        accuracy: "89%",
      },
      painPoint:
        "Sick of inaccurate story points that derail your sprints and create planning debt?",
      solution:
        "AI estimates based on your team's actual velocity and complexity patterns.",
    },
    {
      id: "dual-scrum-master-dev",
      icon: <AgileSvg color="#fff" />,
      title: "Dual Scrum Master & Dev",
      description:
        "Transform chaotic sprint planning into smooth, data-driven ceremonies. SprintiQ's patent-pending algorithms eliminate the stress of manual planning with intelligent automation and prevent planning debt accumulation.",
      image:
        "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/use-case/overwhelmed-scrum-masters.jpg",
      benefits: [
        "Automated sprint planning reduces meeting time by 80%",
        "AI identifies risks before they become problems",
        "Team capacity optimization prevents overcommitment",
        "Ceremony automation keeps teams focused on delivery",
        "Eliminate planning debt with patent-pending optimization algorithms",
      ],
      stats: {
        timeSaved: "80%",
        efficiency: "4x faster",
        accuracy: "98%",
      },
      painPoint:
        "Exhausted from endless sprint planning meetings that create planning debt?",
      solution: "AI handles the planning while you focus on team success.",
    },
    {
      id: "enterprise-teams",
      icon: <DataAnalyticsSvg color="#fff" />,
      title: "Enterprise Teams Drowning in Complexity",
      description:
        "Scale agile practices without the chaos. SprintiQ's patent-pending enterprise algorithms provide the structure and insights large teams need to succeed while eliminating planning debt.",
      image:
        "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/use-case/drowning%20-complexity-teams.jpg",
      benefits: [
        "Multi-team coordination with intelligent dependency mapping",
        "Enterprise-grade security with SOC 2 compliance",
        "Advanced analytics reveal hidden bottlenecks",
        "Custom workflows adapt to your organization's needs",
        "Patent-pending algorithms eliminate enterprise planning debt",
      ],
      stats: {
        timeSaved: "70%",
        efficiency: "6x faster",
        accuracy: "99.9%",
      },
      painPoint:
        "Struggling to coordinate multiple teams and projects while accumulating planning debt?",
      solution:
        "AI orchestrates complex workflows while maintaining visibility and control.",
    },
    {
      id: "lost-startups",
      icon: <InventiveSvg color="#fff" />,
      title: "Lost Startups Without Direction",
      description:
        "Nearby startups are at a loss as to what to do and how to proceed. SprintiQ's patent-pending algorithms provide the roadmap and structure they desperately need to turn chaos into clarity while preventing planning debt.",
      image:
        "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/use-case/lost-startup.jpg",
      benefits: [
        "AI creates clear product roadmaps from scattered ideas",
        "Automated prioritization based on market impact data",
        "Step-by-step sprint planning for first-time founders",
        "Real-time progress tracking keeps teams motivated",
        "Patent-pending algorithms prevent planning debt from day one",
      ],
      stats: {
        timeSaved: "85%",
        efficiency: "10x faster",
        accuracy: "92%",
      },
      painPoint:
        "Don't know where to start or how to prioritize your product without creating planning debt?",
      solution: "AI creates your first sprint plan in minutes, not weeks.",
    },
    {
      id: "skill-mismatches",
      icon: <TeamSvg color="#fff" />,
      title: "Teams with Skill Mismatches",
      description:
        "Development is delayed due to various factors, such as skill mismatches and capabilities in the development team composition. SprintiQ's patent-pending algorithms bridge the gap with intelligent task allocation and prevent planning debt.",
      image:
        "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/use-case/teams-skill-missmatch.jpg",
      benefits: [
        "AI matches tasks to team member capabilities automatically",
        "Skill gap analysis identifies training needs",
        "Balanced workload distribution prevents burnout",
        "Cross-training recommendations improve team resilience",
        "Patent-pending algorithms reduce planning debt through smart allocation",
      ],
      stats: {
        timeSaved: "65%",
        efficiency: "4x faster",
        accuracy: "91%",
      },
      painPoint:
        "Team members struggling with tasks beyond their skills and creating planning debt?",
      solution:
        "AI assigns work based on actual capabilities and growth potential.",
    },
    {
      id: "beginners",
      icon: <RocketSvg color="#fff" />,
      title: "Beginners Turning Ideas into Reality",
      description:
        "Even beginners can turn an idea into reality – ideas become reality. SprintiQ's patent-pending algorithms democratize product development with AI-guided planning that makes complex projects accessible while preventing planning debt.",
      image:
        "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/use-case/idea.jpg",
      benefits: [
        "AI breaks down complex ideas into simple, actionable tasks",
        "Guided sprint planning for first-time developers",
        "Automated best practices prevent common mistakes",
        "Progress tracking keeps beginners motivated and on track",
        "Patent-pending algorithms eliminate planning debt for beginners",
      ],
      stats: {
        timeSaved: "90%",
        efficiency: "15x faster",
        accuracy: "88%",
      },
      painPoint:
        "Have an idea but don't know how to start building it without accumulating planning debt?",
      solution:
        "AI transforms your vision into a step-by-step development plan.",
    },
    {
      id: "scope-creep",
      icon: <GearSvg color="#fff" />,
      title: "Teams Struggling with Scope Creep",
      description:
        "Projects that never seem to end due to constantly changing requirements. SprintiQ's patent-pending AI algorithms help maintain focus and prevent scope creep through intelligent planning while eliminating planning debt.",
      image:
        "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/use-case/scope-creep.jpg",
      benefits: [
        "AI identifies scope creep before it derails projects",
        "Automated change impact analysis",
        "Smart requirement prioritization keeps focus",
        "Real-time progress alerts prevent delays",
        "Patent-pending algorithms prevent planning debt accumulation",
      ],
      stats: {
        timeSaved: "70%",
        efficiency: "5x faster",
        accuracy: "95%",
      },
      painPoint:
        "Projects that keep growing beyond the original scope and creating planning debt?",
      solution:
        "AI maintains project boundaries while adapting to necessary changes.",
    },
    {
      id: "individual-contributor-scrum-master",
      icon: <IndividualSvg color="#fff" />,
      title: "Individual Contributor Dev Scrum Masters",
      description:
        "Leading development teams while maintaining 50% coding capacity. SprintiQ's patent-pending algorithms automate administrative overhead so you can focus on both coding and team leadership without accumulating planning debt.",
      image:
        "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/use-case/individual-contributor-scrum-master.jpg",
      benefits: [
        "Git integration automatically links stories to commits",
        "Code-aware metrics track technical debt and test coverage",
        "Automated ceremonies with velocity forecasts",
        "Developer dashboards gamify sprint goals",
        "Patent-pending algorithms reduce administrative overhead by 70%",
      ],
      stats: {
        timeSaved: "70%",
        efficiency: "25% faster",
        accuracy: "85%",
      },
      painPoint:
        "Struggling to balance coding and team leadership while managing planning debt?",
      solution:
        "AI automates sprint management so you can code and lead effectively.",
    },
    {
      id: "technical-debt-balance",
      icon: <DataAnalyticsSvg color="#fff" />,
      title: "Technical Debt Balance Management",
      description:
        "Managing product feature requests while addressing mounting technical debt in legacy systems. SprintiQ's patent-pending algorithms provide dual-track planning with objective data for technical investment decisions.",
      image:
        "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/use-case/technical-debt-balance.jpg",
      benefits: [
        "Dual-track planning for features and technical improvements",
        "Impact analysis shows technical debt effect on velocity",
        "Executive reports with technical investment ROI",
        "Data-driven capacity planning for technical debt",
        "Patent-pending algorithms secure 30% sprint capacity for technical debt",
      ],
      stats: {
        timeSaved: "60%",
        efficiency: "30% allocation",
        accuracy: "90%",
      },
      painPoint:
        "Can't justify technical debt work to stakeholders while managing planning debt?",
      solution:
        "AI provides objective data for technical investment discussions.",
    },
    {
      id: "post-series-a-startups",
      icon: <RocketSvg color="#fff" />,
      title: "Post Series A Startups",
      description:
        "Scaling from 15 to 45 engineers while maintaining delivery velocity and code quality. SprintiQ's patent-pending algorithms coordinate multiple teams and automate investor reporting for Series B discussions.",
      image:
        "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/use-case/post-series-a-startups.jpg",
      benefits: [
        "Cross-team dependency mapping and critical path analysis",
        "Synchronized sprint planning with milestone tracking",
        "Gradual rollout with change management tracking",
        "Automated board deck generation with KPIs",
        "Patent-pending algorithms reduce coordination overhead by 50%",
      ],
      stats: {
        timeSaved: "80%",
        efficiency: "3x growth",
        accuracy: "95%",
      },
      painPoint:
        "Struggling to coordinate multiple teams and report to investors while managing planning debt?",
      solution:
        "AI orchestrates complex workflows and automates investor reporting.",
    },
    {
      id: "investor-reporting-automation",
      icon: <BarChartDollarSvg color="#fff" />,
      title: "Investor Reporting Automation",
      description:
        "Quarterly board meetings requiring comprehensive product development metrics and delivery forecasting. SprintiQ's patent-pending algorithms automate board preparation and provide data-driven confidence for Series B discussions.",
      image:
        "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/use-case/investor-reporting.jpg",
      benefits: [
        "Executive dashboards with automated board deck generation",
        "Predictive analytics based on historical velocity and backlog",
        "Risk assessment with quantified impact analysis",
        "Competitive positioning against industry benchmarks",
        "Patent-pending algorithms reduce board preparation time by 80%",
      ],
      stats: {
        timeSaved: "80%",
        efficiency: "95% confidence",
        accuracy: "90%",
      },
      painPoint:
        "Spending weeks preparing board decks while managing planning debt?",
      solution:
        "AI generates comprehensive investor reports with predictive analytics.",
    },
  ];

  const industries = [
    {
      name: "SaaS & Technology",
      icon: (
        <Image
          src="/images/tech/saas.png"
          alt="SaaS"
          width={100}
          height={100}
        />
      ),
      description: "Ship features 3x faster with AI-optimized sprint planning",
      image:
        "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/use-case/saas.jpg",
      painPoint: "Competitive pressure to ship faster",
      solution: "AI predicts delivery dates with 94% accuracy",
      metric: "3x faster delivery",
    },
    {
      name: "Financial Services",
      icon: (
        <Image
          src="/images/tech/finance.png"
          alt="SaaS"
          width={100}
          height={100}
        />
      ),
      description: "Maintain compliance while accelerating development cycles",
      image:
        "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/use-case/finance.jpg",
      painPoint: "Complex regulatory requirements slow development",
      solution: "Automated compliance tracking with audit trails",
      metric: "50% faster compliance",
    },
    {
      name: "Healthcare",
      icon: (
        <Image
          src="/images/tech/healthcare.png"
          alt="SaaS"
          width={100}
          height={100}
        />
      ),
      description:
        "Deliver patient-critical systems with zero tolerance for errors",
      image:
        "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/use-case/healthcare.jpg",
      painPoint: "Zero margin for error in patient systems",
      solution: "AI identifies risks before they impact patients",
      metric: "99.9% accuracy",
    },
    {
      name: "E-commerce",
      icon: (
        <Image
          src="/images/tech/e-commerce.png"
          alt="SaaS"
          width={100}
          height={100}
        />
      ),
      description:
        "Optimize customer experience with data-driven feature prioritization",
      image:
        "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/use-case/e-commerce.jpg",
      painPoint: "Customer expectations change faster than you can ship",
      solution: "AI prioritizes features based on customer impact data",
      metric: "2x customer satisfaction",
    },
  ];
  const [isHoverMenuOpen, setIsHoverMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("acceptance");

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block">
        <div
          className="relative"
          onMouseEnter={() => setIsHoverMenuOpen(true)}
          onMouseLeave={() => setIsHoverMenuOpen(false)}
        >
          {/* Menu Button */}
          <motion.button
            className="bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 text-emerald-300 p-3 rounded-l-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-500/30 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="h-5 w-5" />
          </motion.button>

          {/* Hover Menu */}
          <motion.div
            className="absolute right-full top-0 mr-2 bg-white/10 backdrop-blur-xl border border-emerald-500/20 rounded-xl shadow-2xl shadow-emerald-500/20 overflow-hidden"
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{
              opacity: isHoverMenuOpen ? 1 : 0,
              x: isHoverMenuOpen ? 0 : 20,
              scale: isHoverMenuOpen ? 1 : 0.95,
            }}
            transition={{ duration: 0.2 }}
            style={{ pointerEvents: isHoverMenuOpen ? "auto" : "none" }}
          >
            <ScrollArea className="p-3 space-y-1 h-[300px]">
              <h3 className="text-emerald-300 font-bold text-sm mb-3 px-2">
                Use Case Sections
              </h3>
              {useCases.map((section, index) => (
                <motion.button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                    activeSection === section.id
                      ? "bg-emerald-500/30 text-emerald-200 border border-emerald-500/40"
                      : "text-emerald-100/80 hover:bg-emerald-500/20 hover:text-emerald-200"
                  }`}
                  whileHover={{ x: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-emerald-400/70 w-6">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="truncate">
                      {section.title.split(". ")[1] || section.title}
                    </span>
                  </div>
                </motion.button>
              ))}
            </ScrollArea>
          </motion.div>
        </div>
      </div>
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
      <section className="pt-20 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 text-emerald-300 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8 animate-pulse-glow"
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Real-World Applications
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight animate-gradient-shift"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
          >
            Use Cases for
            <motion.span
              className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-500 to-teal-600"
              animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {" "}
              every team
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-base sm:text-xl text-white/50 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Tired of endless sprint planning meetings? Stressed by inaccurate
            story points? SprintiQ eliminates the chaos of traditional Scrum
            with AI-Native precision.
            <br />
            <motion.span
              className="text-emerald-600 font-medium"
              whileHover={{ color: "#10b981" }}
            >
              Turn your project management stress into success with data-driven
              accuracy.
            </motion.span>
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div variants={cardVariant} className="w-full sm:w-auto">
              <Link href="/signup">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto"
                >
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group animate-pulse-glow">
                    Start Your Journey
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </motion.div>
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mobile Table of Contents */}
      <section className="lg:hidden py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              Quick Navigation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {useCases.slice(0, 8).map((section, index) => (
                <motion.button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="text-left p-3 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg border border-emerald-500/20 transition-all duration-200 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-white/80 group-hover:text-white text-sm font-medium truncate">
                      {section.title.split(". ")[1] || section.title}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
            {useCases.length > 8 && (
              <div className="mt-4 text-center">
                <motion.button
                  onClick={() => scrollToSection(useCases[8].id)}
                  className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors duration-200"
                >
                  View all {useCases.length} use cases →
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 animate-gradient-shift px-4"
              whileHover={{ scale: 1.02 }}
            >
              Perfect for
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600"
                animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {" "}
                every role
              </motion.span>
            </motion.h2>
            <motion.p
              className="text-lg sm:text-xl text-white/50 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Whether you're a product manager, developer, scrum master, or
              enterprise leader, SprintiQ adapts to your workflow and enhances
              your productivity.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid lg:grid-cols-1"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {useCases.map((useCase, index) => (
              <div key={index}>
                <div id={useCase.id} className="mb-8 sm:mb-12" />
                <motion.div
                  key={index}
                  variants={cardVariant}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 group animate-bounce-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-center">
                    <div>
                      <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
                        <motion.div
                          className="w-14 h-14 sm:w-16 sm:h-16 p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-emerald-500/30 transition-all duration-300 mx-auto sm:mx-0"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          variants={iconVariant}
                        >
                          {useCase.icon}
                        </motion.div>
                        <div className="flex-1 text-center sm:text-left">
                          <motion.h3
                            className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:text-emerald-300 transition-colors duration-300"
                            whileHover={{ x: 5 }}
                          >
                            {useCase.title}
                          </motion.h3>
                          <motion.p
                            className="text-white/50 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                          >
                            {useCase.description}
                          </motion.p>

                          {/* Pain Point & Solution */}
                          <motion.div
                            className="mb-4 sm:mb-6 space-y-3 sm:space-y-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                          >
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 sm:p-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                                <span className="text-red-200 font-medium text-xs sm:text-sm">
                                  The Problem
                                </span>
                              </div>
                              <p className="text-red-100 text-xs sm:text-sm">
                                {useCase.painPoint}
                              </p>
                            </div>
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 sm:p-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                <span className="text-emerald-200 font-medium text-xs sm:text-sm">
                                  The SprintiQ Solution
                                </span>
                              </div>
                              <p className="text-emerald-100 text-xs sm:text-sm">
                                {useCase.solution}
                              </p>
                            </div>
                          </motion.div>
                        </div>
                      </div>

                      <motion.ul
                        className="space-y-2 sm:space-y-3 mb-4 sm:mb-6"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                      >
                        {useCase.benefits.map((benefit, benefitIndex) => (
                          <motion.li
                            key={benefitIndex}
                            variants={cardVariant}
                            className="flex items-start space-x-3 group/item"
                          >
                            <motion.div
                              whileHover={{ scale: 1.2 }}
                              className="animate-check-bounce flex-shrink-0 mt-0.5"
                              style={{
                                animationDelay: `${benefitIndex * 0.1}s`,
                              }}
                            >
                              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                            </motion.div>
                            <motion.span
                              className="text-white/50 group-hover/item:text-white/70 transition-colors duration-200 text-sm sm:text-base"
                              whileHover={{ x: 3 }}
                            >
                              {benefit}
                            </motion.span>
                          </motion.li>
                        ))}
                      </motion.ul>

                      {/* Stats */}
                      <motion.div
                        className="grid grid-cols-3 gap-3 sm:gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                      >
                        {Object.entries(useCase.stats).map(
                          ([key, value], statIndex) => (
                            <motion.div
                              key={key}
                              className="text-center p-2 sm:p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20"
                              whileHover={{ scale: 1.05 }}
                              style={{ animationDelay: `${statIndex * 0.1}s` }}
                            >
                              <div className="text-lg sm:text-2xl font-bold text-emerald-400">
                                {value}
                              </div>
                              <div className="text-xs text-white/50 capitalize">
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </div>
                            </motion.div>
                          )
                        )}
                      </motion.div>
                    </div>

                    <motion.div
                      className="relative order-first lg:order-last"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="aspect-square w-full max-w-xs sm:max-w-sm mx-auto">
                        <motion.div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-green-500/20 rounded-2xl transform rotate-6" />
                        <motion.div className="absolute inset-0 bg-white/10 rounded-2xl transform rotate-12" />
                        <motion.div
                          className="absolute inset-0 glass-card overflow-hidden rounded-2xl shadow-2xl"
                          whileHover={{ scale: 1.05, rotate: -2 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Image
                            src={useCase.image}
                            alt={useCase.title}
                            width={400}
                            height={400}
                            className="w-full h-full rounded-2xl object-cover"
                          />
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 animate-gradient-shift px-4"
              whileHover={{ scale: 1.02 }}
            >
              Trusted by
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600"
                animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {" "}
                leading industries
              </motion.span>
            </motion.h2>
            <motion.p
              className="text-lg sm:text-xl text-white/50 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              SprintiQ adapts to the unique needs of different industries,
              providing specialized solutions for your specific challenges.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                variants={cardVariant}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-500/20 hover:border-emerald-400/40 animate-bounce-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <motion.div
                  className="h-10 w-10 sm:h-12 sm:w-12 mx-auto rounded-xl flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-300 animate-float text-emerald-400"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {industry.icon}
                </motion.div>
                <motion.h3
                  className="font-semibold text-white text-base sm:text-lg text-center mb-2 sm:mb-3 group-hover:text-emerald-300 transition-colors duration-200"
                  whileHover={{ y: -2 }}
                >
                  {industry.name}
                </motion.h3>
                <motion.p
                  className="text-white/50 text-xs sm:text-sm text-center mb-3 sm:mb-4"
                  whileHover={{ color: "#ffffff80" }}
                >
                  {industry.description}
                </motion.p>
                <motion.div
                  className="text-center mb-3 sm:mb-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="bg-emerald-500/20 rounded-lg p-2">
                    <div className="text-base sm:text-lg font-bold text-emerald-400">
                      {industry.metric}
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  className="relative h-24 sm:h-32 w-full rounded-lg overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                >
                  <Image
                    src={industry.image}
                    alt={industry.name}
                    width={300}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Beginners Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 animate-gradient-shift px-4"
              whileHover={{ scale: 1.02 }}
            >
              From idea to
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600"
                animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {" "}
                reality
              </motion.span>
            </motion.h2>
            <motion.p
              className="text-lg sm:text-xl text-white/50 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Even beginners can turn an idea into reality – ideas become
              reality. SprintiQ democratizes product development with AI-guided
              planning.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-center"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div
              variants={cardVariant}
              className="space-y-6 sm:space-y-8 order-2 lg:order-1"
            >
              <motion.div
                className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-emerald-500/20"
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center">
                    <RocketSvg color="#fff" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      No Experience Required
                    </h3>
                    <p className="text-emerald-400 text-sm sm:text-base">
                      AI guides you through every step
                    </p>
                  </div>
                </div>
                <p className="text-white/70 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                  "I had an idea for an app but no clue how to build it.
                  SprintiQ broke down my vision into simple steps and guided me
                  through my first sprint. Now I'm shipping features like a
                  pro!"
                </p>
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-emerald-400">
                      90%
                    </div>
                    <div className="text-xs text-white/50">Time saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-emerald-400">
                      15x
                    </div>
                    <div className="text-xs text-white/50">Faster start</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-emerald-400">
                      88%
                    </div>
                    <div className="text-xs text-white/50">Success rate</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="space-y-3 sm:space-y-4"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {[
                  "AI breaks down complex ideas into simple, actionable tasks",
                  "Guided sprint planning for first-time developers",
                  "Automated best practices prevent common mistakes",
                  "Progress tracking keeps beginners motivated and on track",
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    variants={cardVariant}
                    className="flex items-start space-x-3"
                  >
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="animate-check-bounce flex-shrink-0 mt-0.5"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                    </motion.div>
                    <span className="text-white/70 text-sm sm:text-base">
                      {benefit}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              className="relative order-1 lg:order-2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="aspect-square w-full max-w-sm sm:max-w-md mx-auto">
                <motion.div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-green-500/20 rounded-2xl transform rotate-6" />
                <motion.div
                  className="absolute inset-0 glass-card overflow-hidden rounded-2xl shadow-2xl"
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Image
                    src="https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/use-case/idea-start.jpg"
                    alt="Beginners turning ideas into reality"
                    width={400}
                    height={400}
                    className="w-full h-full rounded-2xl object-cover"
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 animate-gradient-shift px-4"
              whileHover={{ scale: 1.02 }}
            >
              Success
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600"
                animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {" "}
                stories
              </motion.span>
            </motion.h2>
            <motion.p
              className="text-lg sm:text-xl text-white/50 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              See how teams across different industries are transforming their
              agile practices with SprintiQ.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid lg:grid-cols-2 gap-8 sm:gap-12"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div
              variants={cardVariant}
              className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-emerald-500/20"
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    Tech Startup
                  </h3>
                  <p className="text-emerald-400 text-sm sm:text-base">
                    50-person team
                  </p>
                </div>
              </div>
              <p className="text-white/70 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                "Before SprintiQ, I was spending 3 hours every sprint planning
                meeting arguing about story points. Now our AI predicts with 89%
                accuracy and we finish planning in 30 minutes. My team actually
                looks forward to sprint planning now!"
              </p>
              <div className="flex items-center justify-between">
                <div className="text-xl sm:text-2xl font-bold text-emerald-400">
                  89%
                </div>
                <div className="text-white/50 text-sm sm:text-base">
                  Story point accuracy
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariant}
              className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-emerald-500/20"
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                  <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    Enterprise Corp
                  </h3>
                  <p className="text-emerald-400 text-sm sm:text-base">
                    500+ developers
                  </p>
                </div>
              </div>
              <p className="text-white/70 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                "We were drowning in spreadsheets and manual processes.
                SprintiQ's AI automated 80% of our planning work and gave us
                insights we never had before. Our delivery predictability went
                from 60% to 94% in just 3 months."
              </p>
              <div className="flex items-center justify-between">
                <div className="text-xl sm:text-2xl font-bold text-emerald-400">
                  94%
                </div>
                <div className="text-white/50 text-sm sm:text-base">
                  Delivery predictability
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 animate-gradient-shift px-4"
              whileHover={{ scale: 1.02 }}
            >
              The numbers
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600"
                animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {" "}
                don't lie
              </motion.span>
            </motion.h2>
            <motion.p
              className="text-lg sm:text-xl text-white/50 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Real results from teams using SprintiQ to eliminate project
              management stress
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                number: "87%",
                label: "More accurate story points",
                icon: Target,
              },
              { number: "75%", label: "Less time on planning", icon: Clock },
              {
                number: "94%",
                label: "Delivery predictability",
                icon: TrendingUp,
              },
              { number: "10K+", label: "Teams transformed", icon: Users },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center animate-bounce-in"
                style={{ animationDelay: `${index * 0.2}s` }}
                variants={cardVariant}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <motion.div
                  className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </motion.div>
                <motion.div
                  className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 animate-float"
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
                  className="text-white/50 font-medium text-xs sm:text-sm"
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
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            className="bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden"
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
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 animate-gradient-shift px-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Stop stressing about sprint planning
              </motion.h2>
              <motion.p
                className="text-lg sm:text-xl mb-6 sm:mb-8 text-emerald-50 max-w-2xl mx-auto px-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                Join 10,000+ teams who've eliminated the chaos of traditional
                Scrum. Get AI-Native accuracy, automated planning, and
                stress-free sprints.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center px-4"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <motion.div variants={cardVariant} className="w-full sm:w-auto">
                  <Link href="/signup">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full sm:w-auto"
                    >
                      <Button className="w-full sm:w-auto bg-white text-emerald-600 hover:bg-gray-50 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-glow">
                        Start Free Trial
                        <motion.div
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                        </motion.div>
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
                <motion.div variants={cardVariant} className="w-full sm:w-auto">
                  <Link href="/contact">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full sm:w-auto"
                    >
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto bg-transparent border-2 border-white hover:border-white text-white hover:bg-white/10 hover:text-white/90 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-2xl transition-all duration-300 animate-shimmer"
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
