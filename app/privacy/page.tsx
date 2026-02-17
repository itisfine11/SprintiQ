"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Eye,
  Lock,
  Database,
  Users,
  Globe,
  Calendar,
  Mail,
  ArrowRight,
  AlertTriangle,
  ExternalLink,
  Cookie,
  Fingerprint,
  Key,
  EyeOff,
  FileText,
  Server,
  Menu,
} from "lucide-react";
import Navbar from "@/components/landing/layout/navbar";
import Footer from "@/components/landing/layout/footer";
import ScrollToTop from "@/components/ui/scroll-to-top";
import { ScrollArea } from "@/components/ui/scroll-area";

const privacySections = [
  {
    id: "introduction",
    title: "1. Introduction",
    icon: <Shield className="h-5 w-5" />,
    content: `
      <p>At <a href="https://www.sprintiq.ai" target="_blank" rel="noopener noreferrer" class="text-emerald-400 hover:text-emerald-300"><u>SprintiQ.ai</u></a> ("we", "our", or "us"), we are committed to protecting your privacy and ensuring the security of your personal information. This <a href="https://www.sprintiq.ai/privacy" target="_blank" rel="noopener noreferrer" class="text-emerald-400 hover:text-emerald-300"><u>Privacy Policy</u></a> explains how we collect, use, disclose, and safeguard your information when you use our AI-native agile planning and story generation platform.</p>
      <p>This policy applies to all users of our website, mobile applications, and services (collectively, the "Service"). By using our Service, you consent to the data practices described in this policy.</p>
      <p><strong>Last updated:</strong> ${new Date().toLocaleDateString(
        "en-US",
        { year: "numeric", month: "long", day: "numeric" }
      )}</p>
    `,
  },
  {
    id: "information-collection",
    title: "2. Information We Collect",
    icon: <Database className="h-5 w-5" />,
    content: `
      <p>We collect several types of information to provide and improve our Service:</p>
      
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Personal Information</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>Name and email address when you create an account</li>
        <li>Company name and job title</li>
        <li>Payment information (processed securely by our payment providers)</li>
        <li>Profile information and preferences</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Usage Information</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>How you interact with our Service</li>
        <li>Features you use and pages you visit</li>
        <li>Performance data and error logs</li>
        <li>Device information and browser type</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Content Information</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>User stories and project requirements you input</li>
        <li>AI-generated content and your feedback on it</li>
        <li>Project data and team collaboration information</li>
        <li>Integration data from connected platforms</li>
      </ul>
    `,
  },
  {
    id: "how-we-use",
    title: "3. How We Use Your Information",
    icon: <Eye className="h-5 w-5" />,
    content: `
      <p>We use the collected information for the following purposes:</p>
      
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Service Provision</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>Provide and maintain our AI-Native story generation service</li>
        <li>Process your requests and generate user stories</li>
        <li>Manage your account and subscription</li>
        <li>Provide customer support and respond to inquiries</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Service Improvement</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>Improve our AI models and algorithms</li>
        <li>Analyze usage patterns to enhance user experience</li>
        <li>Develop new features and functionality</li>
        <li>Conduct research and analytics</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Communication</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>Send important service updates and notifications</li>
        <li>Provide technical support and assistance</li>
        <li>Send marketing communications (with your consent)</li>
        <li>Respond to legal requests and compliance requirements</li>
      </ul>
    `,
  },
  {
    id: "ai-data-usage",
    title: "4. AI and Data Usage",
    icon: <Fingerprint className="h-5 w-5" />,
    content: `
      <p>Our AI-Native features require careful handling of your data. Here's how we use your information with our AI systems:</p>
      
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">AI Model Training</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>We may use aggregated, anonymized data to improve our AI models</li>
        <li>Your specific project content is never used to train models that serve other customers</li>
        <li>All personal identifiers are removed before any training data is used</li>
        <li>You can opt out of contributing to AI model improvement in your privacy settings</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Content Processing</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>Your project requirements are processed to generate relevant user stories</li>
        <li>We maintain strict data isolation between different customers</li>
        <li>AI-generated content is created specifically for your use case</li>
        <li>Your feedback on AI suggestions helps improve future recommendations</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Data Retention</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>Your project data is retained for the duration of your account</li>
        <li>Training data is retained only in anonymized form</li>
        <li>You can request deletion of your data at any time</li>
        <li>Data is permanently deleted within 30 days of account closure</li>
      </ul>
    `,
  },
  {
    id: "information-sharing",
    title: "5. Information Sharing and Disclosure",
    icon: <Users className="h-5 w-5" />,
    content: `
      <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following limited circumstances:</p>
      
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Service Providers</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>Cloud hosting and infrastructure providers</li>
        <li>Payment processing services</li>
        <li>Customer support and analytics tools</li>
        <li>Email and communication services</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Legal Requirements</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>Comply with applicable laws and regulations</li>
        <li>Respond to legal requests and court orders</li>
        <li>Protect our rights, property, and safety</li>
        <li>Investigate potential violations of our terms</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Business Transfers</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>In the event of a merger, acquisition, or sale of assets</li>
        <li>With your explicit consent for specific purposes</li>
        <li>To protect against fraud and security threats</li>
      </ul>
    `,
  },
  {
    id: "data-security",
    title: "6. Data Security",
    icon: <Lock className="h-5 w-5" />,
    content: `
      <p>We implement comprehensive security measures to protect your information:</p>
      
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Technical Safeguards</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>AES-256 encryption for data at rest and in transit</li>
        <li>Secure HTTPS connections for all communications</li>
        <li>Multi-factor authentication options</li>
        <li>Regular security audits and penetration testing</li>
        <li>Secure API endpoints with rate limiting</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Organizational Measures</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>Access controls and role-based permissions</li>
        <li>Employee security training and background checks</li>
        <li>Incident response procedures</li>
        <li>Regular security assessments and updates</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Data Protection</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>Automatic backups and disaster recovery</li>
        <li>Data isolation between customers</li>
        <li>Secure data centers with physical security</li>
        <li>Monitoring and alerting systems</li>
      </ul>
    `,
  },
  {
    id: "data-retention",
    title: "7. Data Retention and Deletion",
    icon: <EyeOff className="h-5 w-5" />,
    content: `
      <p>We retain your information only as long as necessary to provide our services and comply with legal obligations:</p>
      
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Retention Periods</h3>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Account Data:</strong> Retained while your account is active</li>
        <li><strong>Project Content:</strong> Retained until you delete it or close your account</li>
        <li><strong>Usage Logs:</strong> Retained for 12 months for security and analytics</li>
        <li><strong>Payment Information:</strong> Retained as required by financial regulations</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Your Rights</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>Access and download your data at any time</li>
        <li>Request correction of inaccurate information</li>
        <li>Delete specific projects or your entire account</li>
        <li>Export your data in portable formats</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Deletion Process</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>Account deletion requests are processed within 30 days</li>
        <li>Data is permanently removed from our systems</li>
        <li>Backup data is deleted within 90 days</li>
        <li>You will receive confirmation when deletion is complete</li>
      </ul>
    `,
  },
  {
    id: "cookies",
    title: "8. Cookies and Tracking Technologies",
    icon: <Cookie className="h-5 w-5" />,
    content: `
      <p>We use cookies and similar technologies to enhance your experience and analyze service usage:</p>
      
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Types of Cookies</h3>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Essential Cookies:</strong> Required for basic service functionality</li>
        <li><strong>Performance Cookies:</strong> Help us understand how you use our service</li>
        <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
        <li><strong>Analytics Cookies:</strong> Provide insights into service usage patterns</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Third-Party Services</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>Google Analytics for website analytics</li>
        <li>Stripe for payment processing</li>
        <li>Intercom for customer support</li>
        <li>Cloudflare for security and performance</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Cookie Management</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>You can control cookies through your browser settings</li>
        <li>Essential cookies cannot be disabled as they're required for service operation</li>
        <li>Disabling certain cookies may affect service functionality</li>
        <li>We provide cookie preferences in your account settings</li>
        <li>You can manage your cookie preferences </li>
      </ul>
    `,
  },
  {
    id: "third-party",
    title: "9. Third-Party Services and Integrations",
    icon: <ExternalLink className="h-5 w-5" />,
    content: `
      <p>Our service integrates with various third-party platforms and services:</p>
      
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Project Management Platforms</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>Jira, Azure DevOps, Linear, Asana, GitHub Issues</li>
        <li>ClickUp, Trello, Monday.com, and others</li>
        <li>Data shared only with your explicit authorization</li>
        <li>Integration tokens are encrypted and securely stored</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Service Providers</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>AWS for cloud infrastructure and hosting</li>
        <li>OpenAI for AI model services</li>
        <li>Stripe for payment processing</li>
        <li>SendGrid for email communications</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Data Protection</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>All third-party services are vetted for security compliance</li>
        <li>Data processing agreements are in place where required</li>
        <li>We monitor third-party service security and compliance</li>
        <li>You can disconnect integrations at any time</li>
      </ul>
    `,
  },
  {
    id: "international",
    title: "10. International Data Transfers",
    icon: <Globe className="h-5 w-5" />,
    content: `
      <p>Your data may be transferred to and processed in countries other than your own:</p>
      
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Data Locations</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>Primary data centers located in the United States</li>
        <li>Backup and disaster recovery in multiple regions</li>
        <li>CDN services distributed globally for performance</li>
        <li>Third-party services may be located in various countries</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Legal Framework</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>Compliance with GDPR for EU residents</li>
        <li>Standard Contractual Clauses for international transfers</li>
        <li>Adequacy decisions where applicable</li>
        <li>Local data protection laws compliance</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Your Rights</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>Right to know where your data is processed</li>
        <li>Right to request data transfer to another service</li>
        <li>Right to lodge complaints with supervisory authorities</li>
        <li>Right to compensation for data protection violations</li>
      </ul>
    `,
  },
  {
    id: "children",
    title: "11. Children's Privacy",
    icon: <AlertTriangle className="h-5 w-5" />,
    content: `
      <p>Our Service is not intended for children under the age of 13:</p>
      
      <ul class="list-disc list-inside space-y-2">
        <li>We do not knowingly collect personal information from children under 13</li>
        <li>If we become aware that we have collected such information, we will delete it immediately</li>
        <li>Parents or guardians should contact us if they believe their child has provided personal information</li>
        <li>Our Service is designed for business and professional use</li>
      </ul>
    `,
  },
  {
    id: "your-rights",
    title: "12. Your Privacy Rights",
    icon: <Key className="h-5 w-5" />,
    content: `
      <p>Depending on your location, you may have the following privacy rights:</p>
      
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Access and Control</h3>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Right to Access:</strong> Request a copy of your personal information</li>
        <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete information</li>
        <li><strong>Right to Erasure:</strong> Request deletion of your personal information</li>
        <li><strong>Right to Portability:</strong> Receive your data in a portable format</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Processing Control</h3>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Right to Restrict Processing:</strong> Limit how we use your information</li>
        <li><strong>Right to Object:</strong> Object to certain types of processing</li>
        <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for processing</li>
        <li><strong>Right to Data Portability:</strong> Transfer your data to another service</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Automated Decision Making</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>Right to human review of automated decisions</li>
        <li>Right to contest automated processing results</li>
        <li>Right to explanation of how decisions are made</li>
        <li>Right to opt out of automated processing</li>
      </ul>
    `,
  },
  {
    id: "changes",
    title: "13. Changes to This Privacy Policy",
    icon: <FileText className="h-5 w-5" />,
    content: `
      <p>We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws:</p>
      
      <ul class="list-disc list-inside space-y-2">
        <li>We will notify you of material changes via email or in-app notification</li>
        <li>Minor changes will be posted on this page with an updated date</li>
        <li>Continued use of our Service after changes constitutes acceptance</li>
        <li>You can review the current policy at any time on this page</li>
      </ul>
    `,
  },
  {
    id: "contact",
    title: "14. Contact Us",
    icon: <Mail className="h-5 w-5" />,
    content: `
      <p>If you have any questions about this <a href="https://www.sprintiq.ai/privacy" target="_blank" rel="noopener noreferrer" class="text-emerald-400 hover:text-emerald-300"><u>Privacy Policy</u></a> or our data practices, please <a href="https://www.sprintiq.ai/contact" target="_blank" rel="noopener noreferrer" class="text-emerald-400 hover:text-emerald-300"><u>contact us</u></a>:</p>
      
      <div class="bg-emerald-500/10 rounded-lg p-6 mt-6 border border-emerald-500/20">
        <h3 class="text-lg font-semibold text-emerald-300 mb-4">Contact Information</h3>
        <ul class="space-y-3">
          <li class="flex items-center">
            <Mail className="h-5 w-5 text-emerald-400 mr-3" />
            <span><strong>Email:</strong> support@sprintiq.ai</span>
          </li>
          <li class="flex items-center">
            <Server className="h-5 w-5 text-emerald-400 mr-3" />
            <span><strong>Support:</strong> support@sprintiq.ai</span>
          </li>
        </ul>
      </div>
      
      <p class="mt-6">We will respond to your inquiry within 30 days and provide any requested information or assistance.</p>
    `,
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

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHoverMenuOpen, setIsHoverMenuOpen] = useState(false);
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 overflow-y-auto custom-scrollbar">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <div className="hidden lg:block fixed right-0 top-1/2 transform -translate-y-1/2 z-50">
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
                Privacy Sections
              </h3>
              {privacySections.map((section, index) => (
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
              {privacySections.slice(0, 8).map((section, index) => (
                <motion.button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg transition-all duration-200 text-xs font-medium ${
                    activeSection === section.id
                      ? "bg-emerald-500/30 text-emerald-200 border border-emerald-500/40"
                      : "bg-white/5 text-emerald-100/80 hover:bg-emerald-500/20 hover:text-emerald-200"
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  {section.title.split(". ")[1]?.split(" ")[0] ||
                    section.title.split(" ")[0]}
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
            {/* Floating Icon */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 text-emerald-300 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8 animate-pulse-glow"
            >
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Privacy Policy
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight px-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-white via-emerald-100 to-emerald-300 bg-clip-text text-transparent">
                Privacy{" "}
              </span>
              <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-green-400 bg-clip-text text-transparent">
                Policy
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-emerald-100/90 max-w-4xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              We are committed to protecting your privacy and ensuring the
              security of your data. Learn how we collect, use, and protect your
              information.
            </motion.p>

            {/* Stats */}
            <motion.div
              className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-emerald-400">
                  14
                </div>
                <div className="text-xs sm:text-sm text-emerald-200/70">
                  Sections
                </div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-emerald-500/30"></div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-emerald-400">
                  GDPR
                </div>
                <div className="text-xs sm:text-sm text-emerald-200/70">
                  Compliant
                </div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-emerald-500/30"></div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-emerald-400">
                  AES-256
                </div>
                <div className="text-xs sm:text-sm text-emerald-200/70">
                  Encryption
                </div>
              </div>
            </motion.div>

            {/* Meta Info */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex items-center text-emerald-300 text-xs sm:text-sm">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Last updated:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center text-emerald-300 text-xs sm:text-sm">
                <Lock className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                GDPR & CCPA Compliant
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* Table of Contents */}
      <section className="py-8 sm:py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <Card className="bg-white/5 backdrop-blur-xl border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
            <CardContent className="p-6 sm:p-8">
              <motion.h2
                className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 flex items-center"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <ArrowRight className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-400 mr-3 sm:mr-4" />
                Table of Contents
              </motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {privacySections.map((section, index) => (
                  <motion.button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`text-left p-3 sm:p-4 rounded-xl transition-all duration-300 group ${
                      activeSection === section.id
                        ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-lg shadow-emerald-500/20"
                        : "bg-white/5 border border-transparent text-emerald-100/80 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div
                        className={`p-1.5 sm:p-2 rounded-lg ${
                          activeSection === section.id
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-white/5 text-emerald-400 group-hover:bg-emerald-500/10"
                        }`}
                      >
                        <div className="w-4 h-4 sm:w-5 sm:h-5">
                          {section.icon}
                        </div>
                      </div>
                      <div className="font-medium text-sm sm:text-base">
                        {section.title}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* Privacy Content */}
      <section className="py-12 sm:py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {privacySections.map((section, index) => (
              <motion.div
                key={section.id}
                id={section.id}
                variants={cardVariant}
                className="mb-12 sm:mb-16"
              >
                {/* Section Header */}
                <motion.div
                  className="flex flex-col sm:flex-row items-start sm:items-center mb-6 sm:mb-8"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-2xl border border-emerald-500/30 mr-4 sm:mr-6 mb-3 sm:mb-0">
                    <div className="text-emerald-400 flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7">
                      {section.icon}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                      {section.title}
                    </h2>
                    <div className="flex items-center mt-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-lg border border-emerald-500/30 flex items-center justify-center mr-2 sm:mr-3">
                        <span className="text-xs sm:text-sm font-bold text-emerald-400">
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-emerald-300/70 text-xs sm:text-sm">
                        Section {index + 1} of {privacySections.length}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Content Card */}
                <Card className="bg-white/5 backdrop-blur-xl border border-emerald-500/20 shadow-2xl shadow-emerald-500/10 overflow-hidden">
                  <CardContent className="p-6 sm:p-8 lg:p-10">
                    <div
                      className="text-emerald-100/90 leading-relaxed prose prose-invert max-w-none text-base sm:text-lg [&>h3]:text-[18px] sm:[&>h3]:text-[20px] [&>h3]:font-semibold [&>h3]:text-emerald-300 [&>h3]:mb-3 sm:[&>h3]:mb-3 [&>h3]:mt-4 sm:[&>h3]:mt-6 [&>p]:text-sm sm:[&>p]:text-base [&>ul]:text-sm sm:[&>ul]:text-base [&>li]:text-sm sm:[&>li]:text-base [&>div]:text-sm sm:[&>div]:text-base"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      <Footer />
      <ScrollToTop isMenuOpen={isMenuOpen} />
    </div>
  );
}
