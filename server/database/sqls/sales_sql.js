//주문등록모달
const selectOrdPartnerModal = `
  select partner_id,
         partner_name,
         manager,
         address,
         main_tel,
         email
  from   partner`;
// WHERE  product_type = '완제품'
//주문등록제품선택
const selectOrderProduct = `
  SELECT  product_id,
          product_type,
          product_name,
          specification,
          unit,
          price
  FROM   product
  `;
//주문서모달
const selectOrdersModal = `
SELECT  
    order_id,  
    order_date,  
    order_manager,  
    delivery_addr,  
    manager,  
    partner_name  
FROM orders 
limit 5
`;

//1.order 주문등록
const InsertOrders = `
  INSERT INTO orders (order_id,
                      partner_id,
                      order_date,
                      order_manager,
                      delivery_addr,
                      supply_price,
                      manager,
                      partner_name,
                      total_qty)
  VALUES (?,?,?,?,?,?,?,?,?)`;

//2.주문상세
const InsertOrderItems = `
  INSERT INTO order_items (order_detail_id,
                           item_seq,
                           quantity,
                           specification,
                           del_date,
                           ord_status,
                           product_id,
                           product_name,
                           product_price,
                           supply_price,
                           order_id)
  VALUES (?,?,?,?,?,?,?,?,?,?,?);
`;

//주문번호 순차적으로 증가
const SelectMaxOrderId = `
  SELECT MAX(order_id) AS max_order_id FROM orders
`;

//4.주문조회--  ,    -- 	   o.manager,
const SelectOrders = `
    SELECT o.order_id,
           o.partner_id,
           i.product_id,
           i.product_name,
           o.manager,
           i.quantity,
           o.delivery_addr,
           DATE_FORMAT( o.order_date, '%Y-%m-%d') as order_date,
           DATE_FORMAT( i.del_date, '%Y-%m-%d') as del_date,
           i.ord_status,
           o.order_manager
    FROM   orders o  INNER JOIN  order_items i 
                      ON  o.order_id = i.order_id
   `;

//주문조회 필터링,1.주문번호,2.주문상태 3.규격,4.거래처코드,5제품명,6.납기일
const selectOrderDetail = `
SELECT
    o.order_id,
    o.partner_id,
    o.partner_name,
    i.product_id,
    i.product_name,
    o.manager,
    i.quantity,
    o.delivery_addr,
    DATE_FORMAT( o.order_date, '%Y-%m-%d') as order_date,
    DATE_FORMAT( i.del_date, '%Y-%m-%d') as del_date,
    i.ord_status,
    o.order_manager,
    i.order_detail_id
FROM orders o
JOIN order_items i
    ON o.order_id = i.order_id
WHERE
    (? IS NULL OR ? = '' OR o.order_id LIKE CONCAT('%', ?, '%'))
    AND (? IS NULL OR ? = '' OR i.ord_status = ?)
    AND (? IS NULL OR ? = '' OR i.product_name LIKE CONCAT('%', ?, '%'))
    AND (? IS NULL OR ? = '' OR o.partner_id LIKE CONCAT('%', ?, '%'))
    AND (? IS NULL OR DATE(i.del_date) = ?)
 ORDER by o.order_id desc
`;

const selcetOrderdelDetail = `
SELECT
    o.order_id,
    o.partner_id,
    o.partner_name,
    i.product_id,
    i.product_name,
    o.manager,
    i.quantity,
    o.delivery_addr,
    DATE_FORMAT( o.order_date, '%Y-%m-%d') as order_date,
    DATE_FORMAT( i.del_date, '%Y-%m-%d') as del_date,
    i.ord_status,
    o.order_manager,
    i.order_detail_id
FROM orders o
JOIN order_items i
    ON o.order_id = i.order_id
WHERE
    (? IS NULL OR ? = '' OR o.order_id LIKE CONCAT('%', ?, '%'))
    AND (? IS NULL OR ? = '' OR i.ord_status = ?)
    AND (? IS NULL OR ? = '' OR i.product_name LIKE CONCAT('%', ?, '%'))
    AND (? IS NULL OR ? = '' OR o.partner_id LIKE CONCAT('%', ?, '%'))
    AND (? IS NULL OR DATE(i.del_date) = ?)
 ORDER by o.order_id desc
`;

