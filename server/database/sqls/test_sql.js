// 검사항목조회
const selectItem = `
SELECT testitem_code, 
                     product_type, 
                     item_name, 
                     unit, 
                     fixedStandard, 
                     createdBy, 
                     createdAt,
                     purpose_name, 
                     purpose_id
FROM   testitem
ORDER BY testitem_code DESC`;
// 검사항목 필터링조회
const selectItemdetail = `
SELECT *
FROM testitem
WHERE (? IS NULL OR ? = '' OR product_type LIKE CONCAT('%', ?, '%'))
  AND (? IS NULL OR ? = '' OR purpose_name LIKE CONCAT('%', ?, '%'));`;

// 검사항목등록
const insertItem = `
INSERT INTO testitem(testitem_code, 
                     product_type, 
                     item_name, 
                     unit, 
                     createdBy,
                     purpose_name)
VALUES(?,?,?,?,?,?)
`;

module.exports = {
  selectItem,
  insertItem,
  selectItemdetail,
};
