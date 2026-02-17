"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Award,
  Heart,
  Zap,
  Globe,
  Star,
  CheckCircle,
} from "lucide-react";
import Navbar from "@/components/landing/layout/navbar";
import Footer from "@/components/landing/layout/footer";
import { TeamSvg } from "@/components/svg/TeamSvg";
import { BadgeSvg } from "@/components/svg/BadgeSvg";
import { EffectiveSvg } from "@/components/svg/EffectiveSvg";
import { IndividualSvg } from "@/components/svg/IndividualSvg";
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

export default function AboutPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const founders = [
    {
      name: "Dr. Jeff Nagy",
      role: "Founder & CEO ",
      bio: "Product & systems strategy visionary with over 15 years in agile architecture & transformation. Passionate about the intersection of AI and neuroscience. ",
      image:
        "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/avatars/teams/jeff.jpeg",
    },
    {
      name: "David Lin",
      role: "CTO & Co-founder",
      bio: "AI agentic systems expert and full-stack architect. Building intelligent systems that understand and enhance human creativity & workflows.",
      image:
        "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/avatars/teams/dlin.jpeg",
    },
    {
      name: "Rachael Long",
      role: "COO & Co-founder",
      bio: "Strategic go-to-market operations expert helping bring AI-native product planning and development to agile teams worldwide. ",
      image:
        "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/avatars/teams/rachael.jpeg",
    },
  ];

  const teams = [
    {
      name: "Andrew",
      role: "Chief Engineer",
      bio: "Leading technical architecture and engineering excellence with expertise in scalable systems and AI-native development",
      image:
        "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/avatars/teams/andrew.jpeg",
      css: "col-span-2",
    },
    {
      name: "Kevin",
      role: "Senior Front-End and UI/UX Engineer",
      bio: "Spearheading front-end technologies to deliver intuitive, high-performance systems, and innovative AI-integrated UI/UX solutions.",
      image:
        "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/avatars/teams/kevin.jpeg",
      css: "col-span-2",
    },
    {
      name: "Dereck",
      role: "Senior Backend Engineer with AI and MCP Expertise",
      bio: "Excelling in backend development, AI integration, and Microsoft Certified Professional (MCP) skills to build robust, efficient, and intelligent systems.",
      image:
        "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/avatars/teams/dereck.jpeg",
      css: "col-span-2",
    },
    {
      name: "Lillian",
      role: "Marketing Specialist",
      bio: "Driving brand awareness and market positioning for SprintiQ's AI-native agile planning platform",
      image:
        "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/avatars/teams/lillian.png",
      css: "col-span-2",
    },
    {
      name: "Joel",
      role: "Social Media Strategist",
      bio: "Building community engagement and thought leadership across digital platforms to amplify SprintiQ's mission",
      image:
        "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/avatars/teams/joel.png",
      css: "col-span-2 col-start-2",
    },
    {
      name: "Hance",
      role: "Agentic AI Systems Engineer",
      bio: "Developing autonomous AI agents and intelligent systems that transform traditional project management workflows",
      image:
        "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/avatars/teams/hance.jpeg",
      css: "col-span-2",
    },
    {
      name: "Jorge",
      role: "Agentic AI Systems Engineer",
      bio: "Creating intelligent automation solutions that eliminate busywork and enhance team productivity",
      image:
        "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/avatars/teams/jorge.jpeg",
      css: "col-span-2",
    },
    {
      name: "Beejern Software Development",
      role: "Strategic Partner",
      bio: "Expert software development partner providing technical expertise and innovative solutions for SprintiQ's platform",
      image:
        "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/avatars/teams/beejern.jpg",
      link: "https://beejern.com/",
      css: "col-span-4",
    },
    {
      name: "Prytania Consulting",
      role: "Strategic Partner",
      bio: "Strategic consulting partner helping organizations optimize their agile processes and embrace AI-native workflows",
      image:
        "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/avatars/teams/prytania.png",
      link: "https://prytaniaconsulting.com/",
      css: "col-span-4",
    },
  ];

  const values = [
    {
      icon: <IndividualSvg color="#fff" />,
      title: "Customer First",
      description:
        "Every decision we make starts with our customers. We listen, learn, and build solutions that truly matter.",
    },
    {
      icon: <BadgeSvg color="#fff" />,
      title: "Trust & Security",
      description:
        "We protect your data like it's our own. Security and privacy are built into everything we do.",
    },
    {
      icon: <EffectiveSvg color="#fff" />,
      title: "Continuous Innovation",
      description:
        "We're always pushing boundaries, exploring new technologies, and improving our platform.",
    },
    {
      icon: <TeamSvg color="#fff" />,
      title: "Team Collaboration",
      description:
        "Great things happen when teams work together. We build tools that bring people closer.",
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
              Building the future of project management
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-6 md:mb-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.span
                className="bg-gradient-to-r from-white via-emerald-100 to-emerald-200 bg-clip-text text-transparent animate-gradient-shift"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                About
              </motion.span>
              <br />
              <motion.span
                className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent animate-gradient-shift"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                SprintiQ
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg sm:text-xl md:text-2xl text-emerald-100/90 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed px-4"
            >
              We're on a mission to transform how teams collaborate and deliver
              exceptional results. Our story began with a simple belief: project
              management should empower, not overwhelm.
            </motion.p>

            {/* Stats */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto px-4"
            >
              {[
                { number: "10K+", label: "Active Teams" },
                { number: "50K+", label: "Projects Completed" },
                { number: "99.9%", label: "Uptime" },
                { number: "4.9/5", label: "Customer Rating" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={cardVariant}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="text-center animate-bounce-gentle"
                  style={{ animationDelay: `${index * 0.5}s` }}
                >
                  <motion.div
                    className="text-2xl sm:text-3xl font-bold text-white mb-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      delay: 0.8 + index * 0.1,
                    }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-sm sm:text-base text-emerald-200/80">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24 px-4 bg-white/5 backdrop-blur-xl">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-12 md:mb-16 px-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Our{" "}
                <span className="text-emerald-400 animate-gradient-shift">
                  Story
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-emerald-100/90 max-w-3xl mx-auto">
                The journey that led us to revolutionize agile planning
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  className="space-y-8"
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  <motion.div variants={cardVariant} className="relative">
                    <div className="absolute -left-4 top-0 w-2 h-full bg-gradient-to-b from-emerald-500 to-green-600 rounded-full"></div>
                    <div className="pl-8">
                      <motion.h3
                        className="text-2xl font-bold text-white mb-4"
                        whileHover={{ color: "#10b981" }}
                      >
                        The Problem We Saw
                      </motion.h3>
                      <motion.p
                        className="text-lg text-emerald-100/90 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                      >
                        SprintiQ started because we were fed up with how broken
                        agile planning had become. Our founding team kept seeing
                        product managers wasting nearly half their time writing
                        user stories instead of focusing on tasks that truly
                        mattered, such as strategy and customer engagement.
                      </motion.p>
                      <motion.div
                        className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                      >
                        <p className="text-red-200 font-medium">
                          "Something that should take a few minutes was eating
                          up entire afternoons."
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div variants={cardVariant} className="relative">
                    <div className="absolute -left-4 top-0 w-2 h-full bg-gradient-to-b from-emerald-500 to-green-600 rounded-full"></div>
                    <div className="pl-8">
                      <motion.h3
                        className="text-2xl font-bold text-white mb-4"
                        whileHover={{ color: "#10b981" }}
                      >
                        The AI Revolution Gap
                      </motion.h3>
                      <motion.p
                        className="text-lg text-emerald-100/90 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                      >
                        And here's the crazy part: while AI was revolutionizing
                        everything else, sprint planning was still stuck in the
                        stone age - people making decisions based on hunches,
                        drowning in spreadsheets and sticky notes and treating
                        sophisticated project management tools like fancy to-do
                        lists.
                      </motion.p>
                      <motion.div
                        className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                      >
                        <p className="text-yellow-200 font-medium">
                          "We knew there had to be a better way."
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="space-y-6">
                  {/* Problem visualization */}
                  <motion.div
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20"
                    whileHover={{ scale: 1.02, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <h4 className="text-lg font-semibold text-white">
                        The Old Way
                      </h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <span className="text-red-200 text-sm">
                          Hours writing user stories
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <span className="text-red-200 text-sm">
                          Manual spreadsheet management
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <span className="text-red-200 text-sm">
                          Gut-feeling decisions
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <span className="text-red-200 text-sm">
                          Fancy to-do lists
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Solution visualization */}
                  <motion.div
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/20"
                    whileHover={{ scale: 1.02, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    style={{ animationDelay: "0.3s" }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                      <h4 className="text-lg font-semibold text-white">
                        The SprintiQ Way
                      </h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span className="text-emerald-200 text-sm">
                          AI-Native story generation
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span className="text-emerald-200 text-sm">
                          Intelligent planning
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span className="text-emerald-200 text-sm">
                          Data-driven decisions
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span className="text-emerald-200 text-sm">
                          Focus on what matters
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Founding Vision Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Our{" "}
                <span className="text-emerald-400 animate-gradient-shift">
                  Founding Vision
                </span>
              </h2>
              <p className="text-xl text-emerald-100/90 max-w-3xl mx-auto">
                Building the first AI-native agile planning platform
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="space-y-6">
                  {" "}
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="aspect-[4/5] w-full max-w-md mx-auto">
                      <motion.div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-2xl transform rotate-6" />
                      <motion.div
                        className="absolute inset-0 glass-card overflow-hidden rounded-2xl shadow-2xl"
                        whileHover={{ scale: 1.05, rotate: -2 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Image
                          src="/images/sprint.png"
                          alt=""
                          width={400}
                          height={700}
                          className="w-full h-full rounded-2xl "
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                  {/* Vision Statement */}
                  <motion.div
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="text-center">
                      <p className="text-emerald-200 font-medium text-sm leading-relaxed">
                        "What if an AI-native agile ecosystem could handle all
                        the tedious parts of agile product development and
                        sprint planning, so teams and developers could focus on
                        what they do best?"
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  className="space-y-8"
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  <motion.div variants={cardVariant} className="relative">
                    <div className="absolute -left-4 top-0 w-2 h-full bg-gradient-to-b from-emerald-500 to-green-600 rounded-full"></div>
                    <div className="pl-8">
                      <motion.h3
                        className="text-2xl font-bold text-white mb-4"
                        whileHover={{ color: "#10b981" }}
                      >
                        The Opportunity We Saw
                      </motion.h3>
                      <motion.p
                        className="text-lg text-emerald-100/90 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                      >
                        We started SprintiQ because we were tired of watching
                        brilliant product people get buried under boring
                        busywork. Product managers were spending nearly half
                        their time writing user stories and prioritizing
                        backlogs instead of focusing on strategy and building
                        amazing products.
                      </motion.p>
                      <motion.div
                        className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                      >
                        <p className="text-blue-200 font-medium">
                          "What if teams could focus on what they do best?"
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div variants={cardVariant} className="relative">
                    <div className="absolute -left-4 top-0 w-2 h-full bg-gradient-to-b from-emerald-500 to-green-600 rounded-full"></div>
                    <div className="pl-8">
                      <motion.h3
                        className="text-2xl font-bold text-white mb-4"
                        whileHover={{ color: "#10b981" }}
                      >
                        AI-Native from the Ground Up
                      </motion.h3>
                      <motion.p
                        className="text-lg text-emerald-100/90 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                      >
                        The founders saw an opportunity to build the first
                        AI-native agile planning platform. Not just another
                        project management tool with AI features bolted on,
                        SprintiQ is an AI-Native application designed to make
                        agile planning intelligent and product development
                        effortless, from the ground up.
                      </motion.p>
                      <motion.div
                        className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                      >
                        <p className="text-emerald-200 font-medium">
                          "Our vision is simple: what if an AI-native agile
                          ecosystem could handle all the tedious parts?"
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24 px-4 bg-white/5 backdrop-blur-xl">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <motion.h2
                  className="text-4xl md:text-5xl font-bold text-white mb-6"
                  whileHover={{ scale: 1.02 }}
                >
                  Our{" "}
                  <span className="text-emerald-400 animate-gradient-shift">
                    Mission
                  </span>
                </motion.h2>
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.h3
                    className="text-3xl font-bold text-emerald-400 mb-4 animate-gradient-shift"
                    whileHover={{ scale: 1.05 }}
                  >
                    Happy people build happy products!
                  </motion.h3>
                </motion.div>
                <motion.p
                  className="text-xl text-emerald-100/90 mb-8 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  We make it our mission to empower agile product teams to focus
                  on what matters most: solving real problems and delighting
                  users. By transforming agile planning from traditional
                  busywork into intelligent, effortless workflows, we unlock
                  your creativity and accelerate innovation.
                </motion.p>
                <motion.div
                  className="flex flex-wrap gap-4"
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  {[
                    "User-Centric Design",
                    "Continuous Innovation",
                    "Global Accessibility",
                    "Data Security",
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      variants={cardVariant}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="flex items-center space-x-2 bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 text-emerald-300 rounded-full px-4 py-2 text-sm"
                    >
                      <motion.div
                        variants={iconVariant}
                        className="animate-check-bounce"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </motion.div>
                      <span>{item}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="aspect-[4/5] w-full max-w-md mx-auto">
                  <motion.div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-2xl transform rotate-6" />
                  <motion.div
                    className="absolute inset-0 glass-card overflow-hidden rounded-2xl shadow-2xl"
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Image
                      src="/images/about.png"
                      alt=""
                      width={400}
                      height={400}
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our{" "}
              <span className="text-emerald-400 animate-gradient-shift">
                Values
              </span>
            </h2>
            <p className="text-xl text-emerald-100/90 max-w-3xl mx-auto">
              The principles that guide everything we do and every decision we
              make
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto px-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {values.map((value, index) => (
              <motion.div key={index} variants={cardVariant}>
                <Card className="group p-6 md:p-8 hover:shadow-2xl h-full transition-all duration-500 border-0 bg-white/10 backdrop-blur-xl cursor-pointer relative overflow-hidden border border-emerald-500/20 hover:border-emerald-400/40 animate-fade-in-up">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <CardContent className="p-0 relative z-10 text-center">
                      <motion.div
                        className="w-12 h-12 md:w-16 md:h-16 p-2 md:p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center mb-4 md:mb-6 mx-auto animate-pulse-glow"
                        whileHover={{
                          scale: 1.2,
                          rotate: 360,
                          boxShadow: "0 0 30px rgba(16, 185, 129, 0.6)",
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        {value.icon}
                      </motion.div>
                      <motion.h3
                        className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3 group-hover:text-emerald-400 transition-colors"
                        whileHover={{ scale: 1.05 }}
                      >
                        {value.title}
                      </motion.h3>
                      <p className="text-sm md:text-base text-emerald-100/80 leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </motion.div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-12 md:mb-16 px-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Our{" "}
              <span className="text-emerald-400 animate-gradient-shift">
                Founders
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-emerald-100/90 max-w-3xl mx-auto">
              The visionary leaders behind SprintiQ who are transforming agile
              planning through AI-native innovation
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto px-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {founders.map((founder, index) => (
              <motion.div key={index} variants={cardVariant}>
                <Card className="group hover:shadow-2xl transition-all h-full duration-500 border-0 bg-white/10 backdrop-blur-xl cursor-pointer relative overflow-hidden border border-emerald-500/20 hover:border-emerald-400/40 animate-bounce-in">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="relative mb-6">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="flex justify-center items-center"
                        >
                          <div className="relative mb-6 flex justify-center items-center w-32 h-32">
                            {/* Rotating Line Animation */}
                            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-400 border-r-emerald-300 animate-spin-slow"></div>
                            <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-green-400 border-l-green-300 animate-spin-slow-reverse"></div>

                            {/* Main Avatar Container */}
                            <div className="relative w-26 h-26 rounded-full bg-gradient-to-r from-emerald-400 to-green-400 p-1 animate-pulse-glow">
                              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                                <img
                                  src={founder.image}
                                  alt={founder.name}
                                  className="w-24 h-24 rounded-full object-cover"
                                />
                              </div>
                            </div>

                            {/* Additional Rotating Elements */}
                            <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-spin-slow"></div>
                          </div>
                        </motion.div>
                      </div>
                      <motion.h3
                        className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors"
                        whileHover={{ scale: 1.05 }}
                      >
                        {founder.name}
                      </motion.h3>
                      <p className="text-emerald-400 font-medium mb-3">
                        {founder.role}
                      </p>
                      <p className="text-emerald-100/80 text-sm mb-4 leading-relaxed">
                        {founder.bio}
                      </p>
                    </CardContent>
                  </motion.div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-12 md:mb-16 px-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Meet Our{" "}
              <span className="text-emerald-400 animate-gradient-shift">
                Team
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-emerald-100/90 max-w-3xl mx-auto">
              The passionate individuals behind SprintiQ who are dedicated to
              building the future of project management
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-8 gap-6 md:gap-8 max-w-7xl mx-auto px-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {teams.map((member, index) => (
              <motion.div
                key={index}
                variants={cardVariant}
                className={member.css}
              >
                <Card className="group hover:shadow-2xl transition-all h-full duration-500 border-0 bg-white/10 backdrop-blur-xl cursor-pointer relative overflow-hidden border border-emerald-500/20 hover:border-emerald-400/40 animate-bounce-in">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <CardContent className="p-4 md:p-6 text-center">
                      <div className="relative mb-4 md:mb-6">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Image
                            src={member.image}
                            alt={member.name}
                            width={120}
                            height={120}
                            className="w-20 h-20 md:w-24 md:h-24 rounded-full mx-auto border-4 border-emerald-400 group-hover:border-emerald-400/40 transition-all duration-300 animate-pulse-glow"
                            style={{ animationDelay: `${index * 0.5}s` }}
                          />
                        </motion.div>
                      </div>
                      <motion.h3
                        className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors"
                        whileHover={{ scale: 1.05 }}
                      >
                        {member.name}
                      </motion.h3>
                      <p className="text-emerald-400 font-medium mb-2 md:mb-3 text-sm md:text-base">
                        {member.role}
                      </p>
                      <p className="text-emerald-100/80 text-xs md:text-sm mb-3 md:mb-4 leading-relaxed">
                        {member.bio}
                      </p>
                    </CardContent>
                  </motion.div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-16 md:py-24 px-4 bg-white/5 backdrop-blur-xl">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <motion.h2
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6"
                  whileHover={{ scale: 1.02 }}
                >
                  Our{" "}
                  <span className="text-emerald-400 animate-gradient-shift">
                    Culture
                  </span>
                </motion.h2>
                <motion.p
                  className="text-lg md:text-xl text-emerald-100/90 mb-6 md:mb-8 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  We're building more than just software – we're creating a
                  culture of innovation, collaboration, and continuous learning.
                  Our team is our greatest asset.
                </motion.p>
                <motion.div
                  className="space-y-6"
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  {[
                    {
                      title: "Remote-First",
                      description:
                        "We believe great work happens anywhere. Our distributed team spans across multiple time zones.",
                    },
                    {
                      title: "Learning & Growth",
                      description:
                        "We invest in our team's growth with learning budgets, conferences, and mentorship programs.",
                    },
                    {
                      title: "Work-Life Balance",
                      description:
                        "We practice what we preach – healthy boundaries and sustainable work practices.",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start space-x-4"
                      variants={cardVariant}
                      whileHover={{ x: 10 }}
                    >
                      <motion.div
                        className="w-2 h-2 bg-emerald-400 rounded-full mt-3 flex-shrink-0 animate-pulse-glow"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 }}
                      />
                      <div>
                        <motion.h3
                          className="text-lg font-semibold text-white mb-2"
                          whileHover={{ color: "#10b981" }}
                        >
                          {item.title}
                        </motion.h3>
                        <p className="text-emerald-100/80">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
              <motion.div
                className="grid grid-cols-2 gap-4 md:gap-6"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                {[
                  { icon: Award, number: "50+", label: "Team Members" },
                  { icon: Globe, number: "15+", label: "Countries" },
                  { icon: Zap, number: "24/7", label: "Innovation" },
                  { icon: Heart, number: "100%", label: "Passion" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-emerald-500/20 text-center animate-bounce-in"
                    style={{ animationDelay: `${index * 0.2}s` }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <stat.icon className="h-8 w-8 md:h-12 md:w-12 text-emerald-400 mx-auto mb-3 md:mb-4 animate-float" />
                    </motion.div>
                    <motion.h3
                      className="text-xl md:text-2xl font-bold text-white mb-2"
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
                    </motion.h3>
                    <p className="text-sm md:text-base text-emerald-100/80">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4">
        <motion.div
          className="relative container mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 md:mb-8 animate-gradient-shift px-4"
            whileHover={{ scale: 1.02 }}
          >
            We're passionate about eliminating busywork from agile planning
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-emerald-100 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Contact us to see SprintiQ in action <br />
            We'd love to hear from you.
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
                  <Button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-xl shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 group animate-pulse-glow">
                    Get Started Free
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
        </motion.div>
      </section>

      <Footer />

      <ScrollToTop isMenuOpen={isMenuOpen} />
    </div>
  );
}
