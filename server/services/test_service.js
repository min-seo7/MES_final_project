// services/test_service.js

const mariadb = require("../database/mapper.js");
const { getConnection, sqlList } = require("../database/mapper.js");

// 전체 검사항목 목록 조회 (필터링 기능 포함)
const findAllItemsWithFilter = async (productType, inspPurpose) => {
  const params = [
    productType || null,
    productType || null,
    inspPurpose || null,
    inspPurpose || null,
  ];

  let list = await mariadb.query("selectItemdetail", params);
  return list || [];
};

// 자재입고검사대기목록
const findInspWait = async () => {
  let list = await mariadb.query("selectInspecWaitList");
  return list || [];
};

// 제품검사대기목록
const findpdInspWait = async () => {
  let list = await mariadb.query("selectpdInspecWaitList");
  return list || [];
};

// 자재입고검사완료목록
const findInspFin = async (purchId, materialCode) => {
  // purchId와 materialCode가 null 또는 undefined일 경우 SQL 쿼리가 작동하도록
  // 각 변수를 두 번씩 배열에 넣어줍니다.
  const params = [
    purchId || null,
    purchId || null,
    materialCode || null,
    materialCode || null,
  ];
  let list = await mariadb.query("selectInspecFinList", params);
  return list || [];
};

// 제품 품질 검사 완료 목록 조회
const findPrdTestFin = async (perfCode, prdCode) => {
  // inspNum 파라미터 제거
  const params = [
    perfCode || null,
    perfCode || null,
    prdCode || null,
    prdCode || null,
  ];
  let list = await mariadb.query("selectPrdTestFinList", params);
  return list || [];
};

// 제품 품질 검사 상세 내역 조회
const findPrdTestDetail = async (pfCode) => {
  let list = await mariadb.query("selectPrdTestDetail", [pfCode]);
  return list || [];
};

// tbl_purchase_detail 조회
const findPD = async () => {
  let list = await mariadb.query("selectPD");
  return list || [];
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

// 자재검사등록 (INSERT + UPDATE) - 트랜잭션 적용
const insertInsp = async (inspInfo) => {
  let conn; // 연결 객체 선언 // 발주아이디 확보

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
    // 1. getConnection 함수를 사용하여 풀에서 연결을 가져옵니다.
    conn = await getConnection(); // 2. 트랜잭션 시작
    await conn.beginTransaction(); // 3. INSERT 실행 (conn.query 사용)

    const result = await conn.query(sqlList.insertInsp, insertData); // 4. UPDATE 실행 (conn.query 사용)

    const updateResult = await conn.query(sqlList.defUpdate, [purch_id]); // 5. 모든 작업이 성공하면 트랜잭션 커밋

    await conn.commit();

    console.log("업데이트:", updateResult);
    return { insertId: result?.insertId || null, raw: result };
  } catch (error) {
    // 6. 실패 시 롤백
    if (conn) await conn.rollback();
    console.error("검사 등록 실패:", error);
    throw error;
  } finally {
    // 7. 사용이 끝난 연결을 풀로 반환
    if (conn) conn.release();
  }
};

// 제품 품질 검사 등록 - 트랜잭션 적용
const insertPrdInsp = async (inspInfo) => {
  // 실적코드(pf_code)가 있는지 확인
  if (!inspInfo.pf_code) {
    throw new Error("실적코드(pf_code)가 누락되었습니다.");
  }
  let conn;
  try {
    conn = await getConnection();
    await conn.beginTransaction(); // 1. product_inspection 테이블에 최종 결과 INSERT

    const inspData = [
      inspInfo.pf_code,
      inspInfo.product_id,
      inspInfo.prd_name,
      inspInfo.result,
      inspInfo.qty,
      inspInfo.remark,
      inspInfo.inspector_id,
    ];
    await conn.query(sqlList.insertPrdInsp, inspData); // 2. product_inspection_detail 테이블에 상세 항목 INSERT

    for (const item of inspInfo.측정값리스트) {
      const detailData = [
        inspInfo.pf_code,
        item.검사항목,
        item.허용범위,
        item.측정값,
        item.판정,
      ];
      await conn.query(sqlList.insertPrdInspDetail, detailData);
    } // 3. Performance 테이블 상태 업데이트

    await conn.query(sqlList.updatePrdStatus, [inspInfo.pf_code]);

    await conn.commit();
    return { success: true };
  } catch (error) {
    if (conn) await conn.rollback();
    console.error("제품 검사 등록 실패:", error);
    throw error;
  } finally {
    if (conn) conn.release();
  }
};

const deleteTestItem = async (testitem_code) => {
  if (!testitem_code) throw new Error("testitem_code가 필요합니다.");
  try {
    const result = await mariadb.query("deleteTestItem", [testitem_code]);
    return result;
  } catch (err) {
    console.error("삭제 실패:", err);
    throw err;
  }
};

// 객체를 배열로 변환하는 메서드
function convertToArray(obj, columns) {
  return columns.map((col) => obj[col]);
}

const getProductTypes = async () =>
  (await mariadb.query("getProductTypes")) || [];
const getInspPurposes = async () =>
  (await mariadb.query("getInspPurposes")) || [];
const getInspItems = async () => (await mariadb.query("getInspItems")) || [];
const getOperators = async () => (await mariadb.query("getOperators")) || [];
const getUnits = async () => (await mariadb.query("getUnits")) || [];

// 제품유형별검사항목조회
const findItemsByProductType = async (info) => {
  console.log(info);
  const list = await mariadb.query("selectTestItemByProductType", info);
  return list || [];
};

module.exports = {
  findAllItemsWithFilter,
  insertItem,
  findInspWait,
  findInspFin,
  findPD,
  insertInsp,
  deleteTestItem,
  getProductTypes,
  getInspPurposes,
  getInspItems,
  getOperators,
  getUnits,
  findpdInspWait,
  findItemsByProductType,
  insertPrdInsp,
  findPrdTestFin,
  findPrdTestDetail,
};
