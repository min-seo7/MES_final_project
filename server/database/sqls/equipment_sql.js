/* =========================
   equipment SQL MAPPER
   ========================= */

/* ---------- 설비점검(Inspection) 목록/검색/Distinct (기존) ---------- */
const selectInspectionList = `
SELECT
  inspection_id      AS inspCode,
  equipment_id       AS eqId,
  inspection_type    AS inspType,
  inspection_date    AS inspDate,
  scheduled_date     AS nextDate,
  inspection_cycle   AS cycle,
  result             AS lastResult,
  inspector          AS manager,
  note               AS note
FROM equipment_inspection
ORDER BY inspection_date DESC
LIMIT 100
`;

const selectInspectionListByFilter = `
SELECT
  inspection_id      AS inspCode,
  equipment_id       AS eqId,
  inspection_type    AS inspType,
  inspection_date    AS inspDate,
  scheduled_date     AS nextDate,
  inspection_cycle   AS cycle,
  result             AS lastResult,
  inspector          AS manager,
  note               AS note
FROM equipment_inspection
WHERE (? IS NULL OR inspection_id = ?)
  AND (? IS NULL OR equipment_id = ?)
  AND (? IS NULL OR inspection_type = ?)
  AND (? IS NULL OR inspection_date >= ?)
  AND (? IS NULL OR inspection_date <= ?)
  AND (? IS NULL OR scheduled_date >= ?)
  AND (? IS NULL OR scheduled_date <= ?)
ORDER BY inspection_date DESC
LIMIT ? OFFSET ?
`;

const selectInspectionListByFilterOr = `
SELECT
  inspection_id      AS inspCode,
  equipment_id       AS eqId,
  inspection_type    AS inspType,
  inspection_date    AS inspDate,
  scheduled_date     AS nextDate,
  inspection_cycle   AS cycle,
  result             AS lastResult,
  inspector          AS manager,
  note               AS note
FROM equipment_inspection
WHERE
  ( ? IS NOT NULL AND TRIM(inspection_id) = TRIM(COALESCE(?, inspection_id)) )
  OR ( ? IS NOT NULL AND TRIM(equipment_id) = TRIM(COALESCE(?, equipment_id)) )
  OR ( ? IS NOT NULL AND TRIM(inspection_type) = TRIM(COALESCE(?, inspection_type)) )
  OR ( ( ? IS NOT NULL OR ? IS NOT NULL )
       AND inspection_date BETWEEN COALESCE(?, inspection_date) AND COALESCE(?, inspection_date) )
  OR ( ( ? IS NOT NULL OR ? IS NOT NULL )
       AND scheduled_date BETWEEN COALESCE(?, scheduled_date) AND COALESCE(?, scheduled_date) )
ORDER BY inspection_date DESC
LIMIT ? OFFSET ?
`;


const distinctInspCode = `
  SELECT DISTINCT inspection_id
  FROM equipment_inspection
  ORDER BY inspection_id DESC
  LIMIT ? OFFSET ?
`;
const countDistinctInspCode = `
  SELECT COUNT(DISTINCT inspection_id) AS total
  FROM equipment_inspection
`;
const distinctEqId = `
  SELECT DISTINCT equipment_id
  FROM equipment_inspection
  ORDER BY equipment_id
  LIMIT ? OFFSET ?
`;
const countDistinctEqId = `
  SELECT COUNT(DISTINCT equipment_id) AS total
  FROM equipment_inspection
`;
const distinctInspType = `
  SELECT DISTINCT inspection_type
  FROM equipment_inspection
  ORDER BY inspection_type
  LIMIT ? OFFSET ?
`;
const countDistinctInspType = `
  SELECT COUNT(DISTINCT inspection_type) AS total
  FROM equipment_inspection
`;
const distinctInspDate = `
  SELECT DISTINCT inspection_date
  FROM equipment_inspection
  ORDER BY inspection_date DESC
  LIMIT ? OFFSET ?
`;
const countDistinctInspDate = `
  SELECT COUNT(DISTINCT inspection_date) AS total
  FROM equipment_inspection
`;
const distinctNextDate = `
  SELECT DISTINCT scheduled_date
  FROM equipment_inspection
  ORDER BY scheduled_date DESC
  LIMIT ? OFFSET ?
`;
const countDistinctNextDate = `
  SELECT COUNT(DISTINCT scheduled_date) AS total
  FROM equipment_inspection
`;

