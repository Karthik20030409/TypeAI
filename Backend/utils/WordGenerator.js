const fetch = require("node-fetch");

let sentencesCache = [];
let loaded = false;
const FALLBACK_SENTENCES = [
  "typing is a skill that improves with patience consistency and daily practice",
  "accuracy is more important than speed when learning to type efficiently",
  "focus on rhythm and control to build long term typing confidence"
];

const BOOK_URL =
  "https://www.gutenberg.org/files/1342/1342-0.txt"; // Pride & Prejudice

async function loadBookOnce() {
  if (loaded) return;

  try {
    const response = await fetch(BOOK_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch book: ${response.status}`);
    }

    const rawText = await response.text();
    const mainText = extractGutenbergText(rawText);

    sentencesCache = mainText
      .split(/[.!?]/)
      .map(s => s.trim())
      .filter(s => s.length >= 200 && s.length <= 400);

    if (sentencesCache.length === 0) {
      throw new Error("No valid sentences extracted");
    }

    loaded = true;
    console.log(`📚 Loaded ${sentencesCache.length} sentences`);
  } catch (error) {
    console.error("❌ Text generation failed:", error.message);

    // Fallback text so API never crashes
    sentencesCache = [
      "practice typing with focus and accuracy to improve your speed and consistency over time"
    ];

    loaded = true;
  }
}

function extractGutenbergText(rawText) {
  let mainText = rawText;

  const startMarker = rawText.indexOf("*** START OF");
  const endMarker = rawText.indexOf("*** END OF");

  if (startMarker !== -1 && endMarker !== -1 && endMarker > startMarker) {
    mainText = rawText.slice(startMarker + 13, endMarker); // 13 = length of "*** START OF"
  }

  // Replace newlines with spaces
  mainText = mainText.replace(/\r?\n|\r/g, " ");

  return mainText;
}

async function getRandomSentence() {
  await loadBookOnce();

  if (!sentencesCache || sentencesCache.length === 0) {
    console.warn("⚠️ Sentence cache empty, using fallback text");

    const fallbackIndex = Math.floor(
      Math.random() * FALLBACK_SENTENCES.length
    );

    return FALLBACK_SENTENCES[fallbackIndex];
  }

  const index = Math.floor(Math.random() * sentencesCache.length);
  return sentencesCache[index];
}


function applyDifficulty(text, level) {
  let output = text;

  if (level === "easy") {
    output = output
      .toLowerCase()
      .replace(/[.,!?;:"'()-]/g, "");
  }

  if (level === "medium") {
    output = output.toLowerCase();
  }

  // hard = unchanged
  return output.trim();
}

module.exports = { getRandomSentence, applyDifficulty };
