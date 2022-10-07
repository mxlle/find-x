import "./index.scss";

import { createButton, createElement } from "./utils/html-utils";
import {
  evaluateGuess,
  initGameData,
  newGame,
  START_DIGIT_HINT,
} from "./game-logic";
import { createNumberInputComponent } from "./components/number-input";
import { globals, MAX_NUM, MIN_NUM } from "./globals";
import {
  addDigitHint,
  addGuessListEntry,
  getGuessList,
  resetGuessList,
} from "./components/guess-list";
import { getTranslation, TranslationKey } from "./translations";

let submitButton;

function init() {
  initGameData();

  const header = createElement({
    tag: "header",
    text: `${getTranslation(TranslationKey.PROMPT)} ${getTranslation(
      TranslationKey.BETWEEN
    )} ${MIN_NUM} ${getTranslation(TranslationKey.AND)} ${MAX_NUM}`,
  });

  const guessList = getGuessList();

  const numberInput = createNumberInputComponent({
    min: globals.minNum,
    max: globals.maxNum,
    hideButtons: true,
    placeholder: getTranslation(TranslationKey.PLACEHOLDER),
  });

  function onSubmit() {
    if (submitButton.innerHTML === getTranslation(TranslationKey.PLAY_AGAIN)) {
      newGame();
      resetGuessList();
      submitButton.innerHTML = getTranslation(TranslationKey.SUBMIT);
      return;
    }

    const guess = parseInt(numberInput.input.value);

    if (isNaN(guess)) {
      return;
    }

    const result = evaluateGuess(guess);
    addGuessListEntry(guess, result);
    numberInput.input.value = "";

    if (result === true) {
      submitButton.innerHTML = getTranslation(TranslationKey.PLAY_AGAIN);
    } else if (globals.tries === START_DIGIT_HINT) {
      addDigitHint();
    }
  }

  numberInput.input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      onSubmit();
    }
  });

  submitButton = createButton({
    text: getTranslation(TranslationKey.SUBMIT),
    onClick: () => {
      onSubmit();
    },
  });

  document.body.appendChild(header);
  document.body.appendChild(numberInput.container);
  document.body.appendChild(submitButton);
  document.body.appendChild(guessList);
}

// INIT
init();
