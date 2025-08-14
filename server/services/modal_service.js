const mariadb = require("../database/mapper.js");

// 사원 조회
const getEmployeeList = async () => {
  let list = await mariadb.query("selectWarehouse");
  return list;
};

module.exports = {};
