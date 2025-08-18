// 설비점검 페이지
// 설비점검 목록(최근순, 최대 100)
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

// 설비점검 조회검색(필터) 추후에 or 삭제나 주석처리 and전환
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
// DISTINCT for inspection pickers (모달용)
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

// ✅ (추가) OR 버전 추후에 안쓰면 삭제
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

////

// 설비정보 등록/수정 페이지

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
// 설비정보 조건 검색 (with pagination)
// const searchEquipment = `
// SELECT
//   equipment_id,
//   equipment_type,
//   equipment_name,
//   manufacturer,
//   serial_no,
//   safety_standard,
//   operation_manual,
//   purchase_date,
//   start_date,
//   location,
//   status,
//   note
// FROM equipment
// WHERE (? IS NULL OR equipment_id = ?)
//   AND (? IS NULL OR equipment_type = ?)
//   AND (? IS NULL OR equipment_name = ?)
//   AND (? IS NULL OR location = ?)
//   AND (? IS NULL OR status = ?)
// ORDER BY equipment_id
// LIMIT ? OFFSET ?
// `;

// 전체 건수

// 설비정보 등록
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
// 설비정보 수정 (eq_id 기준)

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

// "설비정보 조회페이지"
// 설비정보 조건 검색 (OR 기본, AND 주석처리)
/* ===== 설비정보 조회(info2) - 공통 SELECT 컬럼 =====
   eq_id/eq_type/eq_name/maker/serial/in_date/start_date/loc/status
*/

/* 6-1) 무필터 페이지 + 전체 건수 */
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

/* 6-2) 조건검색 - OR(기본) + status는 AND */
const selectEquipmentInfoSearchOr = `
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
WHERE (
      (? IS NOT NULL AND TRIM(equipment_id)   = TRIM(?))
   OR (? IS NOT NULL AND TRIM(equipment_type) = TRIM(?))
   OR (? IS NOT NULL AND TRIM(equipment_name) = TRIM(?))
   OR (? IS NOT NULL AND TRIM(location)       = TRIM(?))
)
AND (? IS NULL OR TRIM(status) = TRIM(?))
ORDER BY equipment_id
LIMIT ? OFFSET ?
`;

const countEquipmentInfoSearchOr = `
SELECT COUNT(*) AS total
FROM equipment
WHERE (
      (? IS NOT NULL AND TRIM(equipment_id)   = TRIM(?))
   OR (? IS NOT NULL AND TRIM(equipment_type) = TRIM(?))
   OR (? IS NOT NULL AND TRIM(equipment_name) = TRIM(?))
   OR (? IS NOT NULL AND TRIM(location)       = TRIM(?))
)
AND (? IS NULL OR TRIM(status) = TRIM(?))
`;

/* 6-3) 조건검색 - AND (예비/주석 전환용) */
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
WHERE (? IS NULL OR equipment_id   = ?)
  AND (? IS NULL OR equipment_type = ?)
  AND (? IS NULL OR equipment_name = ?)
  AND (? IS NULL OR location       = ?)
  AND (? IS NULL OR status         = ?)
ORDER BY equipment_id
LIMIT ? OFFSET ?
`;
const countEquipmentInfoSearchAnd = `
SELECT COUNT(*) AS total
FROM equipment
WHERE (? IS NULL OR equipment_id   = ?)
  AND (? IS NULL OR equipment_type = ?)
  AND (? IS NULL OR equipment_name = ?)
  AND (? IS NULL OR location       = ?)
  AND (? IS NULL OR status         = ?)
`;

/* 6-4) DISTINCT + 페이지네이션(모달 5개 고정) */
const distinctEqId2 = `SELECT DISTINCT equipment_id   FROM equipment ORDER BY equipment_id   LIMIT ? OFFSET ?`;
const distinctEqType2 = `SELECT DISTINCT equipment_type FROM equipment ORDER BY equipment_type LIMIT ? OFFSET ?`;
const distinctEqName2 = `SELECT DISTINCT equipment_name FROM equipment ORDER BY equipment_name LIMIT ? OFFSET ?`;
const distinctLoc2 = `SELECT DISTINCT location       FROM equipment ORDER BY location       LIMIT ? OFFSET ?`;
const distinctStatus2 = `SELECT DISTINCT status         FROM equipment ORDER BY status         LIMIT ? OFFSET ?`;

const countDistinctEqId2 = `SELECT COUNT(DISTINCT equipment_id)   AS total FROM equipment`;
const countDistinctEqType2 = `SELECT COUNT(DISTINCT equipment_type) AS total FROM equipment`;
const countDistinctEqName2 = `SELECT COUNT(DISTINCT equipment_name) AS total FROM equipment`;
const countDistinctLoc2 = `SELECT COUNT(DISTINCT location)       AS total FROM equipment`;
const countDistinctStatus2 = `SELECT COUNT(DISTINCT status)         AS total FROM equipment`;

// 이거 설비정보 등록/수정에 설비코드부분
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

// [FIX] (note 제거) 설비정보 조건 검색 (with pagination)
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

// [FIX] (note 제거) 전체 건수
const countEquipment = `
SELECT COUNT(*) AS total
FROM equipment
WHERE (? IS NULL OR equipment_id = ?)
  AND (? IS NULL OR equipment_type = ?)
  AND (? IS NULL OR equipment_name = ?)
  AND (? IS NULL OR location = ?)
  AND (? IS NULL OR status = ?)
`;

// 새 설비코드 생성 쿼리
const genEquipmentCode = `
  SELECT CONCAT('INSP', LPAD(IFNULL(SUBSTRING_INDEX(MAX(equipment_id),'INSP',-1),0)+1,3,'0')) AS new_code
  FROM equipment
`;

module.exports = {
  selectInspectionList,
  // selectInspectionListByFilter,
  // --- inspection ---
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

  // --- equipment 등록/수정 ---
  insertEquipment,
  updateEquipment,
  distinctEquipmentCode,
  distinctEquipmentType,
  distinctEquipmentName,
  distinctLocation,
  distinctStatus,
  searchEquipment,
  countEquipment,
  genEquipmentCode, //생성코드

  // --- info2 페이지 ---
  selectEquipmentInfoPage,
  countEquipmentInfoAll,
  selectEquipmentInfoSearchOr,
  countEquipmentInfoSearchOr,
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

  // --- 단건 조회 ---
  selectEquipmentOne,
};
