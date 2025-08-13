//원자재(모달용)
let matListQuery = `SELECT material_id, 
	                         material_name,
	                         material_type,
                           unit       
                    FROM material
                    WHERE status = '활성'
                    AND material_type = '원자재'`;

//거래처 모달
let partnerListQuery = `SELECT partner_type,
                                  partner_id, 
                                  partner_name
                            FROM partner
                            WHERE status = '활성';`;

//제품(모달용)
let productListQuery = `SELECT product_id, 
                               product_type,
                               product_name
                        FROM product
                        WHERE status = '활성'`;

//보관창고 (모달)
let warehouseListQuery = `SELECT warehouse_id,
	                              warehouse,
                                warehouse_type
                         FROM warehouse
                         WHERE status = '활성'`;

//발주등록=====================================================
//마스터T 기본정보
let masterInfoPro = `CALL insert_purchase_master(?, ?, ?, ?)`;
//서브T 등록
let subInfoQuery = `INSERT INTO tbl_purchase_detail (material_id, pur_qty, comm, pur_no)
                    VALUES (?, ?, ?, ?)`;
//발주목록=================================================
//리스트
let purchaseListQuery = `SELECT DATE_FORMAT(m.re_date, '%Y-%m-%d') AS re_date,
                                  m.pur_no,
                                  s.material_id,
                                  b.material_name,
                                  s.pur_qty,
                                  b.unit, 
                                  p.partner_name, 
                                  m.manager, 
                              DATE_FORMAT(m.due_date, '%Y-%m-%d') AS due_date,
                                s.pro_status
                          FROM tbl_purchase m
                          JOIN tbl_purchase_detail s
                              ON m.pur_no = s.pur_no
                          JOIN material b
                              ON  s.material_id = b.material_id
                          JOIN partner p
                              ON m.partner_id = p.partner_id
                          WHERE s.pro_status NOT IN ('취소')`;

//발주취소[발주번호 기준, 해당자재코드]
let purchaseCancelQuery = `UPDATE  tbl_purchase_detail
                              SET pro_status = '취소'
                           WHERE pur_no = ?
                             AND material_id = ?`;

//자재관리===================================================================
//자재입고
//자재입고대기
let MatPandigListQuery = `SELECT  DATE_FORMAT(p.due_date, '%Y-%m-%d') AS due_date,
                                  d.pur_no,
                                  t.material_code,
                                  m.material_name,
                                  t.result, 
                                  t.qty,
                                  m.unit,
                                  pa.partner_name,
                                  t.materialOrder_num,
                                  d.purch_id
                          FROM material_Inspection t
                          JOIN tbl_purchase_detail d
                          ON t.purch_id = d.purch_id
                          JOIN tbl_purchase p
                          ON p.pur_no = d.pur_no
                          JOIN material m
                          ON t.material_code = m.material_id
                          JOIN partner pa
                          ON p.partner_id = pa.partner_id
                          WHERE d.pro_status NOT IN ('취소', '입고완료')`;

//자재입고처리
let matInsertQuery = `CALL insert_mat_lot(?, ?, ?, ?, ?, ?)`;

//자재LOT목록(입고)
let matLotListQury = `SELECT DATE_FORMAT(l.open_date, '%Y-%m-%d') AS open_date,
                             l.lot_no, 
                             l.material_id, 
                             m.material_name,
                             l.init_qty,
                             m.unit,
                             l.warehouse, 
                             l.comm
                      FROM tbl_mat_lot l
                      JOIN material m
                      ON l.material_id = m.material_id;`

module.exports = {
  matListQuery,
  productListQuery,
  masterInfoPro,
  subInfoQuery,
  partnerListQuery,
  purchaseListQuery,
  purchaseCancelQuery,
  warehouseListQuery,
  MatPandigListQuery,
  matInsertQuery,
  matLotListQury
};
