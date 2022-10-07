const LOCAL_STORAGE_PREFIX = "findX";

export const LocalStorageKey = {
  HIGH_SCORE: "highScore",
};

export function setLocalStorageItem(key, value) {
  if (value === false) {
    removeLocalStorageItem(key);
    return;
  }

  localStorage.setItem(LOCAL_STORAGE_PREFIX + "." + key, value);
}

export function getLocalStorageItem(key) {
  return localStorage.getItem(LOCAL_STORAGE_PREFIX + "." + key);
}

export function removeLocalStorageItem(key) {
  localStorage.removeItem(LOCAL_STORAGE_PREFIX + "." + key);
}

export function getArrayFromStorage(key) {
  const item = getLocalStorageItem(key);
  if (!item) {
    return [];
  }

  return item.split(",");
}
