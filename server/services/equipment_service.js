const mariadb = require("../database/mapper.js");
// const sqlList = require("../database/sqlList.js");
/* ---------- 공통 유틸 ---------- */
const norm = (v) => {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s.length > 0 ? s : null;
};
const formatDate = (val) => {
  if (!val) return null;
  if (typeof val === "string") return val.slice(0, 10);
  return val.toISOString().slice(0, 10);
};
const fmtDate = formatDate;

/* ---------- 설비점검 페이지 (기존) ---------- */
const findInspectionList = async () => {
  return await mariadb.query("selectInspectionList");
};

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

/* ---------- ★ 설비점검 단건/등록/수정 + 디테일 ---------- */

const findInspectionOne = async (inspId) => {
  if (!inspId) return null;
  const rows = await mariadb.query("selectInspectionOne", [inspId]);
  if (!rows || rows.length === 0) return null;

  const master = rows[0];
  const details = await mariadb.query("selectInspectionDetails", [inspId]);
  return {
    ...master,
    inspectionDate: fmtDate(master.inspectionDate),
    nextDate: fmtDate(master.nextDate),
    details: (details || []).map((d) => ({
      item: d.item ?? "",
      result: d.result ?? "",
      action: d.action ?? "",
    })),
  };
};

const registerInspection = async (data = {}) => {
  if (!(data.equipmentCode || "").trim()) throw new Error("설비코드 필수");
  if (!(data.inspectionType || "").trim()) throw new Error("점검유형 필수");
  if (!data.inspectionDate) throw new Error("점검일 필수");
  if (!(data.manager || "").trim()) throw new Error("점검책임자 필수");

  const inspectionCode =
    (data.inspectionCode || "").trim() && data.inspectionCode !== "자동생성"
      ? data.inspectionCode.trim()
      : genInspectionCode();

  await mariadb.query("insertInspection", [
    inspectionCode,
    data.equipmentCode.trim(),
    data.inspectionType.trim(),
    data.inspectionCycle || null,
    fmtDate(data.inspectionDate),
    fmtDate(data.nextDate),
    data.manager.trim(),
    data.note || null,
    data.lastResult || null,
  ]);

  if (Array.isArray(data.details)) {
    for (const d of data.details) {
      await mariadb.query("insertInspectionDetail", [
        inspectionCode,
        d?.item || "",
        d?.result || "",
        d?.action || "",
      ]);
    }
  }
  return { inspectionCode };
};

const updateInspection = async (data = {}) => {
  if (!String(data.inspectionCode || "").trim())
    throw new Error("점검코드 누락");
  if (!String(data.equipmentCode || "").trim())
    throw new Error("설비코드 필수");
  if (!String(data.inspectionType || "").trim())
    throw new Error("점검유형 필수");
  if (!data.inspectionDate) throw new Error("점검일 필수");
  if (!String(data.manager || "").trim()) throw new Error("점검책임자 필수");

  await mariadb.query("updateInspection", [
    String(data.equipmentCode || "").trim(),
    String(data.inspectionType || "").trim(),
    data.inspectionCycle || null,
    fmtDate(data.inspectionDate),
    fmtDate(data.nextDate),
    String(data.manager || "").trim(),
    data.note || null,
    String(data.inspectionCode || "").trim(),
  ]);

  await mariadb.query("deleteInspectionDetails", [
    String(data.inspectionCode || "").trim(),
  ]);

  if (Array.isArray(data.details)) {
    for (const d of data.details) {
      await mariadb.query("insertInspectionDetail", [
        String(data.inspectionCode || "").trim(),
        String(d?.item || "").trim(),
        String(d?.result || "").trim(),
        String(d?.action || "").trim(),
      ]);
    }
  }

  return { success: true };
};

/* ---------- 설비정보 등록/수정 페이지 (기존) ---------- */
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
  return rows.map((r) => Object.values(r)[0]);
};

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

