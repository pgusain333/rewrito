"use client";

import dynamic from "next/dynamic";

const LazyToolWorkspace = dynamic(
  () => import("@/components/tools/ToolWorkspace").then((mod) => mod.ToolWorkspace),
  {
    loading: () => (
      <div className="card overflow-hidden">
        <div className="border-b border-line bg-bg-soft p-5 sm:p-6">
          <div className="h-5 w-40 rounded-full bg-line/70" />
          <div className="mt-2 h-3 w-64 max-w-full rounded-full bg-line/50" />
        </div>
        <div className="grid gap-0 md:grid-cols-2">
          <div className="border-b border-line p-5 md:border-b-0 md:border-r md:p-6">
            <div className="h-48 rounded-xl bg-bg-section" />
            <div className="mt-4 h-10 rounded-xl bg-line/50" />
          </div>
          <div className="bg-bg-soft p-5 md:p-6">
            <div className="h-56 rounded-xl border border-line bg-white" />
          </div>
        </div>
      </div>
    ),
    ssr: false,
  }
);

export function HomepageToolLoader() {
  return <LazyToolWorkspace />;
}
