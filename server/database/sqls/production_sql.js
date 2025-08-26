const SelectMaxOrdNo = `SELECT MAX(ord_no) AS max_ord_no FROM production_order WHERE ord_no LIKE ?;`;
const insertPrdOrder = `INSERT INTO production_order(ord_no, director) VALUES(?, ?);`;
const insertPrdOrderDetail = `
          INSERT INTO prd_order_detail(
             wo_no, 
             p_st_date, 
             p_ed_date, 
             prd_noworder_qty, 
             line_id, 
             product_name, 
             ord_no, 
             plan_detail_no,
             specification,
             unit,
             prd_form,
             product_id
          ) VALUES (
              CONCAT('wo', DATE_FORMAT(NOW(), '%Y%m%d'),'-',LPAD(NEXT VALUE FOR prd_wo_no_seq, 5, '0')),
              ?,
              ?,
              ?,
              ?,
              ?,
              ?,
              ?,
              ?,
              ?,
              ?,
              ?
          );
      `;
const insertRequestBom = `
INSERT INTO tbl_mat_req (material_id, req_qty, wo_no)
SELECT DISTINCT
    bd.material_id,
    bd.required_qty * ? AS req_qty,
    pod.wo_no
FROM
    bom_detail bd
JOIN
    prd_order_detail pod ON SUBSTR(pod.ord_no, 4, 8) = DATE_FORMAT(CURDATE(), '%Y%m%d')
JOIN
    production_order po ON po.ord_no = pod.ord_no
WHERE
    bd.bom_id = ?;`;

const insertPrdFlow = `
INSERT INTO prd_flow(wo_no, use_order, process_id, equipment_id, prd_noworder_qty,
                     in_qty, def_qty, qty, status
)
SELECT
    pod.wo_no, ld.use_order, ld.process_id, ld.equipment_id, pod.prd_noworder_qty,
    0, 0, 0, 1
FROM
    line_detail ld
JOIN
    prd_order_detail pod ON ld.line_id = pod.line_id
WHERE
    pod.ord_no = ?;
`;
const insertPerform = `
insert into performance(wo_no, pf_code, e_name , process_id , in_qty , line_id, product_id , prd_name, specification , unit , eq_code,w_st_date,status)
values(?,CONCAT('PF', DATE_FORMAT(NOW(), '%Y%m%d'),'-',LPAD(NEXT VALUE FOR pf_code_seq, 5, '0')),?,?,?,?,?,?,?,?,?,?,2);
`;
const selectOrderList = `
SELECT wo_no, product_name, specification, unit, prd_noworder_qty, line_id , ord_no
FROM prd_order_detail
WHERE ord_no = (SELECT MAX(ord_no) FROM production_order)
ORDER BY p_st_date DESC;
`;

const notRegistPrcList = `select ld.use_order AS use_order,
      ld.process_id AS "process_id",
      prc.process_name AS "process_name",
      ld.equipment_id AS "equipment_id",
      pod.wo_no AS "wo_no",
    pod.line_id AS "line_id",
    pod.product_id AS "product_id",
    pod.product_name AS "product_name",
    pod.specification AS specification,
    pod.unit As unit,
    pod.prd_form AS "prd_form",
    pod.prd_noworder_qty AS "prd_noworder_qty",
    pf.in_qty AS "in_qty",
    pf.d_qty AS "def_qty",
    pf.qty AS qty,
    CASE WHEN pf.status IS NULL || pf.status = 1 then '대기' WHEN pf.status = 2 THEN '진행' WHEN pf.status = 3 THEN '완료' ELSE pf.status END AS status,
    pf.w_st_date AS startDate,
    pf.w_ed_date AS endDate
    from line_detail ld 
    JOIN prd_flow flow
    ON ld.process_id = flow.process_id
    JOIN prd_order_detail pod
    ON ld.line_id = pod.line_id
    AND pod.wo_no = flow.wo_no
    LEFT JOIN
    performance pf ON pf.wo_no = pod.wo_no AND pf.line_id = pod.line_id -- line_id와 wo_no를 함께 조인하여 정확도를 높입니다.
    AND pf.process_id = flow.process_id
    JOIN process prc
    ON ld.process_id = prc.process_id
    WHERE pf.w_ed_date is null
    order by pod.wo_no desc, ld.use_order;
`;
const updatePerform = `
UPDATE performance
SET status = ?,
    qty = ?,
    w_ed_date = ?
WHERE wo_no = ?;`;

