import { createElement } from "../../utils/html-utils";
import { getMathProperties } from "../../game-logic";

import "./index.scss";
import { globals } from "../../globals";
import { getCurrentlyRevealedProperties } from "../revealed-properties";
import { getArrayIntersection } from "../../utils/array-utils";

let possibleNumbers;
let originalPossibleNumbers;
let possibleNumberProperties;

export function resetPossibleNumbers() {
  possibleNumbers = [];
  originalPossibleNumbers = [];
  possibleNumberProperties = [];
}

export function updatePossibleNumbers(possibleNumberElem) {
  if (!possibleNumbers) {
    const min = globals.minNum;
    const max = globals.maxNum;
    possibleNumbers = new Array(max - min)
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
            console.debug("divisor not matching");
            return false;
          }
        }

        if (isSumOfDigitsMatched) {
          const isSumMatching =
            numProperties.sumOfDigits === globals.xProperties.sumOfDigits;

          if (!isSumMatching) {
            console.debug("sum not matching");
            return false;
          }
        }

        if (isPrimeKnown) {
          const isPrimeMatching =
            numProperties.isPrime === globals.xProperties.isPrime;

          if (!isPrimeMatching) {
            console.debug("prime not matching");
            return false;
          }
        }

        const isSumOfDigitsPossible = !knownExcludedSumOfDigits.includes(
          numProperties.sumOfDigits,
        );

        if (!isSumOfDigitsPossible) {
          console.debug("sum not possible");
          return false;
        }

        if (knownExcludedPrimeFactors?.length > 0) {
          const intersectWithExcluded = getArrayIntersection(
            knownExcludedPrimeFactors,
            numProperties.primeFactorization,
          );
          const isPrimeFactorsPossible = !intersectWithExcluded.length;

          if (!isPrimeFactorsPossible) {
            console.debug("prime factors not possible");
            return false;
          }
        }

        const isEvenOddMatching =
          globals.xProperties.isEven === numProperties.isEven;
        if (!isEvenOddMatching) {
          console.log("even/odd not matching");
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

  console.log(possibleNumbers);

  if (possibleNumberElem) {
    possibleNumberElem.innerHTML = `Possibilities: ${possibleNumbers.length} (of originally ${originalPossibleNumbers.length})`;
  }
}

export function createCheatSheet(shouldSortByFactorization) {
  const container = createElement({ cssClass: "cheat-sheet" });

  const entry = createElement({ cssClass: "cheat-sheet-entry" });
  entry.append(createElement({ text: "Number" }));
  entry.append(
    createElement({
      text: "Prime factorization",
    }),
  );
  entry.append(createElement({ text: "Sum of digits" }));
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
