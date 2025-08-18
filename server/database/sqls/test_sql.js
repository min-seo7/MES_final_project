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
    P.seq AS 자재검수번호, 
    PD.pur_no AS 발주번호,
    PD.purch_id AS 구매번호,      
    PD.material_id AS 자재코드,  
    PD.pur_qty AS 수량_EA,         
    PD.comm AS 메모,
    P.manager AS 담당자,
    mat.material_name AS 자재명,
    DATE_FORMAT(P.due_date, '%Y-%m-%d') AS 등록날짜,
    PD.inspStatus AS 상태     
FROM
    tbl_purchase_detail AS PD
INNER JOIN
    tbl_purchase AS P
ON
    PD.pur_no = P.pur_no
INNER JOIN material as mat
ON PD.material_id = mat.material_id
WHERE PD.inspStatus= '대기' 
ORDER BY P.due_date DESC`;

// 자재 입고검사 완료목록
const selectInspecFinList = `
SELECT 
    materialOrder_num AS 검수번호,
    purch_id AS 구매번호,
    material_code AS 자재코드,
    mat.material_name AS 자재명,
    insertquantity AS 수량_EA,
    DATE_FORMAT(createdAt,'%Y-%m-%d') AS 등록날짜,
    result AS 검사결과,
    DATE_FORMAT(inspection_date, '%Y-%m-%d') AS 검사완료날짜
FROM material_Inspection MI
LEFT JOIN material mat ON MI.material_code = mat.material_id
ORDER BY MI.purch_id DESC`;

// 검사등록
const insertInsp = `
INSERT INTO material_Inspection (
  material_code,
  inspection_date,
  inspector_id,
  result,
  remark,
  createdAt,
  purch_id,
  insertquantity,
  qty,
  inspStatus
) VALUES (?, NOW(), ?, ?, ?, NOW(), ?, ?, ?, ?)`;

// tbl_purchase_detail테이블 조회
const selectPD = `
SELECT *
FROM tbl_purchase_detail`;

// 합불판정update
const defUpdate = `
UPDATE tbl_purchase_detail
SET
  inspStatus = '완료'
WHERE
  pro_status = '입고대기' AND
  pur_no = ?`;

module.exports = {
  selectItem,
  insertItem,
  selectItemdetail,
  selectInspecWaitList,
  defUpdate,
  selectInspecFinList,
  insertInsp,
  selectPD,
};
