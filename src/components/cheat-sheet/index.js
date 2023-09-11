import { createElement } from "../../utils/html-utils";
import { getMathProperties } from "../../game-logic";

import "./index.scss";
import { globals } from "../../globals";
import { getCurrentlyRevealedProperties } from "../revealed-properties";
import { getArrayIntersection } from "../../utils/array-utils";
import { getTranslation, TranslationKey } from "../../translations";

let possibleNumbers = [];
let originalPossibleNumbers = [];
let possibleNumberProperties = [];

export function resetPossibleNumbers() {
  possibleNumbers = [];
  originalPossibleNumbers = [];
  possibleNumberProperties = [];
}

export function updatePossibleNumbers(possibleNumberElem) {
  if (!possibleNumbers?.length) {
    const min = globals.minNum;
    const max = globals.maxNum;
    possibleNumbers = new Array(max - min + 1)
      .fill(1)
      .map((_, index) => index + min);
    originalPossibleNumbers = [...possibleNumbers];
    possibleNumberProperties = possibleNumbers.map((num) =>
      getMathProperties(num),
    );
  }

  const {
    currentGreatestKnownDivisorProperties,
    isEvenKnown,
    isPrimeKnown,
    isSumOfDigitsMatched,
    knownExcludedPrimeFactors,
    knownExcludedSumOfDigits,
  } = getCurrentlyRevealedProperties();

  if (isEvenKnown) {
    const greatestKnownDivisor = currentGreatestKnownDivisorProperties?.value;

    possibleNumberProperties = possibleNumberProperties.filter(
      (numProperties) => {
        if (greatestKnownDivisor) {
          const isDivisorMatching =
            numProperties.value % greatestKnownDivisor === 0;

          if (!isDivisorMatching) {
            return false;
          }
        }

        if (isSumOfDigitsMatched) {
          const isSumMatching =
            numProperties.sumOfDigits === globals.xProperties.sumOfDigits;

          if (!isSumMatching) {
            return false;
          }
        }

        if (isPrimeKnown) {
          const isPrimeMatching =
            numProperties.isPrime === globals.xProperties.isPrime;

          if (!isPrimeMatching) {
            return false;
          }
        }

        const isSumOfDigitsPossible = !knownExcludedSumOfDigits.includes(
          numProperties.sumOfDigits,
        );

        if (!isSumOfDigitsPossible) {
          return false;
        }

        if (knownExcludedPrimeFactors?.length > 0) {
          const intersectWithExcluded = getArrayIntersection(
            knownExcludedPrimeFactors,
            numProperties.primeFactorization,
          );
          const isPrimeFactorsPossible = !intersectWithExcluded.length;

          if (!isPrimeFactorsPossible) {
            return false;
          }
        }

        const isEvenOddMatching =
          globals.xProperties.isEven === numProperties.isEven;
        if (!isEvenOddMatching) {
          return false;
        }

        return true;
      },
    );

    if (possibleNumberProperties.length !== possibleNumbers.length) {
      possibleNumbers = possibleNumberProperties.map(
        (numProperties) => numProperties.value,
      );
    }
  }

  if (possibleNumberElem) {
    const numNow = possibleNumbers.length;
    const numOrig = originalPossibleNumbers.length;
    const postfix =
      numNow === numOrig
        ? ""
        : ` (${getTranslation(TranslationKey.POSSIBILITIES_OF, numOrig)})`;
    possibleNumberElem.innerHTML = `${getTranslation(
      TranslationKey.POSSIBILITIES,
    )}: ${numNow}${postfix}`;
  }
}

export function createCheatSheet(shouldSortByFactorization) {
  const container = createElement({ cssClass: "cheat-sheet" });

  const entry = createElement({ cssClass: "cheat-sheet-entry" });
  entry.append(createElement({ text: getTranslation(TranslationKey.NUMBER) }));
  entry.append(
    createElement({
      text: getTranslation(TranslationKey.PRIME_FACTORIZATION),
    }),
  );
  entry.append(
    createElement({ text: getTranslation(TranslationKey.SUM_OF_DIGITS) }),
  );
  container.append(entry);

  if (!possibleNumberProperties) {
    possibleNumberProperties = possibleNumbers.map((num) =>
      getMathProperties(num),
    );
  }

  const listOfNumbers = [...possibleNumberProperties];
  const sumOfDigitsDistribution = {};

  if (shouldSortByFactorization) {
    listOfNumbers.sort(
      (a, b) => b.primeFactorizationCount - a.primeFactorizationCount,
    );
  }

  for (let i = 0; i < listOfNumbers.length; i++) {
    const properties = listOfNumbers[i];

    if (!sumOfDigitsDistribution[properties.sumOfDigits]) {
      sumOfDigitsDistribution[properties.sumOfDigits] = 1;
    } else {
      sumOfDigitsDistribution[properties.sumOfDigits]++;
    }

    const entry = createElement({ cssClass: "cheat-sheet-entry" });
    entry.append(createElement({ text: properties.value }));
    entry.append(
      createElement({
        text: properties.primeFactorization.join(", "),
      }),
    );
    entry.append(createElement({ text: properties.sumOfDigits }));
    container.append(entry);
  }

  console.log(sumOfDigitsDistribution);

  return container;
}
