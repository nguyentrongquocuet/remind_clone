export function saveToLocalStorage(obj) {
  for (const entry of Object.entries(obj)) {
    localStorage.setItem(entry[0], JSON.stringify(entry[1]));
  }
}
export function deleteFromLocalStorage(obj) {
  for (const entry of Object.entries(obj)) {
    localStorage.removeItem(entry[0]);
  }
}
export function getFromLocalStorage(...key) {
  if (key.length <= 0) return {};
  let out = {};
  for (const k of key) {
    out[k] = JSON.parse(localStorage.getItem(k));
  }
  return out;
}
