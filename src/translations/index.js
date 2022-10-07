import { getShortLanguageName } from "../utils/language-util";
import { globals } from "../globals";

export const TranslationKey = {
  PROMPT: "prompt",
  BETWEEN: "between",
  AND: "and",
  SUBMIT: "submit",
  PLAY_AGAIN: "playAgain",
  CORRECT: "correct",
  LENGTH: "length",
  ODD: "odd",
  EVEN: "even",
  PRIME: "prime",
  DIGITS: "digits",
  COMMON_DIGITS: "commonDigits",
  SUM_OF_DIGITS: "sumOfDigits",
  UNIQUE_PRIME_FACTORS: "uniquePrimeFactors",
  COMMON_PRIME_FACTORS: "commonPrimeFactors",
  GREATEST_COMMON_FACTOR: "greatestCommonFactor",
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
  [TranslationKey.SUBMIT]: {
    en: "Submit",
    de: "Absenden",
  },
  [TranslationKey.PLAY_AGAIN]: {
    en: "Play again",
    de: "Nochmal spielen",
  },
  [TranslationKey.CORRECT]: {
    en: "Correct!",
    de: "Richtig!",
  },
  [TranslationKey.LENGTH]: {
    en: "same length",
    de: "gleiche Länge",
  },
  [TranslationKey.ODD]: {
    en: "both odd",
    de: "beide ungerade",
  },
  [TranslationKey.EVEN]: {
    en: "both even",
    de: "beide gerade",
  },
  [TranslationKey.PRIME]: {
    en: "both prime",
    de: "beide Primzahlen",
  },
  [TranslationKey.DIGITS]: {
    en: "same digits",
    de: "gleiche Ziffern",
  },
  [TranslationKey.COMMON_DIGITS]: {
    en: "common digits",
    de: "gemeinsame Ziffern",
  },
  [TranslationKey.SUM_OF_DIGITS]: {
    en: "same sum of digits",
    de: "gleiche Quersumme",
  },
  [TranslationKey.UNIQUE_PRIME_FACTORS]: {
    en: "same prime factors", // todo add uniqueness
    de: "gleiche Primfaktoren",
  },
  [TranslationKey.COMMON_PRIME_FACTORS]: {
    en: "common prime factors",
    de: "gemeinsame Primfaktoren",
  },
  [TranslationKey.GREATEST_COMMON_FACTOR]: {
    en: "greatest common factor",
    de: "größter gemeinsamer Teiler",
  },
};

export function getTranslation(key, language) {
  if (!language) {
    const shortLang = getShortLanguageName(navigator.language);
    language =
      globals.language ?? (shortLang in Translation[key] ? shortLang : "en"); // todo
  }

  return Translation[key][language];
}
