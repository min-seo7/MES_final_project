//주문등록모달
const selectOrdPartnerModal = `
  select partner_id,
        partner_name,
        manager,
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
`;
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
      DATE_FORMAT( o.order_date, '%Y-%m-%d') as order_date,
      DATE_FORMAT( i.del_date, '%Y-%m-%d') as del_date,
      i.ord_status,
      o.order_manager,
      i.order_detail_id,
      i.item_seq
  FROM orders o
  JOIN order_items i
      ON o.order_id = i.order_id
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
  SELECT MAX(shipment_id) AS max_shipment_id FROM shipment`;

//주문상세번호 순차적으로 증가
const orderDetailId = ` 
SELECT MAX(order_detail_id) AS max_order_detail_id FROM order_items
`;

//출하등록조회
const shipList = `
 SELECT  s.shipment_id,
         i.product_id,
         i.product_name,
         o.partner_name,
         i.quantity,
         o.delivery_addr,
         i.del_date,
         s.shipment_date,
         s.ship_status,
         o.order_manager
FROM     orders o INNER JOIN order_items i INNER JOIN shipment s
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

//이메일+pdf관련 주문내역
const mailPdfOrderList = `
  SELECT
    o.order_id,
    o.partner_id,
    o.partner_name,
    i.product_id,
    i.product_name,
    o.order_manager,
    i.quantity,
    o.delivery_addr,
    DATE_FORMAT( o.order_date, '%Y-%m-%d') as order_date,
    DATE_FORMAT( i.del_date, '%Y-%m-%d') as del_date,
    i.ord_status,
    p.email AS partner_email,
    e.email AS order_manager_email
FROM
    orders o
JOIN
    order_items i ON o.order_id = i.order_id
JOIN
    partner p ON o.partner_id = p.partner_id
 LEFT JOIN
    employee e ON o.order_manager = e.employee_id
WHERE
    (? IS NULL OR ? = '' OR o.order_id LIKE CONCAT('%', ?, '%'))
    AND (? IS NULL OR ? = '' OR i.ord_status = ?)
    AND (? IS NULL OR ? = '' OR i.product_name LIKE CONCAT('%', ?, '%'))
    AND (? IS NULL OR ? = '' OR o.partner_id LIKE CONCAT('%', ?, '%'))
    AND (? IS NULL OR DATE(i.del_date) = ?)
`;

//반품내역
const returnList = `
  SELECT r.return_id,
        i.product_id,
        i.quantity,
        r.return_date,
        r.return_reason,
        r.re_status,
        o.order_manager
  FROM   order_items i 
  INNER JOIN returns r ON i.order_detail_id = r.order_detail_id
  INNER JOIN orders o ON i.order_id = o.order_id`;

//반품등록
const returnRegist = `
  INSERT INTO returns(
    return_id,
    order_detail_id,
    product_code,
    quantity,
    return_date,
    return_reason,
    re_status,
    prd_id
  ) VALUES (?,?,?,?,?,?,?,?)
`;

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
  returnList,
  returnRegist,
};
