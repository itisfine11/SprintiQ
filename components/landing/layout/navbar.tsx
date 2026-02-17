"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronRight, AlignRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetTitle,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { RocketSvg } from "@/components/svg/RocketSvg";
import { AiBrainSvg } from "@/components/svg/AiBrainSvg";
import { WebSvg } from "@/components/svg/WebSvg";
import { AgileSvg } from "@/components/svg/AgileSvg";
import { DataAnalyticsSvg } from "@/components/svg/DataAnalyticsSvg";
import { InventiveSvg } from "@/components/svg/InventiveSvg";
import TeamsSvg from "@/components/svg/TeamsSvg";
import { GearSvg } from "@/components/svg/GearSvg";
import SprintiQSvg from "@/components/svg/SprintiQSvg";
import { BlogSvg } from "@/components/svg/BlogSvg";
import { ConsultingSvg } from "@/components/svg/ConsultingSvg";
import { BadgeSvg } from "@/components/svg/BadgeSvg";
import { QuestionSvg } from "@/components/svg/QuestionSvg";
import { TermsSvg } from "@/components/svg/TermsSvg";
import { TeamSvg } from "@/components/svg/TeamSvg";
import { BarChartDollarSvg } from "@/components/svg/BarChartDollarSvg";
import { IndividualSvg } from "@/components/svg/IndividualSvg";

