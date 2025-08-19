// sales_service.js

const { query, getConnection, sqlList } = require("../database/mapper.js");
const path = require("path");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const nodemailer = require("nodemailer");

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

// 납기일 변경 및 이력 등록
const modifyUpdate = async (delDateInfo) => {
  const conn = await getConnection();
  try {
    await conn.beginTransaction();

    // history_id 순차적으로 생성
    const [lastHistoryRow] = await conn.query(sqlList.SelectMaxHistoryId);
    let newHistoryId;
    if (lastHistoryRow && lastHistoryRow.max_history_id) {
      const lastNum = parseInt(
        lastHistoryRow.max_history_id.replace("HIST", ""),
        10
      );
      const newNum = lastNum + 1;
      const formattedNum = String(newNum).padStart(3, "0");
      newHistoryId = `HIST${formattedNum}`;
    } else {
      newHistoryId = "HIST001";
    }

    // 주문상세 테이블 납기일 업데이트
    const updateParams = [
      formatDateToYMD(delDateInfo.changeDeliveryDate),
      delDateInfo.orderDetailId,
    ];
    await conn.query(sqlList["modifyDelDate"], updateParams);

    // order_history 테이블에 변경 이력 삽입
    const insertHistoryParams = [
      newHistoryId,
      formatDateToYMD(delDateInfo.orderDate),
      formatDateToYMD(delDateInfo.changeDeliveryDate),
      delDateInfo.changeReason,
      delDateInfo.orderDetailId,
    ];
    await conn.query(sqlList["modifyInsert"], insertHistoryParams);

    await conn.commit();
    return { success: true };
  } catch (err) {
    await conn.rollback();
    console.error("Modify Update Error:", err);
    return { success: false, error: err.message };
  } finally {
    conn.release();
  }
};

//주문수정내역 조회 필터링
const modifyList = (filter) => {
  const params = [
    filter.orderId,
    filter.orderId,
    filter.orderId,
    filter.orderStatus,
    filter.orderStatus,
    filter.orderStatus,
    filter.productName,
    filter.productName,
    filter.productName,
    filter.partnerId,
    filter.partnerId,
    filter.partnerId,
    filter.delDate,
    filter.delDate,
  ];
  console.log("필터링 파라미터:", params);
  let list = query("modifyNextList", params);
  return list;
};

// 주문 내역 조회 필터링
const selectFilteredOrders = (filter) => {
  const params = [
    filter.orderId,
    filter.orderId,
    filter.orderId,
    filter.orderStatus,
    filter.orderStatus,
    filter.orderStatus,
    filter.productName,
    filter.productName,
    filter.productName,
    filter.partnerId,
    filter.partnerId,
    filter.partnerId,
    filter.delDate,
    filter.delDate,
  ];
  let list = query("selectOrderDetail", params);
  return list;
};

//이메일 포함된 주문내역 조회
const selectFilterInfoEmail = (filter) => {
  const params = [
    filter.orderId,
    filter.orderId,
    filter.orderId,
    filter.orderStatus,
    filter.orderStatus,
    filter.orderStatus,
    filter.productName,
    filter.productName,
    filter.productName,
    filter.partnerId,
    filter.partnerId,
    filter.partnerId,
    filter.delDate,
    filter.delDate,
  ];
  let list = query("mailPdfOrderList", params);
  return list;
};

//출하요청등록대상 조회
const selectFilteredShips = (filters) => {
  const params = [
    filters.partnerId,
    filters.partnerId,
    filters.partnerId,
    filters.productId,
    filters.productId,
    filters.productId,
    filters.startDate,
    filters.startDate,
    filters.startDate,
    filters.endDate,
    filters.endDate,
    filters.endDate,
  ];
  console.log("필터링 파라미터:", params);
  let list = query("selectShipOrders", params);
  return list;
};

// 주문서 클릭 시 주문 상세 내역 조회
const selectOrderDetails = async (orderId) => {
  const list = await query("selectShipDetail", [orderId]);
  return list;
};

