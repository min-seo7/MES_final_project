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
//(모달)거래처
router.get("/modalPartnerList", async (req, res) => {
  try {
    let partnerList = await stockService.partnerList();
    res.json(partnerList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});
//(모달)보관창고
router.get("/modalWareList", async (req, res) => {
  try {
    let warehouseList = await stockService.warehouseList();
    res.json(warehouseList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
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
    res.status(500).json({ message: "마스터 저장 실패" });
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
    res.status(500).json({ message: "디테일 저장 실패" });
  }
});
//재고부족리스트
router.get("/lessMatList", async (req, res) => {
  try {
    let lessMatList = await stockService.lessMatList();
    res.json(lessMatList);
    console.log(lessMatList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "리스트 오류" });
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
    res.status(500).json({ message: "리스트 오류" });
  }
});
//발주취소
router.post("/purCancel", async (req, res) => {
  try {
    await stockService.purCancel(req.body); // 배열 통째로 전달
    res.json({ message: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "발주취소 실패" });
  }
});
//조회
router.post("/searchPurchaseList", async (req, res) => {
  try {
    const data = await stockService.getSearchPurchaseList(req.body); // 검색조건 전달
    res.json(data);
    console.log(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "조회 실패" });
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
    res.status(500).json({ message: "입고대기목록 오류" });
  }
});
//입고대기자재조회
router.post("/searchMatPandingList", async (req, res) => {
  try {
    const data = await stockService.getSearchMatPandingList(req.body); // 검색조건 전달
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "조회 실패" });
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
    res.status(500).json({ message: "자재lot등록 실패" });
  }
});
//자재lot목록(입고)
router.get("/matLotList", async (req, res) => {
  try {
    let matLotList = await stockService.matLotList();
    res.json(matLotList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "lot자재목록 오류" });
  }
});
//반품등록
router.post("/matReturn", async (req, res) => {
  try {
    await stockService.matReturn(req.body);
    res.json({ message: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "자재반품 실패" });
  }
});
//입고취소
router.post("/matLotCancel", async (req, res) => {
  try {
    await stockService.matLotCancel(req.body);
    res.json({ message: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "입고취소 실패" });
  }
});
//제품관리============================================================================
//제품입고대기목록
router.get("/prdPendingList", async (req, res) => {
  try {
    let prdPendigList = await stockService.prdPendigList();
    res.json(prdPendigList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "제품목록 오류" });
  }
});
//제품lot등록
router.post("/rePrdtLot", async (req, res) => {
  console.log("Received details:", req.body);
  try {
    await stockService.prdLotInsert(req.body);
    res.json({ message: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "제품lot등록 실패" });
  }
});
//제품lot목록
router.get("/prdLotList", async (req, res) => {
  try {
    let prdLotList = await stockService.prdLotList();
    res.json(prdLotList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "lot제품목록 오류" });
  }
});
//입고취소
router.post("/prdLotCancel", async (req, res) => {
  try {
    await stockService.prdLotCancel(req.body);
    res.json({ message: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "입고취소 실패" });
  }
});
//조회
router.post("/searchProductInList", async (req, res) => {
  try {
    const data = await stockService.getSearchPrdPadingList(req.body); // 검색조건 전달
    res.json(data);
    console.log(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "조회 실패" });
  }
});

