const express = require("express");
const router = express.Router();

const salesService = require("../services/sales_service.js");

router.post("/orderRegist", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const orderData = req.body;
    const result = await salesService.InsertOrder(orderData, orderData.order);
    console.log(orderData.order);
    res.status(200).json({ message: "주문서등록성공", result });
  } catch (error) {
    console.error("주문등록 실패:sales_router. js", error);
    res.status(500).json({ message: "주문등록 실패", error: error.message });
  }
});

module.exports = router;
