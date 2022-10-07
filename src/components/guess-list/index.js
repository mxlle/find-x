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
      createElement({ text: getTranslation(TranslationKey.CORRECT) })
    );
  } else if (Array.isArray(result)) {
    result.forEach((r) => {
      resultText.append(createElement({ text: r }));
    });
    if (result.length === 0) {
      resultText.append(createElement({ text: "-" }));
    }
  }
  entry.append(resultText);

  guessList.prepend(entry);
}

export function resetGuessList() {
  guessList.innerHTML = "";
}
