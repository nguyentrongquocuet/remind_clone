const localTime = (str) => {
  const date = new Date(str);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toLocaleString();
};
export default localTime;
