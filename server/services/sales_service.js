// services/orderService.js
const { getConnection, sqlList } = require("../database/mapper.js");

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

const InsertOrder = async (orderInfo, orderItems) => {
  const conn = await getConnection();

  try {
    await conn.beginTransaction();

    // 주문 등록
    const insertOrderData = convertToArray(orderInfo, [
      "orderId",
      "partnerId",
      "orderDate",
      "orderManager",
      "deliveryAddr",
      "supplyPrice",
    ]);
    await conn.query(sqlList["InsertOrder"], insertOrderData);

    // 주문 상세 등록
    for (const item of orderItems) {
      const orderDetailId = `${orderInfo.orderId}-${item.itemSeq}`;
      item.orderDetailId = orderDetailId;
      item.delDate = formatDateToYMD(item.delDate);

      const insertItemData = convertToArray(item, [
        "orderDetailId",
        "itemSeq",
        "quantity",
        "delDate",
        "ordStatus",
        "productName",
        "productPrice",
        "supplyPrice",
        "orderId",
      ]);

      await conn.query(sqlList["InsertOrderItem"], insertItemData);
    }

    await conn.commit();
    return { success: true };
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
};
