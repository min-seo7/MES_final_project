//각 테이블별로 실행할 쿼리문을 분리,쿼리추가하게되면 여기다가 작성
const informations = require("./sqls/information_sql.js");
const sales = require("./sqls/sales_sql.js");
const stocks = require("./sqls/stock_sql.js");
const productions = require("./sqls/production_sql.js");
const equipments = require("./sqls/equipment_sql.js");
const tests = require("./sqls/test_sql.js");
const modals = require("./sqls/modal_sql.js");
//펼침 연산자
module.exports = {
  ...informations,
  ...sales,
  ...stocks,
  ...productions,
  ...equipments,
  ...tests,
  ...modals,
};
