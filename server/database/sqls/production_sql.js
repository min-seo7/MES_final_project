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

const selectProcessList=`
select pd.wo_no, 
       pd.p_st_date,
       pd.p_ed_date,
       pd.prd_noworder_qty,
       p.product_id,
       pd.product_name,
       pd.specification,
       pd.unit,
       pd.prd_form,
       l.line_id,
       l.line_name,
       ld.process_id,
       ld.equipment_id,
       eq.equipment_name,
       fd.status
from prd_order_detail pd
join line_detail ld
on(pd.line_id = ld.line_id)
join equipment eq
on(ld.equipment_id = eq.equipment_id)
join line l
on(l.line_id = ld.line_id)
join flowchart_detail fd
on(ld.process_id = fd.process_id)
join product p
on(pd.product_name = p.product_name)
order by l.line_name;
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
  selectProcessList,
};
