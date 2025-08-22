const express = require("express");
const router = express.Router();

const productionService = require("../services/production_service.js");

router.get("/orderSearch", async (req, res) => {
  try {
    let list = await productionService.findAllOrder();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

router.post("/productionOrder", async (req, res) => {
  try {
    // // 세션에서 로그인한 사용자의 이름을 가져옵니다.
    //         // req.body에서 director를 추출하지 않습니다.
    //         const { plan_detail_no, details } = req.body;
    //         const directorName = req.session.user.name; // 세션에서 director 값을 가져옵니다.

    //         console.log("라우터가 받은 데이터:", req.body);

    //         // 서비스 함수에 세션에서 가져온 directorName을 전달합니다.
    //         const result = await productionService.startWork(directorName, plan_detail_no, details);
    // res.status(201).json({ message: "등록성공!", result });
    // } catch (error) {
    //     console.error("지시등록에 실패하였습니다.", error);
    //     res.status(500).json({ message: "작업지시등록실패", error: error.message });
    // }
    const { director, plan_detail_no, details } = req.body;
    console.log("라우터가 받은 데이터:", req.body);
    console.log("받은 productPlanCode:", plan_detail_no);
    const result = await productionService.startWork(
      director,
      plan_detail_no,
      details
    );

    res.status(201).json({ message: "등록성공!", result });
  } catch (error) {
    console.error("지시등록에 실패하였습니다.", error);
    res.status(500).json({ message: "작업지시등록실패", error: error.message });
  }
});
// 생산 지시 목록을 조회하는 GET 메서드 추가
router.get("/productionOrderList", async (req, res) => {
  try {
    // productionService에서 데이터를 조회하는 함수 호출
    const productionOrderList = await productionService.selectOrderList();
    // 조회 결과를 JSON 형식으로 클라이언트에게 응답
    res.json({ list: productionOrderList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버오류" });
  }
});
// 공정 흐름도 목록 조회
router.get("/productionResultRegist", async (req, res) => {
  try {
    const notRegistPrcList = await productionService.notRegistPrcList();
    res.json({ list: notRegistPrcList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버오류" });
  }
});
// 실적 등록
router.post("/insertPerform", async (req, res) => {
  try {
    const payload = req.body;
    const insertPerform = await productionService.insertPerform(payload);
    res.status(201).json({ list: insertPerform });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버오류" });
  }
});
// 실적 테이블에 존재하는 데이터의 생산종료일시 기입과 작업상태 수정
router.put("/updatePerform", async (req, res) => {
  try {
    const payload = req.body;
    const updatePerform = await productionService.updatePerform(payload);
    res.status(200).json({ list: updatePerform });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버오류" });
  }
});
// 실적등록된 이름 조회
router.get("/selectEname", async (req, res) => {
  try {
    const { wo_no, process_id } = req.query; // 쿼리 파라미터에서 wo_no, process_id를 가져옵니다.
    const insertedName = await productionService.selectEname(wo_no, process_id);
    res.status(200).json({ success: true, e_name: insertedName });
  } catch (error) {
    console.error("작업자 이름 조회 실패:", error);
    res.status(500).json({ success: false, message: "작업자 이름 조회 실패" });
  }
});
// 작업지시 상태 조회
router.get("/checkWoStatus", async (req, res) => {
  try {
    const { wo_no } = req.query;
    const woStatus = await productionService.checkWoStatus(wo_no);

    res.status(200).json({ status: woStatus });
  } catch (error) {
    console.error("작업지시 상태 조회 실패:", error);
    res.status(500).json({
      status: "error",
      message: "작업지시 상태조회 중 서버 오류 발생!!",
    });
  }
});
router.post("/bomRequestInsert", async (req, res) => {
  try { 
    const { details } = req.body; // 요청 본문에서 details를 가져옵니다.
    console.log("BOM 요청 데이터:", details);
    const result = await productionService.bomRequestInsert(details);
    res.status(201).json({ message: "BOM 요청 성공", result });
  } catch (error) {
    console.error("BOM 요청 실패:", error);
    res.status(500).json({ message: "BOM 요청 실패", error: error.message });
  }
});
module.exports = router;
