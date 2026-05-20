"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

type Option<T extends string> = {
  value: T;
  label: string;
  hint?: string;
};

type Props<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
  ariaLabel?: string;
};

// useLayoutEffect crashes on SSR; fall back to useEffect there.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Segmented control with a sliding thumb behind the active option.
 * Measures the active button on resize and on value change.
 */
export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: Props<T>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [thumb, setThumb] = useState<{ left: number; width: number }>({
    left: 4,
    width: 0,
  });

  useIsoLayoutEffect(() => {
    function measure() {
      const idx = options.findIndex((o) => o.value === value);
      const btn = btnRefs.current[idx];
      const root = rootRef.current;
      if (!btn || !root) return;
      const rootRect = root.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      setThumb({
        left: btnRect.left - rootRect.left,
        width: btnRect.width,
      });
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [value, options]);

  return (
    <div ref={rootRef} role="radiogroup" aria-label={ariaLabel} className="segmented">
      <span
        aria-hidden
        className="segmented-thumb"
        style={{ left: thumb.left, width: thumb.width }}
      />
      {options.map((opt, idx) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            ref={(el) => {
              btnRefs.current[idx] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            data-active={active}
            title={opt.hint}
            onClick={() => onChange(opt.value)}
            className="segmented-btn"
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
