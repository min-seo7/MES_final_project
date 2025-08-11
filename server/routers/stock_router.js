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

module.exports = router;
