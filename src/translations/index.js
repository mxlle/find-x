import { getShortLanguageName } from "../utils/language-util";

export const TranslationKey = {
  PROMPT: "prompt",
  BETWEEN: "between",
  AND: "and",
  PLACEHOLDER: "placeholder",
  SUBMIT: "submit",
  PLAY_AGAIN: "playAgain",
  CORRECT: "correct",
  LENGTH: "length",
  ODD: "odd",
  EVEN: "even",
  PRIME: "prime",
  DIGITS: "digits",
  COMMON_DIGITS: "commonDigits",
  COMMON_DIGITS_HINT: "commonDigitsHint",
  SUM_OF_DIGITS: "sumOfDigits",
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
  [TranslationKey.COMMON_DIGITS_HINT]: {
    en: "Activating common digit hint",
    de: "Aktiviere Hinweis für gemeinsame Ziffern",
  },
  [TranslationKey.SUM_OF_DIGITS]: {
    en: "same sum of digits",
    de: "gleiche Quersumme",
  },
  [TranslationKey.GREATEST_COMMON_FACTOR]: {
    en: "greatest common factor",
    de: "größter gemeinsamer Teiler",
  },
};

export function getTranslation(key, language) {
  if (!language) {
    language = getShortLanguageName(navigator.language);
  }

  language = language in Translation[key] ? language : "en";

  return Translation[key][language];
}
