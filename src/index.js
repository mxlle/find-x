import "./index.scss";

import { createButton, createElement } from "./utils/html-utils";
import {
  evaluateGuess,
  getMathProperties,
  initGameData,
  mathPropertiesToStringArray,
  newGame,
  START_DIGIT_HINT,
} from "./game-logic";
import { createNumberInputComponent } from "./components/number-input";
import { globals } from "./globals";
import {
  addDigitHint,
  addGuessListEntry,
  getGuessList,
  resetGuessList,
} from "./components/guess-list";
import { getTranslation, TranslationKey } from "./translations";
import { createDialog } from "./components/dialog";
import {
  createCheatSheet,
  resetPossibleNumbers,
  updatePossibleNumbers,
} from "./components/cheat-sheet";
import {
  createRevealedProperties,
  resetRevealedProperties,
  updateRevealedProperties,
} from "./components/revealed-properties";

let submitButton, configDialog, cheatSheetDialog, possibleNumberElem;

function onNewGameClick() {
  newGame();
  resetGuessList();
  resetRevealedProperties();
  resetPossibleNumbers();
  updatePossibleNumbers(possibleNumberElem);
  document.body.classList.remove("win");
  submitButton.innerHTML = getTranslation(TranslationKey.SUBMIT);
}

function openConfig() {
  if (!configDialog) {
    configDialog = createDialog(
      getConfigContainer(),
      undefined,
      getTranslation(TranslationKey.DIFFICULTY),
    );
  }

  configDialog.open();
}

function openCheatSheet() {
  if (!cheatSheetDialog) {
    cheatSheetDialog = createDialog(
      createCheatSheet(),
      undefined,
      getTranslation(TranslationKey.CHEAT_SHEET),
    );
  }

  cheatSheetDialog.open();
}

function init() {
  initGameData();

  const header = createElement({
    tag: "header",
  });
  header.append(
    createButton({ text: "🔄", onClick: onNewGameClick, iconBtn: true }),
  );
  header.append(
    createElement({
      text: `${getTranslation(TranslationKey.PROMPT)} ${getTranslation(
        TranslationKey.BETWEEN,
      )} ${globals.minNum} ${getTranslation(TranslationKey.AND)} ${
        globals.maxNum
      }`,
    }),
  );
  header.append(
    createButton({ text: "👀", onClick: openCheatSheet, iconBtn: true }),
  );
  header.append(
    createButton({ text: "⚙️", onClick: openConfig, iconBtn: true }),
  );

  const guessList = getGuessList();

  const numberInput = createNumberInputComponent({
    min: globals.minNum,
    max: globals.maxNum,
    hideButtons: true,
    placeholder: getTranslation(TranslationKey.PLACEHOLDER),
  });

  function onSubmit() {
    if (submitButton.innerHTML === getTranslation(TranslationKey.PLAY_AGAIN)) {
      onNewGameClick();
      return;
    }

    const guess = parseInt(numberInput.input.value);

    if (isNaN(guess)) {
      return;
    }

    const guessProperties = getMathProperties(guess);

    const result = evaluateGuess(guess, guessProperties);
    addGuessListEntry(
      guess,
      result === true ? true : mathPropertiesToStringArray(result),
    );
    updateRevealedProperties(result, guessProperties);

    updatePossibleNumbers(possibleNumberElem);
    if (cheatSheetDialog) {
      cheatSheetDialog.recreateDialogContent(createCheatSheet());
    }

    numberInput.input.value = "";

    if (result === true) {
      submitButton.innerHTML = getTranslation(TranslationKey.PLAY_AGAIN);
      document.body.classList.add("win");
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
  submitButton.classList.add("submit-btn");

  const revealedProperties = createRevealedProperties();

  possibleNumberElem = createElement({ cssClass: "possible-numbers" });

  updatePossibleNumbers(possibleNumberElem);

  document.body.appendChild(header);
  document.body.appendChild(numberInput.container);
  document.body.appendChild(possibleNumberElem);
  document.body.appendChild(submitButton);
  document.body.appendChild(revealedProperties);
  document.body.appendChild(guessList);
}

function getConfigContainer() {
  const container = createElement({ cssClass: "config-container" });

  function closeAndReload(min, max) {
    configDialog.close();
    setTimeout(() => {
      const params = new URLSearchParams();
      params.set("min", min);
      params.set("max", max);
      window.location.search = params.toString();
    }, 300);
  }

  container.append(
    createButton({
      text: getTranslation(TranslationKey.CENTURY) + " (1200-1299)",
      onClick: () => {
        closeAndReload(1200, 1299);
      },
    }),
  );
  container.append(
    createButton({
      text: getTranslation(TranslationKey.BEGINNER) + " (1-9)",
      onClick: () => {
        closeAndReload(1, 9);
      },
    }),
  );
  container.append(
    createButton({
      text: getTranslation(TranslationKey.EASY) + " (10-99)",
      onClick: () => {
        closeAndReload(10, 99);
      },
    }),
  );
  container.append(
    createButton({
      text: getTranslation(TranslationKey.MEDIUM) + " (100-999)",
      onClick: () => {
        closeAndReload(100, 999);
      },
    }),
  );
  container.append(
    createButton({
      text: getTranslation(TranslationKey.HARD) + " (1000-9999)",
      onClick: () => {
        closeAndReload(1000, 9999);
      },
    }),
  );

  return container;
}

// INIT
init();
