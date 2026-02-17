"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Link,
  Mail,
  Phone,
  User,
} from "lucide-react";
import Navbar from "@/components/landing/layout/navbar";
import Footer from "@/components/landing/layout/footer";
import Image from "next/image";
import JiraSvg from "@/components/svg/apps/JiraSvg";
import { ClickUpSvg } from "@/components/svg/apps/ClickUpSvg";
import { MondaySvg } from "@/components/svg/apps/MondaySvg";
import AsanaSvg from "@/components/svg/apps/AsanaSvg";
import GithubSvg from "@/components/svg/apps/GithubSvg";
import SlackSvg from "@/components/svg/apps/SlackSvg";
import AzureSvg from "@/components/svg/apps/AzureSvg";
import MSteamsSvg from "@/components/svg/apps/MSteamsSvg";
import { ScrumMasterSvg } from "@/components/svg/users/ScrumMasterSvg";
import { EngineerSvg } from "@/components/svg/users/EngineerSvg";
import { ProductManagerSvg } from "@/components/svg/users/ProductManagerSvg";
import ZenhubSvg from "@/components/svg/apps/ZenhubSvg";
import ForecastSvg from "@/components/svg/apps/ForecastSvg";
import LinearSvg from "@/components/svg/apps/LinearSvg";
import { Button } from "@/components/ui/button";
import { TargetSVG } from "@/components/svg/TargetSVG";
import ChatbotSvg from "@/components/svg/ChatbotSvg";
import { TeamSvg } from "@/components/svg/TeamSvg";
import TeamsSvg from "@/components/svg/TeamsSvg";
import SnailSvg from "@/components/svg/SnailSvg";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Email verification modal component
function EmailVerificationModal({
  isOpen,
  onClose,
  onVerified,
}: {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
}) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClientComponentClient();

  const handleVerify = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Check if user exists and has appropriate role
      const { data: userRecord, error: userError } = await supabase
        .from("users")
        .select("allowed, role")
        .eq("email", email.toLowerCase().trim())
        .maybeSingle();

      if (userError) {
        setError("An error occurred while verifying your email");
        return;
      }

      if (!userRecord) {
        setError("Email not found in our system");
        return;
      }

      if (userRecord.allowed === false) {
        setError("Your account has been deactivated");
        return;
      }

      if (userRecord.role !== "investor" && userRecord.role !== "admin") {
        setError("You don't have permission to access this page");
        return;
      }

      // Email is verified, show the content
      onVerified();
    } catch (error) {
      setError("An error occurred while verifying your email");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="relative bg-gradient-to-br from-slate-900 via-emerald-900/95 to-slate-900 text-white border border-emerald-500/30 rounded-2xl p-6 sm:p-8 max-w-lg w-full mx-4 shadow-2xl">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 rounded-2xl"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 sm:w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-300" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
              Investor Relations Access
            </h2>
            <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed">
              Please verify your email address to access our comprehensive
              investor relations content and materials.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <Label
                htmlFor="email"
                className="text-emerald-200 font-medium text-sm uppercase tracking-wide"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your professional email address"
                className="mt-2 bg-slate-800/50 border-emerald-500/30 text-white placeholder:text-emerald-300/50 focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-200 h-11 sm:h-12 text-sm sm:text-base"
                onKeyPress={(e) => e.key === "Enter" && handleVerify()}
                disabled={isLoading}
              />
            </div>

            {error && (
              <Alert className="border-red-500/30 bg-red-500/10 backdrop-blur-sm">
                <AlertDescription className="text-red-200 font-medium text-sm">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <Button
                onClick={handleVerify}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold h-11 sm:h-12 text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Verifying...
                  </div>
                ) : (
                  "Verify Access"
                )}
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-400 h-11 sm:h-12 text-sm sm:text-base font-medium transition-all duration-200"
              >
                Cancel
              </Button>
            </div>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-emerald-500/20">
              <p className="text-emerald-100/70 text-xs sm:text-sm">
                Secure access for investors, partners, and authorized personnel
                only
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InvestorRelationsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showEmailModal, setShowEmailModal] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    image: string;
    title: string;
  }>({
    isOpen: false,
    image: "",
    title: "",
  });
  const router = useRouter();

  const handleVerified = () => {
    setIsVerified(true);
    setShowEmailModal(false);
  };

  // All slides as an array of JSX elements
  const slides = [
    // Slide 1: Title & Market
    <section
      key="slide-1"
      className="w-full max-w-7xl mx-auto animate-slide-transition relative"
    >
      <div className="relative z-10">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 sm:mb-8 bg-gradient-to-r from-emerald-300 via-green-300 to-emerald-400 bg-clip-text text-transparent animate-gradient-shift">
            SprintiQ™
          </h1>
          <div className="text-lg sm:text-xl md:text-2xl text-emerald-100/90 max-w-4xl mx-auto font-light mb-6 sm:mb-8 italic">
            "The Planning Revolution Already Started"
          </div>
          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-400 mx-auto rounded-full animate-pulse-glow"></div>
        </div>

        <div className="text-center mb-8 sm:mb-12 lg:mb-16 animate-fade-in-up">
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8 bg-gradient-to-r from-emerald-300 via-green-300 to-emerald-400 bg-clip-text text-transparent animate-gradient-shift">
            Market Fragmentation & Convergence Opportunity
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-6xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <div className="grid grid-rows-2 gap-4 sm:gap-6">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div
                className={`group relative overflow-hidden animate-fade-in-up investor-glass rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center h-full p-4 sm:p-6 lg:p-8 text-center border transition-all duration-700 hover:scale-105`}
                style={{ animationDelay: "0ms" }}
              >
                {/* Value */}
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold  text-emerald-400 group-hover:text-emerald-300 mb-2 sm:mb-4 transition-colors duration-300">
                  $5.2B
                </div>

                {/* Label */}
                <div className="text-emerald-100/90 text-xs sm:text-sm font-medium group-hover:text-emerald-200 transition-colors duration-300">
                  Agile PM Tool Market
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-green-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl sm:rounded-3xl"></div>
              </div>
              <div
                className={`group relative overflow-hidden animate-fade-in-up investor-glass rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center h-full p-4 sm:p-6 lg:p-8 text-center border transition-all duration-700 hover:scale-105`}
                style={{ animationDelay: "0ms" }}
              >
                {/* Value */}
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold  text-emerald-400 group-hover:text-emerald-300 mb-2 sm:mb-4 transition-colors duration-300">
                  $22.2B
                </div>

                {/* Label */}
                <div className="text-emerald-100/90 text-xs sm:text-sm font-medium group-hover:text-emerald-200 transition-colors duration-300">
                  AI Development Tools Market
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-green-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl sm:rounded-3xl"></div>
              </div>
            </div>
            <div
              className={`group relative overflow-hidden animate-fade-in-up investor-glass rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center h-full p-4 sm:p-6 lg:p-8 text-center border transition-all duration-700 hover:scale-105`}
              style={{ animationDelay: "0ms" }}
            >
              {/* Value */}
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold  text-emerald-400 group-hover:text-emerald-300 mb-2 sm:mb-4 transition-colors duration-300">
                $32B
              </div>

              {/* Label */}
              <div className="text-emerald-100/90 text-xs sm:text-sm font-medium group-hover:text-emerald-200 transition-colors duration-300">
                Vibe Coding Market
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-green-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl sm:rounded-3xl"></div>
            </div>
          </div>
          <div
            className={`group relative overflow-hidden animate-fade-in-up investor-glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 text-center flex flex-col items-center justify-center h-full border transition-all duration-700 hover:scale-105`}
            style={{ animationDelay: "0ms" }}
          >
            {/* Value */}
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-emerald-400 mb-2 sm:mb-4 group-hover:text-emerald-300 transition-colors duration-300">
              $59.4B
            </div>

            {/* Label */}
            <div className="text-emerald-100/90 text-xs sm:text-sm font-medium group-hover:text-emerald-200 transition-colors duration-300">
              Total Market Convergence
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-green-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl sm:rounded-3xl"></div>
          </div>
        </div>

        <div
          className="text-center mb-8 sm:mb-12 lg:mb-16 animate-fade-in-up"
          style={{ animationDelay: "800ms" }}
        >
          <p className="text-base sm:text-lg md:text-xl text-emerald-100/90 max-w-4xl mx-auto font-light">
            Three massive markets colliding into one AI-native ecosystem
          </p>
        </div>

        <div
          className="animate-fade-in-up"
          style={{ animationDelay: "1000ms" }}
        >
          <div className="relative overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600/90 via-green-600/90 to-emerald-600/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-white text-center max-w-6xl mx-auto border border-emerald-400/50 shadow-2xl">
              <div className="relative z-10">
                <div className="text-lg sm:text-xl md:text-2xl leading-relaxed italic text-emerald-200">
                  "The planning efficiency gap is not coming, it's here!"
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>,
    // Slide 2: Market Reality Check
    <section
      key="slide-2"
      className="w-full max-w-7xl mx-auto animate-slide-transition relative"
    >
      <div className="relative z-10">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8 bg-gradient-to-r from-emerald-300 via-green-300 to-emerald-400 bg-clip-text text-transparent animate-gradient-shift">
            Market Reality Check
          </h2>
          <div className="text-lg sm:text-xl md:text-2xl text-emerald-100/90 max-w-4xl mx-auto font-light mb-6 sm:mb-8">
            While the AI Market focuses on coding and full stack automations and
            workflows, agile planning remains a heavy lift of anecdotal
            guesswork
          </div>
          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-400 mx-auto rounded-full animate-pulse-glow"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-l-4 border-green-400 p-6 sm:p-8 rounded-2xl">
            <div className="flex items-center w-10 h-10 sm:w-12 sm:h-12 justify-center mb-4 sm:mb-6">
              <SnailSvg color="#6EE7B7" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-green-300 mb-4 sm:mb-6">
              SprintiQ™ Turbo
            </h3>
            <ul className="space-y-3 sm:space-y-4 text-emerald-100/90 text-sm sm:text-base">
              <li>Planning-first specialization</li>
              <li>Integrated ML intelligence</li>
              <li>AI that understands agile context</li>
              <li>Predictable outcomes, not just features</li>
              <li>Elite teams use this approach</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-red-600/20 to-pink-600/20 border-l-4 border-red-400 p-6 sm:p-8 rounded-2xl">
            <div className="flex items-center w-10 h-10 sm:w-12 sm:h-12 justify-center mb-4 sm:mb-6">
              <ChatbotSvg color="#FCA5A5" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-red-300 mb-4 sm:mb-6">
              AI Market Focus
            </h3>
            <ul className="space-y-3 sm:space-y-4 text-emerald-100/90 text-sm sm:text-base">
              <li>Vibe coding and full-stack automation</li>
              <li>Code generation and debugging</li>
              <li>Development workflow optimization</li>
              <li>Planning focus is an afterthought</li>
              <li>Planning remains a manual bottleneck</li>
            </ul>
          </div>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "800ms" }}>
          <div className="relative overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600/90 via-green-600/90 to-emerald-600/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-white text-center max-w-6xl mx-auto border border-emerald-400/50 shadow-2xl">
              <div className="relative z-10">
                <div className="text-lg sm:text-xl md:text-2xl leading-relaxed italic text-emerald-200">
                  "This is our Blue Ocean opportunity!"
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>,

    // Slide 3: Agile Planning is Broken
    <section
      key="slide-3"
      className="w-full max-w-7xl mx-auto animate-slide-transition relative"
    >
      <div className="relative z-10">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8 bg-gradient-to-r from-emerald-300 via-green-300 to-emerald-400 bg-clip-text text-transparent animate-gradient-shift">
            Agile Planning is Broken
          </h2>
          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-400 mx-auto rounded-full animate-pulse-glow"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <div
            className="group relative overflow-hidden animate-fade-in-up investor-glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center border border-emerald-500/20 shadow-xl transition-all duration-700 hover:scale-105"
            style={{ animationDelay: "0ms" }}
          >
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-emerald-400 mb-3 sm:mb-4 group-hover:text-emerald-300 transition-colors duration-300">
              67%
            </div>
            <div className="text-emerald-100/90 text-base sm:text-lg group-hover:text-emerald-200 transition-colors duration-300">
              of agile teams miss sprint goals
            </div>
          </div>
          <div
            className="group relative overflow-hidden animate-fade-in-up investor-glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center border border-emerald-500/20 shadow-xl transition-all duration-700 hover:scale-105"
            style={{ animationDelay: "200ms" }}
          >
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-emerald-400 mb-3 sm:mb-4 group-hover:text-emerald-300 transition-colors duration-300">
              70%
            </div>
            <div className="text-emerald-100/90 text-base sm:text-lg group-hover:text-emerald-200 transition-colors duration-300">
              of agile projects fail
            </div>
          </div>
          <div
            className="group relative overflow-hidden animate-fade-in-up investor-glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center border border-emerald-500/20 shadow-xl transition-all duration-700 hover:scale-105"
            style={{ animationDelay: "400ms" }}
          >
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-emerald-400 mb-3 sm:mb-4 group-hover:text-emerald-300 transition-colors duration-300">
              $52M
            </div>
            <div className="text-emerald-100/90 text-base sm:text-lg group-hover:text-emerald-200 transition-colors duration-300">
              wasted per $1B invested due to poor agile planning
            </div>
          </div>
        </div>

        <div className="text-center mb-6 sm:mb-8">
          <p className="text-emerald-100/90 text-base sm:text-lg">
            Source: PMI 2023 Report
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-l-4 border-green-400 p-6 sm:p-8 rounded-2xl">
            <div className="flex items-center w-10 h-10 sm:w-12 sm:h-12 justify-center mb-4 sm:mb-6">
              <ChatbotSvg color="#6EE7B7" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-green-300 mb-4 sm:mb-6">
              AI-Native Teams
            </h3>
            <ul className="space-y-3 sm:space-y-4 text-emerald-100/90 text-sm sm:text-base">
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
                <strong>Standardized Quality:</strong> Consistent story formats
                across all team members
              </li>
              <li>
                <strong>Strategic Leverage:</strong> PMs focus on vision and
                stakeholder needs while AI handles the tactical execution
                details
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-red-600/20 to-pink-600/20 border-l-4 border-red-400 p-6 sm:p-8 rounded-2xl">
            <div className="flex items-center w-10 h-10 sm:w-12 sm:h-12 justify-center mb-4 sm:mb-6">
              <TeamsSvg color="#FCA5A5" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-red-300 mb-4 sm:mb-6">
              Traditional Teams
            </h3>
            <ul className="space-y-3 sm:space-y-4 text-emerald-100/90 text-sm sm:text-base">
              <li>
                <strong>Story Creation Gap:</strong> Manual writing takes 10x
                longer than AI-native teams
              </li>
              <li>
                <strong>Risk Prediction Gap:</strong> No visibility into sprint
                blockers until it's too late
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
                <strong>Strategic Focus Gap:</strong> PMs buried in busywork vs
                strategic planning
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>,

    // Slide 4: SprintiQ Turbo
    <section
      key="slide-4"
      className="w-full max-w-7xl mx-auto animate-slide-transition relative"
    >
      <div className="relative z-10">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8 bg-gradient-to-r from-emerald-300 via-green-300 to-emerald-400 bg-clip-text text-transparent animate-gradient-shift">
            SprintiQ™ Turbo: Your AI Planning Assistant
          </h2>
          <div className="text-lg sm:text-xl md:text-2xl text-emerald-100/90 max-w-4xl mx-auto font-light mb-6 sm:mb-8">
            Purpose-Built AI for Agile Planning Excellence
          </div>
          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-400 mx-auto rounded-full animate-pulse-glow"></div>
        </div>

        <div className="text-center mb-8 sm:mb-12 lg:mb-16 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row justify-center items-center mb-6 sm:mb-8 gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500/20 rounded-md p-2">
              <TargetSVG color="#6EE7B7" />
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent text-center sm:text-left">
              Our Trained AI Agents are Agile Planning Experts
            </h3>
          </div>
          <span className="text-emerald-100/90 text-base sm:text-lg">
            Product managers no longer face the blank slate. Our AI writes user
            stories with precision, prioritizes by real impact, and surfaces
            risks before they derail sprints. This transforms sprints from
            hopeful wish lists into realistic, aligned, and predictable delivery
            commitments.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mb-8 sm:mb-12 lg:mb-16">
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
              className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-l-4 border-green-400 p-4 sm:p-6 rounded-2xl"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start mb-4 sm:mb-6 gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500/20 rounded-md p-2 text-emerald-300 font-bold text-xl sm:text-2xl flex items-center justify-center">
                  {index + 1}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-green-300 text-center sm:text-left">
                  {item.name}
                </h3>
              </div>
              <span className="text-emerald-100/90 text-sm sm:text-lg">
                {item.description}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center mb-8 sm:mb-12">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
            Seamless Integration
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-8 sm:mb-12 lg:mb-16">
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
              key={integration.name}
              className="bg-white/5 backdrop-blur-xl rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center text-center border border-emerald-500/20 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center w-10 h-10 sm:w-12 sm:h-12 justify-center mb-2">
                {integration.icon}
              </div>
              <div className="text-emerald-300 font-medium text-xs sm:text-sm">
                {integration.name}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 text-center border border-emerald-500/20">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-2">
              5 min
            </div>
            <div className="text-emerald-100/90 text-xs sm:text-sm">
              Planning time vs 5 hours manual
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 text-center border border-emerald-500/20">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-2">
              75%
            </div>
            <div className="text-emerald-100/90 text-xs sm:text-sm">
              Time savings reported
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 text-center border border-emerald-500/20">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-2">
              67%
            </div>
            <div className="text-emerald-100/90 text-xs sm:text-sm">
              Sprint failure rate eliminated
            </div>
          </div>
        </div>
      </div>
    </section>,

    // Slide 5: Market Validation
    <section
      key="slide-5"
      className="w-full max-w-7xl mx-auto animate-slide-transition relative"
    >
      <div className="relative z-10">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8 bg-gradient-to-r from-emerald-300 via-green-300 to-emerald-400 bg-clip-text text-transparent animate-gradient-shift">
            Market Validation
          </h2>
          <div className="text-lg sm:text-xl md:text-2xl text-emerald-100/90 max-w-4xl mx-auto font-light mb-6 sm:mb-8">
            From 20 overwhelmed agile product people that tested our prototype
          </div>
          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-400 mx-auto rounded-full animate-pulse-glow"></div>
        </div>

        <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-l-4 border-emerald-400">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10">
                <ScrumMasterSvg color="#6EE7B7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-emerald-300">
                Scrum Master
              </h3>
            </div>
            <p className="text-emerald-100/90 italic mb-4 text-sm sm:text-base">
              "Backlog grooming was my weekly nightmare that was like 2-3 hours
              of debating acceptance criteria and feature priorities. Turbo
              changed this into 30-45 minute strategic grooming sessions because
              the AI already generated solid acceptance criteria and feature
              priority rankings."
            </p>
            <p className="text-emerald-200 text-xs sm:text-sm">
              ~Alexi, Certified Scrum Master at a digital lead generation
              company
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-l-4 border-emerald-400">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12">
                <EngineerSvg color="#6EE7B7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-emerald-300">
                Engineering Manager
              </h3>
            </div>
            <p className="text-emerald-100/90 italic mb-4 text-sm sm:text-base">
              "My developers were spending more time deciphering vague stories
              than coding. Turbo gave us crystal clear requirements and
              automatically optimizes assignments based on each developer's
              skill level - junior devs get appropriate tasks while seniors
              handle complex architecture. Our sprint velocity increased 40%.
              It's like having an AI scrum master that actually understands our
              team."
            </p>
            <p className="text-emerald-200 text-xs sm:text-sm">
              ~Andrew, Chief Data Engineer at a US government healthcare
              organization
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-l-4 border-emerald-400">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12">
                <ProductManagerSvg color="#6EE7B7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-emerald-300">
                Product Manager
              </h3>
            </div>
            <p className="text-emerald-100/90 italic mb-4 text-sm sm:text-base">
              "Turbo transformed our planning from a 4-5 hour chaotic nightmare
              into a 30 minute strategic session. I love its prioritization
              algorithm and persona based stories!"
            </p>
            <p className="text-emerald-200 text-xs sm:text-sm">
              ~Sarah, PM for a leading gaming company
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-3 gap-3 sm:gap-4 max-w-6xl mx-auto">
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
              className={`bg-white/5 backdrop-blur-xl rounded-xl p-4 sm:p-8 text-center border border-emerald-500/20 hover:bg-white/10 transition-all duration-300 ${
                company.color === "light"
                  ? "bg-white/5"
                  : "bg-gradient-to-br from-emerald-600 to-green-600"
              }`}
            >
              <div className="flex w-full h-16 sm:h-24 items-center justify-center mb-4 sm:mb-6">
                {company.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>,

    // Slide 6: SprintiQ Turbo
    <section
      key="slide-6"
      className="w-full max-w-7xl mx-auto animate-slide-transition relative"
    >
      <div className="relative z-10">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8 bg-gradient-to-r from-emerald-300 via-green-300 to-emerald-400 bg-clip-text text-transparent animate-gradient-shift">
            AI-Native Agile Planning Competitive Landscape
          </h2>
          <div className="text-lg sm:text-xl md:text-2xl text-emerald-100/90 max-w-4xl mx-auto font-light mb-6 sm:mb-8">
            SprintiQ Turbo: Senior PM + Scrum Master AI vs. Junior PM & Basic
            Automation Tools
          </div>
          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-400 mx-auto rounded-full animate-pulse-glow"></div>
        </div>

        <div className="space-y-8 max-w-7xl mx-auto mb-8 sm:mb-12 lg:mb-16">
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
      </div>

      {/* Competitive Summary */}
      <div className="animate-fade-in-up" style={{ animationDelay: "1200ms" }}>
        <div className="relative overflow-hidden max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-emerald-600/90 via-green-600/90 to-emerald-600/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-white border border-emerald-400/50 shadow-2xl">
            <div className="relative z-10">
              <div className="text-center">
                <h3 className="text-xl font-bold text-emerald-200 mb-4">
                  The Competitive Advantage
                </h3>
                <p className="text-lg sm:text-xl leading-relaxed">
                  <span className="font-bold text-emerald-200">The Gap: </span>{" "}
                  While competitors offer junior PM assistants or basic meeting
                  automation, SprintiQ Turbo provides senior PM-level
                  intelligence with scrum master expertise. The only AI trained
                  on 2000+ successful sprints to solve the cognitive overload
                  that causes 40% productivity loss in sprint planning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>,

    // Slide 7: Experienced Team
    <section
      key="slide-7"
      className="w-full max-w-7xl mx-auto animate-slide-transition relative"
    >
      <div className="relative z-10">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8 bg-gradient-to-r from-emerald-300 via-green-300 to-emerald-400 bg-clip-text text-transparent animate-gradient-shift">
            Experienced Team
          </h2>
          <div className="text-lg sm:text-xl md:text-2xl text-emerald-100/90 max-w-4xl mx-auto font-light mb-6 sm:mb-8">
            Built by practitioners who understand the pain
          </div>
          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-400 mx-auto rounded-full animate-pulse-glow"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          {[
            {
              name: "Dr. Jeff Nagy, PhD",
              title: "CEO & President",
              description: "Product Strategy & Vision",
              image:
                "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/avatars/teams/jeff.jpeg",
            },
            {
              name: "David Lin",
              title: "CTO & Secretary",
              description: "AI Architecture & Development",
              image:
                "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/avatars/teams/dlin.jpeg",
            },
            {
              name: "Rachael Long",
              title: "COO",
              description: "Business Operations & Growth",
              image:
                "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/avatars/teams/rachael.jpeg",
            },
            {
              name: "Ardi Iranmanesh",
              title: "Strategic Advisor",
              description: "Startup Fundraising & Scaling Expert",
              image:
                "https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/avatars/teams/ardi.jpeg",
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 text-center border border-emerald-500/20">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-2">
              50+
            </div>
            <div className="text-emerald-100/90 text-xs sm:text-sm">
              Years Combined Agile Experience
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 text-center border border-emerald-500/20">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-2">
              20+
            </div>
            <div className="text-emerald-100/90 text-xs sm:text-sm">
              Enterprise Product Launches
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 text-center border border-emerald-500/20">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-2">
              10+
            </div>
            <div className="text-emerald-100/90 text-xs sm:text-sm">
              Successful AI implementations
            </div>
          </div>
        </div>
      </div>
      <div className="animate-fade-in-up" style={{ animationDelay: "1000ms" }}>
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-white text-center max-w-6xl mx-auto border border-emerald-400/50 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Contact Information */}
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center lg:text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-emerald-200 mb-4 sm:mb-6 bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
                  Get in Touch
                </h3>
                <p className="text-emerald-100/90 text-base sm:text-lg mb-6 sm:mb-8">
                  Ready to transform your agile planning? Let's discuss how
                  SprintiQ™ can revolutionize your team's productivity.
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-xl border border-emerald-400/20 hover:bg-white/10 transition-all duration-300 group">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500/20 rounded-full flex items-center justify-center group-hover:bg-emerald-400/30 transition-colors duration-300">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" />
                  </div>
                  <div className="text-left">
                    <div className="text-emerald-200 font-semibold text-sm sm:text-base">
                      Dr. Jeff Nagy, PhD
                    </div>
                    <div className="text-emerald-100/70 text-xs sm:text-sm">
                      CEO & President
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-xl border border-emerald-400/20 hover:bg-white/10 transition-all duration-300 group">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500/20 rounded-full flex items-center justify-center group-hover:bg-emerald-400/30 transition-colors duration-300">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" />
                  </div>
                  <div className="text-left">
                    <div className="text-emerald-200 font-semibold text-sm sm:text-base">
                      Email
                    </div>
                    <div className="text-emerald-100/70 text-xs sm:text-sm">
                      jeff@sprintiq.ai
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-xl border border-emerald-400/20 hover:bg-white/10 transition-all duration-300 group">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500/20 rounded-full flex items-center justify-center group-hover:bg-emerald-400/30 transition-colors duration-300">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" />
                  </div>
                  <div className="text-left">
                    <div className="text-emerald-200 font-semibold text-sm sm:text-base">
                      Phone
                    </div>
                    <div className="text-emerald-100/70 text-xs sm:text-sm">
                      (504) 575-2477
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="space-y-6 sm:space-y-8">
              <div className="text-center">
                <h4 className="text-lg sm:text-xl font-bold text-emerald-200 mb-3 sm:mb-4">
                  Ready for a 30-Second Demo?
                </h4>
                <p className="text-emerald-100/80 text-base sm:text-lg mb-6 sm:mb-8">
                  See how SprintiQ™ Turbo transforms your planning from hours to
                  minutes
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <Button
                  onClick={() => {
                    router.push("/contact");
                  }}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white text-base sm:text-lg font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                >
                  <span className="flex items-center gap-2">
                    Request Demo
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>

                <Button className="w-full bg-transparent text-emerald-200 text-base sm:text-lg font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl border-2 border-emerald-400/50 hover:border-emerald-300 hover:bg-emerald-400/10 transition-all duration-300 transform hover:scale-105 group">
                  <span className="flex items-center gap-2">
                    Schedule Call
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
                  </span>
                </Button>
              </div>

              <div className="text-center">
                <p className="text-emerald-100/60 text-xs sm:text-sm">
                  No commitment required • 15-minute consultation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>,
  ];

  const totalSlides = slides.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const previousSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        previousSlide();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  // If not verified, show only the modal
  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
        <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <EmailVerificationModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          onVerified={handleVerified}
        />
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        .investor-glass {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .animate-slide-transition {
          animation: slideTransition 0.5s ease-in-out;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-pulse-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }

        .animate-gradient-shift {
          animation: gradientShift 3s ease-in-out infinite;
        }

        @keyframes slideTransition {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulseGlow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(16, 185, 129, 0.6);
          }
        }

        @keyframes gradientShift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 overflow-hidden">
        <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

        <main className="pt-20 sm:pt-24 lg:pt-32 pb-16">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="min-h-[500px] sm:min-h-[600px] flex items-center justify-center">
              <div className="w-full animate-fade-in-up">
                {slides[currentSlide]}
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="fixed bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-40">
            <div className="bg-black/40 backdrop-blur-xl rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-emerald-500/20 shadow-2xl">
              <div className="flex items-center gap-4 sm:gap-6">
                <button
                  className="p-1.5 sm:p-2 rounded-full bg-emerald-600/80 hover:bg-emerald-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                  onClick={() => setCurrentSlide((s) => Math.max(0, s - 1))}
                  disabled={currentSlide === 0}
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:scale-110 transition-transform" />
                </button>

                <div className="text-white font-bold text-base sm:text-lg min-w-[60px] sm:min-w-[80px] text-center">
                  {currentSlide + 1} / {slides.length}
                </div>

                <button
                  className="p-1.5 sm:p-2 rounded-full bg-emerald-600/80 hover:bg-emerald-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                  onClick={() =>
                    setCurrentSlide((s) => Math.min(slides.length - 1, s + 1))
                  }
                  disabled={currentSlide === slides.length - 1}
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="fixed bottom-20 sm:bottom-32 left-1/2 transform -translate-x-1/2 z-40">
            <div className="flex gap-1.5 sm:gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-emerald-400 scale-125"
                      : "bg-emerald-400/30 hover:bg-emerald-400/60"
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
