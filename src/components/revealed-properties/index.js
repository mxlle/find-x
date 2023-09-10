import { createElement } from "../../utils/html-utils";

import "./index.scss";
import { globals } from "../../globals";
import { getLeastCommonMultiple, getMathProperties } from "../../game-logic";

let evenElem,
  oddElem,
  primeElem,
  primeFactorsElem,
  sumOfDigitsElem,
  includedPrimeFactorsElem,
  excludedPrimeFactorsElem,
  excludedSumOfDigitsElem,
  correctSumOfDigitsElem;
let knownExcludedPrimeFactors = [];
let knownExcludedSumOfDigits = [];
let isSumOfDigitsMatched = false;
let currentGreatestKnownDivisorProperties;
let isPrimeKnown = false;
let isEvenKnown = false;

export function getCurrentlyRevealedProperties() {
  return {
    currentGreatestKnownDivisorProperties,
    isEvenKnown,
    isPrimeKnown,
    isSumOfDigitsMatched,
    knownExcludedPrimeFactors,
    knownExcludedSumOfDigits,
  };
}

export function createRevealedProperties() {
  const container = createElement({ cssClass: "revealed-properties" });

  const header = createElement({ text: "Properties of the secret", tag: "h2" });
  container.append(header);

  const entry = createElement({ cssClass: "table-row header-row" });
  entry.append(createElement({ text: "Even" }));
  entry.append(createElement({ text: "Odd" }));
  entry.append(createElement({ text: "Prime" }));
  entry.append(createElement({ text: "Prime factors" }));
  entry.append(createElement({ text: "Sum of digits" }));
  container.append(entry);

  evenElem = createElement({ text: "?" });
  oddElem = createElement({ text: "?" });
  primeElem = createElement({ text: "?" });
  primeFactorsElem = createElement({ cssClass: "prime-factors" });
  includedPrimeFactorsElem = createElement({ text: "✔: ?" });
  primeFactorsElem.appendChild(includedPrimeFactorsElem);
  excludedPrimeFactorsElem = createElement({ text: "X: ?" });
  primeFactorsElem.appendChild(excludedPrimeFactorsElem);
  sumOfDigitsElem = createElement({ cssClass: "sum-of-digits" });
  correctSumOfDigitsElem = createElement({ text: "✔: ?" });
  sumOfDigitsElem.appendChild(correctSumOfDigitsElem);
  excludedSumOfDigitsElem = createElement({ text: "X: ?" });
  sumOfDigitsElem.appendChild(excludedSumOfDigitsElem);

  const valuesEntry = createElement({ cssClass: "table-row" });
  valuesEntry.append(evenElem);
  valuesEntry.append(oddElem);
  valuesEntry.append(primeElem);
  valuesEntry.append(primeFactorsElem);
  valuesEntry.append(sumOfDigitsElem);
  container.append(valuesEntry);

  return container;
}

export function updateRevealedProperties(result, guessProperties) {
  if (globals.tries === 1) {
    updateEvenOddProperties(globals.xProperties.isEven);
  }
  if (guessProperties.isPrime || (result.isEven && globals.minNum > 2)) {
    updateIsPrime(result.isPrime);
  }

  if (result.greatestCommonDivisor) {
    updatedRevealedPrimeFactorsFromGcd(result.greatestCommonDivisor);
  }
  if (result.sumOfDigits) {
    updateConfirmedSumOfDigits(result.sumOfDigits);
  } else if (result !== true) {
    updateRevealedExcludedSumOfDigits(guessProperties.sumOfDigits);
  }

  const excludedPrimeFactors = guessProperties.uniquePrimeFactors.filter(
    (primeFactor) =>
      !result.greatestCommonDivisor ||
      result.greatestCommonDivisor % primeFactor !== 0,
  );
  updateRevealedExcludedPrimeFactors(excludedPrimeFactors);

  if (result === true) {
    updateRevealedPrimeFactors(globals.xProperties.primeFactorization, true);
    updateConfirmedSumOfDigits(globals.xProperties.sumOfDigits);
    updateIsPrime(globals.xProperties.isPrime);
  }
}