/* ---------- ★ 설비점검(Inspection) 단건/등록/수정 + 디테일 ---------- */
const selectInspectionOne = `
SELECT
  i.inspection_id     AS inspectionCode,
  i.equipment_id      AS equipmentCode,
  e.equipment_name    AS equipmentName,
  e.equipment_type    AS equipmentType,
  e.location          AS location,
  i.inspection_type   AS inspectionType,
  i.inspection_cycle  AS inspectionCycle,
  DATE(i.inspection_date)  AS inspectionDate,
  DATE(i.scheduled_date)   AS nextDate,
  i.inspector         AS manager,
  i.result            AS lastResult,
  i.note              AS note
FROM equipment_inspection i
JOIN equipment e ON i.equipment_id = e.equipment_id
WHERE i.inspection_id = ?
`;

const selectInspectionDetails = `
SELECT
    d.id               AS detailId,
    d.inspection_item  AS item,
    d.inspection_result AS result,
    d.corrective_action AS action
FROM equipment_inspection_detail d
WHERE d.inspection_id = ?
ORDER BY d.id;
`;

const insertInspection = `
INSERT INTO equipment_inspection (
  inspection_id, equipment_id, inspection_type, inspection_cycle,
  inspection_date, scheduled_date, inspector, note, result
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, ''))
`;

const insertInspectionDetail = `
INSERT INTO equipment_inspection_detail (
  inspection_id, inspection_item, inspection_result, corrective_action
) VALUES (?, ?, ?, ?)
`;

const updateInspection = `
UPDATE equipment_inspection
   SET equipment_id = ?,
       inspection_type = ?,
       inspection_cycle = ?,
       inspection_date = ?,
       scheduled_date = ?,
       inspector = ?,
       note = ?
 WHERE inspection_id = ?
`;

const deleteInspectionDetails = `
DELETE FROM equipment_inspection_detail
 WHERE inspection_id = ?
`;

/* ---------- 설비정보 등록/수정/조회 (기존) ---------- */
const distinctEquipmentCode = `
  SELECT DISTINCT equipment_id
  FROM equipment
  ORDER BY equipment_id
`;
const distinctEquipmentType = `
  SELECT DISTINCT equipment_type
  FROM equipment
  ORDER BY equipment_type
`;
const distinctEquipmentName = `
  SELECT DISTINCT equipment_name
  FROM equipment
  ORDER BY equipment_name
`;
const distinctLocation = `
  SELECT DISTINCT location
  FROM equipment
  ORDER BY location
`;
const distinctStatus = `
  SELECT DISTINCT status
  FROM equipment
  ORDER BY status
`;

const insertEquipment = `
INSERT INTO equipment (
    equipment_id,
    equipment_type,
    equipment_name,
    manufacturer,
    serial_no,
    safety_standard,
    operation_manual,
    purchase_date,
    start_date,
    location,
    status
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const updateEquipment = `
  UPDATE equipment
     SET equipment_name = ?,
         manufacturer   = ?,
         serial_no      = ?,
         purchase_date  = ?,
         start_date     = ?,
         equipment_type = ?,
         location       = ?,
         status         = ?
   WHERE equipment_id   = ?
`;

/* 전체 목록 */
const selectEquipmentInfoPage = `
SELECT
  equipment_id   AS eq_id,
  equipment_type AS eq_type,
  equipment_name AS eq_name,
  manufacturer   AS maker,
  serial_no      AS serial,
  purchase_date  AS in_date,
  start_date     AS start_date,
  location       AS loc,
  status         AS status
