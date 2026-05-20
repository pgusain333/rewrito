import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      colors: {
        bg: {
          DEFAULT: "#FBFCFF",
          soft: "#F8FAFC",
          section: "#F3F6FB",
        },
        ink: {
          DEFAULT: "#111827",
          muted: "#6B7280",
          subtle: "#9CA3AF",
        },
        brand: {
          DEFAULT: "#7C3AED",
          accent: "#06B6D4",
          softPurple: "#F3E8FF",
          softBlue: "#E0F7FF",
        },
        line: "#E5E7EB",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(17, 24, 39, 0.04), 0 4px 16px rgba(17, 24, 39, 0.04)",
        card: "0 1px 3px rgba(17, 24, 39, 0.04), 0 8px 28px rgba(17, 24, 39, 0.06)",
        glow: "0 8px 32px rgba(124, 58, 237, 0.18)",
      },
      borderRadius: {
        xl: "14px",
        "2xl": "20px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out both",
        "fade-up": "fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        shimmer: "shimmer 1.6s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
