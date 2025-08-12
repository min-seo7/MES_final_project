//1.order 주문등록
const InsertOrders = `
  INSERT INTO orders (order_id,
                      partner_id,
                      order_date,
                      order_manager,
                      delivery_addr,
                      supply_price)
  VALUES (?,?,?,?,?,?)`;

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

//4.주문조회--  i.product_id,    -- 	   o.manager,
const SelectOrders = `
    SELECT o.order_id,
           o.partner_id,
           i.quantity,
           o.delivery_addr,
           DATE_FORMAT( o.order_date, '%Y-%m-%d') as order_date,
           DATE_FORMAT( i.del_date, '%Y-%m-%d') as del_date,
           i.ord_status,
           o.order_manager
    FROM   orders o  INNER JOIN  order_items i 
                      ON  o.order_id = i.order_id
`;

module.exports = {
  InsertOrders,
  InsertOrderItems,
  SelectOrders,
  SelectMaxOrderId,
};
