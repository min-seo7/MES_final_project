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
                            WHERE status = '활성'`;

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
//안전재고 미달 출력
let lessMatListQuery = `SELECT ml.material_id,
                               m.material_name,
                           SUM(ml.curr_qty) AS total_curr_qty,
                              m.safety_stock,
                              (m.safety_stock - SUM(ml.curr_qty)) AS less,
                              m.unit
                       FROM tbl_mat_lot ml
                       JOIN material m ON ml.material_id = m.material_id
                       WHERE ml.pro_status NOT IN ('입고취소', '종료')
                       GROUP BY ml.material_id, 
                               m.material_name, 
                               m.safety_stock,
                               m.unit
                       HAVING total_curr_qty < m.safety_stock`;

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
                                  s.pro_status,
                                  s.comm
                          FROM tbl_purchase m
                          JOIN tbl_purchase_detail s
                          ON m.pur_no = s.pur_no
                          JOIN material b
                          ON  s.material_id = b.material_id
                          JOIN partner p
                          ON m.partner_id = p.partner_id
                          WHERE s.pro_status NOT IN ('취소')
                          ORDER BY m.re_date DESC`;

//발주취소[발주번호 기준, 해당자재코드]
let purchaseCancelQuery = `UPDATE tbl_purchase_detail
                              SET pro_status = '취소'
                           WHERE pur_no = ?
                             AND material_id = ?`;
//발주목록 내 조회
let purchaseSearchQuery = `SELECT DATE_FORMAT(m.re_date, '%Y-%m-%d') AS re_date,
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
                          ON s.material_id = b.material_id
                          JOIN partner p 
                          ON m.partner_id = p.partner_id
                          WHERE 1=1`;
