"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";

type Props = { open: boolean; onClose: () => void };

export function UpgradeModal({ open, onClose }: Props) {
  const [joined, setJoined] = useState(false);

  return (
    <Modal open={open} onClose={onClose} labelledBy="upgrade-headline">
      <div className="mb-5 text-center">
        <div className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-softBlue text-brand-accent">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12 L19 12 M13 6 L19 12 L13 18" />
          </svg>
        </div>
        <h2 id="upgrade-headline" className="text-xl font-semibold text-ink">
          You've reached your rewrite limit
        </h2>
        <p className="mt-1.5 text-sm text-ink-muted">
          Premium plans are coming soon. Join the waitlist for early access and launch pricing.
        </p>
      </div>

      {joined ? (
        <div className="rounded-xl bg-bg-section p-4 text-center text-sm text-ink">
          <p className="font-medium">You're on the list.</p>
          <p className="mt-1 text-ink-muted">We'll email you the moment Premium opens up.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <button onClick={() => setJoined(true)} className="btn-primary w-full">
            Join the premium waitlist
          </button>
          <a href="mailto:hello@rewrito.ai" className="btn-secondary w-full">
            Contact us
          </a>
        </div>
      )}

      <button
        onClick={onClose}
        className="mt-4 block w-full text-center text-sm text-ink-muted hover:text-ink"
      >
        Close
      </button>
    </Modal>
  );
}
