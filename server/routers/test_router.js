const express = require("express");
const router = express.Router();

const testService = require("../services/test_service.js");

router.get("/testInform", async (req, res) => {
  try {
    const { productType, inspPurpose } = req.query;

    // 파라미터가 정확히 전달되는지 확인
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

router.get("/matTestRegist", async (req, res) => {
  try {
    let list = await testService.findInspWait();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

router.post("/matTestRegist", async (req, res) => {
  try {
    const { 자재검수번호, 최종판정 } = req.body;

    // 필수 데이터 누락 시 에러 처리
    if (!자재검수번호 || !최종판정) {
      return res.status(400).json({
        message: "필수 파라미터(자재검수번호, 최종판정)가 누락되었습니다.",
      });
    }

    // 서비스 함수를 호출하여 DB 업데이트
    const result = await testService.updateInspectionResult(
      자재검수번호,
      최종판정
    );

    if (result && result.affectedRows > 0) {
      // 성공 응답
      res.status(200).json({
        success: true,
        message: "검사 결과가 성공적으로 업데이트되었습니다.",
      });
    } else {
      // 자재검수번호를 찾지 못한 경우
      res.status(404).json({
        success: false,
        message: "해당 자재검수번호를 찾을 수 없습니다.",
      });
    }
  } catch (error) {
    console.error("검사 결과 업데이트 실패:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류로 인해 업데이트에 실패했습니다.",
    });
  }
});

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