// SELECT
//     o.order_id,
//     o.partner_id,
//     o.partner_name,
//     i.product_id,
//     i.product_name,
//     o.manager,
//     i.quantity,
//     o.delivery_addr,
//     DATE_FORMAT( o.order_date, '%Y-%m-%d') as order_date,
//     DATE_FORMAT( i.del_date, '%Y-%m-%d') as del_date,
//     i.ord_status,
//     o.order_manager,
//     i.order_detail_id
// FROM orders o
// JOIN order_items i
//     ON o.order_id = i.order_id
// WHERE
//     — 1. 주문번호 필터: 와일드카드를 뒤에만 사용하여 인덱스를 활용 (전방 일치 검색)
//     (? IS NULL OR ? = '' OR o.order_id LIKE CONCAT(?, '%'))
//     AND (? IS NULL OR ? = '' OR i.ord_status = ?)
//     — 2. 제품명 필터: 와일드카드를 뒤에만 사용하여 인덱스를 활용
//     AND (? IS NULL OR ? = '' OR i.product_name LIKE CONCAT(?, '%'))
//     — 3. 거래처코드 필터: 와일드카드를 뒤에만 사용하여 인덱스를 활용
//     AND (? IS NULL OR ? = '' OR o.partner_id LIKE CONCAT(?, '%'))
//     AND (? IS NULL OR DATE(i.del_date) = ?)
// ORDER BY o.order_id DESC
// LIMIT 100; — 4. 한 번에 가져올 데이터 수를 제한 (선택 사항)
//주문서클릭시 하단(주문상세)
const selectShipDetail = `
SELECT
    o.order_id,
    o.partner_id,
    o.partner_name,
    i.product_id,
    i.product_name,
    o.manager,
    i.quantity,
    o.delivery_addr,
    DATE_FORMAT(o.order_date, '%Y-%m-%d') AS order_date,
    DATE_FORMAT(i.del_date, '%Y-%m-%d') AS del_date,
    i.ord_status,
    o.order_manager,
    i.order_detail_id,
    i.item_seq,
    COALESCE(pl.curr_qty, 0) AS curr_qty,
    COALESCE(sd.shipped_qty, 0) AS shipped_qty
FROM orders o
JOIN order_items i
    ON o.order_id = i.order_id
LEFT JOIN (
    SELECT product_id, SUM(curr_qty) AS curr_qty
    FROM tbl_prd_lot
    GROUP BY product_id
) pl ON pl.product_id = i.product_id
LEFT JOIN (
    SELECT order_detail_id, SUM(shipment_qty) AS shipped_qty
    FROM shipment
    GROUP BY order_detail_id
) sd ON sd.order_detail_id = i.order_detail_id
WHERE o.order_id = ?
 `;
//출하요청등록대상(주문서)조회,(등록일의 처음과 끝을 별칭으로 구분)
const selectShipOrders = `
SELECT
    o.order_id,
    o.partner_id,
    o.partner_name,
    o.manager,
    o.delivery_addr,
    o.total_qty,
    DATE_FORMAT(o.order_date, '%Y-%m-%d') as order_date,
    MAX(i.ord_status) as ord_status,
    o.order_manager
FROM orders o
JOIN order_items i ON o.order_id = i.order_id
WHERE
    (? IS NULL OR ? = '' OR o.partner_id LIKE CONCAT('%', ?, '%'))
    AND (? IS NULL OR ? = '' OR i.product_id LIKE CONCAT('%', ?, '%'))
    AND (? IS NULL OR o.order_date >= ?)
    AND (? IS NULL OR o.order_date <= ?)
GROUP BY o.order_id, o.partner_id, o.partner_name, o.manager, o.delivery_addr, o.order_date, o.order_manager
`;

