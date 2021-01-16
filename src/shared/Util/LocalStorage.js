export function saveToLocalStorage(obj) {
  for (const entry of Object.entries(obj)) {
    localStorage.setItem(entry[0], JSON.stringify(entry[1]));
  }
}
export function deleteFromLocalStorage(...keys) {
  for (const key of keys) {
    localStorage.removeItem(key);
  }
}
export function getFromLocalStorage(...key) {
  if (key.length <= 0) return {};
  let out = {};
  for (const k of key) {
    out[k] = JSON.parse(localStorage.getItem(k));
  }
  console.log(out);
  return out;
}
