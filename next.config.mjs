/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "rewrito.vercel.app" }],
        destination: "https://rewrito.ai/:path*",
        permanent: true,
      },
      {
        source: "/rewrito-study",
        destination: "/study-assistant",
        permanent: true,
      },
      {
        source: "/rewrito-study/quiz",
        destination: "/study-assistant/quiz",
        permanent: true,
      },
      {
        source: "/rewrito-study/flashcards",
        destination: "/study-assistant/flashcards",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/auth/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/dashboard",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  outputFileTracingIncludes: {
    "/api/extract-pdf": ["./node_modules/pdf-parse/dist/pdf-parse/esm/pdf.worker.mjs"],
  },
  experimental: {
    optimizePackageImports: ["@supabase/supabase-js", "@supabase/ssr"],
  },
};

export default nextConfig;