const selectEname = `
SELECT e_name 
FROM performance 
WHERE wo_no = ?
AND process_id = ?;
`;
const selectStatusCheck = `
SELECT
  SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) AS "in_progress_count",
  SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END) AS "completed_count"
FROM performance
WHERE wo_no = ?`;

const selectAllOrder = `
SELECT ord_no, director, order_date, status
FROM production_order`;

const productionOrderList = `
SELECT  pod.p_st_date AS "startDate", 
        pod.p_ed_date AS "endDate", 
        pod.prd_noworder_qty AS "prd_noworder_qty", 
        pod.line_id AS "line_id", 
        l.line_name AS "line_name",
        pod.product_name AS "product_name", 
        p.product_form AS "product_type",
        pod.ord_no AS "ord_no", 
        pod.plan_detail_no AS "plan_detail_no",
        pod.specification AS "specification",
        pod.unit AS "unit",
        pod.prd_form AS "prd_form",
        pod.product_id AS "product_id",
        po.director AS "lastname"
FROM    prd_order_detail pod JOIN line l
ON pod.line_id = l.line_id
JOIN product p
ON pod.product_id = p.product_id
JOIN production_order po
ON pod.ord_no = po.ord_no
ORDER BY pod.p_st_date DESC;
`;

const selectProcessingList = `
SELECT prc.process_id AS process_id,
       prc.process_name AS process_name,
       ld.use_order AS use_order,
       ld.line_id AS line_id,
       l.line_name AS line_name
FROM process prc
JOIN line_detail ld
JOIN line l
ON ld.line_id = l.line_id
ON prc.process_id = ld.process_id;
`;

const selectProcessNotSearchList = `
SELECT  pfm.process_id AS "product_id",
        pfm.process_id AS "process_id",
		p.process_name AS "process_name",
        prd.product_name AS "product_name",
        prd.product_type AS "product_type",
        prd.product_form AS "product_form",
        prd.specification AS "specification",
        prd.unit AS "unit",
        pfm.line_id AS "line_id",
        pfm.e_name AS "lastname",
        pfm.w_ed_date AS "endDate",
        pfm.eq_code AS "equipment_id",
        eq.equipment_name AS "equipment_name",
        pfm.qty AS "qty"
FROM performance pfm
JOIN process p
ON pfm.process_id = p.process_id
JOIN product prd
ON prd.product_id = pfm.product_id
JOIN equipment eq
ON pfm.eq_code = eq.equipment_id
ORDER BY pfm.w_ed_date DESC;
`;

const filterPerformance = `
SELECT  pfm.product_id AS "product_id",
        pfm.process_id AS "process_id",
        p.process_name AS "process_name",  
        prd.product_name AS "product_name",
        prd.product_type AS "product_type",
        prd.product_form AS "product_form",
        prd.specification AS "specification",
        prd.unit AS "unit",
        pfm.line_id AS "line_id",
        pfm.e_name AS "lastname",
        pfm.w_ed_date AS "endDate",
        pfm.eq_code AS "equipment_id",
        eq.equipment_name AS "equipment_name",
        pfm.qty AS "qty"
FROM performance pfm
JOIN process p
ON pfm.process_id = p.process_id
JOIN product prd
ON prd.product_id = pfm.product_id
JOIN equipment eq
ON pfm.eq_code = eq.equipment_id
WHERE   ((DATE(pfm.w_ed_date) >= STR_TO_DATE(?,'%Y-%m-%d') AND DATE(pfm.w_ed_date) < STR_TO_DATE(?,'%Y-%m-%d')) OR ? IS NULL)
AND    (pfm.process_id = ? OR ? IS NULL)
AND    (pfm.line_id = ? OR ? IS NULL)
AND    (pfm.e_name = ? OR ? IS NULL)
AND    (prd.product_type = ? OR ? IS NULL)
AND    (prd.product_form = ? OR ? IS NULL)
ORDER BY pfm.w_ed_date DESC;
`;

