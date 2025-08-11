// 검사항목조회
const selectItem = `
SELECT *
FROM   testitem`;
// 검사항목 단건조회
const selectItemdetail = `
SELECT *
FROM testitem
WHERE 1=1
  AND (:productType IS NULL OR :productType = '' OR product_type = :productType)
  AND (:inspPurpose IS NULL OR :inspPurpose = '' OR purpose_name = :inspPurpose)
  AND (:inspItem IS NULL OR :inspItem = '' OR item_name = :inspItem);`;
// 검사항목등록
const insertItem = `
INSERT INTO testitem(testitem_code, 
                     product_type, 
                     item_name, 
                     unit, 
                     fixedStandard, 
                     createdBy, 
                     createdAt,
                     purpose_name, 
                     purpose_id)
VALUES(?,?,?,?,?,?,CURRENT_TIMESTAMP,?,?)
`;

module.exports = {
  selectItem,
  insertItem,
  selectItemdetail,
};
