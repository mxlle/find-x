import { createElement } from "../../utils/html-utils";

import "./index.scss";
import { globals } from "../../globals";
import { getPrimeFactorization } from "../../game-logic";

let evenElem,
  oddElem,
  primeElem,
  primeFactorsElem,
  sumOfDigitsElem,
  includedPrimeFactorsElem,
  excludedPrimeFactorsElem,
  excludedSumOfDigitsElem,
  correctSumOfDigitsElem;
const knownIncludedPrimeFactors = [];
const knownExcludedPrimeFactors = [];
const knownExcludedSumOfDigits = [];
let isSumOfDigitsMatched = false;

export function createRevealedProperties() {
  const container = createElement({ cssClass: "revealed-properties" });

  const header = createElement({ text: "Properties of the secret", tag: "h2" });
  container.append(header);

  const entry = createElement({ cssClass: "table-row" });
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
  if (guessProperties.isPrime) {
    updateIsPrime(result.isPrime);
  }
  if (result.greatestCommonDivisor) {
    updateRevealedPrimeFactors(
      getPrimeFactorization(result.greatestCommonDivisor),
    );
  }
  if (result.sumOfDigits) {
    updateConfirmedSumOfDigits(result.sumOfDigits);
  } else if (result !== true) {
    updateRevealedExcludedSumOfDigits(guessProperties.sumOfDigits);
  }

  if (result === true) {
    updateRevealedPrimeFactors(globals.xProperties.primeFactorization, true);
    updateConfirmedSumOfDigits(globals.xProperties.sumOfDigits);
  }
}

function updateEvenOddProperties(isEven) {
  evenElem.innerText = isEven ? "✅" : "❌";
  oddElem.innerText = !isEven ? "✅" : "❌";
}

function updateIsPrime(isPrime) {
  primeElem.innerText = isPrime ? "✅" : "❌";
}

function updateRevealedPrimeFactors(primeFactors, isFinal) {
  const newPrimeFactors = primeFactors.filter((primeFactor) => {
    return !knownIncludedPrimeFactors.includes(primeFactor);
  }); // today duplicate prime factors
  knownIncludedPrimeFactors.push(...newPrimeFactors);
  const prefix = isFinal ? "✅: " : "✔: ";
  const postfix = isFinal ? "" : ", ... ?";
  const mainText =
    knownIncludedPrimeFactors.sort((a, b) => a - b).join(", ") || "?";
  includedPrimeFactorsElem.innerText = prefix + mainText + postfix;
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
  knownIncludedPrimeFactors.length = 0;
  knownExcludedPrimeFactors.length = 0;
  knownExcludedSumOfDigits.length = 0;
  isSumOfDigitsMatched = false;
  includedPrimeFactorsElem.innerText = "☑️: ?";
  excludedSumOfDigitsElem.innerText = "X: ?";
  correctSumOfDigitsElem.innerText = "☑️: ?";
  excludedPrimeFactorsElem.innerText = "X: ?";
}