const productListModal = `
SELECT DISTINCT p.product_id AS "product_id",
       p.product_name AS "product_name",
        p.product_type AS "product_type",
       p.specification AS "specification",
       p.unit AS "unit",
       l.line_id AS "line_id",
       l.line_name AS "line_name"
FROM product p
JOIN line l
ON p.product_cate_id = l.product_id;

`;

// const insertMasterPlan = `
// INSERT INTO production_plan
// (
//   plan_no,
//   pf_code,
//   pl_in_date,
//   pl_st_date,
//   pl_ed_date,
//   due_date,
//   director
// )
// VALUES (
//   CONCAT('PNO', DATE_FORMAT(NOW(), '%Y%m%d'),'-',LPAD(NEXT VALUE FOR plan_no_seq, 5, '0')),
//   ?, ?, ?, ?, ?, ?
// )
// RETURNING plan_no;
// `;

const insertMasterPlan = `
INSERT INTO production_plan
(
plan_no,
pf_code,
pl_in_date,
pl_st_date,
pl_ed_date,
due_date,
director
)
VALUES(? ,? , ? , ? , ? , ? , ?);
`;

// const insertDetailPlan = `
// INSERT INTO plan_detail
// (
// plan_detail_no,
// product_id,
// product_name,
// p_type,
// specification,
// unit,
// line_id,
// pl_qty,
// planned_qty,
// plan_no
// )
// VALUES(CONCAT('PDNO', DATE_FORMAT(NOW(), '%Y%m%d'),'-',LPAD(NEXT VALUE FOR plan_detail_no_seq, 5, '0')),
// ?, ?, ?, ?, ?, ?, ?, ? , ?);
// `;

const insertDetailPlan = `
INSERT INTO plan_detail
(
plan_detail_no,
product_id,
product_name,
p_type,
specification,
unit,
line_id,
pl_qty,
planned_qty,
plan_no
)
VALUES(CONCAT('PDNO', DATE_FORMAT(NOW(), '%Y%m%d'),'-',LPAD(NEXT VALUE FOR plan_detail_no_seq, 5, '0')),
?, ?, ?, ?, ?, ?, ?, ? , ?);
`;

// wo_no >> 날짜가 변하면 일련번호 초기화 과정
// 시퀀스 증가

const checkPlanNo = ` SELECT COUNT(*) AS count
      FROM production_plan
      WHERE plan_no LIKE CONCAT('PNO', DATE_FORMAT(NOW(), '%Y%m%d'), '%')`;

// 생산계획 목록(모달)
const fetchPlanList = `
       SELECT pd.plan_detail_no AS "planDetailNo",
       pp.plan_no AS "plan_no",
       pp.pl_st_date AS "startDate",
       pp.pl_ed_date AS "endDate",
       pd.product_name AS "product_name",
       pd.p_type AS "p_type",
       pd.pl_qty AS "pl_qty",
       pd.planned_qty AS "planned_qty",
       pd.product_id AS "product_id",
       p.product_form AS "product_form",
       pd.specification AS "specification",
       pd.unit AS "unit",
       pd.line_id AS "line_id",
       l.line_name AS "line_name"
FROM  production_plan pp
JOIN plan_detail pd
ON pp.plan_no = pd.plan_no
JOIN product p
ON pd.product_id = p.product_id
JOIN line l
ON pd.line_id = l.line_id
ORDER BY pd.plan_detail_no DESC;
`;

module.exports = {
  selectAllOrder,
  insertPrdOrderDetail,
  insertPrdOrder,
  SelectMaxOrdNo,
  // startWork,
  insertPerform,
  // selectProcessList,
  insertPrdFlow,
  selectOrderList,
  notRegistPrcList,
  updatePerform,
  selectEname,
  selectStatusCheck,
  insertRequestBom,
  productionOrderList,
  selectProcessingList,
  selectProcessNotSearchList,
  filterPerformance,
  productListModal,
  insertMasterPlan,
  insertDetailPlan,
  checkPlanNo,
  fetchPlanList,
};
