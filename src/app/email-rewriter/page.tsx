import type { Metadata } from "next";
import { ToolPage } from "@/components/tools/ToolPage";
import { pageMetadata, TOOL_KEYWORDS } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Professional Email Rewriter - Polite, Clear AI Emails",
  description:
    "Rewrite emails professionally with rewrito. Turn rough drafts, follow-ups, client replies, and workplace messages into concise, polite, confident emails.",
  path: "/email-rewriter",
  keywords: TOOL_KEYWORDS.email,
});

export default function Page() {
  return (
    <ToolPage
      tool="email"
      intro={{
        h1: "Professional Email Rewriter - clear, polite, confident in seconds.",
        lead: "Paste a rough draft and get a concise, professional email that keeps your intent and every important detail.",
      }}
      whatItDoes={[
        "Removes filler, hedging, and unnecessary apologies.",
        "Keeps your request, dates, names, and numbers exact.",
        "Adjusts tone - friendly, professional, or executive.",
        "Tightens long emails without losing key details.",
        "Polite without being apologetic; confident without being curt.",
        "Maintains standard email structure when appropriate.",
      ]}
      audiences={[
        {
          title: "Busy professionals",
          body: "Turn rough notes into clear, polite emails without overthinking every sentence.",
          image:
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "Managers",
          body: "Balance directness and warmth for follow-ups, feedback, requests, and decisions.",
          image:
            "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "Students and job seekers",
          body: "Improve outreach, applications, professor emails, and professional replies.",
          image:
            "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "Client-facing teams",
          body: "Make replies concise, useful, and respectful without losing important context.",
          image:
            "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "Founders",
          body: "Polish investor updates, hiring messages, customer notes, and team announcements.",
          image:
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
        },
      ]}
      faq={[
        {
          q: "Will it invent details I didn't write?",
          a: "No. rewrito is instructed not to fabricate facts, names, dates, or claims. If something isn't in your draft, it won't appear in the rewrite.",
        },
        {
          q: "Does it add a subject line automatically?",
          a: "Only if your input includes one or asks for one. Otherwise it returns just the email body so you can use your existing subject.",
        },
        {
          q: "Can I use it for sensitive emails?",
          a: "rewrito is great for tone-balancing tricky emails (declining requests, following up, giving feedback). For confidential matters, anonymous sessions are not stored.",
        },
        {
          q: "How long can the email be?",
          a: "Signed-in users can paste up to 1,200 words per input. Long threads work best when rewritten in sections.",
        },
      ]}
    />
  );
}
