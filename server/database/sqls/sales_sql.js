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
                      partner_name)
  VALUES (?,?,?,?,?,?,?,?)`;

//2.주문상세
const InsertOrderItems = `
  INSERT INTO order_items (item_seq,
                           quantity,
                           del_date,
                           ord_status,
                           product_id,
                           product_name,
                           product_price,
                           supply_price,
                           order_id)
  VALUES (?,?,?,?,?,?,?,?,?);
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
    o.order_manager
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

//출하요청등록대상 조회,(납기일의 처음과 끝을 별칭으로 구분)
const selectShipOrders = `
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
      DATE_FORMAT( i.del_date, '%Y-%m-%d') as start_date,
      DATE_FORMAT( i.del_date, '%Y-%m-%d') as end_date,
      i.ord_status,
      o.order_manager
  FROM orders o
  JOIN order_items i
      ON o.order_id = i.order_id
  WHERE
     (? IS NULL OR ? = '' OR o.partner_id LIKE CONCAT('%', ?, '%'))
      AND (? IS NULL OR ? = '' OR i.product_id LIKE CONCAT('%', ?, '%'))
      AND (? IS NULL OR i.del_date >= ?)
      AND (? IS NULL OR i.del_date <= ?)
    `;

const selectShipDetails = `


`;

const insertShip = `
  INSERT INTO (product_code,
               shipment_qty,
               shipement_date,
               ship_status,
               order_manager,
               product_name)
  VALUES(?,?,?,?,?,?)
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
};
