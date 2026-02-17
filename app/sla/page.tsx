"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Lock,
  Database,
  Users,
  Calendar,
  ArrowRight,
  AlertTriangle,
  ExternalLink,
  FileText,
  Clock,
  Zap,
  Target,
  BarChart3,
  Settings,
  Headphones,
  CheckCircle,
  Brain,
  Menu,
} from "lucide-react";
import Navbar from "@/components/landing/layout/navbar";
import Footer from "@/components/landing/layout/footer";
import ScrollToTop from "@/components/ui/scroll-to-top";
import { ScrollArea } from "@/components/ui/scroll-area";

const slaSections = [
  {
    id: "service-overview",
    title: "1. Service Overview",
    icon: <Target className="h-5 w-5" />,
    content: `
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Platform Description</h3>
      <p><a href="https://www.sprintiq.ai" target="_blank" rel="noopener noreferrer" class="text-emerald-400 hover:text-emerald-300"> SprintiQ</a> is an AI-native agile planning platform that provides automated, intelligent sprint planning through sophisticated agentic AI capabilities. The platform serves agile software development teams, product managers, scrum masters, and engineering teams with AI-powered story generation, intelligent backlog prioritization, and automated sprint optimization.</p>
      
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Service Tiers</h3>
      <p>This SLA covers the following <a href="https://www.sprintiq.ai/pricing" target="_blank" rel="noopener noreferrer" class="text-emerald-400 hover:text-emerald-300">service tiers</a>:</p>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Starter Plan:</strong> $19/user/month</li>
        <li><strong>Professional Plan:</strong> $49/user/month</li>
        <li><strong>Enterprise Plan:</strong> $99/user/month</li>
        <li><strong>Beta Program:</strong> Free unlimited access during beta phase</li>
      </ul>
    `,
  },
  {
    id: "availability-commitments",
    title: "2. Availability Commitments",
    icon: <Clock className="h-5 w-5" />,
    content: `
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Platform Uptime</h3>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse border border-emerald-500/30 rounded-lg overflow-hidden">
          <thead class="bg-emerald-500/20">
            <tr>
              <th class="border border-emerald-500/30 px-4 py-3 text-left text-emerald-200 font-semibold">Service Tier</th>
              <th class="border border-emerald-500/30 px-4 py-3 text-left text-emerald-200 font-semibold">Monthly Uptime Commitment</th>
              <th class="border border-emerald-500/30 px-4 py-3 text-left text-emerald-200 font-semibold">Maximum Downtime/Month</th>
            </tr>
          </thead>
          <tbody class="bg-white/5">
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Starter</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">99.5%</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">3 hours 36 minutes</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Professional</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">99.9%</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">43 minutes 12 seconds</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Enterprise</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">99.95%</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">21 minutes 36 seconds</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Beta</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">99.0%</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">7 hours 12 minutes</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Planned Maintenance</h3>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Frequency:</strong> Maximum 4 hours per month</li>
        <li><strong>Notification:</strong> 72 hours advance notice for Enterprise, 48 hours for Professional, 24 hours for Starter</li>
        <li><strong>Window:</strong> Outside business hours (6 PM - 6 AM EST)</li>
        <li><strong>Emergency Maintenance:</strong> May occur with minimal notice for critical security or stability issues</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Availability Calculation</h3>
      <p>Uptime percentage = ((Total Monthly Minutes - Downtime Minutes) / Total Monthly Minutes) × 100</p>
      <p class="mt-3"><strong>Exclusions from downtime calculations:</strong></p>
      <ul class="list-disc list-inside space-y-2">
        <li>Planned maintenance windows</li>
        <li>Force majeure events</li>
        <li>Third-party service failures (AWS, integration partners)</li>
        <li>Client-side connectivity issues</li>
        <li>Misuse or abuse of the platform</li>
      </ul>
    `,
  },
  {
    id: "performance-standards",
    title: "3. Performance Standards",
    icon: <Zap className="h-5 w-5" />,
    content: `
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">AI Response Times</h3>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse border border-emerald-500/30 rounded-lg overflow-hidden">
          <thead class="bg-emerald-500/20">
            <tr>
              <th class="border border-emerald-500/30 px-4 py-3 text-left text-emerald-200 font-semibold">Function</th>
              <th class="border border-emerald-500/30 px-4 py-3 text-left text-emerald-200 font-semibold">Target Response Time</th>
              <th class="border border-emerald-500/30 px-4 py-3 text-left text-emerald-200 font-semibold">Maximum Response Time</th>
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
      <div class="overflow-x-auto">
        <table class="w-full border-collapse border border-emerald-500/30 rounded-lg overflow-hidden">
          <thead class="bg-emerald-500/20">
            <tr>
              <th class="border border-emerald-500/30 px-4 py-3 text-left text-emerald-200 font-semibold">Metric</th>
              <th class="border border-emerald-500/30 px-4 py-3 text-left text-emerald-200 font-semibold">Target</th>
              <th class="border border-emerald-500/30 px-4 py-3 text-left text-emerald-200 font-semibold">Threshold</th>
            </tr>
          </thead>
          <tbody class="bg-white/5">
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Page Load Time</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">&lt; 3 seconds</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">&lt; 8 seconds</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">API Response Time</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">&lt; 500ms</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">&lt; 2 seconds</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">File Upload Processing</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">&lt; 30 seconds</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">&lt; 90 seconds</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Report Generation</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">&lt; 45 seconds</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">&lt; 2 minutes</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">AI Accuracy Standards</h3>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Story Quality Score:</strong> Minimum 85% user satisfaction rating</li>
        <li><strong>Prioritization Accuracy:</strong> 90% alignment with user preferences after training period</li>
        <li><strong>Capacity Estimation Variance:</strong> Within 15% of actual team velocity</li>
        <li><strong>Risk Identification:</strong> 95% detection rate for common project risks</li>
      </ul>
    `,
  },
  {
    id: "ai-service-commitments",
    title: "4. AI Service Commitments",
    icon: <Brain className="h-5 w-5" />,
    content: `
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Model Availability</h3>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Primary AI Models:</strong> 99.9% availability during business hours</li>
        <li><strong>Fallback Systems:</strong> Automatic failover to backup models within 30 seconds</li>
        <li><strong>Model Updates:</strong> Deployed without service interruption</li>
        <li><strong>Training Data Refresh:</strong> Monthly updates to improve accuracy</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Agentic AI Workflow Engine</h3>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Autonomous Decision Processing:</strong> &lt; 10 seconds for routine decisions</li>
        <li><strong>Complex Scenario Escalation:</strong> &lt; 5 seconds to human oversight queue</li>
        <li><strong>Real-time Adaptation:</strong> Continuous learning with &lt;24 hour improvement cycles</li>
        <li><strong>Multi-Agent Coordination:</strong> &lt; 2 seconds inter-agent communication</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Custom Model Training (Enterprise Only)</h3>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Initial Training Setup:</strong> 5-10 business days</li>
        <li><strong>Federated Learning Implementation:</strong> 30 days maximum</li>
        <li><strong>Custom Pattern Development:</strong> 15 business days</li>
        <li><strong>Domain-Specific Model Deployment:</strong> 7 business days</li>
      </ul>
    `,
  },
  {
    id: "integration-commitments",
    title: "5. Integration Commitments",
    icon: <ExternalLink className="h-5 w-5" />,
    content: `
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Third-Party Platform Connectivity</h3>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse border border-emerald-500/30 rounded-lg overflow-hidden">
          <thead class="bg-emerald-500/20">
            <tr>
              <th class="border border-emerald-500/30 px-4 py-3 text-left text-emerald-200 font-semibold">Integration</th>
              <th class="border border-emerald-500/30 px-4 py-3 text-left text-emerald-200 font-semibold">Sync Frequency</th>
              <th class="border border-emerald-500/30 px-4 py-3 text-left text-emerald-200 font-semibold">Maximum Sync Delay</th>
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
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Slack</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Real-time</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">2 minutes</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Asana</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Every 15 minutes</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">30 minutes</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Trello</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Every 30 minutes</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">60 minutes</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Monday.com</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Every 15 minutes</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">30 minutes</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">ClickUp</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Every 15 minutes</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">30 minutes</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Azure DevOps</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Real-time</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">5 minutes</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">API Performance</h3>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>API Uptime:</strong> 99.9% availability</li>
        <li><strong>Rate Limits:</strong> Clearly documented and enforced</li>
        <li><strong>Authentication Response:</strong> &lt; 1 second</li>
        <li><strong>Webhook Delivery:</strong> 99% successful delivery rate</li>
      </ul>
    `,
  },
  {
    id: "security-compliance",
    title: "6. Security and Compliance",
    icon: <Shield className="h-5 w-5" />,
    content: `
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Data Protection</h3>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Encryption:</strong> AES-256 encryption for data at rest and in transit</li>
        <li><strong>Access Controls:</strong> Multi-factor authentication for all accounts</li>
        <li><strong>Data Backup:</strong> Daily automated backups with 30-day retention</li>
        <li><strong>Disaster Recovery:</strong> 4-hour RTO, 1-hour RPO for Enterprise customers</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Compliance Standards</h3>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>SOC 2 Type II:</strong> Annual certification maintained</li>
        <li><strong>GDPR Compliance:</strong> Full compliance with EU data protection regulations</li>
        <li><strong>ISO 27001:</strong> Security management system certification</li>
        <li><strong>Privacy Policy:</strong> Transparent data usage and sharing policies</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Incident Response</h3>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Security Incident Response:</strong> 1 hour notification for security breaches</li>
        <li><strong>Data Breach Protocol:</strong> Immediate notification within 72 hours</li>
        <li><strong>Vulnerability Assessment:</strong> Monthly security scans</li>
        <li><strong>Penetration Testing:</strong> Quarterly third-party security audits</li>
      </ul>
    `,
  },
  {
    id: "support-commitments",
    title: "7. Support Commitments",
    icon: <Headphones className="h-5 w-5" />,
    content: `
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Support Availability</h3>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse border border-emerald-500/30 rounded-lg overflow-hidden">
          <thead class="bg-emerald-500/20">
            <tr>
              <th class="border border-emerald-500/30 px-4 py-3 text-left text-emerald-200 font-semibold">Service Tier</th>
              <th class="border border-emerald-500/30 px-4 py-3 text-left text-emerald-200 font-semibold">Support Hours</th>
              <th class="border border-emerald-500/30 px-4 py-3 text-left text-emerald-200 font-semibold">Response Time Commitment</th>
            </tr>
          </thead>
          <tbody class="bg-white/5">
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Starter</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Business hours (M-F, 9 AM-6 PM EST)</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">24 hours</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Professional</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Extended hours (M-F, 8 AM-8 PM EST)</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">8 hours</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Enterprise</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">24/7/365</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">2 hours</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Beta</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">Business hours</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">48 hours</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Support Channels</h3>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Enterprise:</strong> Dedicated Customer Success Manager, phone, email, chat</li>
        <li><strong>Professional:</strong> Email, chat, knowledge base</li>
        <li><strong>Starter:</strong> Email, knowledge base, community forum</li>
        <li><strong>Beta:</strong> Email, community forum, feedback portal</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Escalation Process</h3>
      <ol class="list-decimal list-inside space-y-2">
        <li><strong>Level 1:</strong> General support inquiries</li>
        <li><strong>Level 2:</strong> Technical issues requiring specialized knowledge</li>
        <li><strong>Level 3:</strong> Critical issues requiring engineering intervention</li>
        <li><strong>Emergency:</strong> Service-affecting issues requiring immediate attention</li>
      </ol>
    `,
  },
  {
    id: "consultancy-services",
    title: "8. Consultancy Services SLA",
    icon: <Users className="h-5 w-5" />,
    content: `
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Agile Transformation Consulting</h3>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Initial Assessment:</strong> Completed within 10 business days</li>
        <li><strong>Strategy Development:</strong> 15 business days for comprehensive plan</li>
        <li><strong>Implementation Support:</strong> Ongoing with weekly check-ins</li>
        <li><strong>Training Delivery:</strong> Custom training programs within 20 business days</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">AI Workflow Design Services</h3>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Workflow Analysis:</strong> 5 business days for current state assessment</li>
        <li><strong>Custom Workflow Development:</strong> 20 business days for complex workflows</li>
        <li><strong>Testing and Validation:</strong> 10 business days for workflow optimization</li>
        <li><strong>Deployment Support:</strong> Real-time assistance during implementation</li>
      </ul>
    `,
  },
  {
    id: "service-credits",
    title: "9. Service Credits and Remedies",
    icon: <CheckCircle className="h-5 w-5" />,
    content: `
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Availability Service Credits</h3>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse border border-emerald-500/30 rounded-lg overflow-hidden">
          <thead class="bg-emerald-500/20">
            <tr>
              <th class="border border-emerald-500/30 px-4 py-3 text-left text-emerald-200 font-semibold">Monthly Uptime Achievement</th>
              <th class="border border-emerald-500/30 px-4 py-3 text-left text-emerald-200 font-semibold">Service Credit</th>
            </tr>
          </thead>
          <tbody class="bg-white/5">
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">&lt; 99.95% but ≥ 99.0% (Enterprise)</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">5% of monthly fees</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">&lt; 99.0% but ≥ 95.0% (Enterprise)</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">15% of monthly fees</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">&lt; 95.0% (Enterprise)</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">30% of monthly fees</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">&lt; 99.9% but ≥ 99.0% (Professional)</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">5% of monthly fees</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">&lt; 99.0% but ≥ 95.0% (Professional)</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">15% of monthly fees</td>
            </tr>
            <tr>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">&lt; 95.0% (Professional)</td>
              <td class="border border-emerald-500/30 px-4 py-3 text-emerald-100">30% of monthly fees</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Performance Service Credits</h3>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Response Time Failures:</strong> 5% credit per incident</li>
        <li><strong>AI Accuracy Below Threshold:</strong> 10% monthly credit</li>
        <li><strong>Integration Failures:</strong> 5% credit per affected integration per day</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Credit Request Process</h3>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Notification Period:</strong> 30 days from incident</li>
        <li><strong>Documentation Required:</strong> Incident details and impact assessment</li>
        <li><strong>Processing Time:</strong> 15 business days for credit approval</li>
        <li><strong>Application Method:</strong> Automatic application to next invoice</li>
      </ul>
    `,
  },
  {
    id: "monitoring-reporting",
    title: "10. Monitoring and Reporting",
    icon: <BarChart3 className="h-5 w-5" />,
    content: `
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Real-Time Monitoring</h3>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Status Page:</strong> Real-time platform status at status.sprintiq.ai</li>
        <li><strong>Performance Dashboard:</strong> Available for Professional and Enterprise customers</li>
        <li><strong>Alert System:</strong> Proactive notifications for service impacts</li>
        <li><strong>Historical Data:</strong> 12 months of performance metrics retention</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">SLA Reporting</h3>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Monthly Reports:</strong> Detailed SLA performance metrics</li>
        <li><strong>Quarterly Reviews:</strong> SLA performance analysis and improvement plans</li>
        <li><strong>Annual Assessment:</strong> Comprehensive SLA effectiveness evaluation</li>
        <li><strong>Custom Reporting:</strong> Available for Enterprise customers</li>
      </ul>
    `,
  },
  {
    id: "limitations-exclusions",
    title: "11. Limitations and Exclusions",
    icon: <AlertTriangle className="h-5 w-5" />,
    content: `
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Service Limitations</h3>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Beta Features:</strong> No SLA commitments for features marked as beta or experimental</li>
        <li><strong>Third-Party Dependencies:</strong> Performance may be affected by external service providers</li>
        <li><strong>User-Generated Content:</strong> Quality of AI outputs depends on input data quality</li>
        <li><strong>Customization Limits:</strong> Some customizations may affect standard performance metrics</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Force Majeure</h3>
      <p>SprintiQ is not liable for service failures due to:</p>
      <ul class="list-disc list-inside space-y-2">
        <li>Natural disasters, acts of war, terrorism</li>
        <li>Government regulations or legal requirements</li>
        <li>Internet infrastructure failures beyond our control</li>
        <li>Cyber attacks or security incidents affecting third-party providers</li>
      </ul>
    `,
  },
  {
    id: "sla-governance",
    title: "12. SLA Governance",
    icon: <Settings className="h-5 w-5" />,
    content: `
      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Review Process</h3>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Quarterly Reviews:</strong> Performance assessment and SLA adjustment discussions</li>
        <li><strong>Annual Updates:</strong> Formal SLA revision based on service evolution</li>
        <li><strong>Customer Feedback:</strong> Regular incorporation of customer input into SLA terms</li>
        <li><strong>Industry Benchmarking:</strong> Alignment with industry best practices</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Communication</h3>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>SLA Changes:</strong> 90-day advance notice for material changes</li>
        <li><strong>Performance Issues:</strong> Transparent communication during service incidents</li>
        <li><strong>Improvement Plans:</strong> Proactive sharing of platform enhancement roadmaps</li>
      </ul>

      <h3 class="text-lg font-semibold text-emerald-300 mt-6 mb-3">Contacts</h3>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>SLA Disputes:</strong> support@sprintiq.ai</li>
        <li><strong>Service Credits:</strong> support@sprintiq.ai</li>
        <li><strong>Technical Issues:</strong> support@sprintiq.ai</li>
        <li><strong>Enterprise Support:</strong> support@sprintiq.ai</li>
      </ul>
    `,
  },
  {
    id: "definitions",
    title: "13. Definitions",
    icon: <FileText className="h-5 w-5" />,
    content: `
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Availability:</strong> The percentage of time the SprintiQ platform is accessible and functioning as intended.</li>
        <li><strong>Business Hours:</strong> Monday through Friday, 9:00 AM to 6:00 PM Eastern Standard Time, excluding federal holidays.</li>
        <li><strong>Downtime:</strong> Any period when the SprintiQ platform is unavailable or not performing within specified parameters.</li>
        <li><strong>Incident:</strong> Any event that causes or may cause an interruption to or reduction in the quality of service.</li>
        <li><strong>Response Time:</strong> The time between when a request is made to the system and when the system begins to respond.</li>
        <li><strong>Service Credit:</strong> A monetary credit applied to a customer's account as compensation for SLA failures.</li>
      </ul>
    `,
  },
  {
    id: "document-control",
    title: "14. Document Control",
    icon: <Database className="h-5 w-5" />,
    content: `
      <div class="bg-emerald-500/10 rounded-lg p-6 mt-6 border border-emerald-500/20">
        <h3 class="text-lg font-semibold text-emerald-300 mb-4">Document Information</h3>
        <ul class="space-y-3">
          <li><strong>Owner:</strong> SprintiQ Operations Team</li>
          <li><strong>Approver:</strong> Chief Technology Officer</li>
          <li><strong>Next Review Date:</strong> Quarterly Review</li>
          <li><strong>Distribution:</strong> All customers, internal stakeholders</li>
        </ul>
      </div>
      
      <p class="mt-6">This SLA is subject to the terms and conditions outlined in the SprintiQ <a href="https://www.sprintiq.ai/terms" target="_blank" rel="noopener noreferrer" class="text-emerald-400 hover:text-emerald-300">Terms of Service</a> and <a href="https://www.sprintiq.ai/privacy" target="_blank" rel="noopener noreferrer" class="text-emerald-400 hover:text-emerald-300">Privacy Policy</a>.</p>
      <p class="mt-3">For questions regarding this SLA, please contact our <a href="https://www.sprintiq.ai/contact" target="_blank" rel="noopener noreferrer" class="text-emerald-400 hover:text-emerald-300">support team</a>.</p>
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

export default function SLAPage() {
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
                SLA Sections
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
              Service Level Agreement
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight px-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-white via-emerald-100 to-emerald-300 bg-clip-text text-transparent">
                Service Level{" "}
              </span>
              <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-green-400 bg-clip-text text-transparent">
                Agreement
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-emerald-100/90 max-w-4xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              We are committed to delivering exceptional service quality and
              performance. Learn about our uptime guarantees, response times,
              and service commitments.
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
                Table of Contents
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
