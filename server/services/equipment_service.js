const mariadb = require("../database/mapper.js");

// =======================
// 설비점검 페이지
// =======================

// 설비점검 목록(최근순, 최대 100)
const findInspectionList = async () => {
  return await mariadb.query("selectInspectionList");
};

// // 설비점검 검색(필터) and부분 // 추후에 주석풀것
// const findInspectionByFilter = async (q = {}) => {
//   const params = [
//     q.insp_code || null, q.insp_code || null,
//     q.eq_id || null, q.eq_id || null,
//     q.insp_type || null, q.insp_type || null,
//     q.date_from || null, q.date_from || null,
//     q.date_to || null, q.date_to || null,
//     q.next_from || null, q.next_from || null,
//     q.next_to || null, q.next_to || null,
//     Number(q.size) || 20,
//     Number(q.page) ? (Number(q.page) - 1) * (Number(q.size) || 20) : 0
//   ];
//   return await mariadb.query("selectInspectionListByFilter", params);
// };

// util 함수 추가
const norm = (v) => {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s.length > 0 ? s : null;
};

// 👉 기본은 OR 검색
// 👉 필요하면 AND 검색 코드 주석 해제하고 OR 주석처리하면 됨
// 설비점검 검색(필터)
const findInspectionByFilter = async (q = {}) => {
  const paramsOr = [
    norm(q.insp_code),
    norm(q.insp_code),
    norm(q.eq_id),
    norm(q.eq_id),
    norm(q.insp_type),
    norm(q.insp_type),
    norm(q.date_from),
    norm(q.date_from),
    norm(q.date_to),
    norm(q.date_to),
    norm(q.next_from),
    norm(q.next_from),
    norm(q.next_to),
    norm(q.next_to),
    Number(q.size) || 20,
    Number(q.page) ? (Number(q.page) - 1) * (Number(q.size) || 20) : 0,
  ];
  return await mariadb.query("selectInspectionListByFilterOr", paramsOr);
};

// 설비점검 DISTINCT (모달 페이징)
const findInspectionDistinct = async (field, page = 1, size = 5) => {
  let listSql = "",
    countSql = "";
  switch (field) {
    case "insp_code":
      listSql = "distinctInspCode";
      countSql = "countDistinctInspCode";
      break;
    case "eq_id":
      listSql = "distinctEqId";
      countSql = "countDistinctEqId";
      break;
    case "insp_type":
      listSql = "distinctInspType";
      countSql = "countDistinctInspType";
      break;
    case "insp_date":
      listSql = "distinctInspDate";
      countSql = "countDistinctInspDate";
      break;
    case "next_date":
      listSql = "distinctNextDate";
      countSql = "countDistinctNextDate";
      break;
    default:
      return { items: [], total: 0, page, size };
  }
  const total = (await mariadb.query(countSql))[0].total;
  const rows = await mariadb.query(listSql, [size, (page - 1) * size]);
  const items = rows.map((r) => Object.values(r)[0]);
  return { items, total, page, size };
};

// =======================
// 설비정보 등록/수정 페이지
// =======================

// 설비정보 등록/수정 DISTINCT
const getDistinct = async (field) => {
  let sql = "";
  switch (field) {
    case "equipment_id":
      sql = "distinctEquipmentCode";
      break;
    case "equipment_type":
      sql = "distinctEquipmentType";
      break;
    case "equipment_name":
      sql = "distinctEquipmentName";
      break;
    case "location":
      sql = "distinctLocation";
      break;
    case "status":
      sql = "distinctStatus";
      break;
    default:
      return [];
  }

  const rows = await mariadb.query(sql);
  // 🔥 rows = [{equipment_id:"EQ-001"}, ...] 이런 식이라서 값만 추출해야 함
  return rows.map((r) => Object.values(r)[0]);
};

// 설비정보 조건 검색
const searchEquipment = async (q = {}, page = 1, size = 10) => {
  const params = [
    q.equipment_id || null,
    q.equipment_id || null,
    q.equipment_type || null,
    q.equipment_type || null,
    q.equipment_name || null,
    q.equipment_name || null,
    q.location || null,
    q.location || null,
    q.status || null,
    q.status || null,
    size,
    (page - 1) * size,
  ];
  const items = await mariadb.query("searchEquipment", params);
  const total = (await mariadb.query("countEquipment", params.slice(0, -2)))[0]
    .total;
  return { items, total, page, size };
};

// 설비정보 등록 (undefined 방지 + 날짜 포맷)
const insertEquipment = async (eqInfo) => {
  const payload = {
    equipmentCode: (eqInfo.equipmentCode ?? "").trim(),
    equipmentType: (eqInfo.equipmentType ?? "").trim(),
    equipmentName: (eqInfo.equipmentName ?? "").trim(),
    manufacturer: (eqInfo.manufacturer ?? "").trim(),
    serialNo: (eqInfo.serialNo ?? "").trim(),
    // 첨부는 아직 파일 업로드 미적용이므로 null 저장
    safety_standard: eqInfo.safety_standard ?? null,
    operation_manual: eqInfo.operation_manual ?? null,
    purchaseDate: formatDate(eqInfo.purchaseDate),
    startDate: formatDate(eqInfo.startDate),
    location: (eqInfo.location ?? "").trim(),
    status: (eqInfo.status ?? "사용").trim(),
  };

  const params = convertToArray(payload, [
    "equipmentCode",
    "equipmentType",
    "equipmentName",
    "manufacturer",
    "serialNo",
    "safety_standard",
    "operation_manual",
    "purchaseDate",
    "startDate",
    "location",
    "status",
  ]);

  // 디버그: 파라미터 개수 확인 (완료되면 주석)
  console.log("[insertEquipment] params length =", params.length, params);

  return await mariadb.query("insertEquipment", params);
};

