// router/testRouter.js

const express = require("express");
const router = express.Router();
const testService = require("../services/test_service.js");

// 중앙 집중식 에러 핸들러
const handleError = (res, message, err) => {
  console.error(message, err);
  res.status(500).json({ success: false, message });
};

// ---
// 1. 검사항목 관련 API (CRUD)
// ---
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
    handleError(res, "검사항목 조회 실패", err);
  }
});

// 검사항목 등록
router.post("/testInform", async (req, res) => {
  try {
    const itemData = req.body;
    const result = await testService.insertItem(itemData);
    res.status(201).json({ success: true, message: "등록 성공", result });
  } catch (err) {
    handleError(res, "항목 등록 실패", err);
  }
});

// 검사항목 삭제
router.delete("/testInform/:testitem_code", async (req, res) => {
  const { testitem_code } = req.params;
  try {
    await testService.deleteTestItem(testitem_code);
    res.json({ success: true, message: "삭제 완료" });
  } catch (err) {
    handleError(res, "삭제 실패", err);
  }
});

// ---
// 2. 자재 검사 관련 API
// ---
// 자재 입고 검사 대기 목록 조회
router.get("/matTestRegist", async (req, res) => {
  try {
    let list = await testService.findInspWait();
    res.json(list);
  } catch (err) {
    handleError(res, "자재 검사 대기 목록 조회 실패", err);
  }
});

// 자재 검사 등록
router.post("/matTestRegist", async (req, res) => {
  try {
    const inspData = req.body;
    const result = await testService.insertInsp(inspData);
    res.status(201).json({ success: true, materialOrder_num: result.insertId });
  } catch (err) {
    handleError(res, "자재 검사 등록 실패", err);
  }
});

// 자재 검수 완료 목록 조회
router.get("/matTestResult", async (req, res) => {
  try {
    // 프론트엔드에서 전달된 purch_id와 material_code 쿼리 파라미터 추출
    const { purch_id, material_code } = req.query;

    // 서비스 함수 호출 시 필터 파라미터들을 전달
    let list = await testService.findInspFin(purch_id, material_code);
    res.json(list);
  } catch (err) {
    handleError(res, "자재 검수 완료 목록 조회 실패", err);
  }
});

// ---
// 3. 제품 검사 관련 API
// ---
// 제품 검사 대기 목록 조회
router.get("/prdTestRegist", async (req, res) => {
  try {
    let list = await testService.findpdInspWait();
    res.json(list);
  } catch (err) {
    handleError(res, "제품 검사 대기 목록 조회 실패", err);
  }
});

// 제품 품질 검사 등록
router.post("/prdTestRegist", async (req, res) => {
  try {
    const inspData = req.body;
    const result = await testService.insertPrdInsp(inspData);
    res.status(201).json(result);
  } catch (err) {
    handleError(res, "제품 검사 등록 실패", err);
  }
});

// 제품 품질 검사 완료 목록 조회
router.get("/prdTestResult", async (req, res) => {
  try {
    const { perfCode, productCode } = req.query; // inspNum 제거
    const list = await testService.findPrdTestFin(perfCode, productCode);
    res.json(list);
  } catch (err) {
    handleError(res, "제품 검사 완료 목록 조회 실패", err);
  }
});

// 제품 품질 검사 상세 내역 조회
router.get("/prdTestResult/detail", async (req, res) => {
  try {
    const { inspNum } = req.query;
    const list = await testService.findPrdTestDetail(inspNum);
    res.json(list);
  } catch (err) {
    handleError(res, "제품 검사 상세 내역 조회 실패", err);
  }
});

// ---
// 4. 공통 데이터 조회 API (유형/목적/단위 등)
// ---
router.get("/productTypes", async (req, res) => {
  try {
    const result = await testService.getProductTypes();
    res.json(result);
  } catch (err) {
    handleError(res, "제품 유형 조회 실패", err);
  }
});

router.get("/inspPurposes", async (req, res) => {
  try {
    const result = await testService.getInspPurposes();
    res.json(result);
  } catch (err) {
    handleError(res, "검사 목적 조회 실패", err);
  }
});

router.get("/inspItems", async (req, res) => {
  try {
    const result = await testService.getInspItems();
    res.json(result);
  } catch (err) {
    handleError(res, "검사 항목 조회 실패", err);
  }
});

router.get("/operators", async (req, res) => {
  try {
    const result = await testService.getOperators();
    res.json(result);
  } catch (err) {
    handleError(res, "연산자 조회 실패", err);
  }
});

router.get("/units", async (req, res) => {
  try {
    const result = await testService.getUnits();
    res.json(result);
  } catch (err) {
    handleError(res, "단위 조회 실패", err);
  }
});

// 제품유형별 검사항목 조회 API
router.get("/prdTestRegist/getitem", async (req, res) => {
  try {
    const { productId } = req.query;
    const rows = await testService.findItemsByProductType(productId);
    res.json(rows);
  } catch (err) {
    handleError(res, "제품유형별 검사항목 조회 실패", err);
  }
});

module.exports = router;
