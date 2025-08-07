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

module.exports = router;