// 설비정보 수정
// 설비 수정
const updateEquipment = async (data) => {
  const params = convertToArray(data, [
    "equipmentName", // ← 프론트에서 보낸 key
    "manufacturer",
    "serialNo",
    "purchaseDate",
    "startDate",
    "equipmentType",
    "location",
    "status",
    "equipmentCode", // WHERE 조건
  ]);
  return await mariadb.query("updateEquipment", params);
};

// "설비정보 조회페이지"
/* ========== 설비정보 조회(info2) ========== */

// 5-1) 무필터 페이지(진입 10건)
const findEquipmentInfoPage = async (page = 1, size = 10) => {
  const items = await mariadb.query("selectEquipmentInfoPage", [
    size,
    (page - 1) * size,
  ]);
  const total = (await mariadb.query("countEquipmentInfoAll"))[0].total;
  return { items, total, page, size };
};

// 5-2) 조건검색 OR 기본 (status는 AND)
const searchEquipmentInfo2 = async (q = {}, page = 1, size = 10) => {
  const paramsSel = [
    // OR 그룹 (코드/유형/명/위치)
    q.equipment_id || null,
    q.equipment_id || null,
    q.equipment_type || null,
    q.equipment_type || null,
    q.equipment_name || null,
    q.equipment_name || null,
    q.location || null,
    q.location || null,
    q.status || null,
    q.status || null,
    size,
    (page - 1) * size,
  ];
  const paramsCnt = paramsSel.slice(0, -2); // LIMIT/OFFSET 뺀 나머지

  const items = await mariadb.query("selectEquipmentInfoSearchOr", paramsSel);
  const total = (
    await mariadb.query("countEquipmentInfoSearchOr", paramsCnt)
  )[0].total;

  /* AND 버전 사용하려면 아래로 교체(윗줄 주석 처리)
  const paramsSelA = [
    q.equipment_id || null, q.equipment_id || null,
    q.equipment_type || null, q.equipment_type || null,
    q.equipment_name || null, q.equipment_name || null,
    q.location || null, q.location || null,
    q.status || null, q.status || null,
    size, (page-1)*size
  ];
  const paramsCntA = paramsSelA.slice(0, -2);
  const items = await mariadb.query("selectEquipmentInfoSearchAnd", paramsSelA);
  const total = (await mariadb.query("countEquipmentInfoSearchAnd", paramsCntA))[0].total;
  */

  return { items, total, page, size };
};

// 5-3) DISTINCT (모달)
const findEquipmentInfoDistinct = async (field, page = 1, size = 5) => {
  let listSql = "",
    countSql = "";
  switch (field) {
    case "equipment_id":
      listSql = "distinctEqId2";
      countSql = "countDistinctEqId2";
      break;
    case "equipment_type":
      listSql = "distinctEqType2";
      countSql = "countDistinctEqType2";
      break;
    case "equipment_name":
      listSql = "distinctEqName2";
      countSql = "countDistinctEqName2";
      break;
    case "location":
      listSql = "distinctLoc2";
      countSql = "countDistinctLoc2";
      break;
    case "status":
      listSql = "distinctStatus2";
      countSql = "countDistinctStatus2";
      break;
    default:
      return { items: [], total: 0, page, size };
  }
  const total = (await mariadb.query(countSql))[0].total;
  const rows = await mariadb.query(listSql, [size, (page - 1) * size]);
  const items = rows.map((r) => Object.values(r)[0]);
  return { items, total, page, size };
};

// --- ADD: 단건 조회 (PK) 이거 설비정보 등록/수정에 설비코드부분---
const findOneEquipment = async (q = {}) => {
  const id = (q.equipment_id || "").trim();
  if (!id) return null;
  const rows = await mariadb.query("selectEquipmentOne", [id]);
  return rows[0] || null;
};

// [FIX] 설비정보 조건 검색 (note 컬럼 SELECT/COUNT에서 제거)
const searchEquipment2 = async (q = {}, page = 1, size = 10) => {
  const params = [
    q.equipment_id || null,
    q.equipment_id || null,
    q.equipment_type || null,
    q.equipment_type || null,
    q.equipment_name || null,
    q.equipment_name || null,
    q.location || null,
    q.location || null,
    q.status || null,
    q.status || null,
    size,
    (page - 1) * size,
  ];
  const items = await mariadb.query("searchEquipment", params);
  const total = (await mariadb.query("countEquipment", params.slice(0, -2)))[0]
    .total;
  return { items, total, page, size };
};

// ✅ 설비코드 자동 생성 (INSP001, INSP002, …)
const generateCode = async () => {
  const rows = await mariadb.query("genEquipmentCode"); // mapper_sql 키와 동일
  return rows?.[0]?.new_code; // 예: 'INSP001'
};

// --- /ADD ---

// =======================
// 공통 함수
// =======================
const formatDate = (val) => {
  if (!val) return null;
  if (typeof val === "string") return val.slice(0, 10);
  return val.toISOString().slice(0, 10);
};

const convertToArray = (obj, columns) => {
  return columns.map((col) => obj[col]);
};

// =======================
// Export
// =======================
module.exports = {
  findInspectionList,
  findInspectionByFilter,
  getDistinct,
  searchEquipment,
  insertEquipment,
  updateEquipment,
  findInspectionDistinct,
  findEquipmentInfoPage,
  searchEquipmentInfo2,
  findEquipmentInfoDistinct,
  findOneEquipment,
  searchEquipment2,
  generateCode,
};
