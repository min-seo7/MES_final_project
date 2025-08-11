const express = require("express");
const router = express.Router();

const stockService = require("../services/stock_service.js");
//(모달)자재리스트
router.get("/modalMatList", async (req, res) => {
  try {
    let matList = await stockService.matList();
    res.json(matList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

//(모달)제품리스트
router.get("/modalPrdList", async (req, res) => {
  try {
    let prdList = await stockService.prdList();
    res.json(prdList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

//발주
//마스터T 등록 라우터
router.post("/purchase", async(req, res) => {
  try {
    const purchaseNo = await stockService.masterInfo(req.body);
    res.json({ purchase_no: purchaseNo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '마스터 저장 실패' });
  }
});
//서브T등록 라우터
router.post('/purDetail', async (req, res) => {
  try {
    const details = req.body; // 배열
    for (const row of details) {
      await stockService.subInfo(row);
    }
      res.json({ message: 'success' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '디테일 저장 실패' });
  }
});

module.exports = router;
