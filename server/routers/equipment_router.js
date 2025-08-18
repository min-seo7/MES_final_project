const express = require("express");
const router = express.Router();
const equipmentService = require("../services/equipment_service.js");

// 설비점검 페이지
// 설비점검 목록(심플)
router.get("/inspection", async (req, res) => {
  try {
    const list = await equipmentService.findInspectionList();
    res.json(list); // 배열 그대로
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 설비점검 검색(필터 포함)
router.get("/inspection/search", async (req, res) => {
  try {
    const list = await equipmentService.findInspectionByFilter(req.query);
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 설비점검 DISTINCT (모달용 페이지네이션 5개 고정)
router.get("/inspection/distinct", async (req, res) => {
  try {
    const { field, page = 1, size = 5 } = req.query;
    const result = await equipmentService.findInspectionDistinct(
      field,
      Number(page),
      Number(size)
    );
    res.json(result); // { items, total, page, size }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "inspection distinct 실패" });
  }
});

/////////////////////////////////

// 설비정보 등록/수정 페이지
// DISTINCT 목록 조회
router.get("/distinct", async (req, res) => {
  try {
    const { field } = req.query;
    const items = await equipmentService.getDistinct(field);
    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "distinct 조회 실패" });
  }
});

// 설비정보 조건 검색 (목록 + 페이지네이션 추가됨)
router.get("/search", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1"), 1);
    const size = Math.max(parseInt(req.query.size || "10"), 1);
    const result = await equipmentService.searchEquipment(
      req.query,
      page,
      size
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "검색 실패" });
  }
});

// 설비 단건 조회 (폼 바인딩용)
router.get("/find-one", async (req, res) => {
  try {
    const item = await equipmentService.findOneEquipment(req.query);
    res.json(item); // null or object
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "단건 조회 실패" });
  }
});

//설비정보 등록
router.post("/regist", async (req, res) => {
  try {
    console.log("[information_router] BODY:", req.body);
    const eqData = req.body;
    const result = await equipmentService.insertEquipment(eqData);

    res.status(201).json({ message: "설비 등록성공", result });
  } catch (error) {
    console.error("설비 등록 실패: information_router.js", error);
    res.status(500).json({ message: "설비 등록 실패", error: error.message });
  }
});

// 설비정보 수정 (PUT)
router.put("/update", async (req, res) => {
  try {
    const result = await equipmentService.updateEquipment(req.body);
    res.status(200).json({ message: "설비 수정 성공", result });
  } catch (error) {
    res.status(500).json({ message: "설비 수정 실패", error: error.message });
  }
});

// "설비정보 조회 페이지"
/* ========== 설비정보 조회 페이지(info2) ========== */
// 4-1) 진입(무필터) 10건 + 전체 건수
router.get("/info2", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1"), 1);
    const size = Math.max(parseInt(req.query.size || "10"), 1);
    const result = await equipmentService.findEquipmentInfoPage(page, size);
    res.json(result); // {items,total,page,size}
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "info2 목록 실패" });
  }
});

// 4-2) 조건검색(OR 기본, AND는 주석)
router.get("/info2/search", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1"), 1);
    const size = Math.max(parseInt(req.query.size || "10"), 1);
    const result = await equipmentService.searchEquipmentInfo2(
      req.query,
      page,
      size
    );
    res.json(result); // {items,total,page,size}
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "info2 검색 실패" });
  }
});

// 코드생성
router.get("/gen-code", async (req, res) => {
  try {
    const code = await equipmentService.generateCode();
    res.json({ code });
  } catch (err) {
    console.error("gen-code 실패:", err);
    res.status(500).json({ message: "코드 생성 실패" });
  }
});

// 4-3) 모달용 DISTINCT + 페이지네이션(5 고정)
router.get("/info2/distinct", async (req, res) => {
  try {
    const { field, page = 1, size = 5 } = req.query;
    const result = await equipmentService.findEquipmentInfoDistinct(
      field,
      Number(page),
      Number(size)
    );
    res.json(result); // {items,total,page,size}
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "info2 distinct 실패" });
  }
});

module.exports = router;
