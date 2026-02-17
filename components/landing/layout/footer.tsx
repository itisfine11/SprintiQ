import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Linkedin,
  Instagram,
  Facebook,
  Phone,
  MapPinned,
  Youtube,
} from "lucide-react";
import { TwitterSvg } from "@/components/svg/TwitterSvg";
import { MediumSvg } from "@/components/svg/MediumSvg";
import { YouTubeSvg } from "@/components/svg/YouTubeSvg";

export default function Footer() {
  const [twitterColor, setTwitterColor] = useState("#BDBDBD");

  return (
    <footer className="relative z-10 bg-black/30 backdrop-blur-xl text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-0">
        <div className="grid md:grid-cols-9 gap-8">
          {/* Logo and Description */}
          <div className="col-span-3">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Image
                src="https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/SprintiQ/sprintiq-logo.png"
                alt="SprintiQ Logo"
                width={150}
                height={40}
                priority // Preload the logo as it's above the fold [^3]
                className="h-auto"
              />
            </Link>

            <p className="text-gray-400 mb-6 text-sm">
              AI-native agile planning that eliminates busywork and amplifies
              creativity. Made with 🤍 for agile teams everywhere.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:support@sprintiq.ai"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  support@sprintiq.ai
                </a>
              </div>
              {/* TODO: Add phone */}
              <div className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                +1 (888) 442-5519
              </div>
              {/* TODO: Add address */}
              <div className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
                <MapPinned className="h-4 w-4 text-gray-400" />
                107 Spring St, Seattle, WA 98104, United States
              </div>
            </div>

            <div className="space-y-8">
              {/* Social media links removed - placeholder links not functional yet */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold mb-2">Social</h3>
                <div className="flex space-x-4">
                  <a
                    href="https://x.com/SprintiQAI"
                    className="text-gray-400 hover:text-white hover:scale-110 duration-300 transition-all"
                    onMouseEnter={() => setTwitterColor("#fff")}
                    onMouseLeave={() => setTwitterColor("#BDBDBD")}
                  >
                    <div className="w-5 h-5">
                      <TwitterSvg color={twitterColor} />
                    </div>
                    <span className="sr-only">Twitter</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/company/sprintiq-ai"
                    className="text-gray-400 hover:text-white hover:scale-110 duration-300 transition-all"
                  >
                    <Linkedin size={18} />
                    <span className="sr-only">LinkedIn</span>
                  </a>
                  <a
                    href="https://www.facebook.com/SprintiQ/"
                    className="text-gray-400 hover:text-white hover:scale-110 duration-300 transition-all"
                  >
                    <Facebook size={18} />
                    <span className="sr-only">Facebook</span>
                  </a>
                  <a
                    href="https://www.instagram.com/sprintiq.ai/"
                    className="text-gray-400 hover:text-white hover:scale-110 duration-300 transition-all"
                  >
                    <Instagram size={18} />
                    <span className="sr-only">Instagram</span>
                  </a>
                  <a
                    href="https://sprintiq.medium.com"
                    className="text-gray-400 hover:text-white hover:scale-110 duration-300 transition-all"
                  >
                    <div className="w-5 h-5">
                      <MediumSvg color={twitterColor} />
                    </div>
                    <span className="sr-only">Medium</span>
                  </a>
                  <a
                    href="https://www.youtube.com/@SprintiQAI"
                    className="text-gray-400 hover:text-white hover:scale-110 duration-300 transition-all"
                  >
                    <Youtube size={20} />
                    <span className="sr-only">YouTube</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Product */}
          <div className="col-span-2">
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/features"
                  className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/use-case"
                  className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                >
                  Use Cases
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-2">
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/insights"
                  className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                >
                  Insights
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-2">
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/terms"
                  className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/support"
                  className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                >
                  Support Guide
                </a>
              </li>
              <li>
                <a
                  href="/sla"
                  className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                >
                  SLA
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/sitemap"
                  className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                >
                  Sitemap
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            Copyright © {new Date().getFullYear()} SprintiQ – All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
