"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Logo } from "@/components/ui/Logo";

type Props = {
  open: boolean;
  onClose: (useCase?: string) => void;
};

const USE_CASES = [
  "Humanize AI writing",
  "Rewrite work emails",
  "Create LinkedIn posts",
  "Study and exam prep",
  "Organize notes",
  "Something else",
];

export function UseCaseModal({ open, onClose }: Props) {
  const [selected, setSelected] = useState<string>("");

  function handleContinue() {
    onClose(selected || "Not specified");
  }

  return (
    <Modal open={open} onClose={() => onClose()} labelledBy="use-case-headline">
      <div className="text-center">
        <div className="mx-auto mb-4 flex justify-center">
          <Logo size={34} />
        </div>
        <h2 id="use-case-headline" className="text-xl font-semibold text-ink">
          How are you going to use rewrito?
        </h2>
        <p className="mt-1.5 text-sm text-ink-muted">
          Pick the closest option so your workspace feels more relevant.
        </p>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {USE_CASES.map((item) => {
          const active = selected === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => setSelected(item)}
              className={`rounded-xl border p-3 text-left text-sm font-medium transition-all ${
                active
                  ? "border-brand bg-brand-softPurple text-brand shadow-soft"
                  : "border-line bg-white text-ink hover:border-ink-subtle hover:bg-bg-soft"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={handleContinue} className="btn-primary w-full">
          Continue
        </button>
        <button
          type="button"
          onClick={() => onClose("Skipped")}
          className="btn-secondary w-full"
        >
          Skip
        </button>
      </div>
    </Modal>
  );
}
