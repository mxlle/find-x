import { globals, resetGlobals } from "./globals";
import { getRandomIntFromInterval } from "./utils/random-utils";
import {
  areArraysEqualIgnoreOrder,
  getArrayIntersection,
  removeDuplicates,
} from "./utils/array-utils";
import { getTranslation, TranslationKey } from "./translations";

export const START_DIGIT_HINT = 15;

export function newGame() {
  resetGlobals();
  initGameData();
}

export function initGameData() {
  globals.x = getRandomIntFromInterval(globals.minNum, globals.maxNum);
  globals.xProperties = getMathProperties(globals.x);
}

export function evaluateGuess(guess) {
  globals.tries++;

  console.log(mathPropertiesToString(getMathProperties(guess)));

  if (guess === globals.x) {
    return true;
  } else {
    const matchingProperties = getMatchingMathProperties(
      getMathProperties(guess),
      globals.xProperties
    );

    console.log(matchingProperties);

    return mathPropertiesToStringArray(matchingProperties);
  }
}

function getMathProperties(int) {
  const factors = getFactors(int);

  const primeFactorization = getPrimeFactorization(int);
  const uniquePrimeFactors = [...new Set(primeFactorization)];

  const isPrime = primeFactorization.length === 1;

  const isEven = int % 2 === 0;

  const digits = int
    .toString()
    .split("")
    .map((digit) => parseInt(digit));

  const sumOfDigits = digits.reduce((sum, digit) => sum + digit, 0);

  const length = digits.length;

  return {
    factors,
    primeFactorization,
    uniquePrimeFactors,
    isPrime,
    isEven,
    digits,
    sumOfDigits,
    length,
  };
}

function getFactors(int) {
  const factors = [];

  for (let i = 2; i <= int; i++) {
    if (int % i === 0) {
      factors.push(i);
    }
  }

  return factors;
}

function getPrimeFactorization(int) {
  const factors = [];
  let remainder = int;

  for (let i = 2; i <= int; i++) {
    if (remainder % i === 0) {
      factors.push(i);
      remainder /= i;
      i--;
    }
  }

  return factors;
}

function getMatchingMathProperties(properties1, properties2) {
  const matchingProperties = {};

  for (const property in properties1) {
    if (properties1[property] === properties2[property]) {
      matchingProperties[property] = properties1[property];
    } else if (Array.isArray(properties1[property])) {
      if (
        areArraysEqualIgnoreOrder(properties1[property], properties2[property])
      ) {
        matchingProperties[property] = properties1[property];
      }
    }
  }

  if (globals.tries > START_DIGIT_HINT) {
    const commonDigits = getArrayIntersection(
      removeDuplicates(properties1.digits),
      removeDuplicates(properties2.digits)
    );

    if (commonDigits.length > 0) {
      matchingProperties.commonDigits = commonDigits;
    }
  }

  const commonFactors = getArrayIntersection(
    properties1.factors,
    properties2.factors
  );

  if (commonFactors.length > 0) {
    matchingProperties.greatestCommonFactor = Math.max(...commonFactors);
  }

  return matchingProperties;
}

function mathPropertiesToString(properties) {
  const {
    primeFactorization,
    uniquePrimeFactors,
    isPrime,
    isEven,
    digits,
    sumOfDigits,
    length,
  } = properties;

  return `
    Prime Factorization: ${primeFactorization.join(", ")}
    Unique Prime Factors: ${uniquePrimeFactors.join(", ")}
    Is prime: ${isPrime}
    Is even: ${isEven}
    Digits: ${digits.join(", ")}
    Sum of digits: ${sumOfDigits}
    Length: ${length}
  `;
}

function mathPropertiesToStringArray(properties) {
  const {
    greatestCommonFactor,
    isPrime,
    isEven,
    digits,
    commonDigits,
    sumOfDigits,
    length,
  } = properties;

  const stringArray = [];

  if (length !== undefined) {
    stringArray.push(getTranslation(TranslationKey.LENGTH));
  }

  if (isEven !== undefined) {
    stringArray.push(
      getTranslation(isEven ? TranslationKey.EVEN : TranslationKey.ODD)
    );
  }

  if (isPrime) {
    stringArray.push(getTranslation(TranslationKey.PRIME));
  }

  if (digits !== undefined) {
    stringArray.push(getTranslation(TranslationKey.DIGITS));
  }

  if (commonDigits !== undefined) {
    stringArray.push(
      `${getTranslation(TranslationKey.COMMON_DIGITS)}: ${commonDigits.join(
        ", "
      )}`
    );
  }

  if (greatestCommonFactor !== undefined) {
    stringArray.push(
      `${getTranslation(
        TranslationKey.GREATEST_COMMON_FACTOR
      )}: ${greatestCommonFactor}`
    );
  }

  if (sumOfDigits !== undefined) {
    stringArray.push(
      `${getTranslation(TranslationKey.SUM_OF_DIGITS)}: ${sumOfDigits}`
    );
  }

  return stringArray;
}
