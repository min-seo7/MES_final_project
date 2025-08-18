const mariadb = require("../database/mapper.js");

// 전체 검사항목 목록 조회 (필터링 기능 포함)
const findAllItemsWithFilter = async (productType, inspPurpose) => {
  const params = [
    productType || null,
    productType || null,
    productType || null,
    inspPurpose || null,
    inspPurpose || null,
    inspPurpose || null,
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

// tbl_purchase_detail 조회
const findPD = async () => {
  let list = await mariadb.query("selectPD");
  return list;
};

// 검사항목 등록
const insertItem = async (ItemInfo) => {
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

// 자재검사등록 (INSERT + UPDATE)
const insertInsp = async (inspInfo) => {
  // 발주아이디 확보
  const purch_id = inspInfo.purch_id || inspInfo.발주아이디;
  if (!purch_id) throw new Error("발주번호가 없습니다.");

  const insertData = [
    inspInfo.material_code,
    inspInfo.inspector_id,
    inspInfo.result,
    inspInfo.remark,
    purch_id,
    inspInfo.insertquantity,
    inspInfo.qty,
    inspInfo.inspStatus,
  ];

  try {
    // 1) INSERT 실행
    const result = await mariadb.query("insertInsp", insertData);

    // 2) UPDATE tbl_purchase_detail의 inspStatus를 '완료'로
    const updateResult = await mariadb.query("defUpdate", [purch_id]);
    console.log("업데이트:", updateResult);

    return { insertId: result?.insertId || null, raw: result };
  } catch (error) {
    console.error("검사 등록 실패:", error);
    throw error;
  }
};

// 객체를 배열로 변환하는 메서드
function convertToArray(obj, columns) {
  return columns.map((col) => obj[col]);
}

module.exports = {
  findAllItemsWithFilter,
  insertItem,
  findInspWait,
  // updateInspectionResult,
  findInspFin,
  findPD,
  insertInsp,
};
