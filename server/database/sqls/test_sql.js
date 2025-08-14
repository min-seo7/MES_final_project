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
    MI.materialOrder_num AS 자재검수번호,
    PD.pur_no AS 발주번호,      
    PD.material_id AS 자재코드,  
    PD.pur_qty AS 수량_EA,         
    MI.inspStatus AS 상태,
    PD.comm AS 메모,
    P.manager AS 담당자,
    mat.material_name AS 자재명,
    DATE_FORMAT(MI.createdAt, '%Y-%m-%d') AS 등록날짜            
FROM
    tbl_purchase_detail AS PD
INNER JOIN
    material_Inspection AS MI
ON
    PD.purch_id = MI.purch_id
INNER JOIN
    tbl_purchase AS P
ON
    PD.pur_no = P.pur_no
INNER JOIN material as mat
ON PD.material_id = mat.material_id
ORDER BY MI.createdAt DESC`;
// WHERE
// 	MI.inspStatus = '대기'`;

// 자재 입고검사 완료목록
const selectInspecFinList = `
SELECT
    MI.materialOrder_num AS 자재검수번호,
    PD.pur_no AS 발주번호,      
    PD.material_id AS 자재코드,  
    PD.pur_qty AS 수량_EA,         
    MI.inspStatus AS 상태,
    PD.comm AS 메모,
    P.manager AS 담당자,
    mat.material_name AS 자재명,
    DATE_FORMAT(MI.createdAt, '%Y-%m-%d') AS 등록날짜,
    MI.result AS 검사결과,
    DATE_FORMAT(MI.inspection_date, '%Y-%m-%d') AS 검사완료날짜           
FROM
    tbl_purchase_detail AS PD
INNER JOIN
    material_Inspection AS MI
ON
    PD.purch_id = MI.purch_id
INNER JOIN
    tbl_purchase AS P
ON
    PD.pur_no = P.pur_no
INNER JOIN material as mat
ON PD.material_id = mat.material_id
WHERE inspStatus = '완료'
ORDER BY MI.inspection_date DESC;`;

// 합불판정update
const defUpdate = `
UPDATE material_Inspection
SET
  result = ?,
  inspStatus = '완료',
  inspection_date = DATE_FORMAT(NOW(), '%Y-%m-%d')
WHERE
  materialOrder_num = ?`;

module.exports = {
  selectItem,
  insertItem,
  selectItemdetail,
  selectInspecWaitList,
  defUpdate,
  selectInspecFinList,
};
