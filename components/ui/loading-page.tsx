"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Sparkles,
  Brain,
  Rocket,
  BarChart3,
  Users,
  Clock,
  Zap,
  Target,
  TrendingUp,
  Cpu,
  Activity,
  Layers,
} from "lucide-react";

interface LoadingPageProps {
  message?: string;
  className?: string;
  showProgress?: boolean;
  showTips?: boolean;
  variant?:
    | "default"
    | "minimal"
    | "premium"
    | "ultra"
    | "neon"
    | "matrix"
    | "hologram";
}

const loadingTips = [
  "AI algorithms analyze 10,000+ data points per sprint",
  "Machine learning predicts delivery dates with 95% accuracy",
  "Smart automation eliminates 80% of manual planning tasks",
  "Real-time analytics process team data in milliseconds",
  "Neural networks optimize resource allocation automatically",
  "Predictive models forecast project risks before they occur",
  "Advanced algorithms learn from your team's unique patterns",
  "Intelligent insights boost team productivity by 60%",
];

const loadingIcons = [
  Brain,
  Rocket,
  BarChart3,
  Users,
  Sparkles,
  Clock,
  Zap,
  Target,
  TrendingUp,
  Cpu,
  Activity,
  Layers,
];

// Holographic loading spinner with 3D effect
const HolographicSpinner = ({ size = "lg" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Holographic rings */}
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className={`${sizeClasses[size]} absolute border-2 rounded-full`}
          style={{
            borderColor: `hsl(${180 + i * 30}, 70%, 60%)`,
            animation: `holographic-spin ${2 + i * 0.5}s linear infinite`,
            animationDelay: `${i * 0.2}s`,
            transform: `scale(${1 - i * 0.15}) rotateX(${i * 15}deg)`,
            opacity: 0.8 - i * 0.15,
          }}
        />
      ))}

      {/* Center core */}
      <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse shadow-lg shadow-cyan-400/50" />

      <style jsx>{`
        @keyframes holographic-spin {
          from {
            transform: rotateY(0deg) rotateX(15deg);
          }
          to {
            transform: rotateY(360deg) rotateX(15deg);
          }
        }
      `}</style>
    </div>
  );
};

// Matrix-style digital rain effect
const MatrixRain = () => {
  const [drops, setDrops] = useState<
    Array<{ id: number; x: number; y: number; speed: number; char: string }>
  >([]);

  useEffect(() => {
    const chars = "SprintiQ";
    const newDrops = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      speed: Math.random() * 2 + 1,
      char: chars[Math.floor(Math.random() * chars.length)],
    }));
    setDrops(newDrops);

    const interval = setInterval(() => {
      setDrops((prev) =>
        prev.map((drop) => ({
          ...drop,
          y: (drop.y + drop.speed) % 110,
          char: chars[Math.floor(Math.random() * chars.length)],
        }))
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute text-green-400 font-mono text-sm opacity-60"
          style={{
            left: `${drop.x}%`,
            top: `${drop.y}%`,
            textShadow: "0 0 10px #00ff00",
            animation: "matrix-glow 2s ease-in-out infinite alternate",
          }}
        >
          {drop.char}
        </div>
      ))}
      <style jsx>{`
        @keyframes matrix-glow {
          from {
            opacity: 0.3;
            text-shadow: 0 0 5px #00ff00;
          }
          to {
            opacity: 0.8;
            text-shadow: 0 0 20px #00ff00, 0 0 30px #00ff00;
          }
        }
      `}</style>
    </div>
  );
};

