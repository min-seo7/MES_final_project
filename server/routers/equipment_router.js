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

//여기 설비정보 등록 / 수정
router.get("/information/equipment/search", async (req, res, next) => {
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
    const result = await svc.findEquipmentList(q);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

// 단건 조회
router.get("/information/equipment/:eq_id", async (req, res, next) => {
  try {
    const item = await svc.findEquipmentById(req.params.eq_id);
    res.json({ item });
  } catch (e) {
    next(e);
  }
});

// 코드 생성(EQ-YYYYMM-####)
router.get("/information/equipment/gencode", async (_req, res, next) => {
  try {
    const code = await svc.generateEquipmentCode();
    res.json({ code });
  } catch (e) {
    next(e);
  }
});

// 등록 (eq_id 없으면 서버가 코드 생성)
router.post("/information/equipment", async (req, res, next) => {
  try {
    const item = await svc.insertEquipment(req.body);
    res.json({ item });
  } catch (e) {
    next(e);
  }
});

// 수정
router.put("/information/equipment/:eq_id", async (req, res, next) => {
  try {
    const item = await svc.updateEquipment(req.params.eq_id, req.body);
    res.json({ item });
  } catch (e) {
    next(e);
  }
});
module.exports = router;
