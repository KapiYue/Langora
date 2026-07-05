import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  showText?: boolean;
  inverted?: boolean;
}

export function BrandLogo({
  className,
  markClassName,
  textClassName,
  showText = true,
  inverted = false,
}: BrandLogoProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-2.5", className)}
      aria-label={showText ? undefined : "Langora"}
    >
      <svg
        viewBox="0 0 64 64"
        className={cn("h-9 w-9 shrink-0", markClassName)}
        role="img"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="langora-mark" x1="10" y1="8" x2="54" y2="56">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="52%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="16" fill="url(#langora-mark)" />
        <path
          d="M18 18v27.5c0 2 1.6 3.6 3.6 3.6H46"
          fill="none"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="6"
        />
        <path
          d="M22 18h17.5c5.2 0 9.5 4.2 9.5 9.4 0 5.3-4.3 9.6-9.5 9.6H29"
          fill="none"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.9"
          strokeWidth="5"
        />
        <text
          x="38"
          y="37"
          fill="white"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="15"
          fontWeight="700"
          textAnchor="middle"
        >
          文
        </text>
      </svg>
      {showText && (
        <span
          className={cn(
            "text-xl font-bold leading-none",
            inverted ? "text-white" : "text-slate-950 dark:text-white",
            textClassName
          )}
        >
          Lang<span className="text-orange-500">ora</span>
        </span>
      )}
    </span>
  );
}
