export const MIN_NUM = 1;
export const MAX_NUM = 99999;

const defaultGlobals = {
  minNum: MIN_NUM,
  maxNum: MAX_NUM,
  x: undefined,
};

export const globals = {};
resetGlobals();

export function resetGlobals() {
  Object.assign(globals, defaultGlobals);
}
