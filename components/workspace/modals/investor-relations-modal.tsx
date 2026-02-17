"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Mail,
  Phone,
  User,
  X,
  Maximize,
  Minimize,
  ChevronLeft,
} from "lucide-react";
import SnailSvg from "@/components/svg/SnailSvg";
import ChatbotSvg from "@/components/svg/ChatbotSvg";
import TeamsSvg from "@/components/svg/TeamsSvg";
import { TargetSVG } from "@/components/svg/TargetSVG";
import JiraSvg from "@/components/svg/apps/JiraSvg";
import SlackSvg from "@/components/svg/apps/SlackSvg";
import GithubSvg from "@/components/svg/apps/GithubSvg";
import AsanaSvg from "@/components/svg/apps/AsanaSvg";
import { ClickUpSvg } from "@/components/svg/apps/ClickUpSvg";
import { MondaySvg } from "@/components/svg/apps/MondaySvg";
import AzureSvg from "@/components/svg/apps/AzureSvg";
import MSteamsSvg from "@/components/svg/apps/MSteamsSvg";
import { ScrumMasterSvg } from "@/components/svg/users/ScrumMasterSvg";
import { EngineerSvg } from "@/components/svg/users/EngineerSvg";
import { ProductManagerSvg } from "@/components/svg/users/ProductManagerSvg";
import Image from "next/image";
import LinearSvg from "@/components/svg/apps/LinearSvg";
import ForecastSvg from "@/components/svg/apps/ForecastSvg";
import ZenhubSvg from "@/components/svg/apps/ZenhubSvg";
import ReactDOM from "react-dom";

// Custom scrollbar styles
const scrollbarStyles = `
  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
  }
  .scrollbar-thin::-webkit-scrollbar-track {
    background: rgba(6, 78, 59, 0.2);
    border-radius: 3px;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: rgba(16, 185, 129, 0.5);
    border-radius: 3px;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: rgba(52, 211, 153, 0.6);
  }
  .scrollbar-thin {
    scrollbar-width: thin;
    scrollbar-color: rgba(16, 185, 129, 0.5) rgba(6, 78, 59, 0.2);
  }
`;

