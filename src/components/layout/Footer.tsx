import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="border-t border-line bg-bg">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <Logo size={24} />
            <p className="max-w-xs text-sm text-ink-muted">
              AI-powered professional communication. Rough text in, refined out.
            </p>
          </div>
          <FooterCol title="Tools">
            <FooterLink href="/ai-humanizer">AI Humanizer</FooterLink>
            <FooterLink href="/linkedin-rewriter">LinkedIn Rewriter</FooterLink>
            <FooterLink href="/email-rewriter">Email Rewriter</FooterLink>
            <FooterLink href="/study-assistant">Rewrito Study</FooterLink>
          </FooterCol>
          <FooterCol title="Product">
            <FooterLink href="/pricing">Pricing</FooterLink>
            <FooterLink href="/faq">FAQ</FooterLink>
            <FooterLink href="/dashboard">Dashboard</FooterLink>
          </FooterCol>
          <FooterCol title="Company">
            <FooterLink href="mailto:hello@rewrito.ai">Contact</FooterLink>
            <FooterLink href="/privacy">Privacy</FooterLink>
            <FooterLink href="/terms">Terms</FooterLink>
          </FooterCol>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-xs text-ink-subtle sm:flex-row sm:items-center">
          <p>(c) {new Date().getFullYear()} rewrito. All rights reserved.</p>
          <p>Built for clear, calm communication.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink">{title}</h4>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-ink-muted hover:text-ink">
        {children}
      </Link>
    </li>
  );
}
