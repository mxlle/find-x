import { createElement } from "../../utils/html-utils";

import "./index.scss";

let guessList;

export function getGuessList() {
  guessList = createElement({ cssClass: "guess-list" });

  return guessList;
}

export function addGuessListEntry(guess, result) {
  const entry = createElement({ cssClass: "guess-list-entry" });
  entry.appendChild(createElement({ text: guess }));
  entry.appendChild(createElement({ text: result }));
  guessList.appendChild(entry);
}

export function resetGuessList() {
  guessList.innerHTML = "";
}
