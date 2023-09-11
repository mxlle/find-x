import { createElement } from "../../utils/html-utils";

import "./index.scss";

import { PubSubEvent, pubSubService } from "../../utils/pub-sub-service";
import {
  getLocalStorageItem,
  LocalStorageKey,
  setLocalStorageItem,
} from "../../utils/local-storage";
import { globals } from "../../globals";

const EMPTY_STAR = "☆";
export const FULL_STAR = "★";
const zeroClass = "zero";
const maxStars = 5;
let currentStars = maxStars;
let globalStars = 0;
let globalStarsElem;

export function createStarComponent(achievedStars) {
  const stars = createElement({
    cssClass: "stars",
  });

  for (let i = 0; i < maxStars; i++) {
    stars.appendChild(createElement({}));
  }
  updateStars(stars, achievedStars);

  return stars;
}

export function updateStars(stars, achievedStars) {
  stars.classList.toggle(zeroClass, achievedStars === 0);
  for (let i = 0; i < maxStars; i++) {
    stars.children[i].textContent = achievedStars > i ? FULL_STAR : EMPTY_STAR;
  }
}

export function getStarsForGameField() {
  const stars = createStarComponent(maxStars);

  pubSubService.subscribe(PubSubEvent.STARS_CHANGED, (gainedStars) => {
    console.log("Star update", gainedStars);
    currentStars = currentStars + gainedStars;
    updateStars(stars, currentStars);
    const starClass = gainedStars > 0 ? "new-star" : "lost-star";
    stars.classList.toggle(starClass, true);
    setTimeout(() => stars.classList.toggle(starClass, false), 300);
  });

  pubSubService.subscribe(PubSubEvent.NEW_GAME, () => {
    currentStars = maxStars;
    updateStars(stars, currentStars);
  });

  return stars;
}

export function createGlobalStarsComponent() {
  if (!globalStarsElem) {
    globalStarsElem = createElement({
      cssClass: "global-stars",
    });
    setCurrentGlobalStars();
  }

  return globalStarsElem;
}

function getStarMap() {
  const starMap = getLocalStorageItem(LocalStorageKey.STAR_MAP);
  return starMap ? JSON.parse(starMap) : {};
}

export function updateStarMap() {
  const starMap = getStarMap();
  const currentStarValue = starMap[globals.x] ?? 0;
  if (currentStars > currentStarValue) {
    starMap[globals.x] = Math.min(currentStars, maxStars);
    setLocalStorageItem(LocalStorageKey.STAR_MAP, JSON.stringify(starMap));
    setCurrentGlobalStars();
    globalStarsElem.classList.toggle("new-star", true);
    setTimeout(() => globalStarsElem.classList.toggle("new-star", false), 1000);
  }
}

export function setCurrentGlobalStars() {
  const starMap = getStarMap();
  let tempStars = 0;
  for (let i = globals.minNum; i <= globals.maxNum; i++) {
    tempStars += starMap[i] ?? 0;
  }
  console.log("tempStars", tempStars, starMap);
  globalStars = tempStars;

  updateGlobalStarsElement();
}

function updateGlobalStarsElement() {
  const totalPossibleStars = (globals.maxNum - globals.minNum + 1) * maxStars;
  globalStarsElem.innerHTML = `${FULL_STAR} ${globalStars}/${totalPossibleStars}`;
}
