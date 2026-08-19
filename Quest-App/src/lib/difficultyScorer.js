// MVP difficulty scoring - no AI call needed. Returns 1-5.

const URGENCY_KEYWORDS = ["urgent", "exam", "deadline", "asap", "due", "test"];
const COMPLEXITY_KEYWORDS = ["project", "research", "essay", "report", "presentation"];

export function scoreManualTask({ title = "", description = "", dueDate = null }) {
  let score = 1;
  const text = `${title} ${description}`.toLowerCase();

  // Length signal
  if (text.length > 200) score += 1;
  if (text.length > 500) score += 1;

  // Keyword signals
  if (URGENCY_KEYWORDS.some((k) => text.includes(k))) score += 1;
  if (COMPLEXITY_KEYWORDS.some((k) => text.includes(k))) score += 1;

  // Due date proximity
  if (dueDate) {
    const daysUntil = Math.floor((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysUntil <= 1) score += 1;
  }

  return Math.min(score, 5);
}

export function estimatedMinutesFromDifficulty(difficultyScore) {
  const map = { 1: 10, 2: 20, 3: 35, 4: 60, 5: 90 };
  return map[difficultyScore] ?? 20;
}
