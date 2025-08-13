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
  AND (? IS NULL OR ? = '' OR purpose_name LIKE CONCAT('%', ?, '%'))
ORDER BY testitem_code DESC`;

// 검사항목등록
const insertItem = `
INSERT INTO testitem(product_type, 
                     item_name,
                     unit,
                     fixedStandard,
                     createdBy,
                     purpose_name,
                     purpose_id)
VALUES(?,?,?,?,?,?,?)
`;

// 자재 입고검사 대기목록
const selectInspecWaitList = `
SELECT
    PD.purch_id AS 발주번호,      
    PD.material_id AS 자재코드,  
    MI.qty AS 수량_EA,         
    MI.inspStatus AS 상태            
FROM
    tbl_purchase_detail AS PD
INNER JOIN
    material_Inspection AS MI
ON
    PD.purch_id = MI.purch_id
WHERE 
	MI.inspStatus = '대기'`;

module.exports = {
  selectItem,
  insertItem,
  selectItemdetail,
  selectInspecWaitList,
};
