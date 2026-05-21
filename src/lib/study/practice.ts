export type StudyQuizQuestion = {
  prompt: string;
  topic: string;
  options: { key: string; text: string }[];
  answerKey: string;
  explanation: string;
};

export type StudyFlashcard = {
  question: string;
  answer: string;
};

export type QuizArea = {
  topic: string;
  total: number;
  correct: number;
  accuracy: number;
};

export type QuizAnalysis = {
  correct: number;
  total: number;
  percent: number;
  rows: QuizArea[];
  strongAreas: QuizArea[];
  importantAreas: QuizArea[];
  weakAreas: QuizArea[];
};

export function cleanStudyMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/\s+\n/g, "\n")
    .trim();
}

export function cleanStudyLine(line: string): string {
  return cleanStudyMarkdown(line)
    .replace(/^#+\s*/, "")
    .replace(/^[-*]\s+/, "")
    .trim();
}

export function parseQuizQuestions(text: string): StudyQuizQuestion[] {
  const lines = text.split(/\r?\n/).map(cleanStudyLine).filter(Boolean);
  const questions: StudyQuizQuestion[] = [];
  const answerKeyLines: string[] = [];
  let current: StudyQuizQuestion | null = null;
  let inAnswerKey = false;

  function pushCurrent() {
    if (current?.prompt && current.options.length >= 2) {
      current.topic = current.topic || inferTopic(current.prompt);
      questions.push(current);
    }
    current = null;
  }

  for (const line of lines) {
    if (/^answer\s*key\b/i.test(line)) {
      inAnswerKey = true;
      pushCurrent();
      continue;
    }

    if (inAnswerKey) {
      answerKeyLines.push(line);
      continue;
    }

    const questionMatch = line.match(/^(?:Q(?:uestion)?\s*)?(\d+)[.)]\s+(.+)$/i);
    const optionMatch = line.match(/^([A-D])[\).:-]\s+(.+)$/i);
    const topicMatch = line.match(/^(?:topic|area|concept)\s*[:\-]\s*(.+)$/i);
    const answerMatch = line.match(/^(?:correct\s*)?answer\s*[:\-]\s*([A-D])(?:[\).:\s-]*(.*))?$/i);
    const explanationMatch = line.match(/^explanation\s*[:\-]\s*(.+)$/i);

    if (questionMatch && !/^(answer|explanation|topic|area|concept)\b/i.test(questionMatch[2])) {
      pushCurrent();
      current = {
        prompt: questionMatch[2].trim(),
        topic: "",
        options: [],
        answerKey: "",
        explanation: "",
      };
      continue;
    }

    if (current && topicMatch) {
      current.topic = topicMatch[1].trim();
      continue;
    }

    if (current && optionMatch) {
      current.options.push({
        key: optionMatch[1].toUpperCase(),
        text: optionMatch[2].trim(),
      });
      continue;
    }

    if (current && answerMatch) {
      current.answerKey = answerMatch[1].toUpperCase();
      if (answerMatch[2]) current.explanation = answerMatch[2].trim();
      continue;
    }

    if (current && explanationMatch) {
      current.explanation = explanationMatch[1].trim();
      continue;
    }

    if (current && current.options.length === 0) {
      current.prompt = `${current.prompt} ${line}`.trim();
    } else if (current && current.answerKey && !current.explanation) {
      current.explanation = line;
    }
  }

  pushCurrent();

  for (const line of answerKeyLines) {
    const keyMatch = line.match(/^(\d+)[.)]\s*([A-D])(?:[\).:\s-]*(.*))?$/i);
    if (!keyMatch) continue;
    const index = Number(keyMatch[1]) - 1;
    const question = questions[index];
    if (!question) continue;
    question.answerKey = keyMatch[2].toUpperCase();
    if (keyMatch[3] && !question.explanation) question.explanation = keyMatch[3].trim();
  }

  return questions.filter((question) => question.answerKey);
}

export function parseFlashcards(text: string): StudyFlashcard[] {
  const lines = text.split(/\r?\n/).map(cleanStudyLine);
  const cards: StudyFlashcard[] = [];
  let current: StudyFlashcard | null = null;
  let side: "question" | "answer" | null = null;

  function pushCurrent() {
    if (current?.question && current.answer) cards.push(current);
    current = null;
    side = null;
  }

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    const questionMatch = line.match(/^(?:\d+[.)]\s*)?Q(?:uestion)?\s*\d*\s*[:\-]\s*(.+)$/i);
    const answerMatch = line.match(/^(?:\d+[.)]\s*)?A(?:nswer)?\s*\d*\s*[:\-]\s*(.+)$/i);

    if (questionMatch) {
      pushCurrent();
      current = { question: questionMatch[1].trim(), answer: "" };
      side = "question";
      continue;
    }

    if (answerMatch) {
      if (!current) current = { question: "", answer: "" };
      current.answer = answerMatch[1].trim();
      side = "answer";
      continue;
    }

    if (current && side) {
      current[side] = `${current[side]} ${line}`.trim();
    }
  }

  pushCurrent();
  return cards;
}

export function analyzeQuizAttempt(
  questions: StudyQuizQuestion[],
  selected: Record<number, string>
): QuizAnalysis {
  const total = questions.length;
  const correct = questions.reduce(
    (sum, question, index) => sum + (selected[index] === question.answerKey ? 1 : 0),
    0
  );
  const grouped = new Map<string, { total: number; correct: number }>();

  questions.forEach((question, index) => {
    const topic = question.topic || inferTopic(question.prompt);
    const current = grouped.get(topic) ?? { total: 0, correct: 0 };
    current.total += 1;
    if (selected[index] === question.answerKey) current.correct += 1;
    grouped.set(topic, current);
  });

  const rows = [...grouped.entries()]
    .map(([topic, row]) => ({
      topic,
      total: row.total,
      correct: row.correct,
      accuracy: Math.round((row.correct / Math.max(row.total, 1)) * 100),
    }))
    .sort((a, b) => a.accuracy - b.accuracy || b.total - a.total);
  const importantAreas = [...rows].sort(
    (a, b) => b.total - a.total || a.accuracy - b.accuracy || a.topic.localeCompare(b.topic)
  );

  return {
    correct,
    total,
    percent: total ? Math.round((correct / total) * 100) : 0,
    rows,
    strongAreas: rows.filter((row) => row.accuracy >= 80),
    importantAreas,
    weakAreas: rows.filter((row) => row.accuracy < 50),
  };
}

export function inferTopic(prompt: string): string {
  const cleaned = prompt
    .replace(/^[^A-Za-z0-9]+/, "")
    .split(/[?:.]/)[0]
    .replace(/\b(which|what|when|where|why|how|does|do|is|are|the|a|an|best|most)\b/gi, "")
    .trim();
  const words = cleaned.split(/\s+/).filter(Boolean).slice(0, 4);
  return words.length ? titleCase(words.join(" ")) : "Core concept";
}

function titleCase(value: string) {
  return value
    .toLowerCase()
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}
