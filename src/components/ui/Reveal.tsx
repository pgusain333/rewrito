"use client";

import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
  /** Stagger delay in ms. Useful when wrapping a row of cards. */
  delay?: number;
  /** Tailwind class for additional styling on the wrapper. */
  className?: string;
  /** Element to render (default: div). */
  as?: "div" | "section" | "article" | "li";
};

/**
 * Fades and lifts a block into view when it enters the viewport.
 * Pure CSS animation; no library, no jank.
 * Respects prefers-reduced-motion via globals.css.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: Props) {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [node]);

  // A callback ref works regardless of which intrinsic element Tag resolves to.
  const setRef = (el: HTMLElement | null) => setNode(el);

  return (
    <Tag
      ref={setRef as never}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${shown ? "reveal-in" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}
