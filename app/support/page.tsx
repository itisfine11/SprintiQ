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
  Clock,
  Zap,
  Target,
  BarChart3,
  Settings,
  Headphones,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Brain,
  Menu,
} from "lucide-react";
import Navbar from "@/components/landing/layout/navbar";
import Footer from "@/components/landing/layout/footer";
import ScrollToTop from "@/components/ui/scroll-to-top";
import { ScrollArea } from "@/components/ui/scroll-area";

const slaSections = [
  {
    id: "platform-reliability",
    title: "1. Platform Reliability",
    icon: <Target className="h-5 w-5" />,
    content: `
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Uptime Guarantees</h3>
      <p>We maintain industry-leading uptime standards to ensure your agile planning never stops:</p>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse border border-emerald-500/30 rounded-lg overflow-hidden">
          <thead class="bg-emerald-500/20">
            <tr>
              <th class="border border-emerald-500/30 px-4 py-3 text-left text-emerald-200 font-semibold">Plan</th>
              <th class="border border-emerald-500/30 px-4 py-3 text-left text-emerald-200 font-semibold">Uptime Commitment</th>
              <th class="border border-emerald-500/30 px-4 py-3 text-left text-emerald-200 font-semibold">Monthly Downtime</th>
            </tr>
          </thead>
          <tbody class="bg-white/5">
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Enterprise</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">99.95%</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Max 21 minutes</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Professional</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">99.9%</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Max 43 minutes</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Starter</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">99.5%</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Max 3.6 hours</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Beta</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">99.0%</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Max 7.2 hours</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Maintenance Windows</h3>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Planned maintenance:</strong> Maximum 4 hours per month</li>
        <li><strong>Advance notice:</strong> 72 hours (Enterprise), 48 hours (Professional), 24 hours (Starter)</li>
        <li><strong>Timing:</strong> Outside business hours (6 PM - 6 AM EST)</li>
      </ul>
    `,
  },
  {
    id: "ai-performance-standards",
    title: "2. AI Performance Standards",
    icon: <Zap className="h-5 w-5" />,
    content: `
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Response Time Commitments</h3>
      <p>Our AI-powered features are designed for speed and efficiency:</p>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse border border-emerald-500/30 rounded-lg overflow-hidden">
          <thead class="bg-emerald-500/20">
            <tr>
              <th class="border border-emerald-500/30 px-4 py-3 text-left text-emerald-200 font-semibold">Feature</th>
              <th class="border border-emerald-500/30 px-4 py-3 text-left text-emerald-200 font-semibold">Target Time</th>
              <th class="border border-emerald-500/30 px-4 py-3 text-left text-emerald-200 font-semibold">Maximum Time</th>
            </tr>
          </thead>
          <tbody class="bg-white/5">
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Story Generation</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">15 seconds</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">60 seconds</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Backlog Prioritization</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">10 seconds</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">60 seconds</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Sprint Optimization</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">20 seconds</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">60 seconds</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Dependency Analysis</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">8 seconds</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">60 seconds</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Capacity Estimation</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">5 seconds</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">60 seconds</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Platform Performance</h3>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Page loading:</strong> Under 3 seconds</li>
        <li><strong>API responses:</strong> Under 500ms</li>
        <li><strong>Report generation:</strong> Under 45 seconds</li>
      </ul>
    `,
  },
  {
    id: "integration-reliability",
    title: "3. Integration Reliability",
    icon: <ExternalLink className="h-5 w-5" />,
    content: `
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Supported Platforms</h3>
      <p>SprintiQ seamlessly connects with your existing tools:</p>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse border border-emerald-500/30 rounded-lg overflow-hidden">
          <thead class="bg-emerald-500/20">
            <tr>
              <th class="border border-emerald-500/30 px-4 py-3 text-left text-emerald-200 font-semibold">Platform</th>
              <th class="border border-emerald-500/30 px-4 py-3 text-left text-emerald-200 font-semibold">Sync Speed</th>
              <th class="border border-emerald-500/30 px-4 py-3 text-left text-emerald-200 font-semibold">Max Delay</th>
            </tr>
          </thead>
          <tbody class="bg-white/5">
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Jira</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Real-time</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">5 minutes</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">GitHub</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Real-time</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">3 minutes</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Azure DevOps</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Real-time</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">5 minutes</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Slack</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Real-time</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">2 minutes</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Asana</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Every 15 min</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">30 minutes</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Monday.com</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Every 15 min</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">30 minutes</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">ClickUp</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Every 15 min</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">30 minutes</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Trello</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Every 30 min</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">60 minutes</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Integration Uptime</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>99.9% availability for all integrations</li>
        <li>Automatic failover for critical connections</li>
        <li>Real-time status monitoring available on our status page</li>
      </ul>
    `,
  },
  {
    id: "security-compliance",
    title: "4. Security & Compliance",
    icon: <Shield className="h-5 w-5" />,
    content: `
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Data Protection</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>AES-256 encryption for all data at rest and in transit</li>
        <li>Multi-factor authentication required for all accounts</li>
        <li>Daily automated backups with 30-day retention</li>
        <li>SOC 2 Type II certified infrastructure</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Compliance Standards</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>GDPR compliant data handling</li>
        <li>ISO 27001 security certification</li>
        <li>Regular security audits and vulnerability assessments</li>
        <li>Transparent privacy policies</li>
      </ul>
    `,
  },
  {
    id: "support-coverage",
    title: "5. Support Coverage",
    icon: <Headphones className="h-5 w-5" />,
    content: `
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Support Hours & Response Times</h3>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse border border-emerald-500/30 rounded-lg overflow-hidden">
          <thead class="bg-emerald-500/20">
            <tr>
              <th class="border border-emerald-500/30 px-4 py-3 text-left text-emerald-200 font-semibold">Plan</th>
              <th class="border border-emerald-500/30 px-4 py-3 text-left text-emerald-200 font-semibold">Availability</th>
              <th class="border border-emerald-500/30 px-4 py-3 text-left text-emerald-200 font-semibold">Response Time</th>
            </tr>
          </thead>
          <tbody class="bg-white/5">
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Enterprise</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">24/7/365</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">2 hours</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Professional</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">M-F, 8 AM-8 PM EST</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">8 hours</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Starter</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">M-F, 9 AM-6 PM EST</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">24 hours</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Beta</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">M-F, 9 AM-6 PM EST</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">48 hours</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Support Channels</h3>
      <p><strong>Enterprise Customers:</strong></p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>Dedicated Customer Success Manager</li>
        <li>Priority phone support</li>
        <li>Live chat support</li>
        <li>Email support</li>
        <li>Knowledge base access</li>
      </ul>
      
      <p class="mt-4"><strong>Professional Customers:</strong></p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>Live chat support</li>
        <li>Email support</li>
        <li>Comprehensive knowledge base</li>
        <li>Community forums</li>
      </ul>
      
      <p class="mt-4"><strong>Starter Customers:</strong></p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>Email support</li>
        <li>Knowledge base access</li>
        <li>Community forums</li>
      </ul>
      
      <p class="mt-4"><strong>Beta Users:</strong></p>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>Email support</li>
        <li>Community forums</li>
        <li>Feedback portal</li>
      </ul>
    `,
  },
  {
    id: "ai-accuracy-standards",
    title: "6. AI Accuracy Standards",
    icon: <Brain className="h-5 w-5" />,
    content: `
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Quality Commitments</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>85%+ user satisfaction for AI-generated stories</li>
        <li>90% alignment with user preferences for prioritization</li>
        <li>±15% accuracy for capacity estimation</li>
        <li>95% detection rate for common project risks</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Continuous Improvement</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>Monthly model updates to improve accuracy</li>
        <li>Real-time learning from user feedback</li>
        <li>Custom training available for Enterprise customers</li>
      </ul>
    `,
  },
  {
    id: "enterprise-features",
    title: "7. Enterprise Features",
    icon: <Users className="h-5 w-5" />,
    content: `
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Advanced Capabilities</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>Custom model training (5-10 business days setup)</li>
        <li>Federated learning implementation</li>
        <li>Domain-specific patterns development</li>
        <li>White-label options available</li>
        <li>SSO/SAML authentication</li>
        <li>On-premise deployment options</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Dedicated Services</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>Customer Success Manager assigned</li>
        <li>Custom integrations development</li>
        <li>Priority feature requests</li>
        <li>Strategic analytics platform</li>
        <li>Board-ready reporting</li>
      </ul>
    `,
  },
  {
    id: "service-credits",
    title: "8. Service Credits",
    icon: <CheckCircle className="h-5 w-5" />,
    content: `
      <p>If we don't meet our commitments, we make it right with automatic service credits:</p>
      
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Availability Credits</h3>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse border border-emerald-500/30 rounded-lg overflow-hidden">
          <thead class="bg-emerald-500/20">
            <tr>
              <th class="border border-emerald-500/30 px-4 py-3 text-left text-emerald-200 font-semibold">Uptime Achievement</th>
              <th class="border border-emerald-500/30 px-4 py-3 text-left text-emerald-200 font-semibold">Service Credit</th>
            </tr>
          </thead>
          <tbody class="bg-white/5">
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Below commitment but ≥99.0%</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">5% monthly fee</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Below 99.0% but ≥95.0%</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">15% monthly fee</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Below 95.0%</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">30% monthly fee</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Performance Credits</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>Response time failures: 5% credit per incident</li>
        <li>AI accuracy below standards: 10% monthly credit</li>
        <li>Integration failures: 5% credit per day affected</li>
      </ul>
      
      <p class="mt-4">Credits are automatically applied to your next invoice within 15 business days.</p>
    `,
  },
  {
    id: "transparency-monitoring",
    title: "9. Transparency & Monitoring",
    icon: <BarChart3 className="h-5 w-5" />,
    content: `
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Real-Time Status</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>Live status page: status.sprintiq.ai</li>
        <li>Performance dashboards for Pro+ customers</li>
        <li>Proactive notifications for any service impacts</li>
        <li>Historical metrics available for 12 months</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Regular Reporting</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>Monthly performance reports for all customers</li>
        <li>Quarterly <a href="https://www.sprintiq.ai/sla" target="_blank" rel="noopener noreferrer" class="text-emerald-400 hover:text-emerald-300"><u>SLA</u></a> reviews for Enterprise customers</li>
        <li>Annual platform assessments</li>
      </ul>
    `,
  },
  {
    id: "emergency-support",
    title: "10. Emergency Support",
    icon: <AlertTriangle className="h-5 w-5" />,
    content: `
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Critical Issue Response</h3>
      <p>For service-affecting issues:</p>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Enterprise:</strong> Immediate escalation, 2-hour response</li>
        <li><strong>Professional:</strong> Priority handling, 4-hour response</li>
        <li><strong>All customers:</strong> Real-time status updates</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">24/7 Monitoring</h3>
      <p>Our platform is monitored around the clock with:</p>
      <ul class="list-disc list-inside space-y-2">
        <li>Automated incident detection</li>
        <li>Proactive alerting systems</li>
        <li>Immediate response protocols</li>
        <li>Transparent communication during incidents</li>
      </ul>
    `,
  },
  {
    id: "contact-support",
    title: "11. Contact Support",
    icon: <Mail className="h-5 w-5" />,
    content: `
      <ul class="list-disc list-inside space-y-2">
        <li><strong>All Support Inquiries:</strong> support@sprintiq.ai</li>
        <li><strong>Phone Support (Enterprise):</strong> Available through your Customer Success Manager</li>
        <li><strong>Status Updates:</strong> Follow @SprintIQStatus for real-time updates</li>
      </ul>
    `,
  },
  {
    id: "getting-started",
    title: "12. Getting Started",
    icon: <ArrowRight className="h-5 w-5" />,
    content: `
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">New to SprintiQ?</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>Sign up for free beta access</li>
        <li>Connect your existing tools (Jira, GitHub, etc.)</li>
        <li>Generate your first AI-powered user stories</li>
        <li>Optimize your sprints with intelligent recommendations</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Need Help?</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>Browse our Knowledge Base for quick answers</li>
        <li>Join our Community Forum to connect with other users</li>
        <li>Contact Support for personalized assistance</li>
      </ul>
      
      <div class="bg-emerald-500/10 rounded-lg p-6 mt-6 border border-emerald-500/20">
        <p class="text-emerald-200 text-sm">This guide reflects our current service commitments. For detailed terms and conditions, please refer to our complete <a href="https://www.sprintiq.ai/sla" target="_blank" rel="noopener noreferrer" class="text-emerald-400 hover:text-emerald-300"><u>Service Level Agreement</u></a>. We continuously improve our services and may update these commitments to better serve our customers.</p>
      </div>
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

export default function SupportPage() {
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
                Support Sections
              </h3>
              {slaSections.map((section, index) => (
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
              {slaSections.slice(0, 8).map((section, index) => (
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
              Service Commitments & Support Guide
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight px-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-white via-emerald-100 to-emerald-300 bg-clip-text text-transparent">
                Service Commitments{" "}
              </span>
              <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-green-400 bg-clip-text text-transparent">
                & Support Guide
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-emerald-100/90 max-w-4xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              At SprintiQ, we're committed to delivering reliable,
              high-performance AI-powered agile planning services. Learn about
              our service commitments and support offerings across all plan
              tiers.
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
                  12
                </div>
                <div className="text-xs sm:text-sm text-emerald-200/70">
                  Sections
                </div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-emerald-500/30"></div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-emerald-400">
                  99.95%
                </div>
                <div className="text-xs sm:text-sm text-emerald-200/70">
                  Uptime
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
                Enterprise Grade SLA
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
                Service Guide Contents
              </motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {slaSections.map((section, index) => (
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
      {/* SLA Content */}
      <section className="py-12 sm:py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {slaSections.map((section, index) => (
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
                    <div className="text-emerald-400 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center">
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
                        Section {index + 1} of {slaSections.length}
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
