"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useLoading } from "@/contexts/loading-context";

interface LoadingLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  loadingMessage?: string;
  onClick?: () => void;
}

export function LoadingLink({
  href,
  children,
  className,
  loadingMessage,
  onClick,
}: LoadingLinkProps) {
  const { startPageLoading } = useLoading();

  const handleClick = () => {
    if (onClick) onClick();
    // Trigger loading overlay but allow Next.js Link to handle navigation immediately
    startPageLoading(loadingMessage);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      prefetch
      className={`transition-opacity duration-200 hover:opacity-80 ${
        className || ""
      }`}
    >
      {children}
    </Link>
  );
}
