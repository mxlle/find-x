import { createElement } from "../../utils/html-utils";

import "./index.scss";
import { globals } from "../../globals";
import { getLeastCommonMultiple, getMathProperties } from "../../game-logic";
import { getTranslation, TranslationKey } from "../../translations";

let containerElem,
  guessListElem,
  secretElem,
  evenOddElem,
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
  containerElem = createElement({ cssClass: "revealed-properties" });

  const header = createElement({
    text: getTranslation(TranslationKey.SECRET_PROPERTIES),
    tag: "h2",
  });
  containerElem.append(header);

  const entry = createElement({ cssClass: "table-row header-row" });
  entry.append(createElement({ text: "" }));
  entry.append(
    createElement({
      text: getTranslation(TranslationKey.SECRET),
      cssClass: "secret",
    }),
  );
  entry.append(
    createElement({ text: getTranslation(TranslationKey.EVEN_ODD) }),
  );
  if (globals.checkForPrimes) {
    entry.append(createElement({ text: getTranslation(TranslationKey.PRIME) }));
    containerElem.classList.add("has-prime");
  }
  entry.append(
    createElement({ text: getTranslation(TranslationKey.PRIME_FACTORIZATION) }),
  );
  entry.append(
    createElement({ text: getTranslation(TranslationKey.SUM_OF_DIGITS) }),
  );
  containerElem.append(entry);

  secretElem = createElement({ text: "?", cssClass: "secret" });
  evenOddElem = createElement({ text: "?" });
  primeElem = createElement({ text: "?" });
  primeFactorsElem = createElement({ cssClass: "prime-factors" });
  includedPrimeFactorsElem = createElement({ text: "✔: ?" });
  primeFactorsElem.appendChild(includedPrimeFactorsElem);
  excludedPrimeFactorsElem = createElement({
    text: "",
    cssClass: "not-matching-subtle",
  });
  primeFactorsElem.appendChild(excludedPrimeFactorsElem);
  sumOfDigitsElem = createElement({ cssClass: "sum-of-digits" });
  correctSumOfDigitsElem = createElement({ text: "✔: ?" });
  sumOfDigitsElem.appendChild(correctSumOfDigitsElem);
  excludedSumOfDigitsElem = createElement({
    text: "",
    cssClass: "not-matching-subtle",
  });
  sumOfDigitsElem.appendChild(excludedSumOfDigitsElem);

  const valuesEntry = createElement({ cssClass: "table-row" });
  valuesEntry.append(createElement({ text: "" }));
  valuesEntry.append(secretElem);
  valuesEntry.append(evenOddElem);
  if (globals.checkForPrimes) {
    valuesEntry.append(primeElem);
  }
  valuesEntry.append(primeFactorsElem);
  valuesEntry.append(sumOfDigitsElem);
  containerElem.append(valuesEntry);

  return containerElem;
}

export function registerGuessListElement(guessElement) {
  if (!guessListElem) {
    guessListElem = guessElement;
    containerElem.append(guessElement);
  }
}

export function updateRevealedProperties(result, guessProperties) {
  if (globals.tries === 1) {
    updateEvenOddProperties(globals.xProperties.isEven);
  }

  if (result === true) {
    secretElem.innerText = globals.x;
    currentGreatestKnownDivisorProperties = globals.xProperties;
    updateRevealedPrimeFactors(globals.xProperties.primeFactorization, true);
    updateConfirmedSumOfDigits(globals.xProperties.sumOfDigits);
    updateIsPrime(globals.xProperties.isPrime);
  } else {
    if (globals.checkForPrimes) {
      if (guessProperties.isPrime || (result.isEven && globals.minNum > 2)) {
        updateIsPrime(result.isPrime);
      }
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
  }
}

function updateEvenOddProperties(isEven) {
  isEvenKnown = true;
  evenOddElem.innerText = isEven
    ? getTranslation(TranslationKey.EVEN)
    : getTranslation(TranslationKey.ODD);
  evenOddElem.classList.add("matching");
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
  evenOddElem.innerText = "?";
  evenOddElem.classList.remove("matching");
  primeElem.innerText = "?";
  secretElem.innerText = "?";
  currentGreatestKnownDivisorProperties = undefined;
  knownExcludedPrimeFactors = [];
  knownExcludedSumOfDigits = [];
  isSumOfDigitsMatched = false;
  isEvenKnown = false;
  isPrimeKnown = false;
  includedPrimeFactorsElem.innerText = "☑️: ?";
  excludedSumOfDigitsElem.innerText = "";
  correctSumOfDigitsElem.innerText = "☑️: ?";
  excludedPrimeFactorsElem.innerText = "";
}
