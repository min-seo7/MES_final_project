const express = require("express");
const router = express.Router();

const informationService = require("../services/information_service.js");

router.get("/employee", async (req, res) => {
  try {
    let list = await informationService.findAllEmployees();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

router.post("/employee", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const employeeData = req.body;
    const result = await informationService.insertEmployee(employeeData);
    res.status(201).json({ message: "등록성공", result });
  } catch (error) {
    console.error("사원등록 실패: information_router.js", error);
    res.status(500).json({ message: "사원등록 실패", error: error.message });
  }
});

router.get("/bom", async (req, res) => {
  try {
    let list = await informationService.findAllBOM();
    let list2 = await informationService.findDetailBOM();
    res.json({ list, list2 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

router.post("/bom", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const bomData = req.body;
    const result = await informationService.insertBOM(bomData);
    res.status(201).json({ message: "BOM등록성공", result });
  } catch (error) {
    console.error("BOM등록 실패: information_router.js", error);
    res.status(500).json({ message: "BOM등록 실패", error: error.message });
  }
});

router.post("/bom/detail", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const bomData = req.body;
    const result = await informationService.insertDetailBOM(bomData);
    res.status(201).json({ message: "BOM_detail등록성공", result });
  } catch (error) {
    console.error("BOM_detail등록 실패: information_router.js", error);
    res
      .status(500)
      .json({ message: "BOM_detail등록 실패", error: error.message });
  }
});

router.get("/process", async (req, res) => {
  try {
    let list = await informationService.findAllProcess();
    res.json({ list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

router.post("/process", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const processData = req.body;
    const result = await informationService.insertProcess(processData);
    res.status(201).json({ message: "공정등록성공", result });
  } catch (error) {
    console.error("공정등록 실패: information_router.js", error);
    res.status(500).json({ message: "공정등록 실패", error: error.message });
  }
});

router.post("/process/modify", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const processData = req.body;
    console.log(processData);
    const result = await informationService.updateProcess(processData);
    res.status(201).json({ message: "공정수정성공", result });
  } catch (error) {
    console.error("공정수정 실패: information_router.js", error);
    res.status(500).json({ message: "공정수정 실패", error: error.message });
  }
});

router.get("/line", async (req, res) => {
  try {
    let list = await informationService.findAllLine();
    let list2 = await informationService.findAllDetailLine();

    res.json({ list, list2 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

router.post("/line", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const processData = req.body;
    const result = await informationService.insertLine(processData);
    res.status(201).json({ message: "라인등록성공", result });
  } catch (error) {
    console.error("라인등록 실패: information_router.js", error);
    res.status(500).json({ message: "라인등록 실패", error: error.message });
  }
});

router.post("/line/modify", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const lineData = req.body;
    console.log(lineData);
    const result = await informationService.updateLine(processData);
    res.status(201).json({ message: "라인수정성공", result });
  } catch (error) {
    console.error("라인수정 실패: information_router.js", error);
    res.status(500).json({ message: "라인수정 실패", error: error.message });
  }
});

router.post("/line/detail", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const lineData = req.body;
    const result = await informationService.insertDetailLine(lineData);
    res.status(201).json({ message: "라인등록성공", result });
  } catch (error) {
    console.error("라인등록 실패: information_router.js", error);
    res.status(500).json({ message: "라인등록 실패", error: error.message });
  }
});

router.post("/line/detail/modify", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const lineData = req.body;
    console.log(lineData);
    const result = await informationService.updateDetailLine(processData);
    res.status(201).json({ message: "라인수정성공", result });
  } catch (error) {
    console.error("라인수정 실패: information_router.js", error);
    res.status(500).json({ message: "라인수정 실패", error: error.message });
  }
});

