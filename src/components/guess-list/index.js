import { createElement } from "../../utils/html-utils";

import "./index.scss";
import { globals } from "../../globals";
import { getTranslation, TranslationKey } from "../../translations";

let guessList;

export function getGuessList() {
  guessList = createElement({ cssClass: "guess-list" });

  return guessList;
}

export function addGuessListEntry(guess, result) {
  const entry = createElement({ cssClass: "guess-list-entry" });
  entry.append(createElement({ text: globals.tries + ".)" }));
  entry.append(createElement({ text: guess + " ?" }));

  const resultText = createElement({ cssClass: "result" });
  if (result === true) {
    resultText.append(
      createElement({
        text: getTranslation(TranslationKey.CORRECT),
      })
    );
    resultText.classList.add("correct");
  } else if (Array.isArray(result)) {
    result.forEach((r) => {
      resultText.append(createElement({ text: r }));
    });
    if (result.length === 0) {
      resultText.append(createElement({ text: "-" }));
    }
  }
  entry.append(resultText);

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