/* 조건문은 서비스영역 안에서 추가 가능 */

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
                          WHERE d.pro_status NOT IN ('취소', '입고완료', '반품')
                          AND t.lot_pro NOT IN ('생성', '반품')
                          ORDER BY p.due_date DESC`;

//자재입고처리
let matInsertQuery = `CALL insert_mat_lot(?, ?, ?, ?, ?, ?)`;

//자재LOT목록(입고)
let matLotListQuery = `SELECT DATE_FORMAT(l.open_date, '%Y-%m-%d') AS open_date,
                             l.lot_no, 
                             l.material_id, 
                             m.material_name,
                             l.init_qty,
                             m.unit,
                             l.warehouse, 
                             l.comm
                      FROM tbl_mat_lot l
                      JOIN material m
                      ON l.material_id = m.material_id
                      WHERE l.pro_status = '등록'
                      ORDER BY l.open_date DESC`;
//자재반품
let matReturnQuery = `CALL mat_return(?, ?, ?)`;

//입고취소
let matLotCancelQuery = ` UPDATE  tbl_mat_lot
                     SET pro_status = '입고취소'
                     WHERE lot_no = ?`;

//제품
//제품입고===========================================================================
//제품입고대기목록
// 테이블 다시 진행해야함!!!!!!!!!
let prdPendigListQuery = `select DATE_FORMAT(zt.inspection_date, '%Y-%m-%d') AS inspection_date,
zt.inspection_id,
p.product_type,
zt.product_id,
p.product_name,
zt.qty,
p.unit
from ztestprdresult zt
JOIN product p
ON zt.product_id = p.product_id
WHERE zt.judgment = '합격'
AND zt.pro_status ='미생성'`; 
// //쿼리 만들어진걸로 수정해야 함.
// -> 입고처리완료 상태값 필요함 목록출력제어위해서..

//제품입고처리
let prdInsertQuery = `CALL insert_prd_lot(?, ?, ?, ?, ?)`;
//제품입고완료목록
let prdLotListQuerty = `SELECT DATE_FORMAT(pl.open_date, '%Y-%m-%d') AS open_date,
                          pl.prd_lot_no,
                          p.product_type,
                          pl.product_id,
                          p.product_name,
                          pl.init_qty,
                          p.unit,
                          pl.warehouse,
                          pl.e_name,
                          pl.comm
                  FROM tbl_prd_lot pl
                  JOIN product p
                  ON pl.product_id = p.product_id
                  WHERE pl.pro_status = '등록'
                  ORDER BY pl.open_date DESC`;

//입고취소
let prdLotCancelQuery = ` UPDATE tbl_prd_lot
                          SET pro_status = '입고취소'
                          WHERE prd_lot_no  = ?`;

//자재출고===================================================
//자재출고요청목록
let matReqListQuery = `SELECT DATE_FORMAT(mr.req_date, '%Y-%m-%d') AS req_date,
                             mr.wo_no,
                             mr.material_id,
                             m.material_name,
                             mr.req_qty,
                             m.unit,
                             mr.req_id
                     FROM tbl_mat_req mr
                     JOIN material m
                     ON mr.material_id = m.material_id
                     WHERE pro_status = '출고대기'
                     ORDER BY mr.req_date DESC`;

let matOutReQuery = `CALL mat_outbound(?, ?, ?, ?)`;

let matOutListQuery = `SELECT DATE_FORMAT(mo.out_date, '%Y-%m-%d') AS out_date,
		                mr.wo_no,
                              mo.material_id,
                              m.material_name,
                              mo.out_qty,
                              m.unit,
                              mo.comm
                       from tbl_mat_out mo
                       LEFT JOIN tbl_mat_req mr
                       ON mo.req_id = mr.req_id
                       LEFT JOIN material m
                       ON mo.material_id = m.material_id
                       ORDER BY out_date DESC`;

//제품출고======================================================
//제품출고대기목록
let prdShipWaitListQurey = `SELECT DATE_FORMAT(sh.shipment_date, '%Y-%m-%d') AS shipment_date,
                                   sh.shipment_id,
                                   sh.product_code, 
                                   p.product_type,
                                   p.product_name,
                                   sh.shipment_qty,
                                   pt.partner_name
                            FROM shipment sh
                            JOIN product p
                            ON sh.product_code = p.product_id
                            JOIN order_items oi
                            ON sh.order_detail_id = oi.order_detail_id
                            JOIN orders o
                            ON oi.order_id = o.order_id
                            JOIN partner pt
                            ON o.partner_id = pt.partner_id
                            WHERE sh.ship_status = 1
                            ORDER BY sh.shipment_date DESC`;
//제품제고확인
let checkStockQuery = `SELECT pl.product_id,
                         p.product_name,
                         SUM(pl.curr_qty) AS total_qty
                  FROM tbl_prd_lot pl
                  JOIN product p
                  ON pl.product_id = p.product_id
                  WHERE 1=1`;
//출고등록
let prdOutRQuery = `CALL prd_outbound(?, ?, ?, ?, ?, ?)`;
//제품출고목록
let prdOutListQuery = `SELECT DATE_FORMAT(po.ship_date, '%Y-%m-%d') AS ship_date,
                                    po.prd_out_no,
                                    p.product_type,
                                    po.product_id,
                                    p.product_name,
                                    po.prd_out_qty,
                                    po.e_name,
                                    o.partner_name,
                                    po.ship_partner,
                                    po.comm
                          FROM tbl_prd_out po
                          LEFT JOIN shipment s
                          ON po.shipment_id = s.shipment_id
                          LEFT JOIN product p
                          ON po.product_id = p.product_id
                          LEFT JOIN order_items oi
                          ON s.order_detail_id = oi.order_detail_id
			     LEFT JOIN orders o
			     ON oi.order_id = o.order_id
                          ORDER BY ship_date DESC`;

//조회
let prdShipWaitSearchQurey = `SELECT DATE_FORMAT(sh.shipment_date, '%Y-%m-%d') AS shipment_date,
                                   sh.shipment_id,
                                   sh.product_code, 
                                   p.product_type,
                                   p.product_name,
                                   sh.shipment_qty,
                                   pt.partner_name
                            FROM shipment sh
                            JOIN product p
                            ON sh.product_code = p.product_id
                            JOIN order_items oi
                            ON sh.order_detail_id = oi.order_detail_id
                            JOIN orders o
                            ON oi.order_id = o.order_id
                            JOIN partner pt
                            ON o.partner_id = pt.partner_id
                            WHERE 1=1`;

//재고조회========================================================================================
//제품재고조회(첫목록)
let searchPrdListQuery = `SELECT DATE_FORMAT(pl.open_date, '%Y-%m-%d') AS open_date,
                                   pl.prd_lot_no,
                                   p.product_type,
                                   pl.product_id,
                                   p.product_name,
                                   pl.curr_qty,
                                   p.unit,
                                   pl.warehouse,
                                   pl.pro_status
                           FROM tbl_prd_lot pl
                           JOIN product p
                           ON pl.product_id = p.product_id
                           WHERE pl.pro_status NOT IN ('입고취소', '종료')
                           ORDER BY pl.open_date`;

let searchPrdLotSearchQuery = `SELECT DATE_FORMAT(pl.open_date, '%Y-%m-%d') AS open_date,
                                   pl.prd_lot_no,
                                   p.product_type,
                                   pl.product_id,
                                   p.product_name,
                                   pl.curr_qty,
                                   p.unit,
                                   pl.warehouse,
                                   pl.pro_status
                           FROM tbl_prd_lot pl
                           JOIN product p
                           ON pl.product_id = p.product_id
                           WHERE 1=1`;
//반품=============================================================
let returnListQurey = `SELECT DATE_FORMAT(re.return_date, '%Y-%m-%d') AS return_date,
                            re.id,
                            po.prd_out_no,
                            p.product_type,
                            re.product_id,
                            p.product_name,
                            re.quantity,
                            p.unit,
                            re.inbound_pro,
				re.warehouse_name,
                            re.in_qty,
                            re.in_comm
                       FROM returns re
                       JOIN tbl_prd_out po
                       ON re.shipment_id = po.shipment_id
                       JOIN product p
                       ON re.product_id = p.product_id`;

let returnReQuery = `UPDATE returns
                     SET in_date = now(),
	                  warehouse_name = ?,
                         in_qty = ?,
                         in_comm = ?,
                         re_status = 2,
                         inbound_pro = '확정'    
                     WHERE id = ?;`;
//================================================================
//자재재고조회
//자재재고조회(첫목록)
let searchMatListQuery = `SELECT DATE_FORMAT(ml.open_date, '%Y-%m-%d') AS open_date,
                                   ml.lot_no,
                                   ml.material_id,
                                   m.material_name,
                                   ml.curr_qty,
                                   m.unit,
                                   ml.warehouse,
                                   ml.pro_status
                        FROM tbl_mat_lot ml
                        JOIN material m
                        ON ml.material_id = m.material_id
                        WHERE ml.pro_status NOT IN ('입고취소', '종료')
                        ORDER BY ml.open_date`;

let searchMatLotSearchQuery = `SELECT DATE_FORMAT(ml.open_date, '%Y-%m-%d') AS open_date,
                                   ml.lot_no,
                                   ml.material_id,
                                   m.material_name,
                                   ml.curr_qty,
                                   m.unit,
                                   ml.warehouse,
                                   ml.pro_status
                        FROM tbl_mat_lot ml
                        JOIN material m
                        ON ml.material_id = m.material_id
                        WHERE 1=1`;

//폐기물=====================================================================
//목록
let wasteListQurey = `SELECT tw.seq,
                            DATE_FORMAT(tw.re_date, '%Y-%m-%d') AS re_date,
                            tw.waste_id,
                            tw.waste_name,
                            tw.qty,
                            tw.unit,
                            w.warehouse,
                            tw.pro_status,
                            DATE_FORMAT(tw.out_date, '%Y-%m-%d') AS out_date,
                            p.partner_name,
                            tw.comm
                     FROM tbl_waste tw
                     LEFT JOIN warehouse w
                     ON tw.warehouse_id = w.warehouse_id
                     LEFT JOIN partner p
                     ON tw.partner_id = p.partner_id
                     ORDER BY tw.re_date DESC`;
//등록
let wasteOutQuery = `UPDATE tbl_waste
                     SET out_date = ?,
	                  partner_id = ?,
                         comm = ?,
                         pro_status = '확정'
                     WHERE seq = ?`;
//수정
let wasteUpdate = `update tbl_waste
                   set pro_status = '대기'
                   where seq = ?`;

//조회
let wasteSearchQuery = `SELECT tw.seq,
                            DATE_FORMAT(tw.re_date, '%Y-%m-%d') AS re_date,
                            tw.waste_id,
                            waste_name,
                            tw.qty,
                            tw.unit,
                            w.warehouse,
                            tw.pro_status,
                            DATE_FORMAT(tw.out_date, '%Y-%m-%d') AS out_date,
                            p.partner_name,
                            tw.comm
                     FROM tbl_waste tw
                     LEFT JOIN warehouse w
                     ON tw.warehouse_id = w.warehouse_id
                     LEFT JOIN partner p
                     ON tw.partner_id = p.partner_id
                     WHERE 1=1`;
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
  matLotListQuery,
  matReturnQuery,
  matLotCancelQuery,
  prdOutListQuery,
  prdShipWaitListQurey,
  prdOutListQuery,
  purchaseSearchQuery,
  prdPendigListQuery,
  prdInsertQuery,
  prdLotListQuerty,
  lessMatListQuery,
  searchMatListQuery,
  searchMatLotSearchQuery,
  searchPrdListQuery,
  searchPrdLotSearchQuery,
  prdLotCancelQuery,
  wasteListQurey,
  wasteOutQuery,
  prdShipWaitSearchQurey,
  wasteSearchQuery,
  prdOutRQuery,
  matReqListQuery,
  matOutListQuery,
  matOutReQuery,
  returnListQurey,
  returnReQuery,
  wasteUpdate,
  checkStockQuery,
};