FROM equipment
ORDER BY equipment_id
LIMIT ? OFFSET ?
`;

const countEquipmentInfoAll = `
SELECT COUNT(*) AS total
FROM equipment
`;

// const selectEquipmentInfoSearchOr = `
// SELECT
//   equipment_id   AS eq_id,
//   equipment_type AS eq_type,
//   equipment_name AS eq_name,
//   manufacturer   AS maker,
//   serial_no      AS serial,
//   purchase_date  AS in_date,
//   start_date     AS start_date,
//   location       AS loc,
//   status         AS status
// FROM equipment
// WHERE (
//       (? IS NOT NULL AND TRIM(equipment_id)   = TRIM(?))
//    OR (? IS NOT NULL AND TRIM(equipment_type) = TRIM(?))
//    OR (? IS NOT NULL AND TRIM(equipment_name) = TRIM(?))
//    OR (? IS NOT NULL AND TRIM(location)       = TRIM(?))
//    OR ( ? IS NULL AND ? IS NULL AND ? IS NULL AND ? IS NULL )
   
// )
// AND (? IS NULL OR TRIM(status) = TRIM(?))
// ORDER BY equipment_id
// LIMIT ? OFFSET ?
// `;


// const countEquipmentInfoSearchOr = `
// SELECT COUNT(*) AS total
// FROM equipment
// WHERE (
//       (? IS NOT NULL AND TRIM(equipment_id)   = TRIM(?))
//    OR (? IS NOT NULL AND TRIM(equipment_type) = TRIM(?))
//    OR (? IS NOT NULL AND TRIM(equipment_name) = TRIM(?))
//    OR (? IS NOT NULL AND TRIM(location)       = TRIM(?))
//    OR ( ? IS NULL AND ? IS NULL AND ? IS NULL AND ? IS NULL )
// )
// AND (? IS NULL OR TRIM(status) = TRIM(?))
// `;

// 함수이름 and인데 or조건임
const selectEquipmentInfoSearchAnd = `
SELECT 
  equipment_id   AS eq_id,
  equipment_type AS eq_type,
  equipment_name AS eq_name,
  manufacturer   AS maker,
  serial_no      AS serial,
  purchase_date  AS in_date,
  start_date     AS start_date,
  location       AS loc,
  status         AS status
FROM equipment
WHERE 1=1
  AND (
       (? IS NOT NULL AND equipment_id   LIKE CONCAT('%', ?, '%'))
    OR (? IS NOT NULL AND equipment_type LIKE CONCAT('%', ?, '%'))
    OR (? IS NOT NULL AND equipment_name LIKE CONCAT('%', ?, '%'))
    OR (? IS NOT NULL AND location       LIKE CONCAT('%', ?, '%'))
    OR (? IS NOT NULL AND status         LIKE CONCAT('%', ?, '%'))
  )
ORDER BY equipment_id
LIMIT ? OFFSET ?;
`;

// 함수이름 and인데 or조건임
const countEquipmentInfoSearchAnd = `
SELECT COUNT(*) AS total
FROM equipment
WHERE (? IS NULL OR TRIM(equipment_id)   LIKE CONCAT('%', ?, '%'))
  AND (? IS NULL OR TRIM(equipment_type) LIKE CONCAT('%', ?, '%'))
  AND (? IS NULL OR TRIM(equipment_name) LIKE CONCAT('%', ?, '%'))
  AND (? IS NULL OR TRIM(location)       LIKE CONCAT('%', ?, '%'))
  AND (? IS NULL OR TRIM(status)         LIKE CONCAT('%', ?, '%'))
`;


/* DISTINCT (모달) */
const distinctEqId2 = `
  SELECT DISTINCT equipment_id 
  FROM equipment 
  ORDER BY equipment_id 
  LIMIT ? OFFSET ?
`;
const countDistinctEqId2 = `SELECT COUNT(DISTINCT equipment_id) AS total FROM equipment`;


const distinctEqType2 = `
  SELECT DISTINCT equipment_type 
  FROM equipment 
  ORDER BY equipment_type 
  LIMIT ? OFFSET ?
`;
const countDistinctEqType2 = `SELECT COUNT(DISTINCT equipment_type) AS total FROM equipment`;