const insertShip = `
INSERT INTO shipment(
    shipment_id,
    item_seq,
    product_code,
    shipment_qty,
    shipment_date, 
    ship_status,
    order_manager,
    product_name,
    order_detail_id
) VALUES(?,?,?,?,?,?,?,?,?)
`;

// 출하등록번호 순차적으로 증가
const SelectMaxShipId = `
  SELECT MAX(shipment_id) AS max_shipment_id FROM shipment
  `;

//주문상세번호 순차적으로 증가
const orderDetailId = ` 
SELECT MAX(order_detail_id) AS max_order_detail_id FROM order_items
`;

//출하등록조회
const shipList = `
SELECT  s.shipment_id,
        o.order_id,
        i.product_id,
        i.product_name,
        o.partner_name,
        i.quantity,
        o.order_date,
        o.manager,
        o.delivery_addr,
        DATE_FORMAT(i.del_date, '%Y-%m-%d') as del_date,
        DATE_FORMAT(s.shipment_date, '%Y-%m-%d') as shipment_date,
        s.ship_status,
        o.order_manager
FROM  orders o
JOIN   order_items i ON i.order_id = o.order_id
JOIN   shipment s ON i.order_detail_id = s.order_detail_id
WHERE
     (? IS NULL OR o.partner_id LIKE CONCAT('%', ?, '%'))
     AND (? IS NULL OR i.product_id LIKE CONCAT('%', ?, '%'))
     AND (? IS NULL OR s.ship_status = ?)
     AND (? IS NULL OR DATE(i.del_date) >= ?)
     AND (? IS NULL OR DATE(i.del_date) <= ?)
ORDER by s.shipment_id desc
`;

//주문수정조회
const modifypreList = `
    SELECT o.order_id,
           o.partner_id,
           i.product_name,
           o.manager,
           i.quantity,
           o.delivery_addr,
           DATE_FORMAT( o.order_date, '%Y-%m-%d') as order_date,
           DATE_FORMAT( i.del_date, '%Y-%m-%d') as del_date,
           i.ord_status,
           o.order_manager,
          i.order_detail_id
    FROM   orders o  INNER JOIN  order_items i
                      ON  o.order_id = i.order_id
`;

//납기일수정
const modifyDelDate = `
      UPDATE order_items SET
      del_date = ?
      WHERE
      order_detail_id = ?`;

// history_id 순차적으로 증가
const SelectMaxHistoryId = `
  SELECT MAX(history_id) AS max_history_id FROM order_history`;

//변경이력등록
const modifyInsert = `
  INSERT INTO order_history (history_id,order_date,new_due_date,change_reason,order_detail_id) 
  VALUES (?,?,?,?,?)`;

//변경내역
const modifyNextList = `
SELECT
    o.order_id,
    o.partner_id,
    o.partner_name,
    i.product_id,
    i.product_name,
    o.manager,
    i.quantity,
    o.delivery_addr,
    DATE_FORMAT(o.order_date, '%Y-%m-%d') as order_date,
    DATE_FORMAT(i.del_date, '%Y-%m-%d') as del_date,
    DATE_FORMAT(h.change_date, '%Y-%m-%d') as change_date,
    o.order_manager,
    h.change_reason  
FROM orders o
INNER JOIN order_items i
    ON o.order_id = i.order_id
INNER JOIN order_history h  
    ON i.order_detail_id = h.order_detail_id
WHERE
    (? IS NULL OR ? = '' OR o.order_id LIKE CONCAT('%', ?, '%'))
    AND (? IS NULL OR ? = '' OR i.ord_status = ?)
    AND (? IS NULL OR ? = '' OR i.product_name LIKE CONCAT('%', ?, '%'))
    AND (? IS NULL OR ? = '' OR o.partner_id LIKE CONCAT('%', ?, '%'))
    AND (? IS NULL OR DATE(i.del_date) = ?)
    
`;