export default function Navbar({
  isMenuOpen,
  setIsMenuOpen,
}: {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/features" },
  ];

  const useCases = [
    {
      label: "Overwhelmed Product Managers",
      icon: <AiBrainSvg color="#7fffbf" />,
      href: "/use-case#overwhelmed-product-managers",
    },
    {
      label: "Frustrated Development Teams",
      icon: <WebSvg color="#7fffbf" />,
      href: "/use-case#frustrated-development-teams",
    },
    {
      label: "Dual Scrum Master & Dev",
      icon: <AgileSvg color="#7fffbf" />,
      href: "/use-case#dual-scrum-master-dev",
    },
    {
      label: "Enterprise Teams",
      icon: <DataAnalyticsSvg color="#7fffbf" />,
      href: "/use-case#enterprise-teams",
    },
    {
      label: "Lost Startups",
      icon: <InventiveSvg color="#7fffbf" />,
      href: "/use-case#lost-startups",
    },
    {
      label: "Teams with Skill Mismatches",
      icon: <TeamSvg color="#7fffbf" />,
      href: "/use-case#skill-mismatches",
    },
    {
      label: "Beginners",
      icon: <RocketSvg color="#7fffbf" />,
      href: "/use-case#beginners",
    },
    {
      label: "Scope Creep Struggles",
      icon: <GearSvg color="#7fffbf" />,
      href: "/use-case#scope-creep",
    },
    {
      label: "Individual Contributor Scrum Masters",
      icon: <IndividualSvg color="#7fffbf" />,
      href: "/use-case#individual-contributor-scrum-master",
    },
    {
      label: "Technical Debt Balance Management",
      icon: <DataAnalyticsSvg color="#7fffbf" />,
      href: "/use-case#technical-debt-balance",
    },
    {
      label: "Post Series A Startups",
      icon: <RocketSvg color="#7fffbf" />,
      href: "/use-case#post-series-a-startups",
    },
    {
      label: "Investor Reporting Automation",
      icon: <BarChartDollarSvg color="#7fffbf" />,
      href: "/use-case#investor-reporting-automation",
    },
  ];

  const company = [
    { label: "About Us", icon: <SprintiQSvg />, href: "/about" },
    { label: "Insights", icon: <BlogSvg color="#7fffbf" />, href: "/insights" },
    {
      label: "Contact",
      icon: <ConsultingSvg color="#7fffbf" />,
      href: "/contact",
    },
  ];

  const support = [
    {
      label: "Terms of Service",
      icon: <TermsSvg color="#7fffbf" />,
      href: "/terms",
    },
    {
      label: "Privacy Policy",
      icon: <BadgeSvg color="#7fffbf" />,
      href: "/privacy",
    },
    { label: "FAQ", icon: <QuestionSvg color="#7fffbf" />, href: "/faq" },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        isScrolled
          ? "bg-[#0F192B]/90 border-b border-white/10 shadow-lg "
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-0">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <Image
              src="https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/SprintiQ/sprintiq-logo.png"
              alt="SprintiQ Logo"
              width={150}
              height={40}
              priority
              className="h-auto w-[120px] transition-transform duration-200 group-hover:scale-105 lg:w-[150px]"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-3 py-2 transition-all duration-300 text-base font-medium flex items-center group",
                      isActive
                        ? "text-emerald-400 font-semibold"
                        : "text-white/90 hover:text-emerald-300"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                    <div
                      className={cn(
                        "absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 bg-gradient-to-r from-emerald-400 to-green-400 transition-all duration-300",
                        isActive
                          ? "w-full opacity-100"
                          : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                      )}
                    />
                  </Link>
                );
              })}

              {/* Use Cases Navigation Menu */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={cn(
                        "relative px-3 py-2 transition-all duration-300 text-base font-medium flex items-center group gap-1 bg-transparent hover:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-emerald-300 hover:text-emerald-300",
                        pathname === "/use-case"
                          ? "text-emerald-400 font-semibold"
                          : "text-white/90 hover:text-emerald-300"
                      )}
                    >
                      Use Cases
                      <div
                        className={cn(
                          "absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 bg-gradient-to-r from-emerald-400 to-green-400 transition-all duration-300",
                          pathname === "/use-case"
                            ? "w-full opacity-100"
                            : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                        )}
                      />
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-[#0F192B]/95 border border-emerald-500/30 shadow-2xl rounded-xl">
                        {useCases.map((useCase) => (
                          <li key={useCase.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={useCase.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-emerald-500/10 hover:text-emerald-700 focus:bg-emerald-50 focus:text-emerald-700"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 p-1 bg-emerald-500/50 rounded-lg">
                                    <div className="w-full h-full flex items-center justify-center">
                                      {useCase.icon}
                                    </div>
                                  </div>
                                  <div className="flex-1 text-sm font-medium leading-none text-white">
                                    {useCase.label}
                                  </div>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={cn(
                        "relative px-3 py-2 transition-all duration-300 text-base font-medium flex items-center group gap-1 bg-transparent hover:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-emerald-300 hover:text-emerald-300",
                        pathname === "/about" ||
                          pathname === "/insights" ||
                          pathname === "/contact"
                          ? "text-emerald-400 font-semibold"
                          : "text-white/90 hover:text-emerald-300"
                      )}
                    >
                      Company
                      <div
                        className={cn(
                          "absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 bg-gradient-to-r from-emerald-400 to-green-400 transition-all duration-300",
                          pathname === "/about" ||
                            pathname === "/insights" ||
                            pathname === "/contact"
                            ? "w-full opacity-100"
                            : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                        )}
                      />
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[200px] gap-3 p-4 bg-[#0F192B]/95 border border-emerald-500/30 shadow-2xl rounded-xl isolate">
                        {company.map((company) => (
                          <li key={company.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={company.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-emerald-500/10 hover:text-emerald-700 focus:bg-emerald-50 focus:text-emerald-700"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 p-1 bg-emerald-500/50 rounded-lg flex items-center justify-center">
                                    {company.icon}
                                  </div>
                                  <div className="text-sm font-medium leading-none text-white">
                                    {company.label}
                                  </div>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <Link
                key="pricing"
                href="/pricing"
                className={cn(
                  "relative px-3 py-2 transition-all duration-300 text-base font-medium flex items-center group",
                  pathname === "/pricing"
                    ? "text-emerald-400 font-semibold"
                    : "text-white/90 hover:text-emerald-300"
                )}
                aria-current={pathname === "/pricing" ? "page" : undefined}
              >
                Pricing
                <div
                  className={cn(
                    "absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 bg-gradient-to-r from-emerald-400 to-green-400 transition-all duration-300",
                    pathname === "/pricing"
                      ? "w-full opacity-100"
                      : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                  )}
                />
              </Link>

              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={cn(
                        "relative px-3 py-2 transition-all duration-300 text-base font-medium flex items-center group gap-1 bg-transparent hover:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-emerald-300 hover:text-emerald-300",
                        pathname === "/terms" ||
                          pathname === "/privacy" ||
                          pathname === "/faq"
                          ? "text-emerald-400 font-semibold"
                          : "text-white/90 hover:text-emerald-300"
                      )}
                    >
                      Support
                      <div
                        className={cn(
                          "absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 bg-gradient-to-r from-emerald-400 to-green-400 transition-all duration-300",
                          pathname === "/terms" ||
                            pathname === "/privacy" ||
                            pathname === "/faq"
                            ? "w-full opacity-100"
                            : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                        )}
                      />
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[250px] gap-3 p-4 bg-[#0F192B]/95 border border-emerald-500/30 shadow-2xl rounded-xl isolate">
                        {support.map((support) => (
                          <li key={support.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={support.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-emerald-500/10 hover:text-emerald-700 focus:bg-emerald-50 focus:text-emerald-700"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 p-1 bg-emerald-500/50 rounded-lg flex items-center justify-center">
                                    {support.icon}
                                  </div>
                                  <div className="text-sm font-medium leading-none text-white">
                                    {support.label}
                                  </div>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="flex items-center space-x-6">
              <Link
                href="/signin"
                className={cn(
                  "transition-all duration-300 text-base font-medium px-4 py-2 rounded-lg hover:bg-white/10",
                  pathname === "/signin"
                    ? "text-emerald-400 font-semibold bg-white/5"
                    : "text-white/90 hover:text-emerald-300"
                )}
              >
                Sign In
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative p-1 hover:bg-white/10 transition-all duration-300"
                  aria-label="Toggle mobile menu"
                >
                  <AlignRight className="h-12 w-12 text-white" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] p-0 bg-white [&>button]:hidden flex flex-col h-full"
              >
                <SheetHeader className="p-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <Image
                      src="https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/SprintiQ/logo1.png"
                      alt="SprintiQ Logo"
                      width={150}
                      height={40}
                      priority
                      className="h-auto transition-transform duration-200"
                    />
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-9 h-9 p-0 rounded-full hover:bg-gray-200 text-gray-600 hover:text-gray-800"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </SheetClose>
                  </div>
                </SheetHeader>

                {/* Links */}
                <div className="flex-1 overflow-y-auto p-3">
                  <div className="space-y-3">
                    {navLinks.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                            "flex items-center justify-between w-full p-2  font-semibold rounded-xl transition-all duration-200 group text-sm",
                            isActive
                              ? "bg-emerald-100 text-emerald-700 font-bold"
                              : "text-gray-800 hover:bg-gray-100 hover:text-emerald-700"
                          )}
                          aria-current={isActive ? "page" : undefined}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span>{link.label}</span>
                          <ChevronRight
                            className={cn(
                              "h-5 w-5 transition-all duration-200",
                              isActive
                                ? "text-emerald-600"
                                : "text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1"
                            )}
                          />
                        </Link>
                      );
                    })}

                    {/* Use Cases Section */}
                    <div className="border-t border-gray-200 pt-3">
                      <div className="text-sm font-semibold text-gray-600 mb-2 px-3">
                        Use Cases
                      </div>
                      <div className="space-y-1">
                        {useCases.map((useCase) => {
                          const isActive = pathname === useCase.href;
                          return (
                            <Link
                              key={useCase.href}
                              href={useCase.href}
                              className={cn(
                                "flex items-center justify-between w-full p-2 rounded-lg transition-all duration-200 group text-sm",
                                isActive
                                  ? "bg-emerald-100 text-emerald-700 font-semibold"
                                  : "text-gray-600 hover:bg-gray-100 hover:text-emerald-700"
                              )}
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <div className="flex items-center space-x-3">
                                <span>{useCase.label}</span>
                              </div>
                              <ChevronRight
                                className={cn(
                                  "h-4 w-4 transition-all duration-200",
                                  isActive
                                    ? "text-emerald-600"
                                    : "text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1"
                                )}
                              />
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                    {/* Company Section */}
                    <div className="border-t border-gray-200 pt-3">
                      <div className="text-sm font-semibold text-gray-600 mb-2 px-3">
                        Company
                      </div>
                      <div className="space-y-1">
                        {company.map((companyItem) => {
                          const isActive = pathname === companyItem.href;
                          return (
                            <Link
                              key={companyItem.href}
                              href={companyItem.href}
                              className={cn(
                                "flex items-center justify-between w-full p-2 rounded-lg transition-all duration-200 group text-sm",
                                isActive
                                  ? "bg-emerald-100 text-emerald-700 font-semibold"
                                  : "text-gray-600 hover:bg-gray-100 hover:text-emerald-700"
                              )}
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <div className="flex items-center space-x-3">
                                <span>{companyItem.label}</span>
                              </div>
                              <ChevronRight
                                className={cn(
                                  "h-4 w-4 transition-all duration-200",
                                  isActive
                                    ? "text-emerald-600"
                                    : "text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1"
                                )}
                              />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                    <hr />
                    <Link
                      key="pricing"
                      href="/pricing"
                      className={cn(
                        "flex items-center justify-between w-full p-2 font-semibold rounded-xl transition-all duration-200 group text-sm",
                        pathname === "/pricing"
                          ? "bg-emerald-100 text-emerald-700 font-bold"
                          : "text-gray-800 hover:bg-gray-100 hover:text-emerald-700"
                      )}
                      aria-current={
                        pathname === "/pricing" ? "page" : undefined
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>Pricing</span>
                      <ChevronRight
                        className={cn(
                          "h-5 w-5 transition-all duration-200",
                          pathname === "/pricing"
                            ? "text-emerald-600"
                            : "text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1"
                        )}
                      />
                    </Link>

                    {/* Support Section */}
                    <div className="border-t border-gray-200 pt-3">
                      <div className="text-sm font-semibold text-gray-600 mb-2 px-3">
                        Support
                      </div>
                      <div className="space-y-1">
                        {support.map((supportItem) => {
                          const isActive = pathname === supportItem.href;
                          return (
                            <Link
                              key={supportItem.href}
                              href={supportItem.href}
                              className={cn(
                                "flex items-center justify-between w-full p-2 rounded-lg transition-all duration-200 group text-sm",
                                isActive
                                  ? "bg-emerald-100 text-emerald-700 font-semibold"
                                  : "text-gray-600 hover:bg-gray-100 hover:text-emerald-700"
                              )}
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <div className="flex items-center space-x-3">
                                <span>{supportItem.label}</span>
                              </div>
                              <ChevronRight
                                className={cn(
                                  "h-4 w-4 transition-all duration-200",
                                  isActive
                                    ? "text-emerald-600"
                                    : "text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1"
                                )}
                              />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Auth buttons */}
                <SheetFooter className="p-3 flex flex-col gap-3 border-t border-gray-200 mt-auto">
                  <Link href="/signin" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="default"
                      className="w-full py-4 text-base bg-gray-900 hover:bg-black text-white"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white py-4 text-base font-medium">
                      Get Started
                    </Button>
                  </Link>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}
