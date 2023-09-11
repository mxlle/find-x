import "./index.scss";

import { createButton, createElement } from "./utils/html-utils";
import {
  evaluateGuess,
  getMathProperties,
  initGameData,
  LOSE_STAR_TRIES,
  newGame,
  WIN_STAR_TRIES,
} from "./game-logic";
import { createNumberInputComponent } from "./components/number-input";
import { globals } from "./globals";
import {
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
  getCurrentlyRevealedProperties,
  registerGuessListElement,
  resetRevealedProperties,
  updateRevealedProperties,
} from "./components/revealed-properties";
import {
  createGlobalStarsComponent,
  FULL_STAR,
  getStarsForGameField,
  updateStarMap,
} from "./components/stars";
import { PubSubEvent, pubSubService } from "./utils/pub-sub-service";
import { sleep } from "./utils/promise-utils";

let submitButton,
  configDialog,
  cheatSheetDialog,
  possibleNumberElem,
  cheatSheetBtn;

let isCheatSheetActivated = false;

function onNewGameClick() {
  newGame();
  resetGuessList();
  resetRevealedProperties();
  resetPossibleNumbers();
  updatePossibleNumbers(possibleNumberElem);
  isCheatSheetActivated = false;
  cheatSheetBtn.classList.remove("unlocked");
  if (cheatSheetDialog) {
    cheatSheetDialog.recreateDialogContent(createCheatSheet());
  }
  pubSubService.publish(PubSubEvent.NEW_GAME);
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

async function openCheatSheet() {
  if (!isCheatSheetActivated) {
    isCheatSheetActivated = true;
    cheatSheetBtn.classList.add("unlocked");
    pubSubService.publish(PubSubEvent.STARS_CHANGED, -1);
    await sleep(500);
  }

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
      tag: "h1",
      text: `${getTranslation(TranslationKey.PROMPT)} ${getTranslation(
        TranslationKey.BETWEEN,
      )} ${globals.minNum} ${getTranslation(TranslationKey.AND)} ${
        globals.maxNum
      }`,
    }),
  );
  header.append(createGlobalStarsComponent());
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
    updateRevealedProperties(result, guessProperties);
    const values = getCurrentlyRevealedProperties();
    addGuessListEntry(guessProperties, result, values.isPrimeKnown);

    updatePossibleNumbers(possibleNumberElem);
    if (cheatSheetDialog) {
      cheatSheetDialog.recreateDialogContent(createCheatSheet());
    }

    registerGuessListElement(guessList);

    numberInput.input.value = "";

    if (result === true) {
      submitButton.innerHTML = getTranslation(TranslationKey.PLAY_AGAIN);
      document.body.classList.add("win");
      if (WIN_STAR_TRIES.includes(globals.tries)) {
        pubSubService.publish(PubSubEvent.STARS_CHANGED, 1);
      }
      updateStarMap();
    } else if (LOSE_STAR_TRIES.includes(globals.tries)) {
      pubSubService.publish(PubSubEvent.STARS_CHANGED, -1);
    }
    /* else if (globals.tries === START_DIGIT_HINT) {
      addDigitHint();
    }*/
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

  const possibleNumberContainer = createElement({
    cssClass: "possible-number-container",
  });

  possibleNumberElem = createElement({ cssClass: "possible-numbers" });
  possibleNumberContainer.append(possibleNumberElem);

  cheatSheetBtn = createButton({
    text: `👀 ${getTranslation(TranslationKey.CHEAT_SHEET)}`,
    onClick: openCheatSheet,
  });
  cheatSheetBtn.classList.add("cheat-sheet-btn");
  cheatSheetBtn.appendChild(
    createElement({
      text: `🔓 -${FULL_STAR}`,
      cssClass: "cheat-lock",
      tag: "span",
    }),
  );

  possibleNumberContainer.append(cheatSheetBtn);

  updatePossibleNumbers(possibleNumberElem);

  document.body.appendChild(header);
  document.body.appendChild(numberInput.container);
  document.body.appendChild(submitButton);
  document.body.appendChild(getStarsForGameField());
  document.body.appendChild(possibleNumberContainer);
  document.body.appendChild(revealedProperties);
  registerGuessListElement(guessList);
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
