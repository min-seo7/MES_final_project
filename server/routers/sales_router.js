const express = require("express");
const router = express.Router();
const salesService = require("../services/sales_service.js");

// ------------------
// 주문 등록
// ------------------
router.post("/orderRegist", async (req, res) => {
  try {
    const orderData = req.body;
    const result = await salesService.InsertOrder(orderData, orderData.orders);
    res.status(200).json({ message: "주문서등록성공", result });
  } catch (error) {
    console.error("주문등록 실패:sales_router.js", error);
    res.status(500).json({ message: "주문등록 실패", error: error.message });
  }
});

// ------------------
// 주문 관련 조회
// ------------------
router.get("/ordPaModalList", async (req, res) => {
  try {
    let list = await salesService.selectOrdRegistModal();
    res.json({ list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류", error: err.message });
  }
});

router.get("/ordModalPrdList", async (req, res) => {
  try {
    let list = await salesService.selectOrderProductModal();
    res.json({ list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류", error: err.message });
  }
});

router.get("/ordsListModal", async (req, res) => {
  try {
    let list = await salesService.selectOrderListModal();
    res.json({ list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류", error: err.message });
  }
});

router.get("/orderSearch", async (req, res) => {
  try {
    const filter = {
      orderId: req.query.orderId || null,
      orderStatus: req.query.orderStatus || null,
      productName: req.query.productName || null,
      partnerId: req.query.partnerId || null,
      startDate: req.query.startDate || null,
      endDate: req.query.endDate || null,
    };
    const filteredData = await salesService.selectFilteredOrders(filter);
    res.json({ list: filteredData });
  } catch (error) {
    console.error("주문내역 조회 실패:sales_router.js", error);
    res.status(500).json({ error: "데이터를 가져오는 데 실패했습니다." });
  }
});

//납기일 1
router.get("/delDateSearch", async (req, res) => {
  try {
    const filter = {
      orderId: req.query.orderId || null,
      orderStatus: req.query.orderStatus || null,
      productName: req.query.productName || null,
      productId: req.query.productId || null,
      partnerId: req.query.partnerId || null,
      delDate: req.query.delDate || null,
    };
    const filteredData = await salesService.selectFilteredOrders(filter);
    res.json({ list: filteredData });
  } catch (error) {
    console.error("주문내역 조회 실패:sales_router.js", error);
    res.status(500).json({ error: "데이터를 가져오는 데 실패했습니다." });
  }
});

router.get("/pdfEmail", async (req, res) => {
  try {
    const filter = {
      orderId: req.query.orderId || null,
      // orderStatus: req.query.orderStatus || null,
      productName: req.query.productName || null,
      partnerId: req.query.partnerId || null,
      delDate: req.query.delDate || null,
      // startDate: req.query.startDate || null,
      // endDate: req.query.endDate || null,
    };
    const filteredData = await salesService.selectFilterInfoEmail(filter);
    res.json({ list: filteredData });
  } catch (error) {
    console.error("이메일 + 주문내역 조회 실패:sales_router.js", error);
    res.status(500).json({ error: "데이터를 가져오는 데 실패했습니다." });
  }
});

// ------------------
// 반품 관련
// ------------------
router.get("/returnRegist", async (req, res) => {
  try {
    const filter = {
      orderId: req.query.orderId || null,
      orderStatus: req.query.orderStatus || null,
      productId: req.query.productId || null,
      partnerId: req.query.partnerId || null,
      startDate: req.query.startDate || null,
      endDate: req.query.endDate || null,
    };
    const filteredData = await salesService.selectFiltereReturns(filter);
    res.json({ list: filteredData });
  } catch (error) {
    console.error("반품내역 조회 실패:sales_router.js", error);
    res.status(500).json({ error: "데이터를 가져오는 데 실패했습니다." });
  }
});

//반품내역 조회 라우터(시작-끝)
router.get("/returnSearch", async (req, res) => {
  try {
    const filter = {
      orderId: req.query.orderId || null,
      reStatus: req.query.reStatus || null,
      partnerId: req.query.partnerId || null,
      startDate: req.query.startDate || null,
      endDate: req.query.endDate || null,
    };
    const filteredData = await salesService.returnList(filter);
    res.json({ list: filteredData });
  } catch (err) {
    console.error("출하조회 실패:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});
//납기일만 반품내역조회
router.get("/returnDelSearch", async (req, res) => {
  try {
    const filter = {
      orderId: req.query.orderId || null,
      reStatus: req.query.reStatus || null,
      partnerId: req.query.partnerId || null,
      delDate: req.query.delDate || null,
    };
    const filteredData = await salesService.returndelList(filter);
    res.json({ list: filteredData });
  } catch (err) {
    console.error("출하조회 실패:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

router.post("/returnRegist", async (req, res) => {
  try {
    const returnItems = req.body.returnItems;
    if (!returnItems || returnItems.length === 0) {
      return res.status(400).json({ message: "반품할 항목이 없습니다." });
    }
    const result = await salesService.returnRegist(returnItems);
    if (result.success) {
      res.status(200).json({
        message: "반품 등록 성공",
        createdCount: result.createdCount,
      });
    } else {
      res.status(500).json({ message: "반품 등록 실패", error: result.error });
    }
  } catch (error) {
    console.error("반품 등록 실패:", error);
    res.status(500).json({ message: "반품 등록 실패", error: error.message });
  }
});

// 출하 관련
router.get("/shipReqOrders", async (req, res) => {
  try {
    const filters = {
      partnerId: req.query.partnerId || null,
      productId: req.query.productId || null,
      startDate: req.query.startDate || null,
      endDate: req.query.endDate || null,
    };
    const filteredData = await salesService.selectFilteredShips(filters);
    res.json({ list: filteredData });
  } catch (error) {
    console.error("주문서 조회 실패:sales_router.js", error);
    res
      .status(500)
      .json({ error: "주문서 데이터를 가져오는 데 실패했습니다." });
  }
});

router.get("/shipReqRegist/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const list = await salesService.selectOrderDetails(orderId);
    res.status(200).json({ message: "주문목록불러오기 성공", list });
  } catch (err) {
    console.error("주문상세내역조회실패:", err);
    res
      .status(500)
      .json({ error: "주문상세 데이터를 가져오는 데 실패했습니다." });
  }
});

router.post("/shipReqRegist", async (req, res) => {
  try {
    const shipmentItems = req.body.shipmentItems;
    if (!shipmentItems || shipmentItems.length === 0) {
      return res.status(400).json({ message: "출하할 항목이 없습니다." });
    }
    const result = await salesService.insertShipment(shipmentItems);
    if (result.success) {
      res.status(200).json({
        message: "출하 등록 성공",
        createdCount: result.createdCount,
      });
    } else {
      res.status(500).json({ message: "출하 등록 실패", error: result.error });
    }
  } catch (error) {
    console.error("출하 등록 실패:", error);
    res.status(500).json({ message: "출하 등록 실패", error: error.message });
  }
});

router.get("/shipReqSearch", async (req, res) => {
  try {
    const filters = {
      partnerId: req.query.partnerId || null,
      productId: req.query.productId || null,
      shipStatus: req.query.shipStatus || null,
      startDate: req.query.startDate || null,
      endDate: req.query.endDate || null,
    };
    const filteredData = await salesService.shipList(filters);
    res.json({ list: filteredData });
  } catch (err) {
    console.error("출하조회 실패:", err);
    res.status(500).json({ message: "서버 오류", error: err.message });
  }
});

// 납기일 수정 및 조회
router.put("/updateOrderDelivery", async (req, res) => {
  try {
    const delDateInfo = req.body;
    const result = await salesService.modifyUpdate(delDateInfo);
    if (result.success) {
      res
        .status(200)
        .json({ message: "납기일 변경이 성공적으로 완료되었습니다." });
    } else {
      res
        .status(500)
        .json({ message: "납기일 변경에 실패했습니다.", error: result.error });
    }
  } catch (err) {
    console.error("납기일 수정 실패:", err);
    res
      .status(500)
      .json({ message: "서버 오류가 발생했습니다.", error: err.message });
  }
});

router.get("/orderModify", async (req, res) => {
  try {
    const filter = {
      orderId: req.query.orderId || null,
      orderStatus: req.query.orderStatus || null,
      productName: req.query.productName || null,
      partnerId: req.query.partnerId || null,
      delDate: req.query.delDate || null,
    };
    const result = await salesService.modifyList(filter);
    if (result && result.length > 0) {
      res.json({ list: result });
    } else {
      // 404 대신 200 OK와 빈 배열을 반환
      res.status(200).json({ list: [] });
    }
  } catch (err) {
    console.error("납기일 변경 조회 실패:", err);
    res
      .status(500)
      .json({ error: "납기일 변경 내역 조회 실패", error: err.message });
  }
});

// ------------------
// PDF 다운로드
// ------------------
router.get("/pdf/download/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { filePath, fileName } = await salesService.generatePdfAndDownload(
      orderId
    );

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error("PDF 다운로드 중 오류 발생:", err);
        return res.status(500).json({ message: "PDF 다운로드 실패" });
      } // 임시 파일 삭제
      const fs = require("fs");
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error("임시 파일 삭제 실패:", unlinkErr);
      });
    });
  } catch (err) {
    console.error("PDF 생성 및 다운로드 실패:", err);
    res
      .status(500)
      .json({ message: "PDF 생성 및 다운로드 실패", error: err.message });
  }
});

// ------------------
// 이메일 전송
// ------------------
router.post("/email/send", async (req, res) => {
  try {
    const { orderId, emailDetails } = req.body;
    if (!orderId || !emailDetails) {
      return res
        .status(400)
        .json({ message: "주문 번호와 이메일 정보가 필요합니다." });
    }
    const result = await salesService.generatePdfAndSendEmail(
      orderId,
      emailDetails
    );
    if (result.success) {
      res.json({ message: "이메일 전송 완료" });
    } else {
      console.error("이메일 전송 실패:", result.error);
      res
        .status(500)
        .json({ message: "이메일 전송 실패", error: result.error });
    }
  } catch (err) {
    console.error("이메일 전송 실패:", err);
    res.status(500).json({ message: "이메일 전송 실패", error: err.message });
  }
});

module.exports = router;
