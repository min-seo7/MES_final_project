// 설비점검 목록(심플)
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

// 설비점검 목록(검색)
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
WHERE (? IS NULL OR REPLACE(equipment_id,'-','') = REPLACE(?, '-', ''))
  AND (? IS NULL OR inspection_type = ?)
  AND (? IS NULL OR result = ?)
  AND (? IS NULL OR inspector = ?)
  -- 점검일
  AND (? IS NULL OR inspection_date >= ?)
  AND (? IS NULL OR inspection_date <= ?)
  -- 점검예정일
  AND (? IS NULL OR scheduled_date >= ?)
  AND (? IS NULL OR scheduled_date <= ?)
ORDER BY inspection_date DESC
LIMIT ? OFFSET ?
`;

// 설비정보 등록
const insertEquipment = `
INSERT INTO equipment
(equipment_id, equipment_name, manufacturer, serial_no,
 purchase_date, start_date, eq_type, location, status, note)
VALUES (:eq_id, :equipment_name, :manufacturer, :serial_no,
        :purchase_date, :start_date, :eq_type, :loc, :status, :note)
`;

// 설비정보 등록/수정
// 목록(조건검색/돋보기)
/* ===== 목록(검색/돋보기용) ===== */
const selectEquipmentList = `
const selectEquipmentList = `
SELECT
  e.equipment_id   AS eq_id,
  e.eq_type        AS eq_type,
  e.equipment_name AS eq_name,
  e.location       AS loc,
  e.status         AS status
FROM equipment e
WHERE 1=1
  AND ( :eq_id   IS NULL OR e.equipment_id LIKE CONCAT('%', :eq_id, '%') )
  AND ( :eq_type IS NULL OR e.eq_type      LIKE CONCAT('%', :eq_type, '%') )
  AND ( :eq_name IS NULL OR e.equipment_name LIKE CONCAT('%', :eq_name, '%') )
  AND ( :loc     IS NULL OR e.location     LIKE CONCAT('%', :loc, '%') )
  AND ( :status  IS NULL OR e.\`status\`   = :status )
ORDER BY e.equipment_id ASC
LIMIT :offset, :size
`;

const countEquipmentList = `
SELECT COUNT(*) AS total
FROM equipment e
WHERE 1=1
  AND ( :eq_id   IS NULL OR e.equipment_id LIKE CONCAT('%', :eq_id, '%') )
  AND ( :eq_type IS NULL OR e.eq_type      LIKE CONCAT('%', :eq_type, '%') )
  AND ( :eq_name IS NULL OR e.equipment_name LIKE CONCAT('%', :eq_name, '%') )
  AND ( :loc     IS NULL OR e.location     LIKE CONCAT('%', :loc, '%') )
  AND ( :status  IS NULL OR e.\`status\`   = :status )
`;

