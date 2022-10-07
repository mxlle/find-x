export const MIN_NUM = 1;
export const MAX_NUM = 9999;

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
}
