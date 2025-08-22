const express = require("express");
const router = express.Router();
const equipmentService = require("../services/equipment_service.js");

/* ========== 설비점검 페이지 (기존) ========== */
// 심플 목록
router.get("/inspection", async (req, res) => {
  try {
    const list = await equipmentService.findInspectionList();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 검색(OR)
router.get("/inspection/search", async (req, res) => {
  try {
    const list = await equipmentService.findInspectionByFilter(req.query);
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// DISTINCT (모달용)
router.get("/inspection/distinct", async (req, res) => {
  try {
    const { field, page = 1, size = 5 } = req.query;
    const result = await equipmentService.findInspectionDistinct(
      field,
      Number(page),
      Number(size)
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "inspection distinct 실패" });
  }
});

/* ========== ★ 설비점검 단건/등록/수정 ========== */
// 단건 조회 (폼 바인딩)
router.get("/inspection/find-one", async (req, res) => {
  try {
    const { insp_code } = req.query;
    const item = await equipmentService.findInspectionOne(insp_code);
    res.json(item); // null or object
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "inspection 단건 조회 실패" });
  }
});
// 점검 단건 조회
router.get("/inspection/:id", async (req, res) => {
  try {
    const data = await equipmentService.getInspectionById(req.params.id);

    if (!data.length) {
      return res.status(404).json({ message: "Not found" });
    }

    // 마스터/디테일 분리
    const master = {
      insp_code: data[0].insp_code,
      eq_id: data[0].eq_id,
      insp_type: data[0].insp_type,
      insp_date: data[0].insp_date,
      next_date: data[0].next_date,
      manager: data[0].manager,
      note: data[0].note,
      details: data.map((r) => ({
        detail_id: r.detail_id,
        item: r.item,
        result: r.result,
        action: r.action,
      })),
    };

    res.json(master);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "조회 실패" });
  }
});

// 등록 (POST)  ← 404 원인 해결
router.post("/inspection/regist", async (req, res) => {
  try {
    const result = await equipmentService.registerInspection(req.body);
    res.status(201).json({ message: "설비점검 등록 성공", ...result });
  } catch (err) {
    console.error(err);
    const status = err?.code === "ER_DUP_ENTRY" ? 409 : 500;
    res.status(status).json({ message: err.message || "설비점검 등록 실패" });
  }
});

// 수정 (PUT)
router.put("/inspection/update", async (req, res) => {
  try {
    const result = await equipmentService.updateInspection(req.body);
    res.json({ message: "설비점검 수정 성공", ...result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "설비점검 수정 실패" });
  }
});

/* ========== 설비정보 등록/수정 페이지 (기존) ========== */
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

router.get("/find-one", async (req, res) => {
  try {
    const item = await equipmentService.findOneEquipment(req.query);
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "단건 조회 실패" });
  }
});

router.post("/regist", async (req, res) => {
  try {
    const eqData = req.body;
    const { code, result } = await equipmentService.insertEquipment(eqData);
    res.status(201).json({ message: "설비 등록성공", code, result });
  } catch (error) {
    console.error("설비 등록 실패: information_router.js", error);
    const status = error?.code === "ER_DUP_ENTRY" ? 409 : 500;
    res.status(status).json({ message: error.message || "설비 등록 실패" });
  }
});

router.put("/update", async (req, res) => {
  try {
    const result = await equipmentService.updateEquipment(req.body);
    res.status(200).json({ message: "설비 수정 성공", result });
  } catch (error) {
    res.status(500).json({ message: "설비 수정 실패", error: error.message });
  }
});

/* ========== 설비정보 조회 페이지(info2) (기존) ========== */
router.get("/info2", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1"), 1);
    const size = Math.max(parseInt(req.query.size || "10"), 1);
    const result = await equipmentService.findEquipmentInfoPage(page, size);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "info2 목록 실패" });
  }
});

router.get("/info2/search", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1"), 1);
    const size = Math.max(parseInt(req.query.size || "10"), 1);
    const result = await equipmentService.searchEquipmentInfo2(
      req.query,
      page,
      size
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "info2 검색 실패" });
  }
});

router.get("/gen-code", async (req, res) => {
  try {
    const code = await equipmentService.generateCode();
    res.json({ code });
  } catch (err) {
    console.error("gen-code 실패:", err);
    res.status(500).json({ message: "코드 생성 실패" });
  }
});

router.get("/info2/distinct", async (req, res) => {
  try {
    const { field, page = 1, size = 5 } = req.query;
    const result = await equipmentService.findEquipmentInfoDistinct(
      field,
      Number(page),
      Number(size)
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "info2 distinct 실패" });
  }
});

// 비가동 페이지

// ===== 비가동 목록 조회 =====
router.get("/downtime-list", async (req, res) => {
  try {
    const { eq_id, page = 1, size = 10 } = req.query;
    const offset = (page - 1) * size;

    const result = await equipmentService.getDowntimeList({
      eq_id,
      offset: parseInt(offset, 10),
      size: parseInt(size, 10),
    });

    res.json({
      items: result.rows,
      total: result.total,
    });
  } catch (err) {
    console.error("[GET /equipment/downtime-list] 실패", err);
    res.status(500).json({ message: "비가동 목록 조회 실패" });
  }
});

// 설비코드 모달 조회
router.get("/code-list", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1"), 1);
    const size = Math.max(parseInt(req.query.size || "5"), 1);
    const result = await equipmentService.getCodeList(page, size);
    res.json(result);
  } catch (err) {
    console.error("code-list error", err);
    res.status(500).json({ message: "설비코드 목록 조회 실패" });
  }
});

// 비가동 등록
router.post("/downtime/regist", async (req, res) => {
  try {
    const result = await equipmentService.registDowntime(req.body);
    res.json({ message: "등록 완료", ...result });
  } catch (err) {
    console.error("downtime regist error", err);
    res.status(500).json({ message: "비가동 등록 실패" });
  }
});

// 비가동 수정
router.put("/downtime/update", async (req, res) => {
  try {
    const result = await equipmentService.updateDowntime(req.body);
    res.json({ message: "수정 완료", ...result });
  } catch (err) {
    console.error("downtime update error", err);
    res.status(500).json({ message: "비가동 수정 실패" });
  }
});

/* ========== 설비수리 페이지 ========== */

// (1) 수리목록 기본 조회 (페이지네이션)
router.get("/repair-list", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1"), 1);
    const size = Math.max(parseInt(req.query.size || "10"), 1);
    const result = await equipmentService.getRepairList(page, size);
    res.json({ ...result, page, size });
  } catch (err) {
    console.error("[GET /repair-list] Error:", err);
    res.status(500).json({ message: "설비수리 목록 조회 실패" });
  }
});

// (2) 수리목록 (검색조건 포함)  ← 프론트: /api/equipment/repair-list/search
router.get("/repair-list/search", async (req, res) => {
  try {
    const result = await equipmentService.searchRepairList(req.query);
    res.json({ items: result.items, total: result.total });
  } catch (err) {
    console.error("[GET /repair-list/search] Error:", err);
    res.status(500).json({ message: "설비수리 조회 실패" });
  }
});

// (3) DISTINCT (모달용)
router.get("/repair/distinct", async (req, res) => {
  try {
    const { field, page = 1, size = 5 } = req.query;
    const result = await equipmentService.getRepairDistinct(
      field,
      Number(page),
      Number(size)
    );
    res.json(result);
  } catch (err) {
    console.error("[GET /repair/distinct] Error:", err);
    res.status(500).json({ message: "repair distinct 실패" });
  }
});

module.exports = router;
