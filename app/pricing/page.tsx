"use client";

import { useState } from "react";

import Navbar from "@/components/landing/layout/navbar";
import Footer from "@/components/landing/layout/footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, CircleCheck, Lock, Phone, Plus } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import ScrollToTop from "@/components/ui/scroll-to-top";

export const plans = [
  {
    name: "Free",
    price: "$0",
    period: "Forever free",
    description: "Essential AI planning for individuals",
    features: [
      "30 stories/month",
      "2 sprints/month",
      "1 project",
      "1 user",
      "Basic story templates",
    ],
    aiCapabilities: [
      "Template-based generation",
      "Basic priority scoring",
      "Format validation",
      "No real world training data",
    ],
    support: ["Community forums", "Basic Jira export", "No priority support"],
    integrations: ["No integrations"],
    popular: false,
    cta: "Get Started Free",
  },
  {
    name: "Beta Program",
    price: "FREE",
    period: "During Beta (30 days)",
    description:
      "Get Starter Tier features FREE for 30 days + exclusive Beta benefits",
    features: [
      "Unlimited stories (vs 300 in production)",
      "10 sprints/month",
      "3 projects",
      "10 team members (vs 5 in production)",
      "Full persona integration",
      "Team collaboration",
    ],
    aiCapabilities: [
      "Contextual story generation",
      "Multi-persona integration",
      "Dynamic priority weighting",
      "Sprint capacity planning",
      "Dependency detection",
    ],
    successAntiPatterns: [
      "Success Rate Patterns Analysis",
      "Anti-Patterns Failure Analysis",
      "Velocity decline detection",
      "Team scaling disaster prevention",
    ],
    support: [
      "Team velocity dashboard",
      "Time savings breakdown",
      "Quality metrics tracking",
      "Priority email support",
      "Jira platform integration",
      "30% lifetime discount",
    ],
    popular: true,
    cta: "Join Beta Program",
  },
  {
    name: "Starter",
    price: "$24",
    period: "per user/month",
    description: "Professional team planning with real project data insights",
    features: [
      "300 stories/month",
      "10 sprints/month",
      "3 projects",
      "5 team members",
      "Full persona integration",
      "Team collaboration",
    ],
    aiCapabilities: [
      "Contextual story generation",
      "Multi-persona integration",
      "Dynamic priority weighting",
      "Sprint capacity planning",
      "Dependency detection",
    ],
    successAntiPatterns: [
      "Success Rate Patterns Analysis (89% completion optimization)",
      "Anti-Patterns Failure Analysis (Large-scale failure prevention)",
      "Velocity decline detection",
      "Team scaling disaster prevention",
    ],
    support: [
      "Team velocity dashboard",
      "Time savings breakdown",
      "Quality metrics tracking",
      "Priority email support",
      "3 platform integrations",
    ],
    popular: false,
    cta: "Start Free Trial",
  },
  {
    name: "Professional",
    price: "$49",
    period: "per user/month",
    description: "Advanced AI intelligence with predictive insights",
    features: [
      "Unlimited stories",
      "50 sprints/month",
      "10 projects",
      "20 team members",
      "Advanced sprint optimization",
      "Custom priority frameworks",
    ],
    aiCapabilities: [
      "Multi-modal story analysis",
      "Predictive priority modeling",
      "Advanced dependency analysis",
      "Quality prediction models",
      "Natural language processing",
    ],
    adVancedPatterns: [
      "Death spiral prediction (>90% accuracy)",
      "Communication breakdown analysis",
      "Technical debt detection",
      "Real-time pattern monitoring",
      "Quality-velocity optimization",
    ],
    support: [
      "Predictive velocity modeling",
      "Custom report builder",
      "API access",
      "Priority support (4hr response)",
      "All platform integrations",
    ],
    popular: false,
    cta: "Start Free Trial",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "beginning at $99/user/month",
    description: "Custom AI intelligence for large organizations",
    features: [
      "Unlimited everything",
      "200+ sprints/month",
      "25+ projects",
      "50+ team members",
      "SSO/SAML authentication",
      "White-label options",
    ],
    aiCapabilities: [
      "Multi-agent AI system",
      "Custom model training",
      "Federated learning",
      "Real-time model adaptation",
      "Domain-specific language models",
    ],
    enterprisePatterns: [
      "Custom anti-pattern development",
      "Organizational success DNA",
      "Industry-specific patterns",
      "Regulatory compliance patterns",
      "Competitive advantage analysis",
    ],
    support: [
      "Strategic analytics platform",
      "Board-ready reports",
      "Real-time data streaming",
      "Dedicated Customer Success Manager",
      "Custom integrations",
      "On-premise deployment",
    ],
    popular: false,
    cta: "Contact Us",
  },
];

