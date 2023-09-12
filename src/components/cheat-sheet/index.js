import { createButton, createElement } from "../../utils/html-utils";
import { getMathProperties } from "../../game-logic";

import "./index.scss";
import { globals } from "../../globals";
import { getCurrentlyRevealedProperties } from "../revealed-properties";
import { getArrayIntersection } from "../../utils/array-utils";
import { getTranslation, TranslationKey } from "../../translations";
import { PubSubEvent, pubSubService } from "../../utils/pub-sub-service";
import { FULL_STAR } from "../stars";

let possibleNumbers = [];
let originalPossibleNumbers = [];
let possibleNumberProperties = [];
let originalPossibleNumberProperties = [];
let isFilterUnlocked = false;
let isFilterActivated = false;
let filterButton;

export function resetPossibleNumbers() {
  possibleNumbers = [];
  originalPossibleNumbers = [];
  possibleNumberProperties = [];
  originalPossibleNumberProperties = [];
  isFilterUnlocked = false;
  isFilterActivated = false;
  filterButton.classList.remove("unlocked");
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
    originalPossibleNumberProperties = [...possibleNumberProperties];
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

  if (possibleNumbers.length < originalPossibleNumbers.length) {
    filterButton = createButton({
      text: "",
      onClick: () => {
        if (!isFilterUnlocked) {
          isFilterUnlocked = true;
          filterButton.classList.add("unlocked");
          pubSubService.publish(PubSubEvent.STARS_CHANGED, -1);
        }

        isFilterActivated = !isFilterActivated;
        document.body.classList.toggle("filter-on", isFilterActivated);
      },
    });
    filterButton.classList.add("filter-btn");
    if (isFilterUnlocked) {
      filterButton.classList.add("unlocked");
    }

    filterButton.appendChild(
      createElement({
        text: getTranslation(TranslationKey.FILTER_ON, possibleNumbers.length),
        cssClass: "filter-on-text",
        tag: "span",
      }),
    );
    filterButton.appendChild(
      createElement({
        text: getTranslation(
          TranslationKey.FILTER_OFF,
          originalPossibleNumbers.length,
        ),
        cssClass: "filter-off-text",
        tag: "span",
      }),
    );
    filterButton.appendChild(
      createElement({
        text: `🔓 -${FULL_STAR}`,
        cssClass: "cheat-lock",
        tag: "span",
      }),
    );

    container.append(filterButton);
  }

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

  const listOfNumbers = [...originalPossibleNumberProperties];

  if (shouldSortByFactorization) {
    listOfNumbers.sort(
      (a, b) => b.primeFactorizationCount - a.primeFactorizationCount,
    );
  }

  for (let i = 0; i < listOfNumbers.length; i++) {
    const properties = listOfNumbers[i];

    const entry = createElement({ cssClass: "cheat-sheet-entry" });
    entry.append(createElement({ text: properties.value }));
    entry.append(
      createElement({
        text: properties.primeFactorization.join(", "),
      }),
    );
    entry.append(createElement({ text: properties.sumOfDigits }));
    container.append(entry);

    if (!possibleNumbers.includes(properties.value)) {
      entry.classList.add("not-possible");
    }
  }

  return container;
}