// Neon pulse loader with electric effects
const NeonPulseLoader = ({ size = "lg" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Electric outer ring */}
      <div
        className={`${sizeClasses[size]} absolute border-2 border-pink-500 rounded-full animate-pulse`}
        style={{
          boxShadow: "0 0 20px #ec4899, inset 0 0 20px #ec4899",
          animation: "neon-pulse 1.5s ease-in-out infinite",
        }}
      />

      {/* Middle energy ring */}
      <div
        className={`${sizeClasses[size]} absolute border border-cyan-400 rounded-full`}
        style={{
          boxShadow: "0 0 30px #22d3ee, inset 0 0 30px #22d3ee",
          animation: "neon-rotate 2s linear infinite reverse",
          transform: "scale(0.7)",
        }}
      />

      {/* Inner core */}
      <div
        className="w-3 h-3 bg-white rounded-full"
        style={{
          boxShadow: "0 0 15px #ffffff, 0 0 25px #ffffff",
          animation: "neon-core 1s ease-in-out infinite alternate",
        }}
      />

      {/* Electric sparks */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-yellow-400 rounded-full"
          style={{
            animation: `electric-spark 0.8s ease-in-out infinite`,
            animationDelay: `${i * 0.1}s`,
            transform: `rotate(${i * 60}deg) translateX(${
              size === "lg" ? "40" : size === "md" ? "30" : "20"
            }px)`,
            boxShadow: "0 0 10px #facc15",
          }}
        />
      ))}

      <style jsx>{`
        @keyframes neon-pulse {
          0%,
          100% {
            transform: scale(1);
            box-shadow: 0 0 20px #ec4899, inset 0 0 20px #ec4899;
          }
          50% {
            transform: scale(1.1);
            box-shadow: 0 0 40px #ec4899, inset 0 0 40px #ec4899;
          }
        }
        @keyframes neon-rotate {
          from {
            transform: scale(0.7) rotate(0deg);
          }
          to {
            transform: scale(0.7) rotate(360deg);
          }
        }
        @keyframes neon-core {
          from {
            transform: scale(1);
            box-shadow: 0 0 15px #ffffff, 0 0 25px #ffffff;
          }
          to {
            transform: scale(1.2);
            box-shadow: 0 0 25px #ffffff, 0 0 40px #ffffff;
          }
        }
        @keyframes electric-spark {
          0%,
          100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

// Ultra-premium animated background with neural network effect
const NeuralNetworkBackground = () => {
  const [nodes, setNodes] = useState<
    Array<{ x: number; y: number; vx: number; vy: number }>
  >([]);

  useEffect(() => {
    const nodeCount = 25;
    const newNodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));
    setNodes(newNodes);

    const interval = setInterval(() => {
      setNodes((prevNodes) =>
        prevNodes.map((node) => ({
          x: (node.x + node.vx + 100) % 100,
          y: (node.y + node.vy + 100) % 100,
          vx: node.vx,
          vy: node.vy,
        }))
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="w-full h-full" style={{ filter: "blur(0.5px)" }}>
        {/* Neural network connections */}
        {nodes.map((node, i) =>
          nodes.slice(i + 1).map((otherNode, j) => {
            const distance = Math.sqrt(
              Math.pow(node.x - otherNode.x, 2) +
                Math.pow(node.y - otherNode.y, 2)
            );
            if (distance < 20) {
              return (
                <line
                  key={`${i}-${j}`}
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${otherNode.x}%`}
                  y2={`${otherNode.y}%`}
                  stroke="url(#gradient)"
                  strokeWidth="1"
                  opacity={Math.max(0.1, 1 - distance / 20)}
                />
              );
            }
            return null;
          })
        )}

        {/* Neural network nodes */}
        {nodes.map((node, i) => (
          <circle
            key={i}
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r="2"
            fill="url(#nodeGradient)"
            opacity="0.8"
          />
        ))}

        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              stopColor="rgb(var(--primary))"
              stopOpacity="0.3"
            />
            <stop
              offset="100%"
              stopColor="rgb(var(--primary))"
              stopOpacity="0.1"
            />
          </linearGradient>
          <radialGradient id="nodeGradient">
            <stop
              offset="0%"
              stopColor="rgb(var(--primary))"
              stopOpacity="0.8"
            />
            <stop
              offset="100%"
              stopColor="rgb(var(--primary))"
              stopOpacity="0.2"
            />
          </radialGradient>
        </defs>
      </svg>

      {/* Floating geometric shapes */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`shape-${i}`}
          className="absolute opacity-20"
          style={{
            left: `${20 + i * 10}%`,
            top: `${15 + (i % 3) * 25}%`,
            animation: `float ${4 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }}
        >
          {i % 3 === 0 && <div className="w-3 h-3 bg-primary/30 rotate-45" />}
          {i % 3 === 1 && (
            <div className="w-4 h-4 bg-primary/20 rounded-full" />
          )}
          {i % 3 === 2 && <div className="w-2 h-6 bg-primary/25" />}
        </div>
      ))}
    </div>
  );
};

// Premium loading spinner with orbital animation
const PremiumSpinner = ({ size = "lg" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer ring */}
      <div
        className={`${sizeClasses[size]} absolute border-2 border-primary/20 rounded-full`}
      />

      {/* Middle ring */}
      <div
        className={`${sizeClasses[size]} absolute border-2 border-transparent border-t-primary/60 rounded-full animate-spin`}
        style={{ animationDuration: "1s" }}
      />

      {/* Inner ring */}
      <div
        className={`${sizeClasses[size]} absolute border border-transparent border-t-primary rounded-full animate-spin`}
        style={{ animationDuration: "0.7s", animationDirection: "reverse" }}
      />

      {/* Center dot */}
      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />

      {/* Orbital dots */}
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-primary/60 rounded-full"
          style={{
            animation: `orbit 2s linear infinite`,
            animationDelay: `${i * 0.6}s`,
            transformOrigin: `${
              parseInt(sizeClasses[size].split(" ")[0].slice(2)) * 4
            }px center`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg)
              translateX(
                ${size === "lg" ? "32" : size === "md" ? "24" : "16"}px
              )
              rotate(0deg);
          }
          to {
            transform: rotate(360deg)
              translateX(
                ${size === "lg" ? "32" : size === "md" ? "24" : "16"}px
              )
              rotate(-360deg);
          }
        }
      `}</style>
    </div>
  );
};

