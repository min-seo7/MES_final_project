const express = require("express");
const router = express.Router();

const testService = require("../services/test_service.js");

// 검사항목 조회 (필터 적용 가능)
router.get("/testInform", async (req, res) => {
  try {
    const { productType, inspPurpose } = req.query;
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

// 검사항목 등록
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

// 자재입고검사 대기 목록 조회
router.get("/matTestRegist", async (req, res) => {
  try {
    let list = await testService.findInspWait();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 자재검사 등록
router.post("/matTestRegist", async (req, res) => {
  try {
    console.log("req.body:", req.body);
    const inspData = req.body;

    // 서비스 함수 호출: INSERT + UPDATE
    const result = await testService.insertInsp(inspData);

    // insertId만 materialOrder_num으로 반환, raw 결과도 포함
    res.status(201).json({
      success: true,
      materialOrder_num: result.insertId,
      raw: result.raw,
    });
  } catch (err) {
    console.error("검사등록실패..:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 자재검수 완료 목록 조회
router.get("/matTestResult", async (req, res) => {
  try {
    let list = await testService.findInspFin();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

module.exports = router;