export default function PricingPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const getPlanPrice = (planName: string, monthlyPrice: string) => {
    if (billingCycle === "yearly") {
      switch (planName) {
        case "Starter":
          return "$260";
        case "Professional":
          return "$530";
        default:
          return monthlyPrice;
      }
    }
    return monthlyPrice;
  };

  const getPlanPeriod = (planName: string, monthlyPeriod: string) => {
    if (billingCycle === "yearly") {
      switch (planName) {
        case "Starter":
        case "Professional":
          return "per user/year";
        default:
          return monthlyPeriod;
      }
    }
    return monthlyPeriod;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* Hero Section */}
      <section className="pt-20 sm:pt-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 text-emerald-300 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8 animate-fade-in animate-bounce-in">
            Simple & Transparent Pricing
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight animate-slide-up-delayed px-4">
            Plans that scale
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-500 to-teal-600 animate-gradient-shift">
              {" "}
              with your team
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-white mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed animate-slide-up-delayed-2 px-4">
            Limited 30-Day Beta Program
            <br />
            <span className="text-emerald-600 font-medium">
              Get Starter Tier features FREE for 30 days + 30% lifetime discount
              on future plans
            </span>
          </p>
        </div>
      </section>

      {/* Billing Cycle Tabs */}
      <section className="pb-6 sm:pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="inline-flex bg-white/10 backdrop-blur-sm rounded-2xl p-1 border border-white/20">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 sm:px-8 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${
                  billingCycle === "monthly"
                    ? "bg-white text-gray-900 shadow-lg"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 sm:px-8 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 relative text-sm sm:text-base ${
                  billingCycle === "yearly"
                    ? "bg-white text-gray-900 shadow-lg"
                    : "text-white"
                }`}
              >
                Yearly
                {billingCycle === "yearly" && (
                  <span className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-emerald-500 text-white border border-emerald-400 shadow-sm">
                    Save 10%
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8 lg:gap-6">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group animate-fade-in-up col-span-1 sm:col-span-1 lg:col-span-2 ${
                  plan.popular
                    ? "border-emerald-200 shadow-xl shadow-emerald-100/50 bg-gradient-to-br from-emerald-600 to-green-600 text-white animate-pulse-glow"
                    : "border-slate-200 shadow-lg hover:border-emerald-200"
                } ${index === 3 ? "lg:col-start-2" : ""}`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 sm:-top-5 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="inline-flex items-center bg-white text-emerald-600 border border-emerald-200 px-3 sm:px-6 py-1.5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-6 sm:p-8 lg:p-10">
                  <div className="mb-6 sm:mb-8">
                    <h3
                      className={`text-xl sm:text-2xl font-bold ${
                        plan.popular ? "text-white" : "text-gray-900"
                      } mb-2 sm:mb-3`}
                    >
                      {plan.name}
                    </h3>
                    <p
                      className={`text-gray-600 leading-relaxed text-sm sm:text-base ${
                        plan.popular ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {plan.description}
                    </p>
                  </div>

                  <div className="mb-6 sm:mb-8">
                    <div className="flex items-baseline">
                      <span
                        className={`text-3xl sm:text-5xl font-bold ${
                          plan.popular ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {getPlanPrice(plan.name, plan.price)}
                      </span>
                      {plan.period && (
                        <span
                          className={`text-gray-500 ml-2 text-base sm:text-lg ${
                            plan.popular ? "text-white" : "text-gray-900"
                          }`}
                        >
                          /{getPlanPeriod(plan.name, plan.period)}
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    href={plan.name === "Enterprise" ? "/contact" : "/signup"}
                    className="block mb-6 sm:mb-8"
                  >
                    <Button
                      className={`w-full py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                        plan.popular
                          ? "bg-white hover:bg-white/80 text-emerald-600 shadow-lg hover:shadow-xl animate-gradient-shift"
                          : "bg-gray-900 hover:bg-gray-800 text-white border-2 border-transparent hover:border-emerald-500"
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>

                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <h4
                        className={`font-semibold ${
                          plan.popular ? "text-white" : "text-gray-900"
                        } mb-3 sm:mb-4 text-base sm:text-lg`}
                      >
                        CORE FEATURES
                      </h4>
                      <ul className="space-y-3 sm:space-y-4">
                        {plan.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-start space-x-3 sm:space-x-4 animate-slide-in-left"
                            style={{
                              animationDelay: `${
                                index * 200 + featureIndex * 100
                              }ms`,
                            }}
                          >
                            <div
                              className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500/10 flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300 ${
                                plan.popular
                                  ? "bg-white/10"
                                  : "bg-emerald-500/10"
                              }`}
                            >
                              <CheckCircle
                                className={`h-3 w-3 sm:h-4 sm:w-4 ${
                                  plan.popular
                                    ? "text-white"
                                    : "text-emerald-600"
                                } animate-check-bounce`}
                              />
                            </div>
                            <span
                              className={`text-gray-700 leading-relaxed text-sm sm:text-base ${
                                plan.popular ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {feature}
                            </span>
                          </li>
                        ))}
                        <h4
                          className={`font-semibold ${
                            plan.popular ? "text-white" : "text-gray-900"
                          } mb-3 sm:mb-4 text-base sm:text-lg`}
                        >
                          AI CAPABILITIES
                        </h4>
                        {plan.aiCapabilities.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-start space-x-3 sm:space-x-4 opacity-60 animate-slide-in-left"
                            style={{
                              animationDelay: `${
                                index * 200 +
                                (plan.features.length + featureIndex) * 100
                              }ms`,
                            }}
                          >
                            <div
                              className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500/10 flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300 ${
                                plan.popular
                                  ? "bg-white/10"
                                  : "bg-emerald-500/10"
                              }`}
                            >
                              <CheckCircle
                                className={`h-3 w-3 sm:h-4 sm:w-4 ${
                                  plan.popular
                                    ? "text-white"
                                    : "text-emerald-600"
                                } animate-check-bounce`}
                              />
                            </div>
                            <span
                              className={`text-gray-500 leading-relaxed text-sm sm:text-base ${
                                plan.popular ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {feature}
                            </span>
                          </li>
                        ))}
                        {plan.successAntiPatterns && (
                          <h4
                            className={`font-semibold ${
                              plan.popular ? "text-white" : "text-gray-900"
                            } mb-3 sm:mb-4 text-base sm:text-lg`}
                          >
                            SUCCESS ANTI-PATTERNS
                          </h4>
                        )}
                        {plan.successAntiPatterns?.map(
                          (feature, featureIndex) => (
                            <li
                              key={featureIndex}
                              className="flex items-start space-x-3 sm:space-x-4 opacity-60 animate-slide-in-left"
                              style={{
                                animationDelay: `${
                                  index * 200 +
                                  (plan.features.length +
                                    plan.aiCapabilities.length +
                                    featureIndex) *
                                    100
                                }ms`,
                              }}
                            >
                              <div
                                className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500/10 flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300 ${
                                  plan.popular
                                    ? "bg-white/10"
                                    : "bg-emerald-500/10"
                                }`}
                              >
                                <CheckCircle
                                  className={`h-3 w-3 sm:h-4 sm:w-4 ${
                                    plan.popular
                                      ? "text-white"
                                      : "text-emerald-600"
                                  } animate-check-bounce`}
                                />
                              </div>
                              <span
                                className={`text-gray-500 leading-relaxed text-sm sm:text-base ${
                                  plan.popular ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {feature}
                              </span>
                            </li>
                          )
                        )}

                        {plan.adVancedPatterns && (
                          <h4
                            className={`font-semibold ${
                              plan.popular ? "text-white" : "text-gray-900"
                            } mb-3 sm:mb-4 text-base sm:text-lg`}
                          >
                            ADVANCED PATTERNS
                          </h4>
                        )}
                        {plan.adVancedPatterns?.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-start space-x-3 sm:space-x-4 opacity-60 animate-slide-in-left"
                            style={{
                              animationDelay: `${
                                index * 200 +
                                (plan.features.length +
                                  plan.aiCapabilities.length +
                                  (plan?.adVancedPatterns?.length || 0) +
                                  featureIndex) *
                                  100
                              }ms`,
                            }}
                          >
                            <div
                              className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500/10 flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300 ${
                                plan.popular
                                  ? "bg-white/10"
                                  : "bg-emerald-500/10"
                              }`}
                            >
                              <CheckCircle
                                className={`h-3 w-3 sm:h-4 sm:w-4 ${
                                  plan.popular
                                    ? "text-white"
                                    : "text-emerald-600"
                                } animate-check-bounce`}
                              />
                            </div>
                            <span
                              className={`text-gray-500 leading-relaxed text-sm sm:text-base ${
                                plan.popular ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {feature}
                            </span>
                          </li>
                        ))}

                        {plan.enterprisePatterns && (
                          <h4
                            className={`font-semibold ${
                              plan.popular ? "text-white" : "text-gray-900"
                            } mb-3 sm:mb-4 text-base sm:text-lg`}
                          >
                            Enterprise Patterns
                          </h4>
                        )}
                        {plan.enterprisePatterns?.map(
                          (feature, featureIndex) => (
                            <li
                              key={featureIndex}
                              className="flex items-start space-x-3 sm:space-x-4 opacity-60 animate-slide-in-left"
                              style={{
                                animationDelay: `${
                                  index * 200 +
                                  (plan.features.length +
                                    plan.aiCapabilities.length +
                                    (plan?.enterprisePatterns?.length || 0) +
                                    featureIndex) *
                                    100
                                }ms`,
                              }}
                            >
                              <div
                                className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500/10 flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300 ${
                                  plan.popular
                                    ? "bg-white/10"
                                    : "bg-emerald-500/10"
                                }`}
                              >
                                <CheckCircle
                                  className={`h-3 w-3 sm:h-4 sm:w-4 ${
                                    plan.popular
                                      ? "text-white"
                                      : "text-emerald-600"
                                  } animate-check-bounce`}
                                />
                              </div>
                              <span
                                className={`text-gray-500 leading-relaxed text-sm sm:text-base ${
                                  plan.popular ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {feature}
                              </span>
                            </li>
                          )
                        )}
                        <h4
                          className={`font-semibold ${
                            plan.popular ? "text-white" : "text-gray-900"
                          } mb-3 sm:mb-4 text-base sm:text-lg`}
                        >
                          SUPPORT
                        </h4>
                        {plan.support.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-start space-x-3 sm:space-x-4 opacity-60 animate-slide-in-left"
                            style={{
                              animationDelay: `${
                                index * 200 +
                                (plan.features.length +
                                  plan.aiCapabilities.length +
                                  (plan?.successAntiPatterns?.length || 0) +
                                  featureIndex) *
                                  100
                              }ms`,
                            }}
                          >
                            <div
                              className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500/10 flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300 ${
                                plan.popular
                                  ? "bg-white/10"
                                  : "bg-emerald-500/10"
                              }`}
                            >
                              <CheckCircle
                                className={`h-3 w-3 sm:h-4 sm:w-4 ${
                                  plan.popular
                                    ? "text-white"
                                    : "text-emerald-600"
                                } animate-check-bounce`}
                              />
                            </div>
                            <span
                              className={`text-gray-500 leading-relaxed text-sm sm:text-base ${
                                plan.popular ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Lock,
                title: "Secure & Compliant",
                desc: "Enterprise-grade security with SOC 2 compliance",
              },
              {
                icon: Phone,
                title: "24/7 Support",
                desc: "Get help when you need it from our expert team",
              },
              {
                icon: CircleCheck,
                title: "Money-back Guarantee",
                desc: "30-day money-back guarantee on all plans",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center group animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center mb-4 sm:mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 animate-float">
                  <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-300 text-base sm:text-lg">
                  {item.title}
                </h3>
                <p className="text-white/50 group-hover:text-white/70 transition-colors duration-300 text-sm sm:text-base">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 px-4">
              Got questions?
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600 animate-gradient-shift">
                {" "}
                We've got answers
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-white/50 px-4">
              Everything you need to know about our pricing and plans
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6">
            {[
              {
                question: "Can I change my plan anytime?",
                answer:
                  "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
              },
              {
                question: "What is the Beta Program?",
                answer:
                  "Our Beta Program offers Starter Tier features FREE for 30 days plus exclusive benefits like unlimited stories, 10 team members, advanced AI capabilities, and a 30% lifetime discount when you upgrade.",
              },
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept all major credit cards, PayPal, and bank transfers for Enterprise customers.",
              },
              {
                question:
                  "What's the difference between Free and Beta Program?",
                answer:
                  "Free plan is for individuals with basic AI planning (30 stories/month, 1 user). Beta Program offers team features FREE for 30 days with unlimited stories, 10 team members, advanced AI capabilities, and exclusive benefits.",
              },
              {
                question: "Can I cancel anytime?",
                answer:
                  "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden group hover:border-white/20 transition-all duration-300 animate-fade-in-up hover:bg-white/10"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-4 sm:p-6 flex justify-between items-center group-hover:bg-white/5 transition-colors duration-300"
                >
                  <h3 className="text-lg sm:text-xl font-medium text-white group-hover:text-emerald-300 transition-colors duration-300 pr-4">
                    {faq.question}
                  </h3>
                  <motion.div
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0"
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
                </button>
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    openFaqIndex === index
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-4 sm:px-6 pb-4 text-white/70 animate-slide-down">
                    <p className="text-base sm:text-lg">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            className="bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-12 text-white relative overflow-hidden"
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
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 animate-gradient-shift px-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Why SprintiQ's Planning Agents are Different
              </motion.h2>
              <motion.p
                className="text-lg sm:text-xl text-emerald-50 mx-auto px-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                Unlike generic AI tools trained on internet text, our AI learned
                from thousands of successful and failed stories and sprints from
                real projects including high-performing projects (89% completion
                rate) and large-scale enterprise failures (multi-million dollar
                project analysis). This means our AI generates successful
                stories while helping you avoid proven failure patterns.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
      <ScrollToTop isMenuOpen={isMenuOpen} />
    </div>
  );
}
