const MIN_NUM = 1;
const MAX_NUM = 9999;

const defaultGlobals = {
  language: "de",
  minNum: MIN_NUM,
  maxNum: MAX_NUM,
  tries: 0,
  x: undefined,
  xProperties: undefined,
};

export const globals = {};
resetGlobals();

export function resetGlobals() {
  Object.assign(globals, defaultGlobals);
  globals.maxNum = getMaxNum();
}

function getMaxNum() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const maxValueParam = urlParams.get("max");
  let maxNum = maxValueParam ? Number(maxValueParam) : MAX_NUM;
  maxNum = isNaN(maxNum) ? MAX_NUM : maxNum;

  return maxNum;
}
