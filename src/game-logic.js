import { globals, resetGlobals } from "./globals";
import { getRandomIntFromInterval } from "./utils/random-utils";
import {
  areArraysEqualIgnoreOrder,
  getArrayIntersection,
} from "./utils/array-utils";
import { getTranslation, TranslationKey } from "./translations";

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
    primeFactorization,
    uniquePrimeFactors,
    isPrime,
    isEven,
    digits,
    sumOfDigits,
    length,
  };
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

  const commonPrimeFactors = getArrayIntersection(
    properties1.uniquePrimeFactors,
    properties2.uniquePrimeFactors
  );

  if (commonPrimeFactors.length > 0) {
    matchingProperties.commonPrimeFactors = commonPrimeFactors;
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
    uniquePrimeFactors,
    commonPrimeFactors,
    isPrime,
    isEven,
    digits,
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

  if (uniquePrimeFactors !== undefined) {
    stringArray.push(getTranslation(TranslationKey.UNIQUE_PRIME_FACTORS));
  }

  if (commonPrimeFactors !== undefined) {
    stringArray.push(
      `${getTranslation(
        TranslationKey.COMMON_PRIME_FACTORS
      )}: ${commonPrimeFactors.join(", ")}`
    );
  }

  if (sumOfDigits !== undefined) {
    stringArray.push(
      `${getTranslation(TranslationKey.SUM_OF_DIGITS)}: ${sumOfDigits}`
    );
  }

  return stringArray;
}
