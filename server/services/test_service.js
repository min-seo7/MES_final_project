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
    "createdBy",
    "purpose_name",
  ]);

  const result = await mariadb.query("insertItem", insertData);
  return result;
};
// 필터링 기능이 추가된 새로운 함수
const findAllItemsWithFilter = async (productType, inspPurpose) => {
  // ⭐ 6개의 파라미터를 담은 배열을 정확하게 구성해야 합니다.
  const params = [
    productType || null,
    productType || null,
    productType || null,
    inspPurpose || null,
    inspPurpose || null,
    inspPurpose || null,
  ];

  // ⭐ 이 params 배열이 mapper.js로 전달되어야 합니다.
  let list = await mariadb.query("selectItemdetail", params);

  return list;
};
// 객체를 배열로 변환하는 매서드
function convertToArray(obj, columns) {
  return columns.map((col) => obj[col]);
}
module.exports = {
  findAllItem,
  insertItem,
  findAllItemsWithFilter,
};