//이메일+pdf관련 주문서조회
const mailPdfOrderList = `
SELECT
  o.order_id,
  o.partner_id,
  i.product_id,
  o.partner_name,
  o.delivery_addr,
  o.total_qty,
  o.order_manager,
  DATE_FORMAT(o.order_date, '%Y-%m-%d') as order_date,
  p.email AS partner_email,
  e.email AS order_manager_email,
  GROUP_CONCAT(DISTINCT i.product_name ORDER BY i.item_seq SEPARATOR ', ') AS product_name,
  MAX(DATE_FORMAT(i.del_date, '%Y-%m-%d')) AS del_date
FROM
  orders o
JOIN
  partner p ON o.partner_id = p.partner_id
LEFT JOIN
  employee e ON o.order_manager = e.employee_id
LEFT JOIN
  order_items i ON o.order_id = i.order_id
WHERE
  (? IS NULL OR ? = '' OR o.order_id LIKE CONCAT('%', ?, '%'))
  AND (? IS NULL OR ? = '' OR o.partner_id LIKE CONCAT('%', ?, '%'))
  AND (? IS NULL OR ? = '' OR i.product_name LIKE CONCAT('%', ?, '%'))
  AND (? IS NULL OR DATE(i.del_date) = ?)
GROUP BY
  o.order_id, i.product_id, o.partner_id, o.partner_name, o.delivery_addr, o.total_qty, o.order_manager, o.order_date, p.email, e.email
ORDER BY
  o.order_id desc
`;

//주문서목록 클릭 호출되는 상세 정보
const selectOrderDetailsByOrderId = `
SELECT
  o.order_id,
  o.partner_id,
  p.partner_name,
  p.email AS partner_email,
  o.delivery_addr,
  o.order_manager,
  o.manager,
  e.email AS order_manager_email,
  o.total_qty,
  DATE_FORMAT(o.order_date, '%Y-%m-%d') AS order_date,
  DATE_FORMAT(i.del_date, '%Y-%m-%d') AS del_date,
  i.product_name,
  i.specification,
  i.quantity,
  i.product_price,
  i.supply_price,
  e.phone
FROM
  orders o
JOIN
  partner p ON o.partner_id = p.partner_id
JOIN
  order_items i ON o.order_id = i.order_id
LEFT JOIN
  employee e ON o.manager = e.name
WHERE
  o.order_id = ?
`;

//반품내역
const returnList = `
SELECT    s.shipment_id,
          r.return_id,
          s.shipment_date,
          s.prd_out_no,
          i.product_id,
          i.product_name,
          o.partner_id,
          o.partner_name,
          o.manager,
          i.quantity,
          o.delivery_addr,
          DATE_FORMAT( i.del_date, '%Y-%m-%d') as del_date,
          DATE_FORMAT( r.return_date, '%Y-%m-%d') as return_date,
          r.return_reason,
          r.re_status,
          o.order_manager
  FROM   order_items i 
  INNER JOIN returns r ON i.order_detail_id = r.order_detail_id
  INNER JOIN orders o ON i.order_id = o.order_id
  INNER JOIN shipment s ON i.order_detail_id = s.order_detail_id
  WHERE
    (? IS NULL OR ? = '' OR o.order_id LIKE CONCAT('%', ?, '%'))
    AND (? IS NULL OR ? = '' OR r.re_status = ?)
    AND (? IS NULL OR ? = '' OR o.partner_id LIKE CONCAT('%', ?, '%'))
    AND (? IS NULL OR DATE(r.return_date) >= ?)
    AND (? IS NULL OR DATE(r.return_date) <= ?)
    ORDER by r.return_id desc
  `;

//반품등록
const returnRegist = `
  INSERT INTO returns(
    return_id,
    order_detail_id,
    product_id,
    quantity,
    return_date,
    return_reason,
    order_manager,
    re_status,
    in_date,
    warehouse_name,
    prd_id,
    shipment_id
  ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
`;

//반품번호 순차적 증가
const SelectMaxReturnId = `
  SELECT COALESCE(MAX(return_id), 'RTN000') AS max_return_id FROM returns`;

