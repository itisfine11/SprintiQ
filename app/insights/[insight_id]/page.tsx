"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, User, Tag, ArrowLeft, Star } from "lucide-react";
import Navbar from "@/components/landing/layout/navbar";
import Footer from "@/components/landing/layout/footer";
import ScrollToTop from "@/components/ui/scroll-to-top";
import { SocialLinks } from "@/components/ui/social-links";
import { Insight } from "@/lib/database.types";

interface InsightPageProps {
  params: Promise<{
    insight_id: string;
  }>;
}

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

export default function InsightPage({ params }: InsightPageProps) {
  const [insight, setInsight] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Unwrap params using React.use()
  const unwrappedParams = use(params) as { insight_id: string };
  const insightId = unwrappedParams.insight_id;

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/insights/${insightId}`);

        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error("Failed to fetch insight");
        }

        const data = await response.json();
        setInsight(data.insight);
      } catch (error) {
        console.error("Error fetching insight:", error);
        setError("Failed to load insight");
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
  }, [insightId]);

  // Reading progress tracking for mobile
  useEffect(() => {
    const updateReadingProgress = () => {
      const progressBar = document.getElementById("reading-progress");
      if (!progressBar) return;

      const scrollTop = window.pageYOffset;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      progressBar.style.width = Math.min(scrollPercent, 100) + "%";
    };

    window.addEventListener("scroll", updateReadingProgress);
    return () => window.removeEventListener("scroll", updateReadingProgress);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
        <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <div className="pt-20 sm:pt-32 pb-12 sm:pb-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="animate-pulse">
              <div className="w-32 sm:w-40 h-8 sm:h-12 bg-white/10 rounded mb-6 sm:mb-8"></div>
              <div className="w-20 sm:w-24 h-4 sm:h-6 bg-white/10 rounded mx-auto mb-4 sm:mb-6"></div>
              <div className="h-6 sm:h-8 bg-white/10 rounded w-full mx-auto mb-2 sm:mb-3"></div>
              <div className="h-6 sm:h-8 bg-white/10 rounded w-3/4 mx-auto mb-2 sm:mb-3"></div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 mx-auto items-center justify-center mb-6 sm:mb-8">
                <div className="w-24 sm:w-32 h-4 sm:h-5 bg-white/10 rounded"></div>
                <div className="w-24 sm:w-32 h-4 sm:h-5 bg-white/10 rounded"></div>
                <div className="w-24 sm:w-32 h-4 sm:h-5 bg-white/10 rounded"></div>
                <div className="w-24 sm:w-32 h-4 sm:h-5 bg-white/10 rounded"></div>
              </div>
              <div className="h-48 sm:h-[320px] bg-white/10 rounded w-full mx-auto mb-6 sm:mb-8"></div>
              <div className="w-48 sm:w-64 h-4 sm:h-6 bg-white/10 rounded mb-2 sm:mb-3" />
              <div className="w-full h-4 sm:h-6 bg-white/10 rounded mb-2 sm:mb-3" />
              <div className="w-4/5 h-4 sm:h-6 bg-white/10 rounded mb-2 sm:mb-3" />
              <div className="w-full h-4 sm:h-6 bg-white/10 rounded mb-2 sm:mb-3" />
              <div className="w-1/2 h-4 sm:h-6 bg-white/10 rounded mb-2 sm:mb-3" />
              <div className="w-1/6 h-4 sm:h-6 bg-white/10 rounded mb-2 sm:mb-3" />
              <div className="w-full h-4 sm:h-6 bg-white/10 rounded mb-2 sm:mb-3" />
              <div className="w-full h-4 sm:h-6 bg-white/10 rounded mb-2 sm:mb-3" />
              <div className="w-full h-4 sm:h-6 bg-white/10 rounded mb-2 sm:mb-3" />
              <div className="w-1/5 h-4 sm:h-6 bg-white/10 rounded mb-2 sm:mb-3" />
              <div className="w-1/5 h-4 sm:h-6 bg-white/10 rounded mb-2 sm:mb-3" />
              <div className="w-1/5 h-4 sm:h-6 bg-white/10 rounded mb-2 sm:mb-3" />
              <div className="w-full h-4 sm:h-6 bg-white/10 rounded mb-2 sm:mb-3" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !insight) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
        <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <div className="pt-20 sm:pt-32 pb-12 sm:pb-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
              Insight Not Found
            </h1>
            <p className="text-emerald-100/80 mb-6 sm:mb-8 text-sm sm:text-base">
              The insight you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/insights">
              <Button className="bg-transparent text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/10 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Back to Insights
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 overflow-y-auto custom-scrollbar">
        <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

        {/* Hero Section */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="pt-20 sm:pt-32 pb-12 sm:pb-16 px-4"
        >
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <div className="mb-6 sm:mb-8">
              <Link href="/insights">
                <Button className="bg-transparent text-emerald-300 hover:text-emerald-200 hover:bg-emerald-500/10 text-sm sm:text-base px-3 sm:px-4 py-2">
                  <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Back to Insights
                </Button>
              </Link>
            </div>

            {/* Mobile Reading Progress */}
            <div className="lg:hidden mb-4">
              <div className="w-full bg-white/10 rounded-full h-1">
                <div
                  className="bg-emerald-500 h-1 rounded-full"
                  style={{ width: "0%" }}
                  id="reading-progress"
                ></div>
              </div>
            </div>

            {/* Insight Header */}
            <div className="max-w-6xl mx-auto text-center mb-8 sm:mb-12">
              <motion.div variants={cardVariant}>
                {insight.featured && insight.published && (
                  <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-4 sm:mb-6 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 fill-current" />{" "}
                    Featured
                  </Badge>
                )}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight px-4">
                  {insight.title}
                </h1>

                {/* Meta Information */}
                <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-6 text-emerald-200/70 text-sm sm:text-base px-4">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{insight.author || "Unknown Author"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>
                      {new Date(insight.post_date).toLocaleDateString()}
                    </span>
                  </div>
                  {insight.read_time && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{insight.read_time}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{insight.category}</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Featured Image */}
            {insight.post_image && (
              <motion.div
                variants={cardVariant}
                className="max-w-6xl mx-auto mb-8 sm:mb-12"
              >
                <div className="relative h-48 sm:h-64 md:h-96 overflow-hidden rounded-xl">
                  <Image
                    src={insight.post_image}
                    alt={insight.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
            )}

            {/* Content */}
            <motion.div variants={cardVariant} className="max-w-6xl mx-auto">
              <Card className="bg-white/10 backdrop-blur-xl border-emerald-500/20">
                <CardContent className="p-4 sm:p-6 md:p-8 lg:p-12">
                  <div
                    className="prose prose-sm sm:prose-base lg:prose-lg prose-invert max-w-none prose-headings:text-white prose-p:text-emerald-100/80 prose-strong:text-emerald-300 [&_hr]:border-emerald-500/30 [&_hr]:my-6 sm:my-8 [&_hr]:border-t [&_hr]:border-opacity-30 [&_ul]:text-emerald-100/80 [&_ul]:space-y-1 sm:space-y-2 [&_ul]:my-4 sm:my-6 [&_li]:text-emerald-100/80 [&_li]:pl-2 [&_ul]:list-none [&_li]:relative [&_li]:pl-4 sm:pl-6 [&_li]:before:content-['•'] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:-top-1 [&_li]:before:text-emerald-400 [&_li]:before:text-base [&_li]:text-sm sm:before:text-lg [&_h1]:text-xl sm:text-2xl lg:text-3xl [&_h2]:text-lg sm:text-xl lg:text-2xl [&_h3]:text-base sm:text-lg lg:text-xl [&_p]:text-sm sm:text-base lg:text-lg [&_p]:leading-relaxed [&_p]:mb-3 sm:mb-4 [&_blockquote]:border-l-2 sm:border-l-4 [&_blockquote]:pl-3 sm:pl-4 [&_blockquote]:py-2 sm:py-3 [&_blockquote]:my-4 sm:my-6 [&_code]:text-xs sm:text-sm [&_pre]:text-xs sm:text-sm [&_pre]:p-2 sm:p-4 [&_pre]:overflow-x-auto"
                    dangerouslySetInnerHTML={{ __html: insight.description }}
                  />

                  {/* Tags */}
                  {insight.tags && insight.tags.length > 0 && (
                    <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-emerald-500/20">
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {insight.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-emerald-300 border-emerald-500/30 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Social Links */}
                  {insight.links &&
                    Array.isArray(insight.links) &&
                    insight.links.length > 0 && (
                      <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-emerald-500/20">
                        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
                          Follow & Connect
                        </h3>
                        <SocialLinks
                          links={
                            insight.links as { type: string; url: string }[]
                          }
                          className="justify-start"
                        />
                      </div>
                    )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        <Footer />
        <ScrollToTop isMenuOpen={isMenuOpen} />
        {/* Retell AI Chat Widget - Only on landing page */}
        <script
          id="retell-widget"
          src="https://dashboard.retellai.com/retell-widget.js"
          type="module"
          data-public-key={process.env.NEXT_PUBLIC_RETELL_PUBLIC_KEY}
          data-agent-id={process.env.NEXT_PUBLIC_RETELL_AGENT_ID}
          data-agent-version="0"
          data-title="SprintiQ"
          data-color="#00BC7D"
          data-logo-url="https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/avatars/agents/turbo.png"
        />
      </div>
    </>
  );
}
