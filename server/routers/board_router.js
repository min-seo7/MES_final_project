const express = require("express");
const router = express.Router();

const boardService = require("../services/board_service.js");

router.get("/api/information/employee", async (req, res) => {
  try {
    let list = await boardService.findAllEmployees();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

router.post("/api/information/employee", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const employeeData = req.body;
    const result = await boardService.insertEmployee(employeeData);
    res.status(201).json({ message: "등록성공", result });
  } catch (error) {
    console.error("사원등록 실패: board_router.js", error);
    res.status(500).json({ message: "사원등록 실패", error: error.message });
  }
});

module.exports = router;
