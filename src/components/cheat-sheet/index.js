import { createElement } from "../../utils/html-utils";
import { getMathProperties } from "../../game-logic";

import "./index.scss";

export function createCheatSheet(min, max, shouldSortByFactorization) {
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

  const listOfNumbers = [];
  const sumOfDigitsDistribution = {};

  for (let i = min; i <= max; i++) {
    const properties = getMathProperties(i);

    listOfNumbers.push({
      value: i,
      properties,
    });

    if (!sumOfDigitsDistribution[properties.sumOfDigits]) {
      sumOfDigitsDistribution[properties.sumOfDigits] = 1;
    } else {
      sumOfDigitsDistribution[properties.sumOfDigits]++;
    }
  }

  if (shouldSortByFactorization) {
    listOfNumbers.sort(
      (a, b) =>
        b.properties.primeFactorizationCount -
        a.properties.primeFactorizationCount,
    );
  }

  for (let j = 0; j < listOfNumbers.length; j++) {
    const { value, properties } = listOfNumbers[j];

    const entry = createElement({ cssClass: "cheat-sheet-entry" });
    entry.append(createElement({ text: value }));
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
