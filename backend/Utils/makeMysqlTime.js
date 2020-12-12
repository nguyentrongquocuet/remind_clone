const convertToMysqlTime = (time) => {
  const mysqlTime = new Date(time).toISOString().replace(/T|\..+$/g, " ");
  return mysqlTime;
};

module.exports = convertToMysqlTime;
