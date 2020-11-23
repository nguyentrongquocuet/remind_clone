const localTime = (str) => {
  const date = new Date(str);
  return date.toLocaleString();
};
export default localTime;