// 설비 등록 설비코드 생성
const insertEquipment = async (equipmentInfo) => {
  let conn;
  try {
    conn = await mariadb.getConnection();
    await conn.beginTransaction();

    // 1. 마지막 equipment_id 조회 (mapper alias 사용)
    const rows = await conn.query("selectMaxEqId"); // <-- 여기에 들어감
    const maxNum = rows?.[0]?.max_num || 0;

    // 2. 새로운 equipment_id 생성
    let newEqId;
    if (!maxId) {
      newEqId = "EQ001";
    } else {
      const lastNum = parseInt(maxId.replace(/\D/g, ""), 10);
      const newEqId = `EQ${String(maxNum + 1).padStart(3, "0")}`;
    }

    // 3. 날짜 포맷팅 함수
    const formatDateToYMD = (isoDate) => {
      if (!isoDate) return null;
      const d = new Date(isoDate);
      if (isNaN(d)) return null;
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const purchaseDate = formatDateToYMD(equipmentInfo.purchaseDate);
    const startDate = formatDateToYMD(equipmentInfo.startDate);

    // 4. INSERT 실행
    const insertData = [
      newEqId, // equipment_id
      equipmentInfo.equipmentType, // equipment_type
      equipmentInfo.equipmentName, // equipment_name
      equipmentInfo.manufacturer, // manufacturer
      equipmentInfo.serialNo, // serial_no
      equipmentInfo.safetyStandard || null, // safety_standard
      equipmentInfo.operationManual || null, // operation_manual
      purchaseDate, // purchase_date
      startDate, // start_date
      equipmentInfo.location, // location
      equipmentInfo.status, // status
    ];

    await conn.query("insertEquipment", insertData);

    // 5. 커밋
    await conn.commit();

    return { success: true, newEqId };
  } catch (err) {
    if (conn) await conn.rollback();
    console.error("insertEquipment Error:", err);
    return { success: false, error: err.message };
  } finally {
    if (conn) conn.release();
  }
};

/* ---------- 설비정보 조회페이지 (기존) ---------- */
const findEquipmentInfoPage = async (page = 1, size = 10) => {
  const items = await mariadb.query("selectEquipmentInfoPage", [
    size,
    (page - 1) * size,
  ]);
  const total = (await mariadb.query("countEquipmentInfoAll"))[0].total;
  return { items, total, page, size };
};

const searchEquipmentInfo2 = async (q = {}, page = 1, size = 10) => {
  const paramsSel = [
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
  const paramsCnt = paramsSel.slice(0, -2);
  const items = await mariadb.query("selectEquipmentInfoSearchOr", paramsSel);
  const total = (
    await mariadb.query("countEquipmentInfoSearchOr", paramsCnt)
  )[0].total;
  return { items, total, page, size };
};

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

const findOneEquipment = async (q = {}) => {
  const id = (q.equipment_id || "").trim();
  if (!id) return null;
  const rows = await mariadb.query("selectEquipmentOne", [id]);
  return rows[0] || null;
};

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

// 설비정보 수정
const updateEquipment = async (data = {}) => {
  const params = [
    (data.equipmentName ?? "").trim(),
    (data.manufacturer ?? "").trim(),
    (data.serialNo ?? "").trim(),
    formatDate(data.purchaseDate),
    formatDate(data.startDate),
    (data.equipmentType ?? "").trim(),
    (data.location ?? "").trim(),
    (data.status ?? "").trim(),
    (data.equipmentCode ?? "").trim(), // PK
  ];
  return await mariadb.query("updateEquipment", params);
};

// 설비정보 등록/수정페이지 설비코드 자동생성

// 비가동 페이지

/* ===== 비가동 목록 조회 ===== */
async function getDowntimeList({ eq_id, offset, size }) {
  // 데이터 목록
  const rows = await mariadb.query("selectDowntimeList", [
    eq_id,
    eq_id,
    offset,
    size,
  ]);

  // 전체 건수
  const totalRows = await mariadb.query("countDowntimeList", [eq_id, eq_id]);

  return { rows, total: totalRows[0].cnt };
}

// 비가동

// 설비코드모달 목록 조회
// 설비코드 목록
async function getCodeList(page, size) {
  const offset = (page - 1) * size;
  const rows = await mariadb.query("selectCodeList", [offset, size]);
  const total = (await mariadb.query("countEquipment2"))[0].cnt;
  return { items: rows, total, page, size };
}

// 비가동 등록
async function registDowntime(form) {
  const result = await mariadb.query("insertDowntime", [
    form.equipment_id,
    form.repair_id,
    form.inspection_id,
    form.fault_type,
    form.fault_dtime,
    form.restart_dtime,
    form.note,
    form.status,
  ]);
  return { id: result.insertId };
}

// 비가동 수정
async function updateDowntime(form) {
  await mariadb.query("updateDowntime", [
    form.equipment_id,
    form.repair_id,
    form.inspection_id,
    form.fault_type,
    form.fault_dtime,
    form.restart_dtime,
    form.note,
    form.status,
    form.id,
  ]);
  return { id: form.id };
}

module.exports = {
  /* 설비점검(기존) */
  findInspectionList,
  findInspectionByFilter,
  findInspectionDistinct,

  /* ★ 설비점검 단건/등록/수정 */
  findInspectionOne,
  registerInspection,
  updateInspection,

  /* 설비정보(기존) */
  getDistinct,
  searchEquipment,
  insertEquipment,
  updateEquipment,
  findEquipmentInfoPage,
  searchEquipmentInfo2,
  findEquipmentInfoDistinct,
  findOneEquipment,
  searchEquipment2,

  //비가동
  getDowntimeList,
  updateDowntime, // 비가동 수정
  getCodeList,
  registDowntime,
};
