const normalizeName = (str) => {
  return str
    .split(/\s+/)
    .map((part) => part.toLowerCase().replace(/^./, part[0].toUpperCase()))
    .join(" ");
};

module.exports = normalizeName;
