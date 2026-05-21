"use client";

import type { EducationLevel, Refinement, StudyMode, ToolType, Tone } from "@/lib/prompts";
import { ArrowRightIcon } from "@/components/ui/icons";

type Props = {
  session: {
    tool: ToolType;
    input: string;
    output: string;
    tone: Tone | string;
    refinement: Refinement | string;
    studyMode?: StudyMode | null;
    educationLevel?: EducationLevel | null;
  };
};

const REOPEN_SESSION_KEY = "rewrito.reopenSession";

export function HistoryReopenButton({ session }: Props) {
  function reopen() {
    window.localStorage.setItem(REOPEN_SESSION_KEY, JSON.stringify(session));
    window.location.href = "/try";
  }

  return (
    <button
      type="button"
      onClick={reopen}
      className="btn-ghost !px-3 !py-1.5 text-xs"
      title="Reopen in the editor"
    >
      Reopen
      <ArrowRightIcon size={13} />
    </button>
  );
}
