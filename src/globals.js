const MIN_NUM = 1201;
const MAX_NUM = 1300;

const defaultGlobals = {
  language: "en",
  minNum: MIN_NUM,
  maxNum: MAX_NUM,
  tries: 0,
  x: undefined,
  xProperties: undefined,
  checkForPrimes: false,
};

export const globals = {};
resetGlobals();

export function resetGlobals() {
  Object.assign(globals, defaultGlobals);
  globals.maxNum = Math.max(getNumFromParam("max", MAX_NUM), 9);
  globals.minNum = Math.max(
    Math.min(getNumFromParam("min", MIN_NUM), globals.maxNum),
    1,
  );
}

function getNumFromParam(param, fallback) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const valueParam = urlParams.get(param);
  let num = valueParam ? Number(valueParam) : fallback;
  num = isNaN(num) ? fallback : num;

  return num;
}
