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
      // 기존 spec, productType 대신 productName 사용
      productName: req.query.productName || null,
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
module.exports = router;
