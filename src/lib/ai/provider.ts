/**
 * Provider-agnostic chat completion.
 * Switch providers with the AI_PROVIDER env var:
 *   AI_PROVIDER=openai    -> uses OPENAI_API_KEY + OPENAI_MODEL
 *   AI_PROVIDER=anthropic -> uses ANTHROPIC_API_KEY + ANTHROPIC_MODEL
 */
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type GenerateOptions = {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
};

const provider = (process.env.AI_PROVIDER || "openai").toLowerCase();

// Lazily instantiate clients so missing keys for the unused provider don't crash boot.
let _openai: OpenAI | null = null;
function openai(): OpenAI {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

let _anthropic: Anthropic | null = null;
function anthropic(): Anthropic {
  if (!_anthropic) _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _anthropic;
}

export async function generateCompletion(opts: GenerateOptions): Promise<string> {
  const temperature = opts.temperature ?? 0.7;
  const maxTokens = opts.maxTokens ?? 1500;

  if (provider === "anthropic") {
    // Anthropic's Messages API takes `system` as a top-level field, not a role.
    const systemMsg = opts.messages.find((m) => m.role === "system")?.content ?? "";
    const conversation = opts.messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    const model = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";

    const response = await anthropic().messages.create({
      model,
      system: systemMsg,
      messages: conversation,
      temperature,
      max_tokens: maxTokens,
    });

    // Concatenate any text blocks (Anthropic returns an array of content blocks).
    const text = response.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("")
      .trim();

    return text;
  }

  if (provider === "openai") {
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const completion = await openai().chat.completions.create({
      model,
      messages: opts.messages,
      temperature,
      max_tokens: maxTokens,
    });
    return completion.choices[0]?.message?.content?.trim() ?? "";
  }

  throw new Error(`Unsupported AI provider: ${provider}`);
}