const distinctEqName2 = `
  SELECT DISTINCT equipment_name 
  FROM equipment 
  ORDER BY equipment_name 
  LIMIT ? OFFSET ?
`;
const countDistinctEqName2 = `SELECT COUNT(DISTINCT equipment_name) AS total FROM equipment`;

const distinctLoc2 = `
  SELECT DISTINCT COALESCE(NULLIF(TRIM(location), ''), '-') AS location
  FROM equipment 
  ORDER BY location 
  LIMIT ? OFFSET ?
`;
const countDistinctLoc2 = `
  SELECT COUNT(DISTINCT location) AS total 
  FROM equipment
`;

const distinctStatus2 = `
  SELECT DISTINCT status 
  FROM equipment 
  ORDER BY status 
  LIMIT ? OFFSET ?
`;
const countDistinctStatus2 = `SELECT COUNT(DISTINCT status) AS total FROM equipment`;



const selectEquipmentOne = `
SELECT
  equipment_id   AS equipmentCode,
  equipment_name AS equipmentName,
  manufacturer   AS manufacturer,
  serial_no      AS serialNo,
  purchase_date  AS purchaseDate,
  start_date     AS startDate,
  equipment_type AS equipmentType,
  location       AS location,
  status         AS status
FROM equipment
WHERE equipment_id = ?
`;

const searchEquipment = `
SELECT
  equipment_id,
  equipment_type,
  equipment_name,
  manufacturer,
  serial_no,
  safety_standard,
  operation_manual,
  purchase_date,
  start_date,
  location,
  status
FROM equipment
WHERE (? IS NULL OR equipment_id = ?)
  AND (? IS NULL OR equipment_type = ?)
  AND (? IS NULL OR equipment_name = ?)
  AND (? IS NULL OR location = ?)
  AND (? IS NULL OR status = ?)
ORDER BY equipment_id
LIMIT ? OFFSET ?
`;
const countEquipment = `
SELECT COUNT(*) AS total
FROM equipment
WHERE (? IS NULL OR equipment_id = ?)
  AND (? IS NULL OR equipment_type = ?)
  AND (? IS NULL OR equipment_name = ?)
  AND (? IS NULL OR location = ?)
  AND (? IS NULL OR status = ?)
`;

// 점검 조회 (마스터 + 디테일)
async function getInspectionById(inspCode) {
  const sql = `
    SELECT 
      i.inspection_id   AS insp_code,
      i.equipment_id    AS eq_id,
      i.inspection_type AS insp_type,
      i.inspection_date AS insp_date,
      i.scheduled_date  AS next_date,
      i.inspector       AS manager,
      i.note            AS note,
      d.detail_id       AS detail_id,
      d.item            AS item,
      d.result          AS result,
      d.action          AS action
    FROM equipment_inspection i
    LEFT JOIN equipment_inspection_detail d 
           ON i.inspection_id = d.inspection_id
    WHERE i.inspection_id = ? 
    ORDER BY d.detail_id ASC
  `;
  const [rows] = await mariadb.query(sql, [inspCode]);
  return rows;
}

// 마지막 설비코드 조회
const selectMaxEqId = `
  SELECT MAX(equipment_id) AS max_eq_id
  FROM equipment
  FOR UPDATE;
`;

// 마지막 점검코드 조회
const selectMaxInspId = `
  SELECT MAX(inspection_id) AS max_insp_id
  FROM equipment_inspection
  FOR UPDATE;`;

// 시저

