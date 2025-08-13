const mariadb = require("../database/mapper.js");

const toArray = (obj, cols) => cols.map((c) => obj[c]);

// 목록(최근순, 최대 100)
const findInspectionList = async () => {
  const list = await mariadb.query("selectInspectionList");
  return list; // SQL에서 AS로 UI 키 제공
};

// 검색(필터)
const findInspectionByFilter = async (q = {}) => {
  const params = [
    q.eq_id || null,
    q.eq_id || null, // 하이픈 혼재는 SQL에서 REPLACE로 처리
    q.insp_type || null,
    q.insp_type || null,
    q.result || null,
    q.result || null,
    q.inspector || null,
    q.inspector || null,
    q.date_from || null,
    q.date_from || null,
    q.date_to || null,
    q.date_to || null,
    q.next_from || null, // 📌 추가
    q.next_from || null,
    q.next_to || null, // 📌 추가
    q.next_to || null,
    Number(q.size) || 20,
    Number(q.page) ? (Number(q.page) - 1) * (Number(q.size) || 20) : 0,
  ];
  const list = await mariadb.query("selectInspectionListByFilter", params);
  return list;
};

// 등록
const insertInspection = async (body) => {
  const insertData = toArray(body, [
    "equipmentId",
    "inspectionType",
    "inspectionDate",
    "scheduledDate",
    "inspectionCycle",
    "inspector",
    "result",
    "requestedBy",
    "note",
  ]);
  const result = await mariadb.query("insertInspection", insertData);
  return result;
};

// 설비정보 등록/수정

function paging(p, s) {
  const page = Math.max(1, Number(p || 1));
  const size = Math.min(200, Math.max(1, Number(s || 20)));
  return { page, size, offset: (page - 1) * size };
}

async function findEquipmentList(q) {
  const { page, size, offset } = paging(q.page, q.size);
  const params = {
    eq_id: q.eq_id || null,
    eq_type: q.eq_type || null,
    eq_name: q.eq_name || null,
    loc: q.loc || null,
    status: q.status || null,
    offset,
    size,
  };
  const items = await db.query("selectEquipmentList", params);
  const [{ total }] = await db.query("countEquipmentList", params);
  return { items, total, page, size };
}

async function findEquipmentById(eq_id) {
  const [row] = await db.query("selectEquipmentById", { eq_id });
  return row || null;
}

async function generateEquipmentCode() {
  const [{ next_code }] = await db.query("generateEquipmentCode", {});
  return next_code;
}

async function insertEquipment(body) {
  const eq_id = body.eq_id || (await generateEquipmentCode());
  await db.query("insertEquipment", {
    eq_id,
    eq_name: body.eq_name,
    manufacturer: body.manufacturer || null,
    serial_no: body.serial_no || null,
    purchase_date: body.purchase_date || null, // 'YYYY-MM-DD' 또는 null
    start_date: body.start_date || null,
    eq_type: body.eq_type || null,
    loc: body.loc || null,
    status: body.status || "사용",
    note: body.note || null,
  });
  return await findEquipmentById(eq_id);
}

async function updateEquipment(eq_id, body) {
  await db.query("updateEquipment", {
    eq_id,
    eq_name: body.eq_name,
    manufacturer: body.manufacturer || null,
    serial_no: body.serial_no || null,
    purchase_date: body.purchase_date || null,
    start_date: body.start_date || null,
    eq_type: body.eq_type || null,
    loc: body.loc || null,
    status: body.status || "사용",
    note: body.note || null,
  });
  return await findEquipmentById(eq_id);
}

module.exports = {
  findInspectionList,
  findInspectionByFilter,
  insertInspection,
  generateEquipmentCode,
  updateEquipment,
};
