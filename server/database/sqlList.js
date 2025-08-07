//각 테이블별로 실행할 쿼리문을 분리,쿼리추가하게되면 여기다가 작성
const boards = require("./sqls/boards.js");
//펼침 연산자
module.exports = {
  ...boards,
};