function updateEvenOddProperties(isEven) {
  isEvenKnown = true;
  evenElem.innerText = isEven ? "✅" : "❌";
  oddElem.innerText = !isEven ? "✅" : "❌";
}

function updateIsPrime(isPrime) {
  if (!isPrimeKnown) {
    isPrimeKnown = true;
    primeElem.innerText = isPrime ? "✅" : "❌";
  }
}

function updateRevealedExcludedPrimeFactors(excludedPrimeFactors) {
  for (const excludedPrimeFactor of excludedPrimeFactors) {
    if (!knownExcludedPrimeFactors.includes(excludedPrimeFactor)) {
      knownExcludedPrimeFactors.push(excludedPrimeFactor);
    }
  }

  excludedPrimeFactorsElem.innerText =
    "X: " + [...knownExcludedPrimeFactors].sort((a, b) => a - b).join(", ");
}

function updateRevealedPrimeFactors(primeFactors, isFinal) {
  const prefix = isFinal ? "✅: " : "✔: ";
  const postfix = isFinal ? "" : ", ... ?";
  const mainText = primeFactors.sort((a, b) => a - b).join(", ") || "?";
  includedPrimeFactorsElem.innerText = prefix + mainText + postfix;
}

function updatedRevealedPrimeFactorsFromGcd(resultGcd) {
  if (resultGcd !== currentGreatestKnownDivisorProperties?.value) {
    const guessCommonDivisorProperties = getMathProperties(resultGcd);
    if (!currentGreatestKnownDivisorProperties) {
      currentGreatestKnownDivisorProperties = guessCommonDivisorProperties;
      updateRevealedPrimeFactors(
        guessCommonDivisorProperties.primeFactorization,
      );
    } else {
      const newCurrentProductOfAllKnownPrimeFactorsProperties =
        getLeastCommonMultiple(
          guessCommonDivisorProperties,
          currentGreatestKnownDivisorProperties,
        );
      if (
        newCurrentProductOfAllKnownPrimeFactorsProperties !==
        currentGreatestKnownDivisorProperties.value
      ) {
        currentGreatestKnownDivisorProperties = getMathProperties(
          newCurrentProductOfAllKnownPrimeFactorsProperties,
        );
        updateRevealedPrimeFactors(
          currentGreatestKnownDivisorProperties.primeFactorization,
        );
      }
    }
  }
}

function updateRevealedExcludedSumOfDigits(excludedSumOfDigits) {
  if (isSumOfDigitsMatched) {
    return;
  }

  if (!knownExcludedSumOfDigits.includes(excludedSumOfDigits)) {
    knownExcludedSumOfDigits.push(excludedSumOfDigits);
  }
  excludedSumOfDigitsElem.innerText =
    "X: " + knownExcludedSumOfDigits.sort((a, b) => a - b).join(", ");
}

function updateConfirmedSumOfDigits(sumOfDigits) {
  if (isSumOfDigitsMatched) {
    return;
  }

  isSumOfDigitsMatched = true;
  correctSumOfDigitsElem.innerText = "✅: " + sumOfDigits;
}

export function resetRevealedProperties() {
  evenElem.innerText = "?";
  oddElem.innerText = "?";
  primeElem.innerText = "?";
  knownExcludedPrimeFactors = [];
  knownExcludedSumOfDigits = [];
  isSumOfDigitsMatched = false;
  isEvenKnown = false;
  isPrimeKnown = false;
  includedPrimeFactorsElem.innerText = "☑️: ?";
  excludedSumOfDigitsElem.innerText = "X: ?";
  correctSumOfDigitsElem.innerText = "☑️: ?";
  excludedPrimeFactorsElem.innerText = "X: ?";
}