interface InvestorRelationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const slides = [
  {
    title: "SprintiQ™ & Market Opportunity",
    preview: (
      <svg width="100%" height="80" viewBox="0 0 200 80" className="rounded-xl">
        <defs>
          <linearGradient id="slide1-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#065f46" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="slide1-title" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#6ee7b7" />
          </linearGradient>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#slide1-bg)"
          rx="8"
          stroke="#fff"
          strokeWidth="1"
        />
        <text
          x="100"
          y="15"
          textAnchor="middle"
          fill="url(#slide1-title)"
          fontSize="11"
          fontWeight="bold"
        >
          SprintiQ™
        </text>
        <text
          x="100"
          y="25"
          textAnchor="middle"
          fill="#d1fae5"
          fontSize="6"
          fontStyle="italic"
        >
          "The Planning Revolution Already Started"
        </text>
        <text x="100" y="35" textAnchor="middle" fill="#fff" fontSize="7">
          Market Fragmentation & Convergence
        </text>
        <rect
          x="30"
          y="40"
          width="40"
          height="20"
          fill="#022c22"
          stroke="#10b981"
          strokeWidth="0.5"
          rx="4"
        />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          fill="#6ee7b7"
          fontSize="7"
          fontWeight="bold"
        >
          $5.2B
        </text>
        <text x="50" y="56" textAnchor="middle" fill="#d1fae5" fontSize="4">
          Agile PM
        </text>
        <rect
          x="80"
          y="40"
          width="40"
          height="20"
          fill="#022c22"
          stroke="#10b981"
          strokeWidth="0.5"
          rx="4"
        />
        <text
          x="100"
          y="50"
          textAnchor="middle"
          fill="#6ee7b7"
          fontSize="7"
          fontWeight="bold"
        >
          $22.2B
        </text>
        <text x="100" y="56" textAnchor="middle" fill="#d1fae5" fontSize="4">
          AI Tools
        </text>
        <rect
          x="30"
          y="60"
          width="90"
          height="20"
          fill="#022c22"
          stroke="#10b981"
          strokeWidth="0.5"
          rx="4"
        />
        <text
          x="75"
          y="70"
          textAnchor="middle"
          fill="#6ee7b7"
          fontSize="7"
          fontWeight="bold"
        >
          $32B
        </text>
        <text x="75" y="76" textAnchor="middle" fill="#d1fae5" fontSize="4">
          Vibe Coding
        </text>
        <rect
          x="130"
          y="40"
          width="50"
          height="40"
          fill="#022c22"
          stroke="#10b981"
          strokeWidth="0.5"
          rx="4"
        />
        <text
          x="155"
          y="60"
          textAnchor="middle"
          fill="#6ee7b7"
          fontSize="10"
          fontWeight="bold"
        >
          $59.4B
        </text>
        <text x="155" y="68" textAnchor="middle" fill="#d1fae5" fontSize="4">
          Total Market
        </text>
      </svg>
    ),
    content: (
      <section
        key="slide-1"
        className="w-full max-w-7xl mx-auto animate-slide-transition relative"
      >
        <div className="relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 bg-gradient-to-r from-emerald-300 via-green-300 to-emerald-400 bg-clip-text text-transparent animate-gradient-shift">
              SprintiQ™
            </h1>
            <div className="text-xl md:text-2xl text-emerald-100/90 max-w-4xl mx-auto font-light mb-8 italic">
              "The Planning Revolution Already Started"
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-400 mx-auto rounded-full animate-pulse-glow"></div>
          </div>

          <div className="text-center mb-16 animate-fade-in-up">
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-8 bg-gradient-to-r from-emerald-300 via-green-300 to-emerald-400 bg-clip-text text-transparent animate-gradient-shift">
              Market Fragmentation & Convergence Opportunity
            </h3>
          </div>

          <div className="grid grid-cols-2  gap-6 max-w-6xl mx-auto mb-16">
            <div className="grid grid-rows-2 gap-6">
              <div className="grid grid-cols-2 gap-6">
                <div
                  className={`group relative overflow-hidden animate-fade-in-up investor-glass rounded-3xl flex flex-col items-center justify-center h-full p-8 text-center border transition-all duration-700 hover:scale-105`}
                  style={{ animationDelay: "0ms" }}
                >
                  {/* Value */}
                  <div className="text-2xl md:text-4xl font-bold  text-emerald-400 group-hover:text-emerald-300 mb-4 transition-colors duration-300">
                    $5.2B
                  </div>

                  {/* Label */}
                  <div className="text-emerald-100/90 text-sm font-medium group-hover:text-emerald-200 transition-colors duration-300">
                    Agile PM Tool Market
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-green-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                </div>
                <div
                  className={`group relative overflow-hidden animate-fade-in-up investor-glass rounded-3xl flex flex-col items-center justify-center h-full p-8 text-center border transition-all duration-700 hover:scale-105`}
                  style={{ animationDelay: "0ms" }}
                >
                  {/* Value */}
                  <div className="text-2xl md:text-4xl font-bold  text-emerald-400 group-hover:text-emerald-300 mb-4 transition-colors duration-300">
                    $22.2B
                  </div>

                  {/* Label */}
                  <div className="text-emerald-100/90 text-sm font-medium group-hover:text-emerald-200 transition-colors duration-300">
                    AI Development Tools Market
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-green-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                </div>
              </div>
              <div
                className={`group relative overflow-hidden animate-fade-in-up investor-glass rounded-3xl flex flex-col items-center justify-center h-full p-8 text-center border transition-all duration-700 hover:scale-105`}
                style={{ animationDelay: "0ms" }}
              >
                {/* Value */}
                <div className="text-2xl md:text-4xl font-bold  text-emerald-400 group-hover:text-emerald-300 mb-4 transition-colors duration-300">
                  $32B
                </div>

                {/* Label */}
                <div className="text-emerald-100/90 text-sm font-medium group-hover:text-emerald-200 transition-colors duration-300">
                  Vibe Coding Market
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-green-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
              </div>
            </div>
            <div
              className={`group relative overflow-hidden animate-fade-in-up investor-glass rounded-3xl p-8 text-center flex flex-col items-center justify-center h-full border transition-all duration-700 hover:scale-105`}
              style={{ animationDelay: "0ms" }}
            >
              {/* Value */}
              <div className="text-5xl md:text-6xl font-bold text-emerald-400 mb-4 group-hover:text-emerald-300 transition-colors duration-300">
                $59.4B
              </div>

              {/* Label */}
              <div className="text-emerald-100/90 text-sm font-medium group-hover:text-emerald-200 transition-colors duration-300">
                Total Market Convergence
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-green-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
            </div>
          </div>

          <div
            className="text-center mb-16 animate-fade-in-up"
            style={{ animationDelay: "800ms" }}
          >
            <p className="text-lg md:text-xl text-emerald-100/90 max-w-4xl mx-auto font-light">
              Three massive markets colliding into one AI-native ecosystem
            </p>
          </div>

          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "1000ms" }}
          >
            <div className="relative overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600/90 via-green-600/90 to-emerald-600/90 backdrop-blur-xl rounded-3xl p-10 text-white text-center max-w-6xl mx-auto border border-emerald-400/50 shadow-2xl">
                <div className="relative z-10">
                  <div className="text-xl md:text-2xl leading-relaxed italic text-emerald-200">
                    "The planning efficiency gap is not coming, it's here!"
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    ),
  },
  {
    title: "Market Reality Check",
    preview: (
      <svg width="100%" height="80" viewBox="0 0 200 80" className="rounded-xl">
        <defs>
          <linearGradient id="slide2-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#065f46" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="slide2-title" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#6ee7b7" />
          </linearGradient>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#slide2-bg)"
          rx="8"
          stroke="#10b981"
          strokeWidth="1"
        />
        <text
          x="100"
          y="15"
          textAnchor="middle"
          fill="url(#slide2-title)"
          fontSize="10"
          fontWeight="bold"
        >
          Market Reality Check
        </text>
        <rect
          x="10"
          y="25"
          width="85"
          height="50"
          fill="#064e3b"
          stroke="#22c55e"
          strokeWidth="2"
          rx="4"
        />
        <text
          x="52.5"
          y="35"
          textAnchor="middle"
          fill="#6ee7b7"
          fontSize="8"
          fontWeight="bold"
        >
          SprintiQ™ Turbo
        </text>
        <text x="15" y="45" fill="#d1fae5" fontSize="4">
          • Planning-first
        </text>
        <text x="15" y="50" fill="#d1fae5" fontSize="4">
          • ML intelligence
        </text>
        <text x="15" y="55" fill="#d1fae5" fontSize="4">
          • Agile context
        </text>
        <text x="15" y="60" fill="#d1fae5" fontSize="4">
          • Predictable outcomes
        </text>
        <text x="15" y="65" fill="#d1fae5" fontSize="4">
          • Elite teams
        </text>
        <rect
          x="105"
          y="25"
          width="85"
          height="50"
          fill="#7f1d1d"
          stroke="#ef4444"
          strokeWidth="2"
          rx="4"
        />
        <text
          x="147.5"
          y="35"
          textAnchor="middle"
          fill="#fca5a5"
          fontSize="8"
          fontWeight="bold"
        >
          AI Market Focus
        </text>
        <text x="110" y="45" fill="#d1fae5" fontSize="4">
          • Vibe coding
        </text>
        <text x="110" y="50" fill="#d1fae5" fontSize="4">
          • Code generation
        </text>
        <text x="110" y="55" fill="#d1fae5" fontSize="4">
          • Workflow opt.
        </text>
        <text x="110" y="60" fill="#d1fae5" fontSize="4">
          • Planning afterthought
        </text>
        <text x="110" y="65" fill="#d1fae5" fontSize="4">
          • Manual bottleneck
        </text>
      </svg>
    ),
    content: (
      <section
        key="slide-2"
        className="w-full max-w-7xl mx-auto animate-slide-transition relative"
      >
        <div className="relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 bg-gradient-to-r from-emerald-300 via-green-300 to-emerald-400 bg-clip-text text-transparent animate-gradient-shift">
              Market Reality Check
            </h2>
            <div className="text-xl md:text-2xl text-emerald-100/90 max-w-4xl mx-auto font-light mb-8">
              While the AI Market focuses on coding and full stack automations
              and workflows, agile planning remains a heavy lift of anecdotal
              guesswork
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-400 mx-auto rounded-full animate-pulse-glow"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
            <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-l-4 border-green-400 p-8 rounded-2xl">
              <div className="flex items-center w-12 h-12 justify-center mb-6">
                <SnailSvg color="#6EE7B7" />
              </div>
              <h3 className="text-2xl font-bold text-green-300 mb-6">
                SprintiQ™ Turbo
              </h3>
              <ul className="space-y-4 text-emerald-100/90">
                <li>Planning-first specialization</li>
                <li>Integrated ML intelligence</li>
                <li>AI that understands agile context</li>
                <li>Predictable outcomes, not just features</li>
                <li>Elite teams use this approach</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-red-600/20 to-pink-600/20 border-l-4 border-red-400 p-8 rounded-2xl">
              <div className="flex items-center w-12 h-12 justify-center mb-6">
                <ChatbotSvg color="#FCA5A5" />
              </div>
              <h3 className="text-2xl font-bold text-red-300 mb-6">
                AI Market Focus
              </h3>
              <ul className="space-y-4 text-emerald-100/90">
                <li>Vibe coding and full-stack automation</li>
                <li>Code generation and debugging</li>
                <li>Development workflow optimization</li>
                <li>Planning focus is an afterthought</li>
                <li>Planning remains a manual bottleneck</li>
              </ul>
            </div>
          </div>

          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "800ms" }}
          >
            <div className="relative overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600/90 via-green-600/90 to-emerald-600/90 backdrop-blur-xl rounded-3xl p-10 text-white text-center max-w-6xl mx-auto border border-emerald-400/50 shadow-2xl">
                <div className="relative z-10">
                  <div className="text-xl md:text-2xl leading-relaxed italic text-emerald-200">
                    "This is our Blue Ocean opportunity!"
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    ),
  },
  {
    title: "Agile Planning is Broken",
    preview: (
      <svg width="100%" height="80" viewBox="0 0 200 80" className="rounded-xl">
        <defs>
          <linearGradient id="slide3-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#065f46" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="slide3-title" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#6ee7b7" />
          </linearGradient>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#slide3-bg)"
          rx="8"
          stroke="#10b981"
          strokeWidth="1"
        />
        <text
          x="100"
          y="15"
          textAnchor="middle"
          fill="url(#slide3-title)"
          fontSize="10"
          fontWeight="bold"
        >
          Agile Planning is Broken
        </text>
        <rect
          x="15"
          y="25"
          width="50"
          height="25"
          fill="#022c22"
          stroke="#10b981"
          strokeWidth="0.5"
          rx="4"
        />
        <text
          x="40"
          y="38"
          textAnchor="middle"
          fill="#6ee7b7"
          fontSize="10"
          fontWeight="bold"
        >
          67%
        </text>
        <text x="40" y="45" textAnchor="middle" fill="#d1fae5" fontSize="4">
          miss sprint goals
        </text>
        <rect
          x="75"
          y="25"
          width="50"
          height="25"
          fill="#022c22"
          stroke="#10b981"
          strokeWidth="0.5"
          rx="4"
        />
        <text
          x="100"
          y="38"
          textAnchor="middle"
          fill="#6ee7b7"
          fontSize="10"
          fontWeight="bold"
        >
          70%
        </text>
        <text x="100" y="45" textAnchor="middle" fill="#d1fae5" fontSize="4">
          projects fail
        </text>
        <rect
          x="135"
          y="25"
          width="50"
          height="25"
          fill="#022c22"
          stroke="#10b981"
          strokeWidth="0.5"
          rx="4"
        />
        <text
          x="160"
          y="38"
          textAnchor="middle"
          fill="#6ee7b7"
          fontSize="10"
          fontWeight="bold"
        >
          $52M
        </text>
        <text x="160" y="45" textAnchor="middle" fill="#d1fae5" fontSize="4">
          wasted/$1B
        </text>

        <text x="100" y="60" textAnchor="middle" fill="#d1fae5" fontSize="4">
          Source: PMI 2023 Report
        </text>
      </svg>
    ),
    content: (
      <section
        key="slide-3"
        className="w-full max-w-7xl mx-auto animate-slide-transition relative"
      >
        <div className="relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 bg-gradient-to-r from-emerald-300 via-green-300 to-emerald-400 bg-clip-text text-transparent animate-gradient-shift">
              Agile Planning is Broken
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-400 mx-auto rounded-full animate-pulse-glow"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            <div
              className="group relative overflow-hidden animate-fade-in-up investor-glass rounded-3xl p-8 text-center border border-emerald-500/20 shadow-xl transition-all duration-700 hover:scale-105"
              style={{ animationDelay: "0ms" }}
            >
              <div className="text-4xl md:text-5xl font-bold text-emerald-400 mb-4 group-hover:text-emerald-300 transition-colors duration-300">
                67%
              </div>
              <div className="text-emerald-100/90 text-lg group-hover:text-emerald-200 transition-colors duration-300">
                of agile teams miss sprint goals
              </div>
            </div>
            <div
              className="group relative overflow-hidden animate-fade-in-up investor-glass rounded-3xl p-8 text-center border border-emerald-500/20 shadow-xl transition-all duration-700 hover:scale-105"
              style={{ animationDelay: "200ms" }}
            >
              <div className="text-4xl md:text-5xl font-bold text-emerald-400 mb-4 group-hover:text-emerald-300 transition-colors duration-300">
                70%
              </div>
              <div className="text-emerald-100/90 text-lg group-hover:text-emerald-200 transition-colors duration-300">
                of agile projects fail
              </div>
            </div>
            <div
              className="group relative overflow-hidden animate-fade-in-up investor-glass rounded-3xl p-8 text-center border border-emerald-500/20 shadow-xl transition-all duration-700 hover:scale-105"
              style={{ animationDelay: "400ms" }}
            >
              <div className="text-4xl md:text-5xl font-bold text-emerald-400 mb-4 group-hover:text-emerald-300 transition-colors duration-300">
                $52M
              </div>
              <div className="text-emerald-100/90 text-lg group-hover:text-emerald-200 transition-colors duration-300">
                wasted per $1B invested due to poor agile planning
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <p className="text-emerald-100/90 text-lg">
              Source: PMI 2023 Report
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
            <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-l-4 border-green-400 p-8 rounded-2xl">
              <div className="flex items-center w-12 h-12 justify-center mb-6">
                <ChatbotSvg color="#6EE7B7" />
              </div>
              <h3 className="text-2xl font-bold text-green-300 mb-6">
                AI-Native Teams
              </h3>
              <ul className="space-y-4 text-emerald-100/90">
                <li>
                  <strong>Speed Efficiency:</strong> Complete comprehensive
                  planning in minutes, not hours
                </li>
                <li>
                  <strong>Predictive Accuracy:</strong> AI-native risk detection
                  prevents sprint derailment
                </li>
                <li>
                  <strong>Optimized Capacity:</strong> Data-driven estimates
                  eliminate over/under-commitment
                </li>
                <li>
                  <strong>Standardized Quality:</strong> Consistent story
                  formats across all team members
                </li>
                <li>
                  <strong>Strategic Leverage:</strong> PMs focus on vision and
                  stakeholder needs while AI handles the tactical execution
                  details
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-red-600/20 to-pink-600/20 border-l-4 border-red-400 p-8 rounded-2xl">
              <div className="flex items-center w-12 h-12 justify-center mb-6">
                <TeamsSvg color="#FCA5A5" />
              </div>
              <h3 className="text-2xl font-bold text-red-300 mb-6">
                Traditional Teams
              </h3>
              <ul className="space-y-4 text-emerald-100/90">
                <li>
                  <strong>Story Creation Gap:</strong> Manual writing takes 10x
                  longer than AI-native teams
                </li>
                <li>
                  <strong>Risk Prediction Gap:</strong> No visibility into
                  sprint blockers until it's too late
                </li>
                <li>
                  <strong>Capacity Planning Gap:</strong> Guesswork-based
                  estimates vs data-driven optimization
                </li>
                <li>
                  <strong>Quality Consistency Gap:</strong> Human variance vs AI
                  standardization
                </li>
                <li>
                  <strong>Strategic Focus Gap:</strong> PMs buried in busywork
                  vs strategic planning
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    ),
  },
  {
    title: "SprintiQ™ Turbo: Your AI Planning Assistant",
    preview: (
      <svg width="100%" height="80" viewBox="0 0 200 80" className="rounded-xl">
        <defs>
          <linearGradient id="slide4-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#065f46" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="slide4-title" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#6ee7b7" />
          </linearGradient>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#slide4-bg)"
          rx="8"
          stroke="#10b981"
          strokeWidth="1"
        />
        <text
          x="100"
          y="15"
          textAnchor="middle"
          fill="url(#slide4-title)"
          fontSize="9"
          fontWeight="bold"
        >
          SprintiQ™ Turbo
        </text>
        <text x="100" y="25" textAnchor="middle" fill="#d1fae5" fontSize="6">
          AI Planning Assistant
        </text>
        <rect
          x="10"
          y="30"
          width="55"
          height="18"
          fill="#022c22"
          stroke="#10b981"
          strokeWidth="0.5"
          rx="4"
        />
        <text
          x="37.5"
          y="40"
          textAnchor="middle"
          fill="#6ee7b7"
          fontSize="6"
          fontWeight="bold"
        >
          Real-World Training
        </text>
        <rect
          x="72.5"
          y="30"
          width="55"
          height="18"
          fill="#022c22"
          stroke="#10b981"
          strokeWidth="0.5"
          rx="4"
        />
        <text
          x="100"
          y="40"
          textAnchor="middle"
          fill="#6ee7b7"
          fontSize="6"
          fontWeight="bold"
        >
          Patent-Pending Algo
        </text>
        <rect
          x="135"
          y="30"
          width="55"
          height="18"
          fill="#022c22"
          stroke="#10b981"
          strokeWidth="0.5"
          rx="4"
        />
        <text
          x="162.5"
          y="40"
          textAnchor="middle"
          fill="#6ee7b7"
          fontSize="6"
          fontWeight="bold"
        >
          Adv. Architecture
        </text>
        <rect
          x="10"
          y="55"
          width="55"
          height="15"
          fill="#10b981"
          opacity="0.2"
          rx="4"
        />
        <text x="37.5" y="65" textAnchor="middle" fill="#6ee7b7" fontSize="6">
          5 min planning
        </text>
        <rect
          x="72.5"
          y="55"
          width="55"
          height="15"
          fill="#10b981"
          opacity="0.2"
          rx="4"
        />
        <text x="100" y="65" textAnchor="middle" fill="#6ee7b7" fontSize="6">
          75% savings
        </text>
        <rect
          x="135"
          y="55"
          width="55"
          height="15"
          fill="#10b981"
          opacity="0.2"
          rx="4"
        />
        <text x="162.5" y="65" textAnchor="middle" fill="#6ee7b7" fontSize="6">
          67% success
        </text>
      </svg>
    ),
    content: (
      <section
        key="slide-4"
        className="w-full max-w-7xl mx-auto animate-slide-transition relative"
      >
        <div className="relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 bg-gradient-to-r from-emerald-300 via-green-300 to-emerald-400 bg-clip-text text-transparent animate-gradient-shift">
              SprintiQ™ Turbo: Your AI Planning Assistant
            </h2>
            <div className="text-xl md:text-2xl text-emerald-100/90 max-w-4xl mx-auto font-light mb-8">
              Purpose-Built AI for Agile Planning Excellence
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-400 mx-auto rounded-full animate-pulse-glow"></div>
          </div>

          <div className="text-center mb-16 animate-fade-in-up">
            <div className="flex justify-center items-center mb-8 gap-4">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-md p-2">
                <TargetSVG color="#6EE7B7" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
                Our Trained AI Agents are Agile Planning Experts
              </h3>
            </div>
            <span className="text-emerald-100/90 text-lg">
              Product managers no longer face the blank slate. Our AI writes
              user stories with precision, prioritizes by real impact, and
              surfaces risks before they derail sprints. This transforms sprints
              from hopeful wish lists into realistic, aligned, and predictable
              delivery commitments.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {" "}
            {[
              {
                name: "Real-World Training",
                description:
                  "AI trained on thousands of successful and failed agile projects with continuous learning from actual delivery data",
              },
              {
                name: "Patent-Pending Algorithm",
                description:
                  "Advanced multi-prioritization engine balancing business value, technical complexity, and team capacity",
              },
              {
                name: "Advanced Architecture",
                description:
                  "Tiered LLM integrations with predictive analytics for sprint risk detection and capacity optimization",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-l-4 border-green-400 p-6 rounded-2xl"
              >
                <div className="flex items-center  mb-6 gap-4">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-md p-2 text-emerald-300 font-bold text-2xl flex items-center justify-center">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-green-300">
                    {item.name}
                  </h3>
                </div>
                <span className="text-emerald-100/90 text-lg">
                  {item.description}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
              Seamless Integration
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
            {[
              { name: "Jira", icon: <JiraSvg /> },
              { name: "Slack", icon: <SlackSvg /> },
              { name: "GitHub", icon: <GithubSvg /> },
              { name: "Asana", icon: <AsanaSvg /> },
              { name: "ClickUp", icon: <ClickUpSvg /> },
              { name: "Monday", icon: <MondaySvg /> },
              { name: "Azure DevOps", icon: <AzureSvg /> },
              { name: "MS Teams", icon: <MSteamsSvg /> },
            ].map((integration, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-xl rounded-xl p-4 flex flex-col items-center justify-center text-center border border-emerald-500/20 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center w-12 h-12 justify-center mb-2">
                  {integration.icon}
                </div>
                <div className="text-emerald-300 font-medium">
                  {integration.name}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 text-center border border-emerald-500/20">
              <div className="text-3xl font-bold text-emerald-400 mb-2">
                5 min
              </div>
              <div className="text-emerald-100/90 text-sm">
                Planning time vs 5 hours manual
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 text-center border border-emerald-500/20">
              <div className="text-3xl font-bold text-emerald-400 mb-2">
                75%
              </div>
              <div className="text-emerald-100/90 text-sm">
                Time savings reported
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 text-center border border-emerald-500/20">
              <div className="text-3xl font-bold text-emerald-400 mb-2">
                67%
              </div>
              <div className="text-emerald-100/90 text-sm">
                Sprint failure rate eliminated
              </div>
            </div>
          </div>
        </div>
      </section>
    ),
  },
  {
    title: "Market Validation",
    preview: (
      <svg width="100%" height="80" viewBox="0 0 200 80" className="rounded-xl">
        <defs>
          <linearGradient id="slide5-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#065f46" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="slide5-title" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#6ee7b7" />
          </linearGradient>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#slide5-bg)"
          rx="8"
          stroke="#10b981"
          strokeWidth="1"
        />
        <text
          x="100"
          y="15"
          textAnchor="middle"
          fill="url(#slide5-title)"
          fontSize="10"
          fontWeight="bold"
        >
          Market Validation
        </text>
        <rect
          x="10"
          y="25"
          width="55"
          height="20"
          fill="#022c22"
          stroke="#10b981"
          strokeWidth="0.5"
          rx="4"
        />
        <text
          x="37.5"
          y="35"
          textAnchor="middle"
          fill="#6ee7b7"
          fontSize="6"
          fontWeight="bold"
        >
          Scrum Master
        </text>
        <rect
          x="72.5"
          y="25"
          width="55"
          height="20"
          fill="#022c22"
          stroke="#10b981"
          strokeWidth="0.5"
          rx="4"
        />
        <text
          x="100"
          y="35"
          textAnchor="middle"
          fill="#6ee7b7"
          fontSize="6"
          fontWeight="bold"
        >
          Engineer
        </text>
        <rect
          x="135"
          y="25"
          width="55"
          height="20"
          fill="#022c22"
          stroke="#10b981"
          strokeWidth="0.5"
          rx="4"
        />
        <text
          x="162.5"
          y="35"
          textAnchor="middle"
          fill="#6ee7b7"
          fontSize="6"
          fontWeight="bold"
        >
          PM
        </text>
        <rect
          x="10"
          y="55"
          width="180"
          height="15"
          fill="#10b981"
          opacity="0.2"
          rx="4"
        />
        <text x="100" y="65" textAnchor="middle" fill="#6ee7b7" fontSize="6">
          Companies Testing Prototype
        </text>
      </svg>
    ),
    content: (
      <section
        key="slide-5"
        className="w-full max-w-7xl mx-auto animate-slide-transition relative"
      >
        <div className="relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 bg-gradient-to-r from-emerald-300 via-green-300 to-emerald-400 bg-clip-text text-transparent animate-gradient-shift">
              Market Validation
            </h2>
            <div className="text-xl md:text-2xl text-emerald-100/90 max-w-4xl mx-auto font-light mb-8">
              From 20 overwhelmed agile product people that tested our prototype
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-400 mx-auto rounded-full animate-pulse-glow"></div>
          </div>

          <div className="space-y-8 max-w-6xl mx-auto mb-16">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border-l-4 border-emerald-400">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10">
                  <ScrumMasterSvg color="#6EE7B7" />
                </div>
                <h3 className="text-xl font-bold text-emerald-300">
                  Scrum Master
                </h3>
              </div>
              <p className="text-emerald-100/90 italic mb-4">
                "Backlog grooming was my weekly nightmare that was like 2-3
                hours of debating acceptance criteria and feature priorities.
                Turbo changed this into 30-45 minute strategic grooming sessions
                because the AI already generated solid acceptance criteria and
                feature priority rankings."
              </p>
              <p className="text-emerald-200 text-sm">
                ~Alexi, Certified Scrum Master at a digital lead generation
                company
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border-l-4 border-emerald-400">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-12 h-12">
                  <EngineerSvg color="#6EE7B7" />
                </div>
                <h3 className="text-xl font-bold text-emerald-300">
                  Engineering Manager
                </h3>
              </div>
              <p className="text-emerald-100/90 italic mb-4">
                "My developers were spending more time deciphering vague stories
                than coding. Turbo gave us crystal clear requirements and
                automatically optimizes assignments based on each developer's
                skill level - junior devs get appropriate tasks while seniors
                handle complex architecture. Our sprint velocity increased 40%.
                It's like having an AI scrum master that actually understands
                our team."
              </p>
              <p className="text-emerald-200 text-sm">
                ~Andrew, Chief Data Engineer at a US government healthcare
                organization
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border-l-4 border-emerald-400">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-12 h-12">
                  <ProductManagerSvg color="#6EE7B7" />
                </div>
                <h3 className="text-xl font-bold text-emerald-300">
                  Product Manager
                </h3>
              </div>
              <p className="text-emerald-100/90 italic mb-4">
                "Turbo transformed our planning from a 4-5 hour chaotic
                nightmare into a 30 minute strategic session. I love its
                prioritization algorithm and persona based stories!"
              </p>
              <p className="text-emerald-200 text-sm">
                ~Sarah, PM for a leading gaming company
              </p>
            </div>
          </div>

          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
              Companies
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {[
              {
                name: "Ubisoft",
                icon: (
                  <Image
                    src="https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/companies/ubisoft.svg"
                    alt="Ubisoft"
                    width={120}
                    height={120}
                  />
                ),
              },
              {
                name: "Stanford University",
                icon: (
                  <Image
                    src="https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/companies/stanford.png"
                    alt="Stanford University"
                    width={200}
                    height={200}
                  />
                ),
                color: "light",
              },
              {
                name: "IBM",
                icon: (
                  <Image
                    src="https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/companies/ibm.svg"
                    alt="Stanford University"
                    width={150}
                    height={100}
                  />
                ),
              },
              {
                name: "Otsuka",
                icon: (
                  <Image
                    src="https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/companies/otsuka.svg"
                    alt="Otsuka"
                    width={150}
                    height={100}
                  />
                ),
                color: "light",
              },
              {
                name: "Beejern",
                icon: (
                  <Image
                    src="https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/companies/beejern.svg"
                    alt="Beejern"
                    width={200}
                    height={100}
                  />
                ),
                color: "light",
              },
              {
                name: "A4D",
                icon: (
                  <Image
                    src="https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/companies/a4d.png"
                    alt="A4D"
                    width={100}
                    height={100}
                  />
                ),
                color: "light",
              },
              {
                name: "USDA",
                icon: (
                  <Image
                    src="https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/companies/usda.svg"
                    alt="USDA"
                    width={100}
                    height={100}
                  />
                ),
              },
              {
                name: "The VA",
                icon: (
                  <Image
                    src="https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/companies/the_va.png"
                    alt="VA"
                    width={190}
                    height={190}
                  />
                ),
                color: "light",
              },
              {
                name: "Booz Allen",
                icon: (
                  <Image
                    src="https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/companies/bah.svg"
                    alt="BAH"
                    width={70}
                    height={70}
                  />
                ),
              },
            ].map((company, index) => (
              <div
                key={company.name}
                className={`bg-white/5 backdrop-blur-xl rounded-xl p-8 text-center border border-emerald-500/20 hover:bg-white/10 transition-all duration-300 ${
                  company.color === "light"
                    ? "bg-white/5"
                    : "bg-gradient-to-br from-emerald-600 to-green-600"
                }`}
              >
                <div className="flex w-full h-24 items-center justify-center mb-6">
                  {company.icon}
                </div>
                <div
                  className={`text-base font-medium ${
                    company.color === "light"
                      ? "text-emerald-300"
                      : "text-white"
                  }`}
                >
                  {company.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },
  {
    title: "Competition Analysis",
    preview: (
      <svg width="100%" height="80" viewBox="0 0 200 80" className="rounded-xl">
        <defs>
          <linearGradient id="slide6-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#065f46" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="slide6-title" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#6ee7b7" />
          </linearGradient>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#slide6-bg)"
          rx="8"
          stroke="#10b981"
          strokeWidth="1"
        />
        <text
          x="100"
          y="15"
          textAnchor="middle"
          fill="url(#slide6-title)"
          fontSize="10"
          fontWeight="bold"
        >
          Competition Analysis
        </text>
        <rect
          x="10"
          y="25"
          width="180"
          height="15"
          fill="#022c22"
          stroke="#10b981"
          strokeWidth="0.5"
          rx="4"
        />
        <text x="100" y="35" textAnchor="middle" fill="#6ee7b7" fontSize="6">
          Zenhub | Jira | Forecast | ClickUp | Linear | SprintiQ
        </text>
        <rect
          x="10"
          y="50"
          width="180"
          height="15"
          fill="#10b981"
          opacity="0.2"
          rx="4"
        />
        <text x="100" y="60" textAnchor="middle" fill="#6ee7b7" fontSize="6">
          SprintiQ: Only AI built for agile planning
        </text>
      </svg>
    ),
    content: (
      <section
        key="slide-6"
        className="w-full max-w-7xl mx-auto animate-slide-transition relative"
      >
        <div className="relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 bg-gradient-to-r from-emerald-300 via-green-300 to-emerald-400 bg-clip-text text-transparent animate-gradient-shift">
              AI-Native Agile Planning Competitive Landscape
            </h2>
            <div className="text-xl md:text-2xl text-emerald-100/90 max-w-4xl mx-auto font-light mb-8">
              SprintiQ Turbo: Senior PM + Scrum Master AI vs. Junior PM & Basic
              Automation Tools
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-400 mx-auto rounded-full animate-pulse-glow"></div>
          </div>

          {[
            {
              name: "ThriveAI",
              icon: "/images/platforms/t.png",
              problemFocus:
                "Product managers waste 40-50% of their time on manual tasks instead of strategic work",
              description:
                "AI Junior Product Manager - handles simple busy work so PMs can focus on strategy. 24/7 monitoring with proactive alerts.",
              price: "$1.2M Pre-seed • No public integrations",
              screenshot: "/images/platforms/thrive.png",
              link: "https://www.thriveai.pm/",
              advantages: [
                "PM tool agnostic - integrates with entire dev ecosystem",
                "Senior PM + Scrum Master vs junior PM assistant",
                "2000+ stories from 200+ teams vs no training data",
              ],
            },
            {
              name: "Spinach.ai",
              icon: "/images/platforms/s.png",
              problemFocus:
                "Scrum Masters & teams lose productivity to meeting admin and documentation",
              description:
                "AI Scrum Master powered by GPT-4 that runs meetings and automates follow-ups. Automated standup facilitation with timer & rotation.",
              price: "YC-backed • 10+ integrations",
              screenshot: "/images/platforms/spinach.png",
              link: "https://www.spinach.ai/",
              advantages: [
                "NP-complete optimization vs basic meeting automation",
                "Predictive intelligence engine vs reactive documentation",
                "Real-time constraint solver vs simple automation",
              ],
            },
            {
              name: "StoriesOnBoard",
              icon: "/images/platforms/o.png",
              problemFocus:
                "Teams struggle with story creation, backlog visualization, and prioritization",
              description:
                "Visual story mapping enhanced with AI for automated story generation and prioritization. AI story generation with acceptance criteria & INVEST.",
              price: "Freemium • 8+ integrations",
              screenshot: "/images/platforms/storiesonboard.png",
              link: "https://storiesonboard.com/",
              advantages: [
                "Neuroscience-based design vs traditional UI mapping",
                "Adaptive persona weighting vs generic templates",
                "80%+ success rate training vs basic prioritization",
              ],
            },
            {
              name: "SprintiQ Turbo",
              icon: "/images/platforms/sq.png",
              problemFocus:
                "Sprint planning violates Miller's Rule by requiring 8-12 simultaneous variables, causing 40% productivity loss",
              description:
                "Senior PM-level AI agents with scrum master expertise, using neuroscience-based algorithms trained on 2000+ successful sprints to optimize planning.",
              price: "80%+ Success Training • PM Tool Agnostic",
              screenshot: "/images/platforms/sprintiq.png",
              link: "https://www.sprintiq.ai/",
              advantages: [
                "Cognitive load optimization - respects Miller's Rule",
                "Trained exclusively on 80%+ success sprints",
                "Gradient descent learning adapts to your team",
              ],
            },
          ].map((tool, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-3xl transition-all duration-500 hover:scale-[1.02] ${
                tool.name === "SprintiQ Turbo"
                  ? "bg-gradient-to-br from-green-600/20 via-emerald-600/15 to-green-700/20 border-2 border-green-400/50 shadow-2xl shadow-green-500/20 animate-pulse-glow"
                  : "bg-gradient-to-br from-slate-800/50 via-slate-700/30 to-slate-800/50 border border-slate-600/30 shadow-xl hover:shadow-2xl"
              }`}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-400"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]"></div>
              </div>

              <div className="relative z-10 p-8 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  {/* Left Column - Content */}
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                          tool.name === "SprintiQ Turbo"
                            ? "bg-gradient-to-br from-green-500/30 to-emerald-500/30 border border-green-400/50"
                            : "bg-gradient-to-br from-slate-700/50 to-slate-600/50 border border-slate-500/30"
                        }`}
                      >
                        <Image
                          src={tool.icon}
                          alt={tool.name}
                          width={64}
                          height={64}
                          className="rounded-2xl"
                        />
                      </div>
                      <div>
                        <h3
                          className={`text-2xl lg:text-3xl font-bold ${
                            tool.name === "SprintiQ Turbo"
                              ? "text-green-300"
                              : "text-emerald-300"
                          }`}
                        >
                          {tool.name}
                        </h3>
                        <div
                          className={`text-sm font-semibold ${
                            tool.name === "SprintiQ Turbo"
                              ? "text-green-400"
                              : "text-emerald-400"
                          }`}
                        >
                          {tool.price}
                        </div>
                      </div>
                    </div>

                    {/* Problem Focus */}
                    <div className="space-y-2">
                      <h4
                        className={`text-sm font-semibold uppercase tracking-wide ${
                          tool.name === "SprintiQ Turbo"
                            ? "text-green-400"
                            : "text-emerald-400"
                        }`}
                      >
                        Problem Focus
                      </h4>
                      <div
                        className={`p-4 rounded-xl border-l-4 ${
                          tool.name === "SprintiQ Turbo"
                            ? "bg-red-500/10 border-red-400/50 text-red-200"
                            : "bg-orange-500/10 border-orange-400/50 text-orange-200"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">
                          {tool.problemFocus}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-emerald-100/90 text-lg leading-relaxed">
                      {tool.description}
                    </p>

                    {/* Advantages */}
                    {tool.advantages && (
                      <div className="space-y-3">
                        <h4
                          className={`text-lg font-semibold ${
                            tool.name === "SprintiQ Turbo"
                              ? "text-green-300"
                              : "text-emerald-300"
                          }`}
                        >
                          SprintiQ Turbo Advantages:
                        </h4>
                        <div className="space-y-2">
                          {tool.advantages.map((advantage, advIndex) => (
                            <div
                              key={advIndex}
                              className="flex items-start gap-3"
                            >
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                                  tool.name === "SprintiQ Turbo"
                                    ? "bg-green-500/20 border border-green-400/50"
                                    : "bg-emerald-500/20 border border-emerald-400/50"
                                }`}
                              >
                                <span
                                  className={`text-xs font-bold ${
                                    tool.name === "SprintiQ Turbo"
                                      ? "text-green-400"
                                      : "text-emerald-400"
                                  }`}
                                >
                                  ✓
                                </span>
                              </div>
                              <span className="text-emerald-100/80 text-sm leading-relaxed">
                                {advantage}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Screenshot */}
                  <div className="relative group">
                    <div
                      className={`rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
                        tool.name === "SprintiQ Turbo"
                          ? "ring-2 ring-green-400/50"
                          : "ring-2 ring-slate-600/50"
                      }`}
                    >
                      {/* Screenshot Container */}
                      <div className="aspect-video relative overflow-hidden">
                        {/* Background Image */}
                        <Image
                          src={tool.screenshot}
                          alt={tool.name}
                          width={1000}
                          height={1000}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Preview Button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-4 left-4 w-20 h-3 bg-white/20 rounded"></div>
                            <div className="absolute top-4 right-4 w-16 h-3 bg-white/20 rounded"></div>
                            <div className="absolute top-12 left-4 w-32 h-2 bg-white/10 rounded"></div>
                            <div className="absolute top-16 left-4 w-24 h-2 bg-white/10 rounded"></div>
                            <div className="absolute top-20 left-4 w-28 h-2 bg-white/10 rounded"></div>
                            <div className="absolute bottom-4 left-4 w-16 h-8 bg-white/20 rounded"></div>
                            <div className="absolute bottom-4 right-4 w-16 h-8 bg-white/20 rounded"></div>
                          </div>
                          <button
                            onClick={() => window.open(tool.link, "_blank")}
                            className={`px-6 py-3 rounded-full font-semibold text-sm flex items-center gap-2 transition-all duration-300 transform group-hover:scale-105 ${
                              tool.name === "SprintiQ Turbo"
                                ? "bg-green-500/90 text-green-900 hover:bg-green-400/90 shadow-lg shadow-green-500/30"
                                : "bg-emerald-500/90 text-emerald-900 hover:bg-emerald-400/90 shadow-lg shadow-emerald-500/30"
                            }`}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            Preview Platform
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Floating Badge */}
                    <div
                      className={`absolute -top-3 -right-3 px-3 py-1 rounded-full text-xs font-bold ${
                        tool.name === "SprintiQ Turbo"
                          ? "bg-green-500/90 text-green-900"
                          : "bg-slate-600/90 text-slate-200"
                      }`}
                    >
                      {tool.name === "SprintiQ Turbo"
                        ? "OUR SOLUTION"
                        : "COMPETITOR"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
          className="animate-fade-in-up"
          style={{ animationDelay: "1200ms" }}
        >
          <div className="relative overflow-hidden max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-emerald-600/90 via-green-600/90 to-emerald-600/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-white border border-emerald-400/50 shadow-2xl">
              <div className="relative z-10">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-emerald-200 mb-4">
                    The Competitive Advantage
                  </h3>
                  <p className="text-lg sm:text-xl leading-relaxed">
                    <span className="font-bold text-emerald-200">
                      The Gap:{" "}
                    </span>{" "}
                    While competitors offer junior PM assistants or basic
                    meeting automation, SprintiQ Turbo provides senior PM-level
                    intelligence with scrum master expertise. The only AI
                    trained on 2000+ successful sprints to solve the cognitive
                    overload that causes 40% productivity loss in sprint
                    planning.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    ),
  },
  {
    title: "Experienced Team",
    preview: (
      <svg width="100%" height="80" viewBox="0 0 200 80" className="rounded-xl">
        <defs>
          <linearGradient id="slide7-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#065f46" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="slide7-title" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#6ee7b7" />
          </linearGradient>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#slide7-bg)"
          rx="8"
          stroke="#10b981"
          strokeWidth="1"
        />
        <text
          x="100"
          y="15"
          textAnchor="middle"
          fill="url(#slide7-title)"
          fontSize="10"
          fontWeight="bold"
        >
          Experienced Team
        </text>
        <rect
          x="10"
          y="25"
          width="40"
          height="20"
          fill="#022c22"
          stroke="#10b981"
          strokeWidth="0.5"
          rx="4"
        />
        <text
          x="30"
          y="35"
          textAnchor="middle"
          fill="#6ee7b7"
          fontSize="6"
          fontWeight="bold"
        >
          Jeff
        </text>
        <rect
          x="55"
          y="25"
          width="40"
          height="20"
          fill="#022c22"
          stroke="#10b981"
          strokeWidth="0.5"
          rx="4"
        />
        <text
          x="75"
          y="35"
          textAnchor="middle"
          fill="#6ee7b7"
          fontSize="6"
          fontWeight="bold"
        >
          David
        </text>
        <rect
          x="100"
          y="25"
          width="40"
          height="20"
          fill="#022c22"
          stroke="#10b981"
          strokeWidth="0.5"
          rx="4"
        />
        <text
          x="120"
          y="35"
          textAnchor="middle"
          fill="#6ee7b7"
          fontSize="6"
          fontWeight="bold"
        >
          Rachael
        </text>
        <rect
          x="145"
          y="25"
          width="40"
          height="20"
          fill="#022c22"
          stroke="#10b981"
          strokeWidth="0.5"
          rx="4"
        />
        <text
          x="165"
          y="35"
          textAnchor="middle"
          fill="#6ee7b7"
          fontSize="6"
          fontWeight="bold"
        >
          Ardi
        </text>
        <rect
          x="10"
          y="55"
          width="55"
          height="15"
          fill="#10b981"
          opacity="0.2"
          rx="4"
        />
        <text x="37.5" y="65" textAnchor="middle" fill="#6ee7b7" fontSize="6">
          50+ Years
        </text>
        <rect
          x="72.5"
          y="55"
          width="55"
          height="15"
          fill="#10b981"
          opacity="0.2"
          rx="4"
        />
        <text x="100" y="65" textAnchor="middle" fill="#6ee7b7" fontSize="6">
          20+ Launches
        </text>
        <rect
          x="135"
          y="55"
          width="55"
          height="15"
          fill="#10b981"
          opacity="0.2"
          rx="4"
        />
        <text x="162.5" y="65" textAnchor="middle" fill="#6ee7b7" fontSize="6">
          10+ AI Impls
        </text>
      </svg>
    ),
    content: (
      <section
        key="slide-7"
        className="w-full max-w-7xl mx-auto animate-slide-transition relative"
      >
        <div className="relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 bg-gradient-to-r from-emerald-300 via-green-300 to-emerald-400 bg-clip-text text-transparent animate-gradient-shift">
              Experienced Team
            </h2>
            <div className="text-xl md:text-2xl text-emerald-100/90 max-w-4xl mx-auto font-light mb-8">
              Built by practitioners who understand the pain
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-400 mx-auto rounded-full animate-pulse-glow"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
            {[
              {
                name: "Dr. Jeff Nagy, PhD",
                title: "CEO & President",
                description: "Product Strategy & Vision",
                image: "/images/teams/jeff.jpeg",
              },
              {
                name: "David Lin",
                title: "CTO & Secretary",
                description: "AI Architecture & Development",
                image: "/images/teams/dlin.jpeg",
              },
              {
                name: "Rachael Long",
                title: "COO",
                description: "Business Operations & Growth",
                image: "/images/teams/rachael.jpeg",
              },
              {
                name: "Ardi Iranmanesh",
                title: "Strategic Advisor",
                description: "Startup Fundraising & Scaling Expert",
                image: "/images/teams/ardi.jpeg",
              },
            ].map((person, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-emerald-500/20"
              >
                <div className="flex items-center gap-4">
                  <div className="relative mb-6 flex justify-center items-center w-32 h-32">
                    {/* Rotating Line Animation */}
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-400 border-r-emerald-300 animate-spin-slow"></div>
                    <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-green-400 border-l-green-300 animate-spin-slow-reverse"></div>

                    {/* Main Avatar Container */}
                    <div className="relative w-18 h-18 rounded-full bg-gradient-to-r from-emerald-400 to-green-400 p-1 animate-pulse-glow">
                      <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                        <img
                          src={person.image}
                          alt={person.name}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Additional Rotating Elements */}
                    <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-spin-slow"></div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-lg font-bold text-emerald-300 mb-2">
                      {person.name}
                    </div>
                    <div className="text-emerald-400 font-semibold mb-2">
                      {person.title}
                    </div>
                    <div className="text-emerald-100/90 text-sm">
                      {person.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 text-center border border-emerald-500/20">
              <div className="text-3xl font-bold text-emerald-400 mb-2">
                50+
              </div>
              <div className="text-emerald-100/90 text-sm">
                Years Combined Agile Experience
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 text-center border border-emerald-500/20">
              <div className="text-3xl font-bold text-emerald-400 mb-2">
                20+
              </div>
              <div className="text-emerald-100/90 text-sm">
                Enterprise Product Launches
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 text-center border border-emerald-500/20">
              <div className="text-3xl font-bold text-emerald-400 mb-2">
                10+
              </div>
              <div className="text-emerald-100/90 text-sm">
                Successful AI implementations
              </div>
            </div>
          </div>
        </div>
        <div
          className="animate-fade-in-up"
          style={{ animationDelay: "1000ms" }}
        >
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 text-white text-center max-w-6xl mx-auto border border-emerald-400/50 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Contact Information */}
              <div className="space-y-6">
                <div className="text-center lg:text-left">
                  <h3 className="text-2xl font-bold text-emerald-200 mb-6 bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
                    Get in Touch
                  </h3>
                  <p className="text-emerald-100/90 text-lg mb-8">
                    Ready to transform your agile planning? Let's discuss how
                    SprintiQ™ can revolutionize your team's productivity.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-emerald-400/20 hover:bg-white/10 transition-all duration-300 group">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center group-hover:bg-emerald-400/30 transition-colors duration-300">
                      <User className="w-5 h-5 text-emerald-300" />
                    </div>
                    <div className="text-left">
                      <div className="text-emerald-200 font-semibold">
                        Dr. Jeff Nagy, PhD
                      </div>
                      <div className="text-emerald-100/70 text-sm">
                        CEO & President
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-emerald-400/20 hover:bg-white/10 transition-all duration-300 group">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center group-hover:bg-emerald-400/30 transition-colors duration-300">
                      <Mail className="w-5 h-5 text-emerald-300" />
                    </div>
                    <div className="text-left">
                      <div className="text-emerald-200 font-semibold">
                        Email
                      </div>
                      <div className="text-emerald-100/70 text-sm">
                        jeff@sprintiq.ai
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-emerald-400/20 hover:bg-white/10 transition-all duration-300 group">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center group-hover:bg-emerald-400/30 transition-colors duration-300">
                      <Phone className="w-5 h-5 text-emerald-300" />
                    </div>
                    <div className="text-left">
                      <div className="text-emerald-200 font-semibold">
                        Phone
                      </div>
                      <div className="text-emerald-100/70 text-sm">
                        (504) 575-2477
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="space-y-8">
                <div className="text-center">
                  <h4 className="text-xl font-bold text-emerald-200 mb-4">
                    Ready for a 30-Second Demo?
                  </h4>
                  <p className="text-emerald-100/80 text-lg mb-8">
                    See how SprintiQ™ Turbo transforms your planning from hours
                    to minutes
                  </p>
                </div>

                <div className="space-y-4">
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white text-lg font-semibold py-4 px-8 rounded-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                    <span className="flex items-center gap-2">
                      Request Demo
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>

                  <Button className="w-full bg-transparent text-emerald-200 text-lg font-semibold py-4 px-8 rounded-xl border-2 border-emerald-400/50 hover:border-emerald-300 hover:bg-emerald-400/10 transition-all duration-300 transform hover:scale-105 group">
                    <span className="flex items-center gap-2">
                      Schedule Call
                      <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </span>
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-emerald-100/60 text-sm">
                    No commitment required • 15-minute consultation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    ),
  },
];

function FullScreenModal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] w-screen h-screen flex flex-col bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 z-0" onClick={onClose} />
      <div className="relative z-10 flex flex-col h-full">{children}</div>
    </div>,
    typeof window !== "undefined" ? document.body : (null as any)
  );
}

export default function InvestorRelationsModal({
  open,
  onOpenChange,
}: InvestorRelationsModalProps) {
  const [current, setCurrent] = React.useState(0);
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const goTo = (idx: number) => setCurrent(idx);
  const next = () => setCurrent((c) => (c + 1 < slides.length ? c + 1 : c));
  const prev = () => setCurrent((c) => (c - 1 >= 0 ? c - 1 : c));

  React.useEffect(() => {
    if (!open) setCurrent(0);
  }, [open]);

  React.useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [current]);

  // Modal content (shared between normal and full screen)
  const modalContent = (
    <>
      <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2 border-b border-emerald-500/10">
        <div className="text-2xl font-bold text-emerald-300">
          Investor Relations
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullScreen((v) => !v)}
            className="text-emerald-300 hover:text-white hover:bg-emerald-500/20"
            aria-label={isFullScreen ? "Exit Full Screen" : "Full Screen"}
          >
            {isFullScreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              isFullScreen ? setIsFullScreen(false) : onOpenChange(false)
            }
            className="text-emerald-300 hover:text-white hover:bg-emerald-500/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div
        className={`flex ${
          isFullScreen ? "h-full min-h-0" : "h-[70vh] min-h-[400px]"
        }`}
      >
        {/* Left: Slide List with Preview */}
        {!isFullScreen && (
          <div className="w-56 bg-slate-900/80 border-r border-emerald-500/10 flex flex-col py-6 px-2 gap-3 overflow-y-auto scrollbar-thin scrollbar-track-emerald-900/20 scrollbar-thumb-emerald-500/50 hover:scrollbar-thumb-emerald-400/60 scrollbar-thumb-rounded-full">
            {slides.map((slide, idx) => (
              <button
                key={slide.title}
                onClick={() => goTo(idx)}
                className={`flex flex-col items-center w-full rounded-xl border-2 transition-all duration-200 p-2 mb-1 shadow-sm focus:outline-none ${
                  idx === current
                    ? "border-emerald-400 bg-emerald-800/40 ring-2 ring-emerald-300"
                    : "border-transparent hover:border-emerald-700/60 hover:bg-emerald-900/30"
                }`}
              >
                <div className="w-full flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-emerald-200 w-5 text-center">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-white truncate">
                    {slide.title}
                  </span>
                </div>
                <div className="w-full">{slide.preview}</div>
              </button>
            ))}
          </div>
        )}
        {/* Main: Slide Content */}
        <div
          ref={contentRef}
          className={`flex-1 flex flex-col px-8 py-8 overflow-y-auto ${
            isFullScreen ? "h-full min-h-0" : ""
          } scrollbar-thin scrollbar-track-emerald-900/20 scrollbar-thumb-emerald-500/50 hover:scrollbar-thumb-emerald-400/60 scrollbar-thumb-rounded-full`}
          style={isFullScreen ? { background: "inherit" } : {}}
        >
          <div className="w-full max-w-6xl mx-auto">
            {slides[current].content}
          </div>
          {isFullScreen && (
            <>
              <div className="fixed bottom-8 left-6 transform -translate-x-1/2 z-40">
                <button
                  className="p-2 rounded-full bg-emerald-600/80 hover:bg-emerald-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                  onClick={() => setCurrent((s) => Math.max(0, s - 1))}
                  disabled={current === 0}
                >
                  <ChevronLeft className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                </button>
              </div>
              <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
                <div className="bg-black/40 backdrop-blur-xl rounded-full px-6 py-3 border border-emerald-500/20 shadow-2xl">
                  <div className="flex items-center gap-6">
                    <div className="text-white font-bold text-lg min-w-[80px] text-center">
                      {current + 1} / {slides.length}
                    </div>
                  </div>
                </div>
              </div>
              <div className="fixed bottom-8 right-1 transform -translate-x-1/2 z-40">
                <button
                  className="p-2 rounded-full bg-emerald-600/80 hover:bg-emerald-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                  onClick={() =>
                    setCurrent((s) => Math.min(slides.length - 1, s + 1))
                  }
                  disabled={current === slides.length - 1}
                >
                  <ChevronRight className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );

  if (isFullScreen) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
        <FullScreenModal onClose={() => setIsFullScreen(false)}>
          {modalContent}
        </FullScreenModal>
      </>
    );
  }

  // When not in full screen, render without Dialog to avoid default close button
  if (!open) return null;

  return ReactDOM.createPortal(
    <>
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="fixed inset-0 bg-black/50"
          onClick={() => onOpenChange(false)}
        />
        <div className="relative z-10 max-w-7xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white border border-emerald-500/20 rounded-lg">
          {modalContent}
        </div>
      </div>
    </>,
    typeof window !== "undefined" ? document.body : (null as any)
  );
}
