const express = require("express");
const router = express.Router();

const informationService = require("../services/information_service.js");

router.post("/bom/search", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const bomData = req.body;
    const result = await informationService.findAllBOM(bomData);
    res.status(201).json({ message: "bom 검색성공", result });
  } catch (error) {
    console.error("bom 검색 실패: information_router.js", error);
    res.status(500).json({ message: "bom 검색 실패", error: error.message });
  }
});

router.post("/flowchart/search", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const flowchartData = req.body;
    const result = await informationService.findAllFlowchart(flowchartData);
    res.status(201).json({ message: "flowchart 검색성공", result });
  } catch (error) {
    console.error("flowchart 검색 실패: information_router.js", error);
    res
      .status(500)
      .json({ message: "flowchart 검색 실패", error: error.message });
  }
});

router.post("/line/search", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const lineData = req.body;
    const result = await informationService.findAllLine(lineData);
    res.status(201).json({ message: "line 검색성공", result });
  } catch (error) {
    console.error("line 검색 실패: information_router.js", error);
    res.status(500).json({ message: "line 검색 실패", error: error.message });
  }
});

router.post("/material/search", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const materialData = req.body;
    const result = await informationService.findAllMaterial(materialData);
    res.status(201).json({ message: "material 검색성공", result });
  } catch (error) {
    console.error("material 검색 실패: information_router.js", error);
    res
      .status(500)
      .json({ message: "material 검색 실패", error: error.message });
  }
});

router.post("/process/search", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const processData = req.body;
    const result = await informationService.findAllProcess(processData);
    res.status(201).json({ message: "process 검색성공", result });
  } catch (error) {
    console.error("process 검색 실패: information_router.js", error);
    res
      .status(500)
      .json({ message: "process 검색 실패", error: error.message });
  }
});

router.post("/product/search", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const productData = req.body;
    const result = await informationService.findAllProduct(productData);
    res.status(201).json({ message: "product 검색성공", result });
  } catch (error) {
    console.error("product 검색 실패: information_router.js", error);
    res
      .status(500)
      .json({ message: "product 검색 실패", error: error.message });
  }
});

router.post("/warehouse/search", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const warehouseData = req.body;
    const result = await informationService.findAllWarehouse(warehouseData);
    res.status(201).json({ message: "warehouse 검색성공", result });
  } catch (error) {
    console.error("warehouse 검색 실패: information_router.js", error);
    res
      .status(500)
      .json({ message: "warehouse 검색 실패", error: error.message });
  }
});

router.get("/employee/getEmployeeId", async (req, res) => {
  try {
    let list = await informationService.findAllEmployeeId();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

router.get("/process/getProcessName", async (req, res) => {
  try {
    let list = await informationService.findAllProcessName();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

router.get("/line/getLineName", async (req, res) => {
  try {
    let list = await informationService.findAllLineName();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

router.get("/line/getProcessId", async (req, res) => {
  try {
    let list = await informationService.findAllProcessId();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

router.get("/line/getEquipmentId", async (req, res) => {
  try {
    let list = await informationService.findAllEquipmentId();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

router.get("/material/getMaterialName", async (req, res) => {
  try {
    let list = await informationService.findAllMaterialName();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

router.get("/bom/getProductName", async (req, res) => {
  try {
    let list = await informationService.findAllProductName();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

router.get("/warehouse/getWarehouseType", async (req, res) => {
  try {
    let list = await informationService.findAllWarehouseTypeModal();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

router.get("/warehouse/getLocation", async (req, res) => {
  try {
    let list = await informationService.findAllLocationModal();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

router.get("/warehouse/getWarehouse", async (req, res) => {
  try {
    let list = await informationService.findAllWarehouseModal();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

router.get("/product/getProductName", async (req, res) => {
  try {
    let list = await informationService.findAllProductName();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

router.get("/flowchart/getFlowName", async (req, res) => {
  try {
    let list = await informationService.findAllFlowchartName();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

router.get("/flowchart/getProductId", async (req, res) => {
  try {
    let list = await informationService.findAllProductId();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

router.get("/flowchart/getProductName", async (req, res) => {
  try {
    let list = await informationService.findAllProductName();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

router.get("/flowchart/getFlowName", async (req, res) => {
  try {
    let list = await informationService.findAllFlowchartName();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

router.post("/employee/search", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const employeeData = req.body;
    const result = await informationService.findAllEmployees(employeeData);
    res.status(201).json({ message: "사원검색성공", result });
  } catch (error) {
    console.error("사원검색 실패: information_router.js", error);
    res.status(500).json({ message: "사원검색 실패", error: error.message });
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
    const { bomInfo, bomDetails } = req.body;
    if (!bomInfo || !bomDetails) {
      return res
        .status(400)
        .json({ success: false, message: "데이터가 부족합니다." });
    }
    const result = await informationService.insertAllBOM(bomInfo, bomDetails);
    if (result.success) {
      res.json({ success: true, newBOMId: result.newBOMId });
    } else {
      res.status(500).json({ success: false, message: result.error });
    }
  } catch (err) {
    console.error("POST /bom Error:", err);
    res.status(500).json({ success: false, message: err.message });
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
    const { lineInfo, lineDetails } = req.body;
    if (!lineInfo || !lineDetails) {
      return res
        .status(400)
        .json({ success: false, message: "데이터가 부족합니다." });
    }
    const result = await informationService.insertAllLine(
      lineInfo,
      lineDetails
    );
    if (result.success) {
      res.json({ success: true, newLineId: result.newLineId });
    } else {
      res.status(500).json({ success: false, message: result.error });
    }
  } catch (err) {
    console.error("POST /line Error:", err);
    res.status(500).json({ success: false, message: err.message });
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
    const { flowInfo, flowDetails } = req.body;
    if (!flowInfo || !flowDetails) {
      return res
        .status(400)
        .json({ success: false, message: "데이터가 부족합니다." });
    }
    const result = await informationService.insertAllFlowchart(
      flowInfo,
      flowDetails
    );
    if (result.success) {
      res.json({ success: true, newFlowId: result.newFlowId });
    } else {
      res.status(500).json({ success: false, message: result.error });
    }
  } catch (err) {
    console.error("POST /flowchart Error:", err);
    res.status(500).json({ success: false, message: err.message });
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

router.get("/partner/getPartnerName", async (req, res) => {
  try {
    let list = await informationService.findAllpartnerName();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

router.post("/partner/search", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const partnerData = req.body;
    const result = await informationService.findAllPartner(partnerData);
    res.status(201).json({ message: "거래처 검색성공", result });
  } catch (error) {
    console.error("거래처 검색 실패: information_router.js", error);
    res.status(500).json({ message: "거래처 검색 실패", error: error.message });
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