// 비가동 페이지
/* ===== 비가동 목록 조회 ===== */
const selectDowntimeList = `
SELECT 
  d.id                AS id,              -- ✅ alias를 downtime_id → id 로 변경
  d.equipment_id      AS eq_id,
  e.equipment_name    AS eq_name,
  d.fault_type,
  d.fault_dtime,
  d.restart_dtime,
  d.note,
  d.status,
  r.repair_id,
  r.reason            AS repair_reason,
  r.repairer,
  r.status            AS repair_status,
  i.inspection_id,
  i.inspection_type,
  i.inspector,
  i.result            AS inspection_result
FROM equipment_downtime d
LEFT JOIN equipment e 
       ON d.equipment_id = e.equipment_id
LEFT JOIN equipment_repair r 
       ON d.repair_id = r.repair_id
LEFT JOIN equipment_inspection i 
       ON d.inspection_id = i.inspection_id
WHERE (? IS NULL OR d.equipment_id = ?)
ORDER BY d.fault_dtime DESC
LIMIT ?, ?;
`;

const countDowntimeList = `
SELECT COUNT(*) AS cnt
FROM equipment_downtime d
WHERE (? IS NULL OR d.equipment_id = ?)
`;



/* ===== 전체 건수 ===== */
// const countDowntimeList = `
// SELECT COUNT(*) AS cnt
// FROM equipment_downtime d
// WHERE (? IS NULL OR d.equipment_id = ?)
// `;



// 설비코드 목록
const selectCodeList = `
  SELECT 
  equipment_id   AS eq_id,
  equipment_name AS eq_name
FROM equipment
ORDER BY equipment_id
LIMIT ?, ?
`;

const countEquipment2 = `
    SELECT COUNT(*) AS cnt FROM equipment
  `;

const insertDowntime = `
  INSERT INTO equipment_downtime
    (equipment_id, repair_id, inspection_id, fault_type, fault_dtime, restart_dtime, note, status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;

// 비가동 수정
// downtime 수정 쿼리
const updateDowntime = `
  UPDATE equipment_downtime
  SET equipment_id=?, repair_id=?, inspection_id=?, fault_type=?, fault_dtime=?, restart_dtime=?, note=?, status=?
  WHERE id=?;
`;

// 설비수리 페이지
/* =========================
   설비수리 SQL MAPPER
   ========================= */

/* 목록 조회 */
/* ✅ 설비수리 목록 */
const selectRepairList = `
SELECT 
    r.repair_id,
    r.equipment_id,
    e.equipment_name,
    d.fault_dtime,
    d.restart_dtime,
    r.start_date,
    r.end_date,
    r.repairer,
    r.reason,
    r.status,
    rd.repair_item,
    rd.repair_result,
    rd.corrective_action
FROM equipment_repair r
LEFT JOIN equipment e 
       ON r.equipment_id = e.equipment_id
LEFT JOIN equipment_downtime d 
       ON r.repair_id = d.repair_id
LEFT JOIN equipment_repair_detail rd 
       ON r.repair_id = rd.repair_id
WHERE 1=1
  AND (? IS NULL OR r.repair_id = ?)
  AND (? IS NULL OR r.equipment_id = ?)
  AND (? IS NULL OR r.status = ?)
  AND (? IS NULL OR DATE(r.start_date) >= ?)
  AND (? IS NULL OR DATE(r.end_date) <= ?)
ORDER BY r.repair_id DESC
LIMIT ? OFFSET ?;
`;

/* 설비수리 목록/검색 */
const searchRepairList = `
SELECT
    r.repair_id,
    r.equipment_id      AS eq_id,
    d.fault_dtime,
    d.restart_dtime,
    r.start_date        AS start_dtime,
    r.end_date          AS end_dtime,
    r.repairer,
    r.reason,
    GROUP_CONCAT(rd.repair_item SEPARATOR ', ')       AS item,
    GROUP_CONCAT(rd.repair_result SEPARATOR ', ')     AS result,
    GROUP_CONCAT(rd.corrective_action SEPARATOR ', ') AS action
FROM equipment_repair r
LEFT JOIN equipment_downtime d 
       ON r.repair_id = d.repair_id
LEFT JOIN equipment_repair_detail rd 
       ON r.repair_id = rd.repair_id
WHERE 1=1
  AND (? IS NULL OR r.repair_id = ?)
  AND (? IS NULL OR r.equipment_id = ?)
  AND (? IS NULL OR r.status = ?)
  AND (? IS NULL OR DATE(r.start_date) >= ?)
  AND (? IS NULL OR DATE(r.end_date) <= ?)
