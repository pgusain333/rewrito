"use client";

import { useEffect, useRef, useState } from "react";

export type ListboxOption<T extends string = string> = {
  value: T;
  label: string;
  hint?: string;
};

type Props<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: ListboxOption<T>[];
  label?: string;
  ariaLabel?: string;
};

/**
 * Custom listbox - keyboard accessible, animated open/close.
 * Closes on outside click or Escape; arrow keys cycle options; Enter selects.
 */
export function Listbox<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(() =>
    Math.max(0, options.findIndex((o) => o.value === value))
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const current = options.find((o) => o.value === value) ?? options[0];

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function handleTriggerKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveIdx(Math.max(0, options.findIndex((o) => o.value === value)));
      setOpen(true);
    }
  }

  function handleListKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i - 1 + options.length) % options.length);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange(options[activeIdx].value);
      setOpen(false);
      triggerRef.current?.focus();
    }
  }

  return (
    <div ref={rootRef} className={`relative ${open ? "z-50" : ""}`}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => {
          setActiveIdx(Math.max(0, options.findIndex((o) => o.value === value)));
          setOpen((v) => !v);
        }}
        onKeyDown={handleTriggerKey}
        className="listbox-trigger"
      >
        <span className="flex min-w-0 flex-col items-start text-left">
          <span className="text-sm">{current.label}</span>
          {current.hint && (
            <span className="text-[11px] text-ink-subtle">{current.hint}</span>
          )}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="listbox-chevron text-ink-muted"
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          tabIndex={-1}
          onKeyDown={handleListKey}
          className="listbox-panel max-h-72 overflow-y-auto py-1.5"
        >
          {options.map((opt, idx) => {
            const selected = opt.value === value;
            const active = idx === activeIdx;
            return (
              <li key={opt.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  data-selected={selected}
                  data-active={active}
                  onMouseEnter={() => setActiveIdx(idx)}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                    triggerRef.current?.focus();
                  }}
                  className="listbox-option"
                >
                  <span className="flex flex-1 flex-col">
                    <span>{opt.label}</span>
                    {opt.hint && (
                      <span className="text-[11px] text-ink-subtle">{opt.hint}</span>
                    )}
                  </span>
                  {selected && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-brand"
                      aria-hidden
                    >
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
