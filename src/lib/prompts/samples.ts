import type { ToolType } from "@/lib/prompts";

export const SAMPLES: Record<ToolType, string> = {
  humanizer: `In today's rapidly evolving digital landscape, it is important to note that leveraging artificial intelligence has become essential for businesses seeking to navigate the complexities of modern operations. Furthermore, organizations must delve into innovative solutions to unlock their full potential and harness the power of cutting-edge technologies. In conclusion, embracing AI is no longer optional but rather a critical imperative for sustained success.`,

  linkedin: `so I just shipped a side project and honestly I almost didn't. spent 3 weekends on it, kept finding reasons it wasn't ready. finally just put it out yesterday. 12 signups overnight. not a lot but it taught me something - the version I was afraid to ship would have been fine. perfectionism is just a polite word for fear. anyway, build the thing and ship it.`,

  email: `hey, just wanted to check in on the proposal i sent over last tuesday. wasn't sure if you had a chance to look at it yet. no rush at all but if there's anything you need me to clarify or change happy to do that. also let me know if you want to hop on a quick call this week. thanks!`,

  study: `In accounting, the matching principle means expenses should be recorded in the same period as the revenue they helped generate. For example, if a company pays sales commissions in January for sales made in December, the commission expense should be recognized in December, not January. This helps financial statements show a more accurate picture of performance.`,
};
