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
router.post("/filterPerformance", async (req, res) => {
  try {
    // // req.body로 값을 받습니다. (axios.post를 사용했기 때문)
    // const { w_ed_date, nextDay, process_id, line_id, e_name, product_type, product_form } = req.body;
    
    // // 이 console.log를 통해 payload가 정상적으로 들어오는지 확인할 수 있습니다.
    // console.log(req.body);

    // 서비스 함수에 값을 전달합니다.
    let list = await productionService.filterPerformance(req.body);
    
    res.json({ message: "조회 성공!", list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류", error: err.message });
  }
});

router.post("/productionOrder", async (req, res) => {
  try {
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
router.get("/productionOrder", async (req, res) => {
  try {
    const productionOrderList = await productionService.productionOrderList();
    res.status(200).json({ list: productionOrderList });
  } catch (error) {
    console.error("요청 실패:", error);
    res.status(500).json({ message: "요청 실패", error: error.message });
  }
});
// 모달 - 공정 리스트
router.get("/selectProcessList", async (req, res) => {
  try {
    const processList = await productionService.selectProcessList();
    res.status(200).json({list : processList});
  } catch (error) {
    console.error("공정 목록 조회 실패:", error);
    res.status(500).json({ message: "공정 목록 조회 실패", error: error.message });
  }
});
// 페이지 - 공정 리스트
router.get("/processesNotSearchList", async (req, res) => {
  try {
    const selectProcessNotSearchList = await productionService.selectProcessNotSearchList();
    res.status(200).json({ list: selectProcessNotSearchList });
  } catch (error) {
    console.error("공정 목록 조회 실패:", error);
    res.status(500).json({ message: "공정 목록 조회 실패", error: error.message });
  }
});

router.get("/productListModal", async (req, res) => {
  try {
    const productList = await productionService.productListModal();
    res.status(200).json({ list: productList });
  } catch (error) {
    console.error("제품 목록 조회 실패:", error);
    res.status(500).json({ message: "제품 목록 조회 실패", error: error.message });
  }
});

router.post("/insertPlan",async(req ,res)=>{
try {
  const payload = req.body;
  const insertPlan = await productionService.insertPlan(payload);
   res.status(201).json({ list: insertPlan });
} catch (error) {
   res.status(500).json({ message: "계획 등록 실패 !",error: error.message })
}
});
module.exports = router;
