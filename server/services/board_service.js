//정형화x 서비스 = 기능 로직어떤거할지는 요구사항에 따라
const mariadb = require("../database/mapper.js");
//실제로 제공하는 기능 : 요구사항에 따라 달라짐
//DB접속필요

//전체조회,조건x형태로 진행
const findAll = async () => {
  let list = await mariadb.query("selectBoardList");
  return list;
};
//화면에서 받는 건 객체
//마리아 db 실행결과 객체로 줌
const addNew = async (boardInfo) => {
  // boardInfo : {"title":'',"writer":'',"content":''}
  let insertData = convertToArray(boardInfo, ["title", "writer", "content"]);
  let resInfo = await mariadb.query("boardInsert", insertData);
  if (resInfo.insertId > 0) {
    return {
      result: true,
      no: resInfo.insertId,
    };
  } else {
    return {
      result: false,
    };
  }
};
function convertToArray(obj, columns) {
  let result = [];
  for (let column of columns) {
    result.push(obj[column]);
  }
  return result;
}

//해당파일불러올때 import x require로 불러들이고 있기에
module.exports = {
  findAll,
  addNew,
};
