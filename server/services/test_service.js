const mariadb = require("../database/mapper.js");

// 전체 검사항목 목록 조회 (필터링 기능 포함)
const findAllItemsWithFilter = async (productType, inspPurpose) => {
  // ⭐ 6개의 파라미터를 정확하게 구성
  // SQL 쿼리의 WHERE 조건에 맞게 productType과 inspPurpose를 각각 3번씩 전달
  const params = [
    productType || null, // 첫 번째 ?
    productType || null, // 두 번째 ?
    productType || null, // 세 번째 ?
    inspPurpose || null, // 네 번째 ?
    inspPurpose || null, // 다섯 번째 ?
    inspPurpose || null, // 여섯 번째 ?
  ];

  let list = await mariadb.query("selectItemdetail", params);
  return list;
};

// 자재입고검사대기목록
const findInspWait = async () => {
  let list = await mariadb.query("selectInspecWaitList");
  return list;
};

// 자재입고검사완료목록
const findInspFin = async () => {
  let list = await mariadb.query("selectInspecFinList");
  return list;
};

// 검사항목 등록
const insertItem = async (ItemInfo) => {
  // 등록에 필요한 모든 필드를 배열로 변환하도록 수정
  const insertData = convertToArray(ItemInfo, [
    "productType",
    "inspItem",
    "unit",
    "fixedStandard",
    "writer",
    "inspPurpose",
    "purposeid",
  ]);

  try {
    const result = await mariadb.query("insertItem", insertData);
    return result;
  } catch (error) {
    console.error("항목등록실패", error);
    throw error;
  }
};

//자재검수결과 업데이트
const updateInspectionResult = async (자재검수번호, 최종판정) => {
  try {
    const result = await mariadb.query("defUpdate", [최종판정, 자재검수번호]);
    console.log("DB 업데이트 결과:", result);
    return result;
  } catch (err) {
    console.error("material_Inspection 업데이트 실패:", err);
    throw err;
  }
};

// 객체를 배열로 변환하는 메서드 (기존 코드 그대로 사용)
function convertToArray(obj, columns) {
  return columns.map((col) => obj[col]);
}

module.exports = {
  findAllItemsWithFilter,
  insertItem,
  findInspWait,
  updateInspectionResult,
  findInspFin,
};
