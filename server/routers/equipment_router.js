const express = require("express");
const router = express.Router();
const equipmentService = require("../services/equipment_service.js");

// 목록(심플)
router.get("/inspection", async (req, res) => {
  try {
    const list = await equipmentService.findInspectionList();
    res.json(list); // 배열 그대로
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 검색(필터 포함)
router.get("/inspection/search", async (req, res) => {
  try {
    const list = await equipmentService.findInspectionByFilter(req.query);
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 등록
router.post("/inspection", async (req, res) => {
  try {
    const result = await equipmentService.insertInspection(req.body);
    res.status(201).json({ message: "설비점검 등록성공", result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "설비점검 등록 실패", error: err.message });
  }
});

module.exports = router;
