const express = require("express");
const router = express.Router();
const equipmentService = require("../services/equipment_service.js");

// ====================== 설비점검 ======================

// 점검 목록(심플)
router.get("/inspection", async (req, res) => {
  try {
    const list = await equipmentService.findInspectionList();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 점검 검색(필터)
router.get("/inspection/search", async (req, res) => {
  try {
    const list = await equipmentService.findInspectionByFilter(req.query);
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 점검 등록
router.post("/inspection", async (req, res) => {
  try {
    const result = await equipmentService.insertInspection(req.body);
    res.status(201).json({ message: "설비점검 등록성공", result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "설비점검 등록 실패", error: err.message });
  }
});

// ====================== 설비정보 ======================

// 설비 검색 (picker + 조건)
router.get("/search", async (req, res, next) => {
  try {
    const q = {
      eq_id: req.query.eq_id || "",
      eq_type: req.query.eq_type || "",
      eq_name: req.query.eq_name || "",
      loc: req.query.loc || "",
      status: req.query.status || "",
      page: Number(req.query.page || 1),
      size: Number(req.query.size || 20),
    };
    const result = await equipmentService.findEquipmentList(q);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

// 설비 단건 조회
router.get("/:eq_id", async (req, res, next) => {
  try {
    const item = await equipmentService.findEquipmentById(req.params.eq_id);
    res.json({ item });
  } catch (e) {
    next(e);
  }
});

// 설비 코드 생성(EQ-YYYYMM-####)
router.get("/gencode/new", async (_req, res, next) => {
  try {
    const code = await equipmentService.generateEquipmentCode();
    res.json({ code });
  } catch (e) {
    next(e);
  }
});

// 설비 등록
router.post("/", async (req, res, next) => {
  try {
    console.log("[등록 요청 데이터]", req.body); // 요청 데이터 확인
    const item = await equipmentService.insertEquipment(req.body);
    res.status(201).json({ message: "등록성공", item });
  } catch (e) {
    console.error("설비등록 실패:", e);
    next(e);
  }
});

// 설비 수정
router.put("/:eq_id", async (req, res, next) => {
  try {
    const item = await equipmentService.updateEquipment(
      req.params.eq_id,
      req.body
    );
    res.json({ item });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
