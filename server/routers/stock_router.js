const express = require("express");
const router = express.Router();

const stockService = require("../services/stock_service.js");

//모달
//(모달)자재리스트
router.get("/modalMatList", async (req, res) => {
  try {
    let matList = await stockService.matList();
    res.json(matList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "(모달-자재)서버 오류" });
  }
});

//(모달)제품리스트
router.get("/modalPrdList", async (req, res) => {
  try {
    let prdList = await stockService.prdList();
    res.json(prdList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "(모달-자재)서버 오류" });
  }
});
//(모달)거래처
router.get("/modalPartnerList", async (req, res) => {
  try {
    let partnerList = await stockService.partnerList();
    res.json(partnerList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "(모달-자재)서버 오류" });
  }
});
//(모달)보관창고
router.get("/modalWareList", async (req, res) => {
  try {
    let warehouseList = await stockService.warehouseList();
    res.json(warehouseList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "(모달-자재)서버 오류" });
  }
});

//발주등록=====================================================================
//마스터T 등록 라우터
router.post("/purchase", async (req, res) => {
  try {
    const purchaseNo = await stockService.masterInfo(req.body);
    res.json({ pur_no: purchaseNo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "(서버)마스터 저장 실패" });
  }
});
//서브T등록 라우터
router.post("/purDetail", async (req, res) => {
  console.log("Received details:", req.body);
  try {
    await stockService.subInfo(req.body); // 배열 통째로 전달
    res.json({ message: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "(서버)디테일 저장 실패" });
  }
});

//발주목록=======================================================
//리스트
router.get("/purchaseList", async (req, res) => {
  try {
    let purchaseList = await stockService.purchaseList();
    res.json(purchaseList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "(서버)리스트 오류" });
  }
});
//발주취소
router.post("/purCancel", async (req, res) => {
  try {
    await stockService.purCancel(req.body); // 배열 통째로 전달
    res.json({ message: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "(서버)발주취소 실패" });
  }
});

//자재관리===================================================================
//자재입고
//자재입고대기
router.get("/matPandingList", async (req, res) => {
  try {
    let matPandingList = await stockService.matPandingList();
    res.json(matPandingList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "(서버)입고대기목록 오류" });
  }
});
//자재lot등록
router.post("/reMatLot", async (req, res) => {
  console.log("Received details:", req.body);
  try {
    await stockService.matLotInsert(req.body);
    res.json({ message: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "(서버)자재lot등록 실패" });
  }
});
//자재lot목록(입고)
router.get("/matLotList", async (req, res) => {
  try {
    let matLotList = await stockService.matLotList();
    res.json(matLotList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "(서버)lot자재목록 오류" });
  }
});
//반품등록
router.post("/matReturn", async (req, res) => {
  try {
    await stockService.matReturn(req.body);
    res.json({ message: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "(서버)자재반품 실패" });
  }
});
//입고취소
router.post("/matLotCancel", async (req, res) => {
  try {
    await stockService.matLotCancel(req.body);
    res.json({ message: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "(서버)입고취소 실패" });
  }
});
//제품관리============================================================================
//제품입고
//
//제품출고
//
//제품출고대기목록
router.get("/prdWOutList", async (req, res) => {
  try {
    let prdWoutList = await stockService.prdOutWaitList();
    res.json(prdWoutList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "(서버)출고대기목록 오류" });
  }
});
module.exports = router;