// 출하 등록
const insertShipment = async (shipmentItems) => {
  const conn = await getConnection();
  let createdCount = 0;

  try {
    await conn.beginTransaction();

    const [lastShipmentRow] = await conn.query(sqlList.SelectMaxShipId);
    let lastNum = 0;
    if (lastShipmentRow && lastShipmentRow.max_shipment_id) {
      lastNum = parseInt(
        lastShipmentRow.max_shipment_id.replace("SHIP", ""),
        10
      );
    }

    for (const item of shipmentItems) {
      lastNum += 1;
      const newShipmentId = `SHIP${String(lastNum).padStart(3, "0")}`;

      const params = [
        newShipmentId,
        item.item_seq,
        item.product_code,
        item.shipment_qty,
        item.shipment_date,
        item.ship_status,
        item.order_manager,
        item.product_name,
        item.order_detail_id,
      ];
      await conn.query(sqlList["insertShip"], params);
      createdCount++;
    }

    await conn.commit();
    return { success: true, createdCount };
  } catch (err) {
    await conn.rollback();
    if (err.code === "ER_DUP_ENTRY" || err.sqlState === "23000") {
      console.error("Duplicate entry detected. (order_detail_id)");
      return {
        success: false,
        error: "선택된 항목 중 이미 출하 등록된 내역이 있습니다.",
      };
    } else {
      console.error("InsertShipment Error:", err);
      return { success: false, error: err.message };
    }
  } finally {
    conn.release();
  }
};

//출하내역조회
const shipList = (filter) => {
  const params = [
    filter.partnerId,
    filter.partnerId,
    filter.partnerId,
    filter.productId,
    filter.productId,
    filter.productId,
    filter.shipStatus,
    filter.shipStatus,
    filter.shipStatus,
    filter.startDate,
    filter.startDate,
    filter.startDate,
    filter.endDate,
    filter.endDate,
    filter.endDate,
  ];
  console.log("출하조회 필터링 파라미터:", params);
  let list = query("shipList", params);
  return list;
};

//주문등록모달창조회
const selectOrdRegistModal = () => {
  let list = query("selectOrdPartnerModal");
  return list;
};

//주문등록상세_완제품제품 조회하는 모달창
const selectOrderProductModal = () => {
  let list = query("selectOrderProduct");
  return list;
};

// 주문 1: 주문상세 N
const InsertOrder = async (orderInfo, orderItems) => {
  const conn = await getConnection();

  try {
    await conn.beginTransaction();
    // 데이터베이스에서 마지막 주문번호 조회
    const [lastOrderRow] = await conn.query(sqlList.SelectMaxOrderId);
    let newOrderId;
    if (lastOrderRow && lastOrderRow.max_order_id) {
      const lastNum = parseInt(
        lastOrderRow.max_order_id.replace("ORD", ""),
        10
      );
      const newNum = lastNum + 1;
      const formattedNum = String(newNum).padStart(3, "0");
      newOrderId = `ORD${formattedNum}`;
    } else {
      newOrderId = "ORD001";
    }
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
      "manager",
      "partnerName",
      "totalQty",
    ]);
    await conn.query(sqlList["InsertOrders"], insertOrderData);

    // 주문 상세 번호 순차적으로 증가
    const [lastDetailRow] = await conn.query(sqlList.orderDetailId);
    let lastDetailIdNum = 0;
    if (lastDetailRow && lastDetailRow.max_order_detail_id) {
      lastDetailIdNum = parseInt(
        lastDetailRow.max_order_detail_id.replace("DET", ""),
        10
      );
    }

    // order_items 테이블에 insert
    for (const item of orderItems) {
      item.delDate = formatDateToYMD(item.delDate);
      item.orderId = newOrderId;

      // 새로운 order_detail_id 생성 및 할당
      lastDetailIdNum += 1;
      const newDetailId = `DET${String(lastDetailIdNum).padStart(3, "0")}`;
      item.orderDetailId = newDetailId;

      const insertItemData = convertToArray(item, [
        "orderDetailId",
        "itemSeq",
        "quantity",
        "specification",
        "delDate",
        "ordStatus",
        "productId",
        "productName",
        "productPrice",
        "supplyPrice",
        "orderId",
      ]);
      await conn.query(sqlList["InsertOrderItems"], insertItemData);
    }

    await conn.commit();
    return { success: true, newOrderId: newOrderId };
  } catch (err) {
    await conn.rollback();
    console.error("InsertOrder Error:", err);
    return { success: false, error: err.message };
  } finally {
    conn.release();
  }
};
// //반품등록
const returnRegist = async (returnItems) => {
  const conn = await getConnection();
  let createdCount = 0;
  try {
    // 1. 트랜잭션 시작
    await conn.beginTransaction();

    // 2. 새로운 반품 ID 생성 (출하 ID와 동일한 로직)
    const [lastReturnRow] = await conn.query(sqlList.SelectMaxReturnId);
    let lastNum = 0;
    if (lastReturnRow && lastReturnRow.max_return_id) {
      lastNum = parseInt(lastReturnRow.max_return_id.replace("RTN", ""), 10);
    }
    // 3. 반품 항목들을 순회하며 데이터베이스 작업 수행
    for (const item of returnItems) {
      lastNum += 1;
      const newReturnId = `RTN${String(lastNum).padStart(3, "0")}`;

      // a. 반품 정보를 returns 테이블에 삽입
      const insertParams = [
        newReturnId,
        item.orderDetailId,
        item.productId,
        item.quantity, // 반품 수량
        item.returnDate,
        item.returnReason,
        item.orderManager,
        item.reStatus,
        item.inDate,
        item.warehouseName,
        item.prdId,
        item.shipmentId,
      ];
      await conn.query(sqlList["returnRegist"], insertParams);
    }
    // 4. 모든 작업이 성공하면 트랜잭션 커밋
    await conn.commit();
    return { success: true, createdCount };
  } catch (err) {
    // 5. 오류 발생 시 트랜잭션 롤백
    await conn.rollback();

    if (err.code === "ER_DUP_ENTRY" || err.sqlState === "23000") {
      console.error("Duplicate entry detected. (order_detail_id)");
      return {
        success: false,
        error: "선택된 항목 중 이미 반품 등록된 내역이 있습니다.",
      };
    } else {
      console.error("ReturnRegist Error:", err);
      return { success: false, error: err.message };
    }
  } finally {
    // 6. 연결 해제
    conn.release();
  }
};

