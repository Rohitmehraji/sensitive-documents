const sentenceSplitRegex = /(?<=[.!?])\s+/;

const scoreSentence = (sentence: string, topWords: Set<string>) => {
  const words = sentence.toLowerCase().match(/[a-z0-9']+/g) ?? [];
  if (!words.length) return 0;
  const hits = words.filter((word) => topWords.has(word)).length;
  return hits / words.length;
};

export const summarizeText = (text: string) => {
  const sentences = text.replace(/\s+/g, " ").split(sentenceSplitRegex).filter(Boolean);
  if (sentences.length === 0) {
    return { summary: "No readable text detected.", keySentences: [] as string[] };
  }

  const words = text.toLowerCase().match(/[a-z0-9']+/g) ?? [];
  const stopWords = new Set(["the", "and", "for", "with", "this", "that", "from", "are", "was", "were", "into", "have", "has", "had", "you", "your", "they", "them", "their"]);

  const frequency = new Map<string, number>();
  words.forEach((word) => {
    if (word.length < 3 || stopWords.has(word)) return;
    frequency.set(word, (frequency.get(word) ?? 0) + 1);
  });

  const topWords = new Set(
    [...frequency.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word]) => word)
  );

  const ranked = sentences
    .map((sentence) => ({ sentence, score: scoreSentence(sentence, topWords) }))
    .sort((a, b) => b.score - a.score);

  const keySentences = ranked.slice(0, 3).map((entry) => entry.sentence.trim());
  const summary = keySentences.join(" ").slice(0, 420) || sentences.slice(0, 2).join(" ");

  return { summary, keySentences };
};
