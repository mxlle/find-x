import { getShortLanguageName } from "../utils/language-util";

export const TranslationKey = {
  PROMPT: 0,
  BETWEEN: 1,
  AND: 2,
  PLACEHOLDER: 3,
  SUBMIT: 4,
  PLAY_AGAIN: 5,
  DIFFICULTY: 6,
  CENTURY: 7,
  BEGINNER: 8,
  EASY: 9,
  MEDIUM: 10,
  HARD: 11,
  CORRECT: 12,
  ODD: 13,
  EVEN: 14,
  PRIME: 15,
  DIGITS: 16,
  COMMON_DIGITS: 17,
  COMMON_DIGITS_HINT: 18,
  SUM_OF_DIGITS: 19,
  PRIME_FACTORIZATION: 20,
  GREATEST_COMMON_DIVISOR: 21,
  CHEAT_SHEET: 22,
  POSSIBILITIES: 23,
  POSSIBILITIES_OF: 24,
  NUMBER: 25,
  SECRET: 26,
  EVEN_ODD: 27,
  SECRET_PROPERTIES: 28,
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
    en: "odd",
    de: "ungerade",
  },
  [TranslationKey.EVEN]: {
    en: "even",
    de: "gerade",
  },
  [TranslationKey.PRIME]: {
    en: "Prime",
    de: "Primzahl",
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
    en: "Sum of digits",
    de: "Quersumme",
  },
  [TranslationKey.PRIME_FACTORIZATION]: {
    en: "Prime factors",
    de: "Primfaktoren",
  },
  [TranslationKey.GREATEST_COMMON_DIVISOR]: {
    en: "GCD",
    de: "ggT",
  },
  [TranslationKey.CHEAT_SHEET]: {
    en: "Cheat sheet",
    de: "Spickzettel",
  },
  [TranslationKey.POSSIBILITIES]: {
    en: "Possibilities",
    de: "Möglichkeiten",
  },
  [TranslationKey.POSSIBILITIES_OF]: {
    en: "of {0}", // {0} will be replaced with the number of possibilities
    de: "von {0}", // {0} wird durch die Anzahl der möglichen Zahlen ersetzt
  },
  [TranslationKey.NUMBER]: {
    en: "Number",
    de: "Zahl",
  },
  [TranslationKey.SECRET]: {
    en: "Secret",
    de: "Geheimzahl",
  },
  [TranslationKey.EVEN_ODD]: {
    en: "Even/Odd",
    de: "(Un-)Gerade",
  },
  [TranslationKey.SECRET_PROPERTIES]: {
    en: "Properties of the secret",
    de: "Eigenschaften der Geheimzahl",
  },
};

export function getTranslation(key, ...args) {
  let language = getShortLanguageName(navigator.language);

  language = language in Translation[key] ? language : "en";

  // language = "de";

  if (args.length > 0) {
    return Translation[key][language].replace("{0}", args[0]);
  }

  return Translation[key][language];
}
