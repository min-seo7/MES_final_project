const mariadb = require("../database/mapper.js");

// 전체 검사항목 목록 조회
const findAllItem = async () => {
  let list = await mariadb.query("selectItem");
  return list;
};

// 검사항목 등록
const insertItem = async (ItemInfo) => {
  //
  const insertData = convertToArray(ItemInfo, [
    "testitem_code",
    "product_type",
    "item_name",
    "unit",
    "fixedStandard",
    "createdBy",
    "createdAt",
    "purpose_name",
    "purpose_id",
  ]);

  const result = await mariadb.query("insertItem", insertData);
  return result;
};
// 객체를 배열로 변환하는 매서드
function convertToArray(obj, columns) {
  return columns.map((col) => obj[col]);
}
module.exports = {
  findAllItem,
  insertItem,
};
