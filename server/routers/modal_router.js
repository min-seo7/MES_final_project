const express = require("express");
const router = express.Router();

const modalService = require("../services/modal_service.js");

router.get("/modal", async (req, res) => {
  const { type } = req.query; // 어떤 데이터 조회인지 구분

  try {
    let result;
    if (type === "employee") {
      result = await modalService.getEmployeeList();
    } else if (type === "product") {
      result = await modalService.getProductList();
    } else if (type === "bom") {
      result = await modalService.getBomList();
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "데이터 조회 실패" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const purchaseNo = await stockService.masterInfo(req.body);
    res.json({ pur_no: purchaseNo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "(서버)마스터 저장 실패" });
  }
});

module.exports = router;
