// sales_service.js

const { query, getConnection, sqlList } = require("../database/mapper.js");
const path = require("path");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const nodemailer = require("nodemailer");

// .env 파일 로드
require("dotenv").config({
  path: path.join(__dirname, "../email/.env"),
});

// 본인의 Gmail 주소와 앱 비밀번호로 변경
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

// ------------------
// 주문
// ------------------

// 주문 1: 주문상세 N
const InsertOrder = async (orderInfo, orderItems) => {
  const conn = await getConnection();
  try {
    await conn.beginTransaction();
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
    orderInfo.orderDate = formatDateToYMD(orderInfo.orderDate);
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
    const [lastDetailRow] = await conn.query(sqlList.orderDetailId);
    let lastDetailIdNum = 0;
    if (lastDetailRow && lastDetailRow.max_order_detail_id) {
      lastDetailIdNum = parseInt(
        lastDetailRow.max_order_detail_id.replace("DET", ""),
        10
      );
    }
    for (const item of orderItems) {
      item.delDate = formatDateToYMD(item.delDate);
      item.orderId = newOrderId;
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

// ------------------
// 주문 조회
// ------------------

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
  return query("selectOrderDetail", params);
};

// 주문서 클릭 시 주문 상세 내역 조회
const selectOrderDetails = async (orderId) => {
  return query("selectShipDetail", [orderId]);
};

// 주문등록 모달창 조회
const selectOrdRegistModal = () => {
  return query("selectOrdPartnerModal");
};

const selectOrderListModal = () => {
  return query("selectOrdersModal");
};

// 주문등록 상세_완제품 제품 조회 모달창
const selectOrderProductModal = () => {
  return query("selectOrderProduct");
};

// ------------------
// 납기일 수정 및 조회
// ------------------

// 납기일 변경 및 이력 등록
const modifyUpdate = async (delDateInfo) => {
  const conn = await getConnection();
  try {
    await conn.beginTransaction();
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
    const updateParams = [
      formatDateToYMD(delDateInfo.changeDeliveryDate),
      delDateInfo.orderDetailId,
    ];
    await conn.query(sqlList["modifyDelDate"], updateParams);
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

// 주문 수정 내역 조회 필터링
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
  return query("modifyNextList", params);
};

// ------------------
// 출하
// ------------------

// 출하 요청 등록 대상 조회
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
  return query("selectShipOrders", params);
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

// 출하 내역 조회
const shipList = (filter) => {
  const params = [
    filter.partnerId,
    filter.partnerId,
    filter.productId,
    filter.productId,
    filter.shipStatus,
    filter.shipStatus,
    filter.startDate,
    filter.startDate,
    filter.endDate,
    filter.endDate,
  ];
  let list = query("shipList", params);
  return list;
};

// ------------------
// 반품
// ------------------

// 반품 등록
const returnRegist = async (returnItems) => {
  const conn = await getConnection();
  let createdCount = 0;
  try {
    await conn.beginTransaction();
    const [lastReturnRow] = await conn.query(sqlList.SelectMaxReturnId);
    let lastNum = 0;
    if (lastReturnRow && lastReturnRow.max_return_id) {
      lastNum = parseInt(lastReturnRow.max_return_id.replace("RTN", ""), 10);
    }
    for (const item of returnItems) {
      lastNum += 1;
      const newReturnId = `RTN${String(lastNum).padStart(3, "0")}`;
      const insertParams = [
        newReturnId,
        item.orderDetailId,
        item.productId,
        item.quantity,
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
    await conn.commit();
    return { success: true, createdCount };
  } catch (err) {
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
    conn.release();
  }
};

// 반품 내역 조회
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
  let list = query("returnList", params);
  return list;
};

// 반품 내역 조회
const returndelList = (filter) => {
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
    filter.delDate,
    filter.delDate,
  ];
  let list = query("returnList", params);
  return list;
};

// 반품 등록 전 조회
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
  return query("selectReturnPreList", params);
};

// ------------------
// PDF 및 이메일 서비스
// ------------------

// 폰트 파일 경로 지정
const fontPath = path.join(__dirname, "../fonts/NanumGothic-Regular.ttf");

// 이메일 포함된 주문내역 조회 (기존 함수)
const selectFilterInfoEmail = (filter) => {
  const params = [
    filter.orderId,
    filter.orderId,
    filter.orderId,
    filter.partnerId,
    filter.partnerId,
    filter.partnerId,
    filter.productName,
    filter.productName,
    filter.productName,
    filter.delDate,
    filter.delDate,
  ];
  return query("mailPdfOrderList", params);
};

/**
 * PDF 문서 생성 핵심 로직
 * @param {Array<Object>} orders - PDF로 만들 주문 정보 배열
 * @returns {Promise<{fileName: string, filePath: string}>} - 생성된 PDF 파일 경로 및 이름
 */
const generatePdf = async (orders) => {
  const fileName = `Orders_${Date.now()}.pdf`;
  const filePath = path.join(__dirname, "../pdfs", fileName);

  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
  });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc.registerFont("NanumGothic", fontPath);
  doc.font("NanumGothic");

  for (const [index, order] of orders.entries()) {
    if (index > 0) {
      doc.addPage();
    }

    doc.fontSize(18).text("주문서", { align: "center" });
    doc.moveDown();

    doc.fontSize(10).text(`거래처: ${order.partnerName}`);
    doc.text(`주문번호: ${order.orderId}`);
    doc.text(`주문일자: ${formatDateToYMD(order.orderDate)}`);
    doc.text(`총수량: ${order.totalQty}`);
    doc.text(`총금액: ${order.supplyPrice}`);
    doc.moveDown(); // 테이블 헤더

    const tableTop = doc.y;
    const colWidths = [150, 80, 80, 50, 80, 80];
    let currentX = 50;
    doc.fontSize(10);
    doc.text("품명", currentX, tableTop, { width: colWidths[0] });
    currentX += colWidths[0];
    doc.text("제품코드", currentX, tableTop, { width: colWidths[1] });
    currentX += colWidths[1];
    doc.text("규격", currentX, tableTop, { width: colWidths[2] });
    currentX += colWidths[2];
    doc.text("수량", currentX, tableTop, { width: colWidths[3] });
    currentX += colWidths[3];
    doc.text("단가", currentX, tableTop, { width: colWidths[4] });
    currentX += colWidths[4];
    doc.text("금액", currentX, tableTop, { width: colWidths[5] }); // 테이블 내용

    let contentY = tableTop + 20;
    for (const item of order.items) {
      let x = 50;
      doc.text(item.productName, x, contentY, { width: colWidths[0] });
      x += colWidths[0];
      doc.text(item.productId, x, contentY, { width: colWidths[1] });
      x += colWidths[1];
      doc.text(item.specification, x, contentY, { width: colWidths[2] });
      x += colWidths[2];
      doc.text(item.quantity, x, contentY, { width: colWidths[3] });
      x += colWidths[3];
      doc.text(item.productPrice, x, contentY, { width: colWidths[4] });
      x += colWidths[4];
      doc.text(item.supplyPrice, x, contentY, { width: colWidths[5] });
      contentY += 20;
    }
  }
  doc.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", () => resolve({ fileName, filePath }));
    stream.on("error", reject);
  });
};

