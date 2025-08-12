const express = require("express");
const router = express.Router();

const testService = require("../services/test_service.js");

router.get("/testInform", async (req, res) => {
  try {
    const { productType, inspPurpose } = req.query;

    // ⭐ 파라미터가 정확히 전달되는지 확인
    const list = await testService.findAllItemsWithFilter(
      productType,
      inspPurpose
    );

    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

router.post("/testInform", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const ItemData = req.body;
    const result = await testService.insertItem(ItemData);
    res.status(201).json({ message: "등록성공", result });
  } catch (error) {
    console.error("항목등록 실패: test_router.js", error);
    res.status(500).json({ message: "항목등록 실패", error: error.message });
  }
});

module.exports = router;
