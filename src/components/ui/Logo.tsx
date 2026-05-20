import * as React from "react";

type Props = {
  size?: number;
  className?: string;
  withMark?: boolean;
};

/**
 * rewrito wordmark.
 *
 * Lowercase, geometric, set in Poppins (inherits from page font stack).
 * The "i" gets a custom gradient dot to carry the brand identity.
 *
 * We render the "i" without its native dot using a span with
 * `font-feature-settings` is unreliable, so we just visually cover the
 * default dot with a same-color block isn't reliable either. Instead we
 * use a "ı" (dotless i, U+0131) so we can place our own dot cleanly.
 */
export function Logo({ size = 28, className = "", withMark = false }: Props) {
  const dotSize = Math.max(3, Math.round(size * 0.18));
  return (
    <span
      className={`inline-flex select-none items-center gap-2 ${className}`}
      aria-label="rewrito"
    >
      {withMark && <LogoMark size={Math.round(size * 1.05)} />}
      <span
        className="relative font-semibold tracking-tight text-ink"
        style={{ fontSize: size, lineHeight: 1, letterSpacing: "-0.02em" }}
      >
        rewr
        <span className="relative inline-block">
          {/* dotless i */}
          {"\u0131"}
          <span
            aria-hidden
            className="absolute rounded-full bg-brand-gradient"
            style={{
              width: dotSize,
              height: dotSize,
              left: "50%",
              top: `-${Math.round(size * 0.05)}px`,
              transform: "translateX(-50%)",
            }}
          />
        </span>
        to
      </span>
    </span>
  );
}

/**
 * Standalone glyph for favicons and tight spaces:
 * a rounded white square containing a soft "r" plus the gradient dot.
 */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="rw-grad" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="10" fill="#FFFFFF" stroke="#E5E7EB" />
      {/* lowercase 'r' */}
      <path
        d="M13 28 V16.5 M13 19.5 C 14.5 17 17 16 20 16.2"
        stroke="#111827"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* gradient dot */}
      <circle cx="29" cy="12" r="3.2" fill="url(#rw-grad)" />
    </svg>
  );
}