GROUP BY r.repair_id
ORDER BY r.repair_id DESC
LIMIT ? OFFSET ?;
`

/* COUNT */
const countRepairListWithFilter = `
SELECT COUNT(DISTINCT r.repair_id) AS total
FROM equipment_repair r
LEFT JOIN equipment_downtime d 
       ON r.repair_id = d.repair_id
LEFT JOIN equipment_repair_detail rd 
       ON r.repair_id = rd.repair_id
WHERE 1=1
  AND (? IS NULL OR r.repair_id = ?)
  AND (? IS NULL OR r.equipment_id = ?)
  AND (? IS NULL OR r.status = ?)
  AND (? IS NULL OR DATE(r.start_date) >= ?)
  AND (? IS NULL OR DATE(r.end_date) <= ?);
`

/* ===== DISTINCT (모달용) ===== */
/* DISTINCT */
// const distinctRepair = `
//   SELECT DISTINCT repair_id
//   FROM equipment_repair
//   ORDER BY repair_id DESC
//   LIMIT ? OFFSET ?;
// `

const distinctRepair = `
  SELECT repair_id
  FROM equipment_repair
  GROUP BY repair_id
  ORDER BY repair_id DESC
  LIMIT ? OFFSET ?;
`;


// 수리코드 5 페이지네이션
const countDistinctRepair = `
  SELECT COUNT(DISTINCT repair_id) AS total
  FROM equipment_repair;
`;




// 설비수리 등록/수정 페이지

// 마지막 수리코드 조회 (R001 ~ R999)
const selectMaxRepairId = `
  SELECT MAX(repair_id) AS max_repair_id
  FROM equipment_repair
  FOR UPDATE;
`;

// 수리 등록 (마스터)
const insertRepair = `
  INSERT INTO equipment_repair
    (repair_id, equipment_id, fault_dtime, start_date, end_date, repairer, reason, status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?);
`;

// 수리 등록 (디테일)
const insertRepairDetail = `
  INSERT INTO equipment_repair_detail
    (repair_id, repair_item, repair_result, corrective_action)
  VALUES (?, ?, ?, ?);
`;

/* ===== 설비수리 단건 조회 (마스터) ===== */
const selectRepairOne = `
SELECT
  r.repair_id      AS repairCode,
  r.equipment_id   AS equipmentCode,
  e.equipment_name AS equipmentName,
  r.fault_dtime    AS faultDate,
  d.restart_dtime  AS restartDate,      -- downtime에 연결되어 있으면 매핑
  r.start_date     AS repairStartDate,
  r.end_date       AS repairEndDate,
  r.repairer       AS manager,
  r.reason         AS repairReason,
  r.status         AS status
FROM equipment_repair r
LEFT JOIN equipment e
       ON r.equipment_id = e.equipment_id
LEFT JOIN equipment_downtime d
       ON d.repair_id = r.repair_id
WHERE r.repair_id = ?
LIMIT 1;
`

/* ===== 설비수리 디테일 조회 ===== */
const selectRepairDetails = `
SELECT
  rd.repair_item       AS item,
  rd.repair_result     AS result,
  rd.corrective_action AS action
FROM equipment_repair_detail rd
WHERE rd.repair_id = ?
ORDER BY rd.id ASC;
`

/* ===== 설비수리 마스터 수정 ===== */
const updateRepairMaster = `
UPDATE equipment_repair
   SET equipment_id = ?,
       fault_dtime = ?,
       start_date  = ?,
       end_date    = ?,
       repairer    = ?,
       reason      = ?,
       status      = ?
 WHERE repair_id   = ?;
`

/* ===== 설비수리 디테일 전체 삭제 ===== */
const deleteRepairDetails = `
DELETE FROM equipment_repair_detail
 WHERE repair_id = ?;
`

/* ===== (선택) downtime 재가동일시 업데이트(있을 때만) ===== */
const updateDowntimeRestartByRepair = `
UPDATE equipment_downtime
   SET restart_dtime = ?
 WHERE repair_id = ?;
`