//자재출고=====================================================
//자재출고대기목록
router.get("/matWOutList", async (req, res) => {
  try {
    let matWoutList = await stockService.matOutWaitList();
    res.json(matWoutList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "자재출고요청대기목록 오류" });
  }
});
//자재재고확인
router.post("/checkMatStock", async (req, res) => {
  const { MatIds } = req.body; // 구조분해로 바로 꺼내기
  console.log("받은 mat:", MatIds);
  try {
    const result = await stockService.getCheckMatStock(MatIds);
    res.json(result);
    console.log(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "재고 확인 실패" });
  }
});
//자재출고조회
router.post("/searchMatOutList", async (req, res) => {
  try {
    const data = await stockService.getSearchMatOutList(req.body); // 검색조건 전달
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "조회 실패" });
  }
});
//자재출고등록
router.post("/reMatOut", async (req, res) => {
  console.log("Received details:", req.body);
  try {
    await stockService.matOusR(req.body);
    res.json({ message: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "출고등록 실패" });
  }
});
//자재출고완료목록
router.get("/matOutList", async (req, res) => {
  try {
    let matoutList = await stockService.matOutList();
    res.json(matoutList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "자재출목록 오류" });
  }
});
//출고취소
router.post("/matOutCancel", async (req, res) => {
  try {
    await stockService.matOutCancel(req.body);
    res.json({ message: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "출고취소 실패" });
  }
});
//제품출고=====================================================
//제품출고대기목록
router.get("/prdWOutList", async (req, res) => {
  try {
    let prdWoutList = await stockService.prdOutWaitList();
    res.json(prdWoutList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "출고대기목록 오류" });
  }
});
//제품재고확인
router.post("/checkStock", async (req, res) => {
  const { productIds } = req.body; // 구조분해로 바로 꺼내기
  console.log("받은 productIds:", productIds);
  console.log("배열인가?:", Array.isArray(productIds));
  try {
    const result = await stockService.getCheckStock(productIds);
    res.json(result);
    console.log(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "재고 확인 실패" });
  }
});
//제품출고등록
router.post("/rePrdOut", async (req, res) => {
  try {
    await stockService.prdOusR(req.body);
    res.json({ message: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "제품출고등록 실패" });
  }
});
//제품출고목록
router.get("/prdOutList", async (req, res) => {
  try {
    let prdoutList = await stockService.prdOutList();
    res.json(prdoutList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "출고대기목록 오류" });
  }
});
//조회
router.post("/productOutSearch", async (req, res) => {
  try {
    const data = await stockService.getSearchOutWaitList(req.body); // 검색조건 전달
    res.json(data);
    console.log(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "조회 실패" });
  }
});
//출고취소
router.post("/prdOutCancel", async (req, res) => {
  try {
    await stockService.prdOutCancel(req.body);
    res.json({ message: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "출고취소 실패" });
  }
});
//재고조회======================================================================
//제품재고조회
//제품첫목록
router.get("/prdSearchList", async (req, res) => {
  try {
    let prdSearchList = await stockService.prdSearchtList();
    res.json(prdSearchList);
    console.log(prdSearchList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "제품조회목록 오류" });
  }
});
//조회
router.post("/searchPrdLotList", async (req, res) => {
  try {
    const data = await stockService.getSearchPrdLotList(req.body); // 검색조건 전달
    res.json(data);
    console.log(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "조회 실패" });
  }
});

//자재재고조회
//첫목록
router.get("/matSearchList", async (req, res) => {
  try {
    let matSearchList = await stockService.matSearchtList();
    res.json(matSearchList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "자재조회목록 오류" });
  }
});
//조회
router.post("/searchMatLotList", async (req, res) => {
  try {
    const data = await stockService.getSearchMatLotList(req.body); // 검색조건 전달
    res.json(data);
    console.log(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "조회 실패" });
  }
});
//반품====================================================================
router.get("/returnList", async (req, res) => {
  try {
    let returnList = await stockService.returnList();
    res.json(returnList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "자재조회목록 오류" });
  }
});
//조회
router.post("/searchReturnList", async (req, res) => {
  try {
    const data = await stockService.getSearchReturnList(req.body); // 검색조건 전달
    res.json(data);
    console.log(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "조회 실패" });
  }
});
//등록
router.post("/returnReg", async (req, res) => {
  console.log("Received details:", req.body);
  try {
    await stockService.returnInfoUpdate(req.body);
    res.json({ message: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "반출등록 실패" });
  }
});
//수정
router.post("/returnRewri", async (req, res) => {
  console.log("Received details:", req.body);
  try {
    await stockService.returnInfoRe(req.body);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "수정 실패" });
  }
});
//폐기물===========================================================================================
router.get("/wasteList", async (req, res) => {
  try {
    let wasteList = await stockService.wasteList();
    res.json(wasteList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "자재조회목록 오류" });
  }
});
//등록
router.post("/wasteOutReg", async (req, res) => {
  console.log("Received details:", req.body);
  try {
    await stockService.wasteInfoUpdate(req.body);
    res.json({ message: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "반출등록 실패" });
  }
});
//조회
router.post("/searchWasteList", async (req, res) => {
  try {
    const data = await stockService.getSearchWasteList(req.body); // 검색조건 전달
    res.json(data);
    console.log(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "조회 실패" });
  }
});
//수정
router.post("/wasteRewri", async (req, res) => {
  console.log("Received details:", req.body);
  try {
    await stockService.wasteInfoRe(req.body);
    res.json({ message: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "수정 실패" });
  }
});
module.exports = router;