/**
 * 단일 주문에 대한 PDF를 생성하고 다운로드 경로를 반환합니다.
 * @param {string} orderId - 주문 번호
 * @returns {Promise<{fileName: string, filePath: string}>} - PDF 파일 정보
 */
const generatePdfAndDownload = async (orderId) => {
  const orderDetails = await selectOrderDetails(orderId);
  if (!orderDetails || orderDetails.length === 0) {
    throw new Error("주문 정보를 찾을 수 없습니다.");
  } // PDF 생성 함수에 전달할 형식으로 데이터 재구성
  const orderData = {
    orderId: orderId,
    partnerName: orderDetails[0].partner_name,
    orderDate: orderDetails[0].order_date,
    totalQty: orderDetails[0].total_qty,
    supplyPrice: orderDetails[0].supply_price,
    items: orderDetails.map((item) => ({
      productName: item.product_name,
      productId: item.product_id,
      specification: item.specification,
      quantity: item.quantity,
      productPrice: item.product_price,
      supplyPrice: item.supply_price,
    })),
  };
  return await generatePdf([orderData]);
};

/**
 * 단일 주문에 대한 PDF를 생성하고 이메일로 전송합니다.
 * @param {string} orderId - 주문 번호
 * @param {Object} emailDetails - 이메일 정보 (to, subject, text 등)
 * @returns {Promise<{success: boolean, error?: string}>} - 성공 여부
 */
const generatePdfAndSendEmail = async (orderId, emailDetails) => {
  const orderDetails = await selectOrderDetails(orderId);
  if (!orderDetails || orderDetails.length === 0) {
    throw new Error("주문 정보를 찾을 수 없습니다.");
  }

  const orderData = {
    orderId: orderId,
    partnerName: orderDetails[0].partner_name,
    orderDate: orderDetails[0].order_date,
    totalQty: orderDetails[0].total_qty,
    supplyPrice: orderDetails[0].supply_price,
    items: orderDetails.map((item) => ({
      productName: item.product_name,
      productId: item.product_id,
      specification: item.specification,
      quantity: item.quantity,
      productPrice: item.product_price,
      supplyPrice: item.supply_price,
    })),
  };

  const { fileName, filePath } = await generatePdf([orderData]);

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: emailDetails.to,
      subject: emailDetails.subject,
      text: emailDetails.body,
      attachments: [
        {
          filename: fileName,
          path: filePath,
        },
      ],
    });
    return { success: true };
  } catch (err) {
    console.error("이메일 전송 실패:", err);
    return { success: false, error: err.message };
  } finally {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

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
  generatePdfAndDownload,
  generatePdfAndSendEmail,
  returndelList,
  selectOrderListModal,
};