//반품등록조회관련 select
const selectReturnPreList = `
SELECT
    o.order_id,
    o.partner_id,
    o.partner_name,
    i.product_id,
    i.product_name,
    o.manager,
    o.order_manager,
    i.quantity,
    o.delivery_addr,
    DATE_FORMAT(o.order_date, '%Y-%m-%d') AS order_date,
    DATE_FORMAT(i.del_date, '%Y-%m-%d') AS del_date,
    i.ord_status,
    i.order_detail_id,
    tpo.prd_id,
    s.shipment_id,
    s.prd_out_no,
    r.in_date
FROM orders o
JOIN order_items i
    ON o.order_id = i.order_id
LEFT JOIN (
    SELECT product_id, MAX(prd_id) AS prd_id
    FROM tbl_prd_out
    GROUP BY product_id
) tpo ON i.product_id = tpo.product_id
INNER  JOIN (
    SELECT order_detail_id, MAX(shipment_id) AS shipment_id, MAX(prd_out_no) AS prd_out_no
    FROM shipment
    GROUP BY order_detail_id
) s ON i.order_detail_id = s.order_detail_id
LEFT JOIN (
    SELECT order_detail_id, MAX(in_date) AS in_date
    FROM returns
    GROUP BY order_detail_id
) r ON i.order_detail_id = r.order_detail_id
WHERE
    (? IS NULL OR ? = '' OR o.order_id LIKE CONCAT('%', ?, '%'))
    AND (? IS NULL OR ? = '' OR i.ord_status = ?)
    AND (? IS NULL OR ? = '' OR i.product_name LIKE CONCAT('%', ?, '%'))
    AND (? IS NULL OR ? = '' OR o.partner_id LIKE CONCAT('%', ?, '%'))
    AND (? IS NULL OR DATE(i.del_date) = ?)
ORDER BY s.shipment_id DESC`;

// const selectReturnPreList = `
// SELECT
//     o.order_id,
//     o.partner_id,
//     o.partner_name,
//     i.product_id,
//     i.product_name,
//     o.manager,
//     o.order_manager,
//     i.quantity,
//     o.delivery_addr,
//     DATE_FORMAT( o.order_date, '%Y-%m-%d') as order_date,
//     DATE_FORMAT( i.del_date, '%Y-%m-%d') as del_date,
//     i.ord_status,
//     i.order_detail_id,
//     MAX(tpo.prd_id) AS prd_id,
//     s.shipment_id,
//     r.in_date
// FROM orders o
// JOIN order_items i
//     ON o.order_id = i.order_id
// LEFT JOIN tbl_prd_out tpo
//     ON i.product_id = tpo.product_id
// LEFT JOIN shipment s
//     ON i.order_detail_id = s.order_detail_id
// LEFT JOIN returns r
//     ON i.order_detail_id = r.order_detail_id
// WHERE
//     (? IS NULL OR ? = '' OR o.order_id LIKE CONCAT('%', ?, '%'))
//     AND (? IS NULL OR ? = '' OR i.ord_status = ?)
//     AND (? IS NULL OR ? = '' OR i.product_name LIKE CONCAT('%', ?, '%'))
//     AND (? IS NULL OR ? = '' OR o.partner_id LIKE CONCAT('%', ?, '%'))
//     AND (? IS NULL OR DATE(i.del_date) = ?)
// GROUP BY
//     o.order_id, o.partner_id, o.partner_name, i.product_id, i.product_name, o.manager,
//     i.quantity, o.delivery_addr, o.order_date, i.del_date, i.ord_status, o.order_manager,
//     i.order_detail_id, s.shipment_id, r.in_date
// `;

module.exports = {
  selectOrdPartnerModal,
  selectOrderProduct,
  InsertOrders,
  InsertOrderItems,
  SelectOrders,
  SelectMaxOrderId,
  selectOrderDetail,
  selectShipDetail,
  selectShipOrders,
  insertShip,
  shipList,
  modifyDelDate,
  modifyInsert,
  SelectMaxHistoryId,
  modifypreList,
  orderDetailId,
  SelectMaxShipId,
  modifyNextList,
  mailPdfOrderList,
  selectShipDetail,
  returnList,
  returnRegist,
  SelectMaxReturnId,
  selectReturnPreList,
  selectOrderDetailsByOrderId,
  selcetOrderdelDetail,
  selectOrdersModal,
};
