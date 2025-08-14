const express = require("express");
const router = express.Router();

const productionService = require("../services/production_service.js");

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
