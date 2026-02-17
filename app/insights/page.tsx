"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, LazyMotion, domAnimation } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Calendar,
  User,
  Tag,
  Search,
  BookOpen,
  ChevronDown,
} from "lucide-react";
import dynamic from "next/dynamic";
import Navbar from "@/components/landing/layout/navbar";
import Footer from "@/components/landing/layout/footer";
import ScrollToTop from "@/components/ui/scroll-to-top";

// Lazy load heavy components
const LazyFooter = dynamic(() => import("@/components/landing/layout/footer"), {
  loading: () => <div className="h-32 bg-transparent" />,
  ssr: false,
});

const LazyScrollToTop = dynamic(() => import("@/components/ui/scroll-to-top"), {
  ssr: false,
});

// Optimized animations with reduced complexity
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05, // Reduced from 0.1
    },
  },
};

const cardVariant = {
  initial: { opacity: 0, y: 20 }, // Reduced from 30
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }, // Reduced from 0.6
};

import { Insight } from "@/lib/database.types";

// Helper function to strip HTML tags for preview (for cards)
const stripHtml = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
};

const categories = [
  "All",
  "AI & Automation",
  "Team Management",
  "Estimation",
  "Integrations",
  "Psychology",
  "Remote Work",
  "Agile",
  "Productivity",
  "Leadership",
];

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const itemsPerPage = 6;
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Memoized search params
  const searchParams = useMemo(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.append("search", searchQuery);
    if (selectedCategory !== "All") params.append("filter", selectedCategory);
    params.append("page", currentPage.toString());
    params.append("limit", itemsPerPage.toString());
    return params;
  }, [searchQuery, selectedCategory, currentPage]);

  // Fetch insights from API with useCallback for performance
  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/insights?${searchParams.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setInsights(data.insights || []);
        setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
      } else {
        console.error("Failed to fetch insights:", data.error);
      }
    } catch (error) {
      console.error("Error fetching insights:", error);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  // Memoized derived state
  const { posts, featuredPost, regularPosts } = useMemo(() => {
    const posts = insights;
    const featuredPost = insights.find((post) => post.featured);
    const regularPosts = posts.filter((post) => !post.featured);
    return { posts, featuredPost, regularPosts };
  }, [insights]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Memoized category filter handler
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
    setCurrentPage(1); // Reset to first page when changing category
  }, []);

  // Memoized search handler
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      setCurrentPage(1); // Reset to first page when searching
    },
    []
  );

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 overflow-y-auto custom-scrollbar">
        <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

        {/* Hero Section */}
        <section className="pt-20 sm:pt-32 pb-12 sm:pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-12 sm:mb-16"
              initial={{ opacity: 0, y: 30 }} // Reduced from 50
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }} // Reduced from 0.8
            >
              <motion.h1
                className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6 px-4"
                whileHover={{ scale: 1.01 }} // Reduced from 1.02
              >
                SprintiQ <span className="text-emerald-600">Insights</span>
              </motion.h1>
              <motion.p
                className="text-lg sm:text-xl text-emerald-100/90 max-w-3xl mx-auto leading-relaxed px-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.1 }} // Reduced from 0.2
              >
                Discover the latest insights, best practices, and expert tips
                for agile development, sprint planning, and team collaboration.
              </motion.p>
            </motion.div>

            {/* Search and Filter */}
            <motion.div
              className="max-w-4xl mx-auto mb-8 sm:mb-12 px-4"
              initial={{ opacity: 0, y: 20 }} // Reduced from 30
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.2 }} // Reduced from 0.3
            >
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {/* Search Bar */}
                <div className="relative flex-1 col-span-1 sm:col-span-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-300 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-3 sm:py-3 bg-white/10 backdrop-blur-xl border border-emerald-500/20 rounded-xl text-white placeholder-emerald-300/70 focus:outline-none focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-sm sm:text-base"
                  />
                </div>

                {/* Category Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-between w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-emerald-500/20 rounded-xl text-emerald-300 hover:border-emerald-400/40 transition-all duration-200 text-sm sm:text-base"
                  >
                    <span>{selectedCategory}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white/10 backdrop-blur-xl border border-emerald-500/20 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => handleCategoryChange(category)}
                          className={`w-full px-4 py-2 text-left hover:bg-white/20 transition-colors duration-200 text-sm sm:text-base ${
                            selectedCategory === category
                              ? "bg-emerald-600 text-white"
                              : "text-emerald-300"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Mobile Quick Filters */}
            <motion.div
              className="lg:hidden max-w-4xl mx-auto mb-6 px-4"
              initial={{ opacity: 0, y: 15 }} // Reduced from 20
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.3 }} // Reduced from 0.4
            >
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.slice(1, 7).map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? "bg-emerald-600 text-white shadow-lg"
                        : "bg-white/10 text-emerald-300 hover:bg-white/20 border border-emerald-500/20"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="max-w-7xl mx-auto mb-12 sm:mb-16 px-4">
            <motion.div
              className="max-w-7xl mx-auto"
              initial={{ opacity: 0, y: 30 }} // Reduced from 50
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }} // Reduced from 0.8
            >
              <Card className="bg-white/10 backdrop-blur-xl border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-200 hover:shadow-emerald-500/20 hover:shadow-xl overflow-hidden group">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Featured Image */}
                  <div className="relative h-48 sm:h-64 md:h-full overflow-hidden order-1 md:order-1">
                    {featuredPost.post_image ? (
                      <Image
                        src={featuredPost.post_image}
                        alt={featuredPost.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        priority
                        loading="eager"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gradient-to-br from-emerald-900/50 to-slate-900/50">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-600/20 rounded-full flex items-center justify-center">
                          <BookOpen className="w-6 h-6 sm:w-8 sm:w-8 text-emerald-300" />
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <Badge className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-emerald-600 text-white text-xs sm:text-sm">
                      Featured
                    </Badge>
                  </div>

                  {/* Featured Content */}
                  <CardContent className="p-4 sm:p-6 md:p-8 flex flex-col justify-center order-2 md:order-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4 text-emerald-300/80 text-xs sm:text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        {new Date(featuredPost.post_date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 sm:w-4 sm:h-4" />
                        {featuredPost.author || "Unknown Author"}
                      </span>
                    </div>
                    <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:text-emerald-400 transition-colors">
                      {featuredPost.title}
                    </CardTitle>
                    <p className="text-emerald-100/80 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                      {stripHtml(featuredPost.description).length > 150
                        ? stripHtml(featuredPost.description).substring(
                            0,
                            350
                          ) + "..."
                        : stripHtml(featuredPost.description)}
                    </p>
                    <Link href={`/insights/${featuredPost.insight_id}`}>
                      <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white group-hover:bg-emerald-500 transition-all duration-200 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">
                        Read Article
                        <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          </section>
        )}

        {/* Latest Insights Section */}
        <section className="max-w-7xl mx-auto mb-12 sm:mb-16 px-4">
          {loading && (
            <div className="text-center py-12 sm:py-16">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
              <p className="text-emerald-100/70 text-sm sm:text-base">
                Loading insights...
              </p>
            </div>
          )}

          {!loading && (
            <>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-50px" }}
              >
                {regularPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    variants={cardVariant}
                    whileHover={{ scale: 1.01, y: -2 }} // Reduced from 1.02, -5
                    className="group"
                  >
                    <Link href={`/insights/${post.insight_id}`}>
                      <Card className="h-full bg-white/10 backdrop-blur-xl border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-200 hover:shadow-emerald-500/20 hover:shadow-xl overflow-hidden cursor-pointer">
                        {/* Image */}
                        <div className="relative h-40 sm:h-48 overflow-hidden">
                          {post.post_image ? (
                            <Image
                              src={post.post_image}
                              alt={post.title}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-gradient-to-br from-emerald-900/30 to-slate-900/30">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-600/20 rounded-full flex items-center justify-center">
                                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300" />
                              </div>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </div>

                        {/* Content */}
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2 sm:mb-3 text-emerald-300/80 text-xs sm:text-sm">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(post.post_date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {post.author || "Unknown Author"}
                            </span>
                          </div>
                          <CardTitle className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3 group-hover:text-emerald-400 transition-colors line-clamp-2">
                            {post.title}
                          </CardTitle>
                          <p className="text-emerald-100/80 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed line-clamp-3">
                            {stripHtml(post.description).length > 100
                              ? stripHtml(post.description).substring(0, 100) +
                                "..."
                              : stripHtml(post.description)}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                            <div className="flex items-center gap-2 text-emerald-300/80 text-xs sm:text-sm">
                              <Tag className="w-3 h-3" />
                              {post.category}
                            </div>
                            <span className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-xs sm:text-sm font-medium group-hover:translate-x-1 transition-transform">
                              Read more <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  className="flex flex-wrap justify-center items-center gap-2 mt-8 sm:mt-12 px-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-emerald-300/70 hover:text-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded text-sm sm:text-base ${
                          currentPage === page
                            ? "bg-emerald-600 text-white"
                            : "text-emerald-300/70 hover:text-emerald-300 hover:bg-emerald-600/20"
                        } transition-colors`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-emerald-300/70 hover:text-emerald-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                  >
                    Next
                  </button>
                </motion.div>
              )}

              {regularPosts.length === 0 && (
                <motion.div
                  className="text-center py-12 sm:py-16 px-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-400/50 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                    No insights found
                  </h3>
                  <p className="text-emerald-100/70 text-sm sm:text-base">
                    Try adjusting your search or filter criteria.
                  </p>
                </motion.div>
              )}
            </>
          )}
        </section>

        <LazyFooter />
        <LazyScrollToTop isMenuOpen={isMenuOpen} />
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
    </LazyMotion>
  );
}
