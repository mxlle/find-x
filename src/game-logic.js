import { globals, resetGlobals } from "./globals";
import { getRandomIntFromInterval } from "./utils/random-utils";
import {
  areArraysEqualIgnoreOrder,
  getArrayIntersection,
  removeDuplicates,
} from "./utils/array-utils";

export const START_DIGIT_HINT = 15;
export const LOSE_STAR_TRIES = [7, 13, 30, 42];
export const WIN_STAR_TRIES = [13, 42];

export function newGame() {
  resetGlobals();
  initGameData();
}

export function initGameData() {
  globals.x = getRandomIntFromInterval(globals.minNum, globals.maxNum);
  globals.xProperties = getMathProperties(globals.x);
}

export function evaluateGuess(guess, guessProperties) {
  globals.tries++;

  console.log(mathPropertiesToString(guessProperties));

  if (guess === globals.x) {
    return true;
  } else {
    const matchingProperties = getMatchingMathProperties(
      guessProperties,
      globals.xProperties,
    );

    console.log(matchingProperties);

    return matchingProperties;
  }
}

export function getMathProperties(int) {
  const factors = getFactors(int);

  const primeFactorization = getPrimeFactorization(int);
  const uniquePrimeFactors = [...new Set(primeFactorization)];
  const primeFactorizationCount = primeFactorization.length;

  const isPrime = primeFactorization.length === 1;

  const isEven = int % 2 === 0;

  const digits = int
    .toString()
    .split("")
    .map((digit) => parseInt(digit));

  const sumOfDigits = digits.reduce((sum, digit) => sum + digit, 0);

  return {
    value: int,
    factors,
    primeFactorization,
    primeFactorizationCount,
    uniquePrimeFactors,
    isPrime,
    isEven,
    digits,
    sumOfDigits,
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

export function getPrimeFactorization(int) {
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

export function getLeastCommonMultiple(properties1, properties2) {
  const commonFactors = getArrayIntersection(
    properties1.factors,
    properties2.factors,
  );

  const greatestCommonDivisor =
    commonFactors.length > 0 ? Math.max(...commonFactors) : 1;

  return (properties1.value * properties2.value) / greatestCommonDivisor;
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
      removeDuplicates(properties2.digits),
    );

    if (commonDigits.length > 0) {
      matchingProperties.commonDigits = commonDigits;
    }
  }

  const commonFactors = getArrayIntersection(
    properties1.factors,
    properties2.factors,
  );

  if (commonFactors.length > 0) {
    matchingProperties.greatestCommonDivisor = Math.max(...commonFactors);
  }

  return matchingProperties;
}

function mathPropertiesToString(properties) {
  const {
    primeFactorization,
    primeFactorizationCount,
    uniquePrimeFactors,
    isPrime,
    isEven,
    digits,
    sumOfDigits,
  } = properties;

  return `
    Prime Factorization: ${primeFactorization.join(", ")}
    Prime Factorization Count: ${primeFactorizationCount}
    Unique Prime Factors: ${uniquePrimeFactors.join(", ")}
    Is prime: ${isPrime}
    Is even: ${isEven}
    Digits: ${digits.join(", ")}
    Sum of digits: ${sumOfDigits}
  `;
}

/*export function mathPropertiesToStringArray(properties) {
  const {
    greatestCommonDivisor,
    isPrime,
    isEven,
    digits,
    commonDigits,
    sumOfDigits,
    primeFactorizationCount,
  } = properties;

  const stringArray = [];

  if (digits !== undefined) {
    stringArray.push(getTranslation(TranslationKey.DIGITS));
  }

  if (commonDigits !== undefined) {
    stringArray.push(
      `${getTranslation(TranslationKey.COMMON_DIGITS)}: ${commonDigits.join(
        ", ",
      )}`,
    );
  }

  if (sumOfDigits !== undefined) {
    stringArray.push(
      `${getTranslation(TranslationKey.SUM_OF_DIGITS)}: ${sumOfDigits}`,
    );
  }

  if (isEven !== undefined) {
    stringArray.push(
      getTranslation(isEven ? TranslationKey.EVEN : TranslationKey.ODD),
    );
  }

  if (greatestCommonDivisor !== undefined) {
    stringArray.push(
      `${getTranslation(
        TranslationKey.GREATEST_COMMON_DIVISOR,
      )}: ${greatestCommonDivisor}`,
    );
  }

  if (isPrime) {
    stringArray.push(getTranslation(TranslationKey.PRIME));
  }

  if (primeFactorizationCount !== undefined && !isPrime) {
    stringArray.push(
      `${getTranslation(
        TranslationKey.PRIME_FACTORIZATION_COUNT,
      )}: ${primeFactorizationCount}`,
    );
  }

  return stringArray;
}*/
