//1.order 주문등록
const InsertOrder = `
  INSERT INTO orders (order_id,
                      partner_id,
                      order_manager,
                      delivery_addr,
                      supply_price)
  VALUES (?, ?, ?, ?,?)`;

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

module.exports = {
  InsertOrder,
  InsertOrderItems,
};
