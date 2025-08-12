const mariadb = require("../database/mapper.js");

const toNull = (v) => (v === "" || v === undefined ? null : v);

const findInspectionList = async (q = {}) => {
  const size = Number(q.size) || 20;
  const page = Number(q.page) || 1;
  const offset = (page - 1) * size;

  // SQL의 ? 순서와 일치
  const params = [
    toNull(q.eq_id),
    toNull(q.eq_id), // 장비코드(하이픈 혼재는 SQL에서 REPLACE로 처리)
    toNull(q.insp_type),
    toNull(q.insp_type),
    toNull(q.result),
    toNull(q.result),
    toNull(q.inspector),
    toNull(q.inspector),
    toNull(q.date_from),
    toNull(q.date_from),
    toNull(q.date_to),
    toNull(q.date_to),
    size,
    offset,
  ];

  const list = await mariadb.query("selectInspectionListByFilter", params);
  return list; // SQL에서 AS로 camelCase 내려주게 할 거라 프론트 매핑 불필요
};

const insertInspection = async (body) => {
  const params = [
    body.equipmentId,
    body.inspectionType,
    body.inspectionDate,
    body.scheduledDate,
    body.inspectionCycle,
    body.inspector,
    body.result,
    body.requestedBy,
    body.note,
  ];
  return await mariadb.query("insertInspection", params);
};

module.exports = { findInspectionList, insertInspection };
