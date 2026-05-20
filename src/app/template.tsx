"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * App Router `template.tsx` re-mounts on every navigation, unlike `layout.tsx`.
 * We use that to play a soft fade + slight rise on each page change.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Re-trigger the animation by toggling the class.
    el.classList.remove("page-enter");
    // Force reflow so the removal registers before re-adding.
    void el.offsetWidth;
    el.classList.add("page-enter");
  }, [pathname]);

  return (
    <div ref={ref} className="page-enter">
      {children}
    </div>
  );
}