//반품내역
const returnList = (filter) => {
  const params = [
    filter.orderId,
    filter.orderId,
    filter.orderId,
    filter.reStatus,
    filter.reStatus,
    filter.reStatus,
    filter.partnerId,
    filter.partnerId,
    filter.partnerId,
    filter.startDate,
    filter.startDate,
    filter.startDate,
    filter.endDate,
    filter.endDate,
    filter.endDate,
  ];
  console.log("반품조회 필터링 파라미터:", params);
  let list = query("returnList", params);
  return list;
};

//반품등록전  조회
const selectFiltereReturns = (filter) => {
  const params = [
    filter.orderId,
    filter.orderId,
    filter.orderId,
    filter.orderStatus,
    filter.orderStatus,
    filter.orderStatus,
    filter.productName,
    filter.productName,
    filter.productName,
    filter.partnerId,
    filter.partnerId,
    filter.partnerId,
    filter.startDate,
    filter.endDate,
  ];
  let list = query("selectReturnPreList", params);
  return list;
};

//폰트 파일 경로 지정
const fontPath = path.join(__dirname, "../fonts/NanumGothic-Regular.ttf");

// PDF 생성 함수
async function generatePdf(orderData) {
  const fileName = `${orderData.orderDate.replace(/-/g, "")}_${
    orderData.partnerName
  }_${orderData.orderId}_주문서.pdf`;
  const filePath = path.join(__dirname, "../pdfs", fileName);

  const doc = new PDFDocument();
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // 한글 폰트 등록
  doc.registerFont("NanumGothic", fontPath);

  // 폰트 적용
  doc.font("NanumGothic");

  doc.fontSize(18).text("주문서", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`주문번호: ${orderData.orderId}`);
  doc.text(`거래처: ${orderData.partnerName}`);
  doc.text(`배송지: ${orderData.deliveryAddr}`);
  doc.text(`제품명: ${orderData.productName}`);
  doc.text(`수량: ${orderData.quantity}`);
  doc.text(`납기일: ${orderData.delDate}`);
  doc.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", () => resolve({ fileName, filePath }));
    stream.on("error", reject);
  });
}

// 이메일 전송 함수
async function sendEmail({
  to,
  from,
  subject,
  text,
  attachmentPath,
  attachmentName,
}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: from,
      pass: "앱 비밀번호",
    },
  });

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    attachments: [
      {
        filename: attachmentName,
        path: attachmentPath,
      },
    ],
  });
}

module.exports = {
  InsertOrder,
  selectFilteredOrders,
  selectOrdRegistModal,
  selectOrderProductModal,
  selectOrderDetails,
  selectFilteredShips,
  insertShipment,
  shipList,
  modifyUpdate,
  modifyList,
  returnList,
  selectFilterInfoEmail,
  returnRegist,
  selectFiltereReturns,
  generatePdf,
  sendEmail,
};
