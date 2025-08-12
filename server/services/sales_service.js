const { query, getConnection, sqlList } = require("../database/mapper.js");

// 객체를 배열로 변환
function convertToArray(obj, columns) {
  return columns.map((col) => obj[col]);
}

// 날짜 포맷 변환 (YYYY-MM-DD)
function formatDateToYMD(isoDate) {
  if (!isoDate) return null;
  const d = new Date(isoDate);
  if (isNaN(d)) return null;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
//주문목록조회
const selectRegisList = () => {
  let list = query("SelectOrders");
  return list;
};

// 주문 1: 주문상세 N
const InsertOrder = async (orderInfo, orderItems) => {
  const conn = await getConnection();

  try {
    await conn.beginTransaction();
    //데이터베이스에서 마지막 주문번호 조회
    const [lastOrderRow] = await conn.query(sqlList.SelectMaxOrderId);
    let newOrderId;
    if (lastOrderRow && lastOrderRow.max_order_id) {
      // 'ORD005' -> '005' -> 5 -> 6 -> '006' -> 'ORD006'
      const lastNum = parseInt(
        lastOrderRow.max_order_id.replace("ORD", ""),
        10
      );
      const newNum = lastNum + 1;
      const formattedNum = String(newNum).padStart(3, "0");
      newOrderId = `ORD${formattedNum}`;
    } else {
      // 주문이 없을 경우 'ORD001'로 시작
      newOrderId = "ORD001";
    }
    //프론트엔드에서 받은 orderInfo객체에 새로운 주문번호 할당
    orderInfo.orderId = newOrderId;

    // 주문 날짜 형식 맞추기
    orderInfo.orderDate = formatDateToYMD(orderInfo.orderDate);

    // orders 테이블에 insert
    const insertOrderData = convertToArray(orderInfo, [
      "orderId",
      "partnerId",
      "orderDate",
      "orderManager",
      "deliveryAddr",
      "supplyPrice",
    ]);
    //
    await conn.query(sqlList["InsertOrders"], insertOrderData);

    // order_items 테이블에 insert
    for (const item of orderItems) {
      item.delDate = formatDateToYMD(item.delDate);
      //주문상세내역에도 새로운 주문번호 할당
      item.orderId = newOrderId;
      // item.orderId = orderInfo.orderId;

      const insertItemData = convertToArray(item, [
        "itemSeq",
        "quantity",
        "delDate",
        "ordStatus",
        "productId", // productId가 없으면 null로 설정 필요
        "productName",
        "productPrice",
        "supplyPrice",
        "orderId",
      ]);
      await conn.query(sqlList["InsertOrderItems"], insertItemData);
    }

    await conn.commit();
    //프론트엔드에 성공 응답 함께 새로 생성된 주문번호 반환
    return { success: true, newOrderId: newOrderId };
    // return { success: true };
  } catch (err) {
    await conn.rollback();
    console.error("InsertOrder Error:", err);
    return { success: false, error: err.message };
  } finally {
    conn.release();
  }
};

module.exports = {
  InsertOrder,
  selectRegisList,
};
