//DB의 기능을 담당 - 업데이트 같이 치면 다른코드 건들 가능성
// 주의 마리아db는 req 부분이 2가지
const mariadb = require("mariadb");
const sqlList = require("./sqlList.js");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "sqls/.env") });

//몇개의 커넥션을 만들어두고 진행
const connectionPool = mariadb.createPool({
  //DB에 접속하는 정보,네이버 공인 아이디 변경
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: process.env.DB_LIMIT,
  connectTimeout: 5000,
  //추가옵션
  insertIdAsNumber: true, //자동으로 넘버타입으로 넘어오지x
  bigIntAsNumber: true, //카운터함수로 실행하면 bigInt데이터타입이라 자바스크립트의 자동매핑되는 타입x 넘버로 자동 변환
  permitSetMultiParamEntries: true, //객체기반 쿼리를 작성할때 자동매핑되는 경우, set ? =>단위x 객체 기준으로 컬럼과 값 자동 매핑하는데 정확히하려면 옵션을 true로 해줘야한다,아닐경우 ? 매핑되지 않는다.
  logger: {
    query: console.log,
    error: console.log,
  },
});
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_LIMIT:", process.env.DB_LIMIT);
//단건실행이라 오토커밋이라 롤백이랑 커밋등이 필요x 콜백x 프로미스 방식
const query = async (alias, values) => {
  let conn = null;
  try {
    conn = await connectionPool.getConnection();
    let exeuteSql = sqlList[alias];
    let result = await conn.query(exeuteSql, values);
    return result;
  } catch (e) {
    console.log(e);
  } finally {
    conn.release();
  }
};
const getConnection = async () => {
  return await connectionPool.getConnection();
};
module.exports = {
  query,
  getConnection,
};
