import * as React from "react";

type Props = {
  size?: number;
  className?: string;
  withMark?: boolean;
};

export function Logo({ size = 28, className = "" }: Props) {
  return (
    <span
      className={`inline-flex select-none items-center ${className}`}
      aria-label="rewrito"
    >
      <img
        src="/rewrito-logo.png"
        alt="rewrito"
        width={Math.round(size * 4.45)}
        height={size}
        className="h-auto max-w-full object-contain"
        style={{ width: Math.round(size * 4.45), height: size }}
      />
    </span>
  );
}

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
      <path
        d="M13 28 V16.5 M13 19.5 C 14.5 17 17 16 20 16.2"
        stroke="#111827"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="29" cy="12" r="3.2" fill="url(#rw-grad)" />
    </svg>
  );
}
