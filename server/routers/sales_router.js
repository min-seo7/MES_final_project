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
//주문조회
router.get("/orderSearch", async (req, res) => {
  try {
    let list = await salesService.selectRegisList();
    res.json({ list });
  } catch (err) {
    console.err(err);
    res.status(500).json({ message: "서버오류" });
  }
});

module.exports = router;
