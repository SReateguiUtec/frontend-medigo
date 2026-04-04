import { cn } from "@/lib/utils";
import React from "react";
import type { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center bg-transparent text-slate-950",
        className
      )}
      {...props}
    >
      {/* Aurora layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -inset-[10px] opacity-50 will-change-transform"
          style={{
            backgroundImage: [
              "repeating-linear-gradient(100deg, #fff 0%, #fff 7%, transparent 10%, transparent 12%, #fff 16%)",
              "repeating-linear-gradient(100deg, #3b82f6 10%, #a5b4fc 15%, #93c5fd 20%, #ddd6fe 25%, #60a5fa 30%)",
            ].join(", "),
            backgroundSize: "300%, 200%",
            backgroundPosition: "50% 50%, 50% 50%",
            filter: "blur(10px)",
            animation: "aurora 60s linear infinite",
            maskImage: showRadialGradient
              ? "radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%)"
              : undefined,
            WebkitMaskImage: showRadialGradient
              ? "radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%)"
              : undefined,
          }}
        />
        {/* Bottom fade — blends aurora into the page background */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{
            background: "linear-gradient(to top, #eff6ff, transparent)",
          }}
        />
      </div>
      {children}
    </div>
  );
};
