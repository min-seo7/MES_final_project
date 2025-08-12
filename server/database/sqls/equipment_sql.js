// 설비점검 목록(필터)
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
  AND (? IS NULL OR inspection_date >= ?)
  AND (? IS NULL OR inspection_date <= ?)
ORDER BY inspection_date DESC
LIMIT ? OFFSET ?
`;

// 설비점검 등록
const insertInspection = `
INSERT INTO equipment_inspection(
  equipment_id, inspection_type, inspection_date, scheduled_date,
  inspection_cycle, inspector, result, requested_by, note
) VALUES (?,?,?,?,?,?,?,?,?)
`;

module.exports = {
  // ...기존 export들 유지
  selectInspectionListByFilter,
  insertInspection,
};