export function LoadingPage({
  message = "Loading SprintiQ...",
  className,
  showProgress = true,
  showTips = true,
  variant = "premium",
}: LoadingPageProps) {
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  const [iconIndex, setIconIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!showProgress) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        const increment = Math.random() * 8 + 2; // More realistic progress
        return Math.min(prev + increment, 95);
      });
    }, 150);

    return () => clearInterval(progressInterval);
  }, [showProgress]);

  useEffect(() => {
    if (!showTips) return;

    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % loadingTips.length);
      setIconIndex((prev) => (prev + 1) % loadingIcons.length);
    }, 4000);

    return () => clearInterval(tipInterval);
  }, [showTips]);

  const CurrentIcon = loadingIcons[iconIndex];

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}
    >
      {/* Dynamic background with mesh gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.1),transparent_50%)]" />

      {/* Animated particles */}
      <NeuralNetworkBackground />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center space-y-12 p-8 max-w-lg w-full mx-4">
        {/* Premium loading spinner */}
        <div className="relative">
          <PremiumSpinner size="lg" />
        </div>

        {/* Enhanced progress section */}
        <div className="w-full space-y-4">
          <div className="flex items-center justify-center">
            <span className="text-white/80 font-medium text-center">
              {message}
            </span>
          </div>
        </div>
      </div>
      {/* Enhanced tips section */}
      {showTips && (
        <div className="absolute bottom-0 text-center space-y-4 min-h-[4rem] flex flex-col justify-center">
          <div
            key={currentTip}
            className="text-white/80 leading-relaxed font-medium max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700"
          >
            {loadingTips[currentTip]}
          </div>
        </div>
      )}
    </div>
  );
}

// Professional loading overlay for quick transitions
export function LoadingOverlay({
  className,
  size = "default",
  variant = "default",
}: {
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "premium" | "minimal";
}) {
  // Map overlay sizes to spinner sizes
  const mapSize = (
    overlaySize: "sm" | "default" | "lg"
  ): "sm" | "md" | "lg" => {
    switch (overlaySize) {
      case "sm":
        return "sm";
      case "default":
        return "md";
      case "lg":
        return "lg";
    }
  };

  if (variant === "premium") {
    return (
      <div
        className={`absolute inset-0 bg-slate-900/80 backdrop-blur-md z-10 flex items-center justify-center animate-in fade-in duration-300 ${className}`}
      >
        <div className="relative">
          {/* Outer glow */}
          <div className="absolute -inset-8 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-full blur-xl opacity-75" />

          {/* Premium spinner */}
          <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <PremiumSpinner size={mapSize(size)} />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div
        className={`absolute inset-0 bg-background/40 backdrop-blur-sm z-10 flex items-center justify-center animate-in fade-in duration-200 ${className}`}
      >
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className={`absolute inset-0 bg-background/70 backdrop-blur-md z-10 flex items-center justify-center animate-in fade-in duration-250 ${className}`}
    >
      <div className="relative">
        {/* Enhanced glow effect */}
        <div className="absolute inset-0 bg-primary/30 rounded-full blur-lg animate-pulse" />

        {/* Main spinner container */}
        <div className="relative bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border/50 shadow-lg">
          <PremiumSpinner size={mapSize(size)} />
        </div>
      </div>
    </div>
  );
}

// Quick loading indicator for buttons and small components
export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 bg-current rounded-full animate-pulse"
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: "1s",
          }}
        />
      ))}
    </div>
  );
}

// Skeleton loader with shimmer effect
export function LoadingSkeleton({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "premium";
}) {
  if (variant === "premium") {
    return (
      <div
        className={`relative overflow-hidden rounded-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 ${className}`}
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"
          style={{ animationDuration: "2s" }}
        />
      </div>
    );
  }

  return <div className={`animate-pulse rounded-md bg-muted ${className}`} />;
}
