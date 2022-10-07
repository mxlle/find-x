import { globals, resetGlobals } from "./globals";
import { getRandomIntFromInterval } from "./utils/random-utils";

export function newGame() {
  resetGlobals();
  initGameData();

}

export function initGameData() {
  globals.x = getRandomIntFromInterval(globals.minNum, globals.maxNum);
}

export function evaluateGuess(guess) {
  if (guess === globals.x) {
    return "correct";
  } else if (guess < globals.x) {
    return "too-low";
  } else {
    return "too-high";
  }
}
