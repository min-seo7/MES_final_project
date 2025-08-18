const express = require("express");
const router = express.Router();

const salesService = require("../services/sales_service.js");

//주문등록
router.post("/orderRegist", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const orderData = req.body;
    const result = await salesService.InsertOrder(orderData, orderData.orders);
    // console.log(orderData);
    console.log(orderData.orders);
    res.status(200).json({ message: "주문서등록성공", result });
  } catch (error) {
    console.error("주문등록 실패:sales_router. js", error);
    res.status(500).json({ message: "주문등록 실패", error: error.message });
  }
});
// //주문조회
// router.get("/orderSearch", async (req, res) => {
//   try {
//     let list = await salesService.selectRegisList();
//     res.json({ list });
//   } catch (err) {
//     console.error("주문조회내역조회" + err);
//     res.status(500).json({ message: "서버오류" });
//   }
// });
//주문등록모달조회
router.get("/ordPaModalList", async (req, res) => {
  try {
    let list = await salesService.selectOrdRegistModal();
    res.json({ list });
  } catch (err) {
    console.err(err);
    res.status(500).json({ message: "서버오류" });
  }
});
//주문제품조회선택모달
router.get("/ordModalPrdList", async (req, res) => {
  try {
    let list = await salesService.selectOrderProductModal();
    res.json({ list });
  } catch (err) {
    console.err(err);
    res.status(500).json({ message: "서버오류" });
  }
});
//주문내역
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

//이메일 관련 주문내역
router.get("/pdfEmail", async (req, res) => {
  try {
    const filter = {
      orderId: req.query.orderId || null,
      orderStatus: req.query.orderStatus || null,
      productName: req.query.productName || null,
      partnerId: req.query.partnerId || null,
      startDate: req.query.startDate || null,
      endDate: req.query.endDate || null,
    };
    const filteredData = await salesService.selectFilterInfoEmail(filter);
    res.json({ list: filteredData });
  } catch (error) {
    console.error("이메일 + 주문내역 조회 실패:sales_router.js", error);
    res.status(500).json({ error: "데이터를 가져오는 데 실패했습니다." });
  }
});

//출하요청내역(주문서목록조회)
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

//출하선택된주문서 주문상세내역
router.get("/shipReqRegist/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const list = await salesService.selectOrderDetails(orderId);
    console.log("프론트엔드에서 주문 상세 내역 조회 요청 받음:", orderId);
    res.status(200).json({ message: "주문목록불러오기 성공", list });
  } catch (err) {
    console.error("주문상세내역조회실패:", err);
    res
      .status(500)
      .json({ error: "주문상세 데이터를 가져오는 데 실패했습니다." });
  }
});
// 출하 등록
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

//출하조회 (필터링 적용)
router.get("/shipReqSearch", async (req, res) => {
  try {
    const filters = {
      partnerId: req.query.partnerId || null,
      productId: req.query.productId || null,
      startDate: req.query.startDate || null,
      endDate: req.query.endDate || null,
    };
    const filteredData = await salesService.shipList(filters);
    res.json({ list: filteredData });
  } catch (err) {
    console.error("출하조회 실패:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});
// 납기일 수정 및 이력 등록 라우터 추가
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
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});
// 납기일 변경 내역 조회 라우터
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
      res.status(404).json({ message: "납기일 변경 내역이 없습니다." });
    }
  } catch (err) {
    console.error("Error fetching modified list:", err);
    res.status(500).json({ error: "납기일 변경 내역 조회 실패" });
  }
});
module.exports = router;
