const express = require("express");
const router = express.Router();

const productionService = require("../services/production_service.js");

// const findInspectionList = async () => {
//   let list = await mariadb.query("selectFlowchart");
//   return list;
// };
router.post("/productionOrder", async (req, res) => {
  try {
    const { director,plan_detail_no,details } = req.body;
    console.log("라우터가 받은 데이터:", req.body);

    console.log("받은 productPlanCode:", plan_detail_no);
    const result = await productionService.startWork(director,plan_detail_no,details);
    res.status(201).json({ message: "등록성공!", result });
  } catch (error) {
    console.error("지시등록에 실패하였습니다.", error);
    res.status(500).json({ message: "작업지시등록실패", error: error.message });
  }
});

module.exports = router;