// 설비정보 등록/수정
// 목록(조건검색/돋보기)
   /* ===== 목록(검색/돋보기용) ===== */
  const selectEquipmentList= `
    SELECT
      e.equipment_id AS eq_id,
      e.eq_type      AS eq_type,
      e.eq_name      AS eq_name,
      e.location     AS loc,
      e.status       AS status
    FROM equipment e
    WHERE 1=1
      AND ( :eq_id   IS NULL OR e.equipment_id LIKE CONCAT('%', :eq_id, '%') )
      AND ( :eq_type IS NULL OR e.eq_type      LIKE CONCAT('%', :eq_type, '%') )
      AND ( :eq_name IS NULL OR e.eq_name      LIKE CONCAT('%', :eq_name, '%') )
      AND ( :loc     IS NULL OR e.location     LIKE CONCAT('%', :loc, '%') )
      AND ( :status  IS NULL OR e.\`status\`   = :status )
    ORDER BY e.equipment_id ASC
    LIMIT :offset, :size
  `,
  /* ===== 카운트(목록과 컬럼/조건 1:1 동일) ===== */
  countEquipmentList = `
  `;

  /* ===== 카운트(목록과 컬럼/조건 1:1 동일) ===== */
 const countEquipmentList= `
    SELECT COUNT(*) AS total
    FROM equipment e
    WHERE 1=1
      AND ( :eq_id   IS NULL OR e.equipment_id LIKE CONCAT('%', :eq_id, '%') )
      AND ( :eq_type IS NULL OR e.eq_type      LIKE CONCAT('%', :eq_type, '%') )
      AND ( :eq_name IS NULL OR e.eq_name      LIKE CONCAT('%', :eq_name, '%') )
      AND ( :loc     IS NULL OR e.location     LIKE CONCAT('%', :loc, '%') )
      AND ( :status  IS NULL OR e.\`status\`   = :status )
  `,
  /* ===== 단건 조회 ===== */
  selectEquipmentById = `
  `;
  
    /* ===== 단건 조회 ===== */
  const selectEquipmentById= `
    SELECT
      e.equipment_id AS eq_id,
      e.eq_name      AS eq_name,
      e.manufacturer AS manufacturer,
      e.serial_no    AS serial_no,
      DATE_FORMAT(e.purchase_date,'%Y-%m-%d') AS purchase_date,
      DATE_FORMAT(e.start_date,'%Y-%m-%d')    AS start_date,
      e.eq_type      AS eq_type,
      e.location     AS loc,
      e.status       AS status,
      e.note         AS note
    FROM equipment e
    WHERE e.equipment_id = :eq_id
  `,
  /* ===== 코드 생성: EQ-YYYYMM-#### (월별 시퀀스) ===== */
  generateEquipmentCode = `
  `;


    /* ===== 코드 생성: EQ-YYYYMM-#### (월별 시퀀스) ===== */
  const generateEquipmentCode= `
    SELECT CONCAT(
      'EQ-',
      DATE_FORMAT(CURDATE(), '%Y%m'),
      '-',
      LPAD(
        CAST(
          COALESCE(MAX(CAST(SUBSTRING_INDEX(equipment_id, '-', -1) AS UNSIGNED)), 0) + 1
          AS CHAR
        ),
        4,'0'
      )
    ) AS next_code
    FROM equipment
    WHERE equipment_id LIKE CONCAT('EQ-', DATE_FORMAT(CURDATE(), '%Y%m'), '-%')
  `,
  /* ===== 등록 ===== */
  insertEquipment = `
  `;

    /* ===== 등록 ===== */
  const insertEquipment= `
    INSERT INTO equipment
      (equipment_id, eq_name, manufacturer, serial_no, purchase_date, start_date, eq_type, location, status, note)
    VALUES
      (:eq_id, :eq_name, :manufacturer, :serial_no, :purchase_date, :start_date, :eq_type, :loc, :status, :note)
  `,
  updateEquipment = `
  `;
  const  updateEquipment= `
    UPDATE equipment
    SET eq_name       = :eq_name,
        manufacturer  = :manufacturer,
        serial_no     = :serial_no,
        purchase_date = :purchase_date,
        start_date    = :start_date,
        eq_type       = :eq_type,
        location      = :loc,
        \`status\`    = :status,
        note          = :note
    WHERE equipment_id = :eq_id
  `;
       
const selectEquipmentById = `
SELECT
  e.equipment_id   AS eq_id,
  e.equipment_name AS eq_name,
  e.manufacturer   AS manufacturer,
  e.serial_no      AS serial_no,
  DATE_FORMAT(e.purchase_date,'%Y-%m-%d') AS purchase_date,
  DATE_FORMAT(e.start_date,'%Y-%m-%d')    AS start_date,
  e.eq_type        AS eq_type,
  e.location       AS loc,
  e.status         AS status,
  e.note           AS note
FROM equipment e
WHERE e.equipment_id = :eq_id
`;

const updateEquipment = `
UPDATE equipment
SET equipment_name = :eq_name,
    manufacturer  = :manufacturer,
    serial_no     = :serial_no,
    purchase_date = :purchase_date,
    start_date    = :start_date,
    eq_type       = :eq_type,
    location      = :loc,
    \`status\`    = :status,
    note          = :note
WHERE equipment_id = :eq_id
`;

const selectEquipmentPickerList = `
SELECT
  equipment_id   AS eq_id,
  eq_type        AS eq_type,
  equipment_name AS eq_name,
  location       AS loc
FROM equipment
ORDER BY equipment_id
LIMIT 200
`;

module.exports = {
  // inspection
  selectInspectionList,
  selectInspectionListByFilter,
  // insertInspection,
  // equipment
  selectEquipmentList,
  countEquipmentList,
  selectEquipmentById,
  insertEquipment,
  updateEquipment,
};
