import "./index.scss";

import { createButton, createElement } from "./utils/html-utils";
import { evaluateGuess, initGameData, newGame } from "./game-logic";
import { createNumberInputComponent } from "./components/number-input";
import { globals, MAX_NUM, MIN_NUM } from "./globals";
import {
  addGuessListEntry,
  getGuessList,
  resetGuessList,
} from "./components/guess-list";

let submitButton;

function init() {
  initGameData();

  const header = createElement({
    tag: "header",
    text: `Find X between ${MIN_NUM} and ${MAX_NUM}`,
  });

  const numberInput = createNumberInputComponent({
    min: globals.minNum,
    max: globals.maxNum,
    hideButtons: true,
  });

  submitButton = createButton({
    text: "Submit",
    onClick: () => {
      if (submitButton.innerHTML === "Play again") {
        newGame();
        resetGuessList();
        submitButton.innerHTML = "Submit";
        return;
      }

      const guess = parseInt(numberInput.input.value);

      if (isNaN(guess)) {
        return;
      }

      const result = evaluateGuess(guess);
      addGuessListEntry(guess, result);
      numberInput.input.value = "";

      if (result === "correct!") {
        submitButton.innerHTML = "Play again";
      }
    },
  });

  const guessList = getGuessList();

  document.body.appendChild(header);
  document.body.appendChild(numberInput.container);
  document.body.appendChild(submitButton);
  document.body.appendChild(guessList);
}

// INIT
init();
