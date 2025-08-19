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

// 반품등록
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
  let list = query("returnList", params);
  return list;
};

//반품등록전  조회
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

// 폰트 파일 경로 지정
const fontPath = path.join(__dirname, "../fonts/NanumGothic-Regular.ttf");

// PDF 생성 함수 (수정됨)
async function generatePdf(orderData) {
  const fileName = `${orderData.orderDate.replace(/-/g, "")}_${
    orderData.partnerName
  }_${orderData.orderId}_주문서.pdf`;
  const filePath = path.join(__dirname, "../pdfs", fileName);

  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
  });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream); // 한글 폰트 등록

  doc.registerFont("NanumGothic", fontPath);
  doc.font("NanumGothic"); // 제목

  doc.fontSize(18).text("주 문 서", { align: "center" }); // 우측 상단 박스 (결재 라인)

  const headerX = 380;
  const headerY = 50;
  const headerWidth = 180;
  const headerHeight = 60;
  doc.rect(headerX, headerY, headerWidth, headerHeight).stroke();
  doc
    .fontSize(8)
    .text("담당", headerX + 15, headerY + 5, { width: 30, align: "center" });
  doc.text("부서장", headerX + 50, headerY + 5, { width: 30, align: "center" });
  doc.text("김원", headerX + 85, headerY + 5, { width: 30, align: "center" });
  doc.text("사장", headerX + 120, headerY + 5, { width: 30, align: "center" });
  doc.text("/", headerX + 25, headerY + 20, { width: 10, align: "center" });
  doc.text("/", headerX + 60, headerY + 20, { width: 10, align: "center" });
  doc.text("/", headerX + 95, headerY + 20, { width: 10, align: "center" });
  doc.text("/", headerX + 130, headerY + 20, { width: 10, align: "center" }); // 거래처 정보 박스

  const partnerBoxY = 115;
  doc.rect(50, partnerBoxY, 510, 50).stroke();
  doc.fontSize(10);
  doc.text("하기와 같이 주문합니다.", 60, partnerBoxY + 10);
  doc.text("귀하", 480, partnerBoxY + 10);
  doc.text(
    `20 ${new Date().getFullYear().toString().substring(2)} 년 ${
      new Date().getMonth() + 1
    } 월 ${new Date().getDate()} 일`,
    440,
    partnerBoxY + 25
  );
  doc.moveDown(); // 주요 주문 정보 박스

  const detailsBoxY = 170;
  doc.rect(50, detailsBoxY, 510, 80).stroke();
  doc.fontSize(10);
  doc.text("● 품 명 : " + orderData.productName, 60, detailsBoxY + 10);
  doc.text("● 납기기한 : " + orderData.delDate, 60, detailsBoxY + 30);
  doc.text("● 납품장소 : " + orderData.deliveryAddr, 60, detailsBoxY + 50); // 테이블 헤더 (1줄)

  const tableTop = 260;
  const tableX = 50;
  const tableWidth = 510;
  const rowHeight = 20;
  const cellPadding = 5;
  const headers = [
    { label: "품명", width: 100 },
    { label: "제품코드", width: 80 },
    { label: "규격/크기", width: 70 },
    { label: "수량", width: 50 },
    { label: "단가", width: 70 },
    { label: "금액", width: 70 },
    { label: "지급조건", width: 70 },
  ];

  let currentX = tableX;
  doc.fontSize(10);
  headers.forEach((header) => {
    doc.text(header.label, currentX, tableTop + cellPadding, {
      width: header.width,
      align: "center",
    });
    currentX += header.width;
  }); // 테이블 내용 (주문 상세) - 동적으로 추가

  let contentY = tableTop + rowHeight;
  const item = orderData; // 단일 주문이므로 orderData를 직접 사용
  currentX = tableX;
  doc.text(item.productName, currentX, contentY + cellPadding, {
    width: headers[0].width,
    align: "center",
  });
  currentX += headers[0].width;
  doc.text(item.productId, currentX, contentY + cellPadding, {
    width: headers[1].width,
    align: "center",
  });
  currentX += headers[1].width;
  doc.text(item.spec, currentX, contentY + cellPadding, {
    width: headers[2].width,
    align: "center",
  });
  currentX += headers[2].width;
  doc.text(item.quantity, currentX, contentY + cellPadding, {
    width: headers[3].width,
    align: "center",
  });
  currentX += headers[3].width;
  doc.text(item.price, currentX, contentY + cellPadding, {
    width: headers[4].width,
    align: "center",
  });
  currentX += headers[4].width;
  doc.text(item.supplyPrice, currentX, contentY + cellPadding, {
    width: headers[5].width,
    align: "center",
  }); // 지급조건, 비고는 데이터에 없으므로 빈칸으로 둠 // 테이블 라인 그리기
  doc.rect(tableX, tableTop, tableWidth, 400).stroke(); // 전체 테이블 테두리
  doc
    .moveTo(tableX, tableTop + rowHeight)
    .lineTo(tableX + tableWidth, tableTop + rowHeight)
    .stroke(); // 헤더 아래 가로선
  for (let i = 0; i < 20; i++) {
    // 가로 줄
    doc
      .moveTo(tableX, tableTop + rowHeight * (i + 2))
      .lineTo(tableX + tableWidth, tableTop + rowHeight * (i + 2))
      .stroke();
  }
  currentX = tableX;
  headers.forEach((header) => {
    doc
      .moveTo(currentX, tableTop)
      .lineTo(currentX, tableTop + 400)
      .stroke();
    currentX += header.width;
  }); // 푸터

  const footerY = tableTop + 420;
  // 주문 회사: orderData.partnerName 또는 유사한 필드를 사용
  doc.text(`주문 회사: ${orderData.partnerName}`, 400, footerY);

  // 주문 책임자: orderData.manager 또는 유사한 필드를 사용
  doc.text(`주문 책임자: ${orderData.manager}`, 400, footerY + 15);

  // 주소 및 전화번호: orderData.partnerAddress, orderData.partnerTel 등 유사한 필드를 사용
  doc.text(
    `주소 및 전화번호: ${orderData.deliveryAddr}, ${orderData.partnerName}`,
    400,
    footerY + 30
  );
  doc.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", () => resolve({ fileName, filePath }));
    stream.on("error", reject);
  });
}

// 이메일 전송 함수
async function generatePdfAndSendEmail(orderData, emailDetails) {
  const { fileName, filePath } = await generatePdf(orderData); // 이 함수는 이제 경로를 반환합니다.

  try {
    await sendEmail({
      to: emailDetails.partnerEmail,
      from: emailDetails.managerEmail, // 담당자 이메일이 발신자라고 가정합니다.
      subject: emailDetails.subject,
      text: emailDetails.body,
      attachmentPath: filePath,
      attachmentName: fileName,
    });
    console.log(
      `이메일이 첨부파일과 함께 성공적으로 전송되었습니다: ${fileName}`
    );
    return { success: true, message: "이메일이 성공적으로 전송되었습니다." };
  } catch (error) {
    console.error("이메일 전송 실패:", error);
    return { success: false, error: "이메일 전송에 실패했습니다." };
  } finally {
    // 임시 PDF 파일 정리
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`임시 파일이 삭제되었습니다: ${filePath}`);
    }
  }
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
  generatePdfAndSendEmail,
};