router.get("/flowchart", async (req, res) => {
  try {
    let list = await informationService.findAllFlowchart();
    let list2 = await informationService.findAllDetailFlowchart();

    res.json({ list, list2 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

router.post("/flowchart", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const flowData = req.body;
    const result = await informationService.insertFlowchart(flowData);
    res.status(201).json({ message: "흐름도 등록성공", result });
  } catch (error) {
    console.error("흐름도 등록 실패: information_router.js", error);
    res.status(500).json({ message: "흐름도 등록 실패", error: error.message });
  }
});

router.post("/flowchart/modify", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const flowData = req.body;
    console.log(flowData);
    const result = await informationService.updateFlowchart(flowData);
    res.status(201).json({ message: "흐름도 수정성공", result });
  } catch (error) {
    console.error("흐름도 수정 실패: information_router.js", error);
    res.status(500).json({ message: "흐름도 수정 실패", error: error.message });
  }
});

router.post("/flowchart/detail", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const flowData = req.body;
    const result = await informationService.insertDetailFlowchart(flowData);
    res.status(201).json({ message: "흐름도 detail 등록성공", result });
  } catch (error) {
    console.error("흐름도 detail 등록 실패: information_router.js", error);
    res
      .status(500)
      .json({ message: "흐름도 detail 등록 실패", error: error.message });
  }
});

router.post("/flowchart/detail/modify", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const flowData = req.body;
    console.log(flowData);
    const result = await informationService.updateDetailFlowchart(flowData);
    res.status(201).json({ message: "흐름도 detail 수정성공", result });
  } catch (error) {
    console.error("흐름도 detail수정 실패: information_router.js", error);
    res
      .status(500)
      .json({ message: "흐름도 detail 수정 실패", error: error.message });
  }
});

router.get("/partner", async (req, res) => {
  try {
    let list = await informationService.findAllPartner();
    res.json({ list });
  } catch (error) {
    res.status(500).json({ message: "서버 오류" });
  }
});

router.post("/partner", async (req, res) => {
  try {
    const partnerData = req.body;
    const result = await informationService.insertPartner(partnerData);
    res.status(201).json({ message: "거래처 등록성공", result });
  } catch (error) {
    res.status(500).json({ message: "거래처 등록 실패", error: error.message });
  }
});

router.post("/partner/modify", async (req, res) => {
  try {
    const partnerData = req.body;
    const result = await informationService.updatePartner(partnerData);
    res.status(201).json({ message: "거래처 수정성공", result });
  } catch (error) {
    res.status(500).json({ message: "거래처 수정 실패", error: error.message });
  }
});

router.get("/material", async (req, res) => {
  try {
    let list = await informationService.findAllMaterial();
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: "서버 오류" });
  }
});

router.post("/material", async (req, res) => {
  try {
    const materialData = req.body;
    const result = await informationService.insertMaterial(materialData);
    res.status(201).json({ message: "자재 등록성공", result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "자재 등록 실패", error: error.message });
  }
});

router.post("/material/modify", async (req, res) => {
  try {
    const materialData = req.body;
    const result = await informationService.updateMaterial(materialData);
    res.status(201).json({ message: "자재 수정성공", result });
  } catch (error) {
    res.status(500).json({ message: "자재 수정실패", error: error.message });
  }
});

router.get("/product", async (req, res) => {
  try {
    let list = await informationService.findAllProduct();
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: "서버 오류" });
  }
});

router.post("/product", async (req, res) => {
  try {
    const productData = req.body;
    const result = await informationService.insertProduct(productData);
    res.status(201).json({ message: "제품 등록성공", result });
  } catch (error) {
    res.status(500).json({ message: "제품 등록 실패", error: error.message });
  }
});

router.post("/product/modify", async (req, res) => {
  try {
    const productData = req.body;
    const result = await informationService.updateProduct(productData);
    res.status(201).json({ message: "제품 수정성공", result });
  } catch (error) {
    res.status(500).json({ message: "제품 수정실패", error: error.message });
  }
});

router.get("/warehouse", async (req, res) => {
  try {
    let list = await informationService.findAllWarehouse();
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: "서버 오류" });
  }
});

router.post("/warehouse", async (req, res) => {
  try {
    const warehouseData = req.body;
    const result = await informationService.insertWarehouse(warehouseData);
    res.status(201).json({ message: "창고 등록성공", result });
  } catch (error) {
    res.status(500).json({ message: "창고 등록 실패", error: error.message });
  }
});

router.post("/warehouse/modify", async (req, res) => {
  try {
    const warehouseData = req.body;
    const result = await informationService.updateWarehouse(warehouseData);
    res.status(201).json({ message: "창고 수정성공", result });
  } catch (error) {
    res.status(500).json({ message: "창고 수정실패", error: error.message });
  }
});

module.exports = router;