// 메뉴얼 페이지

const selectEquipmentManualPage = `
SELECT
  equipment_id      AS equipment_id,
  equipment_type    AS equipment_type,
  equipment_name    AS equipment_name,
  safety_standard   AS safety_standard,
  operation_manual  AS operation_manual,
  status            AS status
FROM equipment
ORDER BY equipment_id
LIMIT ? OFFSET ?
`;

const countEquipmentManual = `
SELECT COUNT(*) AS total
FROM equipment
`;

const searchEquipmentManualOr = `
SELECT
  equipment_id,
  equipment_type,
  equipment_name,
  safety_standard,
  operation_manual,
  status
FROM equipment
WHERE ( ? IS NULL OR equipment_id      LIKE CONCAT('%', ?, '%') )
  AND ( ? IS NULL OR equipment_type    LIKE CONCAT('%', ?, '%') )
  AND ( ? IS NULL OR equipment_name    LIKE CONCAT('%', ?, '%') )
  AND ( ? IS NULL OR location          LIKE CONCAT('%', ?, '%') )
  AND ( ? IS NULL OR status            LIKE CONCAT('%', ?, '%') )
ORDER BY equipment_id
LIMIT ? OFFSET ?
`;

const countEquipmentManualOr = `
SELECT COUNT(*) AS total
FROM equipment
WHERE ( ? IS NULL OR equipment_id      LIKE CONCAT('%', ?, '%') )
  AND ( ? IS NULL OR equipment_type    LIKE CONCAT('%', ?, '%') )
  AND ( ? IS NULL OR equipment_name    LIKE CONCAT('%', ?, '%') )
  AND ( ? IS NULL OR location          LIKE CONCAT('%', ?, '%') )
  AND ( ? IS NULL OR status            LIKE CONCAT('%', ?, '%') )
`;


module.exports = {
  /* 설비점검 목록/검색/Distinct (기존) */
  selectInspectionList,
  selectInspectionListByFilter,
  selectInspectionListByFilterOr,
  distinctInspCode,
  countDistinctInspCode,
  distinctEqId,
  countDistinctEqId,
  distinctInspType,
  countDistinctInspType,
  distinctInspDate,
  countDistinctInspDate,
  distinctNextDate,
  countDistinctNextDate,

  /* ★ 설비점검 단건/등록/수정 + 디테일 */
  selectMaxInspId,
  selectInspectionOne,
  selectInspectionDetails,
  insertInspection,
  insertInspectionDetail,
  updateInspection,
  deleteInspectionDetails,

  /* 설비정보 (기존) */
  insertEquipment,
  updateEquipment,
  distinctEquipmentCode,
  distinctEquipmentType,
  distinctEquipmentName,
  distinctLocation,
  distinctStatus,
  searchEquipment,
  countEquipment,
  selectEquipmentInfoPage,
  countEquipmentInfoAll,
  selectEquipmentInfoSearchAnd,
  countEquipmentInfoSearchAnd,
  distinctEqId2,
  countDistinctEqId2,
  distinctEqType2,
  countDistinctEqType2,
  distinctEqName2,
  countDistinctEqName2,
  distinctLoc2,
  countDistinctLoc2,
  distinctStatus2,
  countDistinctStatus2,
  selectEquipmentOne,
  getInspectionById,
  selectMaxEqId,
  selectEquipmentManualPage,
  searchEquipmentManualOr,
  countEquipmentManualOr,
  countEquipmentManual,



  /* 비가동 */
  selectDowntimeList,
  countDowntimeList,
  selectCodeList,
  insertDowntime,
  countEquipment2,
  updateDowntime,



  // 설비수리
  searchRepairList,
  distinctRepair,
  selectRepairList,
  countRepairListWithFilter,
  selectMaxRepairId,//등록수정
  insertRepair,
  insertRepairDetail,
  countDistinctRepair,
  selectRepairOne,
  selectRepairDetails,
  updateRepairMaster,
  deleteRepairDetails,
  updateDowntimeRestartByRepair,



};
