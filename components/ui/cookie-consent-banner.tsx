"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Cookie,
  Settings,
  Shield,
  BarChart3,
  CheckCircle,
  X,
  Info,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
}

interface CookieConsentBannerProps {
  onPreferencesChange?: (preferences: CookiePreferences) => void;
}

const COOKIE_PREFERENCES_KEY = "sprintiq-cookie-preferences";
const COOKIE_CONSENT_KEY = "sprintiq-cookie-consent";

export function CookieConsentBanner({
  onPreferencesChange,
}: CookieConsentBannerProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, cannot be disabled
    analytics: false,
    functional: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setShowBanner(true);
    } else {
      // Load saved preferences
      const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const newPreferences = {
      essential: true,
      analytics: true,
      functional: true,
      marketing: true,
    };
    setPreferences(newPreferences);
    savePreferences(newPreferences);
    setShowBanner(false);
    onPreferencesChange?.(newPreferences);
  };

  const handleRejectAll = () => {
    const newPreferences = {
      essential: true,
      analytics: false,
      functional: false,
      marketing: false,
    };
    setPreferences(newPreferences);
    savePreferences(newPreferences);
    setShowBanner(false);
    onPreferencesChange?.(newPreferences);
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
    setShowSettings(false);
    setShowBanner(false);
    onPreferencesChange?.(preferences);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");

    // Update Google Analytics based on analytics preference
    if (typeof window !== "undefined" && window.gtag) {
      if (prefs.analytics) {
        // Enable analytics
        window.gtag("consent", "update", {
          analytics_storage: "granted",
        });
      } else {
        // Disable analytics
        window.gtag("consent", "update", {
          analytics_storage: "denied",
        });
      }
    }
  };

  const cookieCategories = [
    {
      key: "essential" as const,
      title: "Essential Cookies",
      description:
        "Required for the website to function properly. Cannot be disabled.",
      icon: <Shield className="h-4 w-4" />,
      badge: <Badge variant="secondary">Always Active</Badge>,
      disabled: true,
    },
    {
      key: "analytics" as const,
      title: "Analytics Cookies",
      description:
        "Help us understand how visitors interact with our website by collecting and reporting information anonymously.",
      icon: <BarChart3 className="h-4 w-4" />,
      badge: <Badge variant="outline">Google Analytics</Badge>,
      disabled: false,
    },
    {
      key: "functional" as const,
      title: "Functional Cookies",
      description:
        "Enable enhanced functionality and personalization, such as remembering your preferences.",
      icon: <Settings className="h-4 w-4" />,
      badge: <Badge variant="outline">Preferences</Badge>,
      disabled: false,
    },
    {
      key: "marketing" as const,
      title: "Marketing Cookies",
      description:
        "Used to track visitors across websites to display relevant advertisements.",
      icon: <Cookie className="h-4 w-4" />,
      badge: <Badge variant="outline">Advertising</Badge>,
      disabled: false,
    },
  ];

  if (!showBanner && !showSettings) {
    return null;
  }

  return (
    <>
      {/* Cookie Consent Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-4"
          >
            <div className="max-w-5xl mx-auto">
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl shadow-xl">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-2xl" />

                <div className="relative p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                    {/* Icon with animated background */}
                    <div className="flex-shrink-0 flex justify-center sm:justify-start">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-lg animate-pulse" />
                        <Cookie className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-xl font-bold text-emerald-400 mb-2">
                            We use cookies to enhance your experience
                          </h3>
                          <p className="text-sm sm:text-base text-white leading-relaxed">
                            We use cookies and similar technologies to help
                            personalize content, provide and measure
                            advertisements, and offer a better experience. By
                            continuing to use our site, you accept our use of
                            cookies.
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowBanner(false)}
                          className="flex-shrink-0 text-white hover:text-foreground hover:bg-white/10 rounded-full p-2 ml-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          onClick={handleAcceptAll}
                          size="sm"
                          className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 order-1 sm:order-1"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept All Cookies
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowSettings(true)}
                          size="sm"
                          className="w-full sm:w-auto border-white/20 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm order-2 sm:order-2"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Customize Settings
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={handleRejectAll}
                          size="sm"
                          className="w-full sm:w-auto text-white hover:text-foreground hover:bg-white/10 order-3 sm:order-3"
                        >
                          Reject All
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cookie Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Cookie Preferences
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="text-sm text-muted-foreground">
              <p className="mb-4">
                Manage your cookie preferences below. Essential cookies are
                always enabled as they are necessary for the website to function
                properly.
              </p>
              <div className="flex items-center gap-2 text-xs">
                <Info className="h-3 w-3 flex-shrink-0" />
                <span>
                  You can change these settings at any time by visiting our{" "}
                  <a
                    href="/privacy"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Privacy Policy
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {cookieCategories.map((category) => (
                <div
                  key={category.key}
                  className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-4 border rounded-lg gap-3 sm:gap-4"
                >
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {category.icon}
                        <h4 className="font-medium text-sm sm:text-base">
                          {category.title}
                        </h4>
                      </div>
                      <div className="flex-shrink-0">{category.badge}</div>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex justify-end sm:justify-start">
                    <Switch
                      checked={preferences[category.key]}
                      onCheckedChange={(checked) =>
                        setPreferences((prev) => ({
                          ...prev,
                          [category.key]: checked,
                        }))
                      }
                      disabled={category.disabled}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowSettings(false)}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSavePreferences}
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                Save Preferences
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
