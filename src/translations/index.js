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
  GREATEST_COMMON_DIVISOR: "greatestCommonFactor",
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
    en: "Same length",
    de: "Gleiche Länge",
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
    en: "Activating common digit hint",
    de: "Aktiviere Hinweis für gemeinsame Ziffern",
  },
  [TranslationKey.SUM_OF_DIGITS]: {
    en: "Same sum of digits",
    de: "Gleiche Quersumme",
  },
  [TranslationKey.GREATEST_COMMON_DIVISOR]: {
    en: "GCD",
    de: "ggT",
  },
};

export function getTranslation(key, language) {
  if (!language) {
    language = getShortLanguageName(navigator.language);
  }

  language = language in Translation[key] ? language : "en";

  return Translation[key][language];
}
