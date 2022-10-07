import { createElement } from "../../utils/html-utils";

import "./index.scss";
import { globals } from "../../globals";

let guessList;

export function getGuessList() {
  guessList = createElement({ cssClass: "guess-list" });

  return guessList;
}

export function addGuessListEntry(guess, result) {
  const entry = createElement({ cssClass: "guess-list-entry" });
  entry.append(createElement({ text: globals.tries + "." }));
  entry.append(createElement({ text: guess }));
  entry.append(createElement({ text: result }));
  guessList.prepend(entry);
}

export function resetGuessList() {
  guessList.innerHTML = "";
}
