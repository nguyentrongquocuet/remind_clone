const isOpen = (c) => c === "[" || c === "{";
const isClose = (c) => c === "]" || c === "}";
const isComma = (c) => c === ",";
const isQuote = (c) => c === '"';
const pretty = (str, space = 2) => {
  const spaceUnit = " ".repeat(space);
  let out = "";
  let openBrackets = 0;
  let isInQuote = false;
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (isQuote(c)) isInQuote = !isInQuote;
    if (isOpen(c)) {
      openBrackets += 1;
      out = out.concat(c);
      if (!isClose(str[i + 1]))
        out = out.concat(`\n` + spaceUnit.repeat(openBrackets));
      continue;
    }
    if (isComma(c) && !isInQuote) {
      out = out.concat(c + `\n` + spaceUnit.repeat(openBrackets));
      continue;
    }
    if (isClose(c)) {
      openBrackets -= 1;
      if (!isOpen(str[i - 1]))
        out = out.concat(`\n` + spaceUnit.repeat(openBrackets) + c);
      else out = out.concat(c);
      continue;
    }
    out = out.concat(c);
  }
  return !isInQuote && openBrackets == 0
    ? out
    : new Error("INVALID JSON FORMAT");
};

module.exports = pretty;
