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
const insertPerform = `
insert into performance(pf_code , wo_no , p_st_date , p_ed_date, eq_code, eq_name, prc_code , prc_name , in_qty , d_cty, qty , line_id, prd_name)
values(?,?,?,?,?,?,?,?,?,?,?,?)
`;

module.exports = { startWork, insertPerform };
