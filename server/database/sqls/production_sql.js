const SelectMaxOrdNo = `SELECT MAX(ord_no) AS max_ord_no FROM production_order`;
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
              CONCAT('wo', DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(NEXT VALUE FOR prd_wo_no_seq, 3, '0')),
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
INSERT INTO tbl_mat_req (material_id, req_qty , wo_no)
SELECT DISTINCT bd.material_id, bd.required_qty * ? AS req_qty, pod.wo_no
FROM bom_detail bd
JOIN prd_order_detail pod
ON SUBSTR(pod.ord_no, 4, 8) = DATE_FORMAT(CURDATE(), '%Y%m%d')
JOIN production_order po
ON po.ord_no = pod.ord_no
WHERE bd.bom_id IN (?);`;

const startWork = `START TRANSACTION;
 SET @master_ord_no = CONCAT(
        'ord',
        DATE_FORMAT(NOW(), '%Y%m%d'),
        '-',
        LPAD(NEXT VALUE FOR ord_no_seq, 3, '0')
)
insert into production_order(ord_no , director)
values( @master_ord_no,'김지시')

insert into prd_order_detail(wo_no , p_st_date , p_ed_date, prd_noworder_qty , line_id , product_name , ord_no , plan_detail_no)
values(CONCAT('wo', DATE_FORMAT(NOW(), '%Y%m%d'),'-',LPAD(NEXT VALUE FOR prd_wo_no_seq, 3, '0')),
        ?,  ?,  ?,  ?,  ?,  @master_ord_no,  ?)

commit;`;
// CONCAT(
//     'ord',
//     DATE_FORMAT(NOW(), '%Y%m%d'),
//     '-',
//     LPAD(NEXT VALUE FOR ord_no_seq, 3, '0')
// )

// const selectProcessList = `
// SELECT
//     pod.wo_no AS 'wo_no',
//     pod.line_id AS 'line_id',
//     pod.product_name AS 'product_name',
//     pod.specification AS 'specification',
//     pod.unit AS 'unit',
//     pod.prd_form AS 'prd_form',
//     fd.use_order AS 'use_order',
//     fd.process_id AS 'process_id',
//     prc.process_name AS 'process_name',
//     eq.equipment_name AS 'equipment_name',
//     eq.equipment_id AS 'equipment_id',
//     pod.prd_noworder_qty AS 'prd_noworder_qty'
// FROM
//     prd_order_detail pod
// JOIN
//     flowchart_detail fd
//       ON pod.product_name = (select product_name
//                              from flowchart_detail
//                              group by product_name)
// JOIN
//     line_detail ld
//      ON fd.process_id = ld.process_id
//      AND pod.line_id = ld.line_id
// JOIN process prc
// ON fd.process_id = prc.process_id
// JOIN equipment eq
// ON ld.equipment_id = eq.equipment_id
// WHERE status = 1
// `;
// const insertPrdFlow = `
// INSERT INTO prd_flow(wo_no,use_order , process_id , equipment_id, prd_noworder_qty , in_qty , def_qty , qty , status)
// SELECT pod.wo_no, ld.use_order, ld.process_id, ld.equipment_id, pod.prd_noworder_qty, 0, 0, 0, 1
// FROM line_detail ld JOIN prd_order_detail pod
// ON ld.line_id = pod.line_id
// WHERE
//     pod.wo_no IN (
//         SELECT wo_no FROM prd_order_detail
//         WHERE ord_no = ? -- 방금 삽입된 ord_no 지시가 생성될떄 newOrderId를 그대로 들고와서 넣는거라 의문
//     );
// `;
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
values(?,?,?,?,?,?,?,?,?,?,?,?,2);
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
};
