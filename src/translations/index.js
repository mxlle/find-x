import { getShortLanguageName } from "../utils/language-util";

export const TranslationKey = {
  PROMPT: "prompt",
  BETWEEN: "between",
  AND: "and",
  PLACEHOLDER: "placeholder",
  SUBMIT: "submit",
  PLAY_AGAIN: "playAgain",
  DIFFICULTY: "difficulty",
  CENTURY: "13thCentury",
  BEGINNER: "beginner",
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
  CORRECT: "correct",
  ODD: "odd",
  EVEN: "even",
  PRIME: "prime",
  DIGITS: "digits",
  COMMON_DIGITS: "commonDigits",
  COMMON_DIGITS_HINT: "commonDigitsHint",
  SUM_OF_DIGITS: "sumOfDigits",
  PRIME_FACTORIZATION_COUNT: "primeFactorizationCount",
  GREATEST_COMMON_DIVISOR: "greatestCommonFactor",
  CHEAT_SHEET: "cheatSheet",
};

const Translation = {
  [TranslationKey.PROMPT]: {
    en: "Find X",
    de: "Bestimme X",
  },
  [TranslationKey.BETWEEN]: {
    en: "between",
    de: "zwischen",
  },
  [TranslationKey.AND]: {
    en: "and",
    de: "und",
  },
  [TranslationKey.PLACEHOLDER]: {
    en: "enter guess",
    de: "Nummer eingeben",
  },
  [TranslationKey.SUBMIT]: {
    en: "Submit",
    de: "Absenden",
  },
  [TranslationKey.PLAY_AGAIN]: {
    en: "Play again",
    de: "Nochmal spielen",
  },
  [TranslationKey.DIFFICULTY]: {
    en: "Difficulty",
    de: "Schwierigkeit",
  },
  [TranslationKey.CENTURY]: {
    en: "13th century",
    de: "13. Jahrhundert",
  },
  [TranslationKey.BEGINNER]: {
    en: "Beginner",
    de: "Anfänger",
  },
  [TranslationKey.EASY]: {
    en: "Easy",
    de: "Leicht",
  },
  [TranslationKey.MEDIUM]: {
    en: "Medium",
    de: "Mittel",
  },
  [TranslationKey.HARD]: {
    en: "Hard",
    de: "Schwer",
  },
  [TranslationKey.CORRECT]: {
    en: "Correct!",
    de: "Richtig!",
  },
  [TranslationKey.ODD]: {
    en: "Both odd",
    de: "Beide ungerade",
  },
  [TranslationKey.EVEN]: {
    en: "Both even",
    de: "Beide gerade",
  },
  [TranslationKey.PRIME]: {
    en: "Both prime numbers",
    de: "Beides Primzahlen",
  },
  [TranslationKey.DIGITS]: {
    en: "Same digits",
    de: "Gleiche Ziffern",
  },
  [TranslationKey.COMMON_DIGITS]: {
    en: "Common digits",
    de: "Gemeinsame Ziffern",
  },
  [TranslationKey.COMMON_DIGITS_HINT]: {
    en: "Still guessing? Activated additional hint for common digits.",
    de: "Immer noch nicht? Hinweis für gemeinsame Ziffern aktiviert.",
  },
  [TranslationKey.SUM_OF_DIGITS]: {
    en: "Same sum of digits",
    de: "Gleiche Quersumme",
  },
  [TranslationKey.PRIME_FACTORIZATION_COUNT]: {
    en: "Same number of prime factors",
    de: "Gleiche Anzahl an Primfaktoren",
  },
  [TranslationKey.GREATEST_COMMON_DIVISOR]: {
    en: "GCD",
    de: "ggT",
  },
  [TranslationKey.CHEAT_SHEET]: {
    en: "Cheat sheet",
    de: "Spickzettel",
  },
};

export function getTranslation(key, language) {
  if (!language) {
    language = getShortLanguageName(navigator.language);
  }

  language = language in Translation[key] ? language : "en";

  return Translation[key][language];
}
