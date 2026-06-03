import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** size of the mark in px */
  size?: number;
  showWordmark?: boolean;
  variant?: "default" | "light";
}

export function Logo({
  className,
  size = 40,
  showWordmark = true,
  variant = "default",
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* left navy stroke of the W */}
        <path d="M6 14 L20 14 L30 44 L23 50 Z" fill="#0E4C7E" />
        {/* center orange stroke */}
        <path d="M22 14 L34 14 L44 44 L37 50 L29 26 Z" fill="#F2792B" />
        {/* right navy stroke */}
        <path d="M36 14 L48 14 L40 38 L34 22 Z" fill="#0E4C7E" />
        {/* teal apex (the Y tip) */}
        <path d="M46 10 L60 10 L52 30 Z" fill="#2BA9D6" />
      </svg>
      {showWordmark && (
        <span className="text-xl font-extrabold tracking-tight">
          <span className={variant === "light" ? "text-white" : "text-[#0E4C7E]"}>
            Work
          </span>
          <span className="text-[#F2792B]">yapa</span>
        </span>
      )}
    </div>
  );
}
