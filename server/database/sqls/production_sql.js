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
             prd_form
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
              ?
          );
      `;
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
const insertPrdFlow = `
INSERT INTO prd_flow(wo_no,use_order , process_id , equipment_id, prd_noworder_qty , in_qty , def_qty , qty , status)
SELECT pod.wo_no, ld.use_order, ld.process_id, ld.equipment_id, pod.prd_noworder_qty, 0, 0, 0, 1
FROM line_detail ld JOIN prd_order_detail pod
ON ld.line_id = pod.line_id
WHERE
    pod.wo_no IN (
        SELECT wo_no FROM prd_order_detail
        WHERE ord_no = ? -- 방금 삽입된 ord_no
    );
`;
const insertPerform = `
insert into performance(pf_code , wo_no , p_st_date , p_ed_date, eq_code, eq_name, prc_code , prc_name , in_qty , d_cty, qty , line_id, prd_name)
values(?,?,?,?,?,?,?,?,?,?,?,?)
`;

module.exports = {
  insertPrdOrderDetail,
  insertPrdOrder,
  SelectMaxOrdNo,
  // startWork,
  insertPerform,
  // selectProcessList,
  insertPrdFlow,
};
