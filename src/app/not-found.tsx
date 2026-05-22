import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="bg-bg">
        <div className="mx-auto flex max-w-2xl flex-col items-center px-5 py-24 text-center sm:px-8">
          <span className="chip mb-5">404</span>
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            We couldn't find that page.
          </h1>
          <p className="mt-3 text-sm text-ink-muted">
            The link may be old, or the page may have moved.
          </p>
          <Link href="/" prefetch={false} className="btn-primary mt-7">
            Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
