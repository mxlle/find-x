import { createElement } from "../../utils/html-utils";

import "./index.scss";
import { globals } from "../../globals";
import { getTranslation, TranslationKey } from "../../translations";
import { getPrimeFactorization } from "../../game-logic";

let guessList;

export function getGuessList() {
  guessList = createElement({ cssClass: "guess-list" });

  return guessList;
}

export function addGuessListEntry(guessProperties, result, isPrimeKnown) {
  const entry = createElement({ cssClass: "guess-list-entry" });
  entry.append(createElement({ text: globals.tries + ".)" }));
  entry.append(createElement({ text: guessProperties.value + " ?" }));

  if (result === true) {
    const resultText = createElement({
      cssClass: "correct-result",
      text: getTranslation(TranslationKey.CORRECT),
    });
    entry.append(resultText);
  } else {
    const evenOddElem = createElement({
      text: guessProperties.isEven ? "even" : "odd",
      cssClass: result.isEven !== undefined ? "matching" : "not-matching",
    });

    const primeElem = createElement({
      text: guessProperties.isPrime ? "prime" : "not prime",
      cssClass:
        result.isPrime === true || (isPrimeKnown && !guessProperties.isPrime)
          ? "matching"
          : isPrimeKnown
          ? "not-matching"
          : "match-unknown",
    });

    const sharedPrimeFactors = getPrimeFactorization(
      result.greatestCommonDivisor,
    );

    const primeFactorsElem = createElement({ cssClass: "guess-prime-factors" });

    for (let primeFactor of guessProperties.primeFactorization) {
      const isIncluded = sharedPrimeFactors.includes(primeFactor);
      if (isIncluded) {
        sharedPrimeFactors.splice(sharedPrimeFactors.indexOf(primeFactor), 1);
      }
      const elem = createElement({
        text: primeFactor,
        cssClass: isIncluded ? "matching" : "not-matching",
      });
      primeFactorsElem.append(elem);
    }

    const sumOfDigitsElem = createElement({
      text: guessProperties.sumOfDigits,
      cssClass: result.sumOfDigits !== undefined ? "matching" : "not-matching",
    });

    entry.append(evenOddElem);
    if (globals.checkForPrimes) {
      entry.append(primeElem);
    }
    entry.append(primeFactorsElem);
    entry.append(sumOfDigitsElem);
  }

  prependWithAnimation(entry);
}

export function addDigitHint() {
  const digitHint = createElement({
    cssClass: "digit-hint",
    text: getTranslation(TranslationKey.COMMON_DIGITS_HINT),
  });

  prependWithAnimation(digitHint);
}

function prependWithAnimation(element) {
  element.classList.add("hidden");
  guessList.prepend(element);
  setTimeout(() => {
    element.classList.remove("hidden");
  });
}

export function resetGuessList() {
  guessList.innerHTML = "";
}
