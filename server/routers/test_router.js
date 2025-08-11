const express = require("express");
const router = express.Router();

const testService = require("../services/test_service.js");

router.get("/testInform", async (req, res) => {
  try {
    let list = await testService.findAllItem();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

router.post("/testInform", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const ItemData = req.body;
    const result = await testService.insertItem(ItemData);
    res.status(201).json({ message: "등록성공", result });
  } catch (error) {
    console.error("항목등록 실패: test_router.js", error);
    res.status(500).json({ message: "항목등록 실패", error: error.message });
  }
});

router.get("/api/test/testInform", async (req, res) => {
  console.log("req.query:", req.query);

  try {
    const { productType, inspPurpose, inspItem } = req.query;

    let sql = `SELECT * FROM testitem WHERE 1=1`;
    const params = [];

    if (productType) {
      sql += ` AND product_type LIKE ?`;
      params.push(`${productType}%`);
    }
    if (inspPurpose) {
      sql += ` AND purpose_name LIKE ?`;
      params.push(`${inspPurpose}%`);
    }
    if (inspItem) {
      sql += ` AND item_name LIKE ?`;
      params.push(`${inspItem}%`);
    }

    console.log("실행 SQL:", sql, "파라미터:", params);

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "조회 실패" });
  }
});

module.exports = router;
