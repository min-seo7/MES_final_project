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
  let loginInfo = req.body;

  console.log("loginInfo:", loginInfo);

  let resInfo = await modalService
    .login(loginInfo)
    .catch((err) => console.log(err));

  console.log("여기?");
  console.log("DB list:", resInfo.userInfo ? [resInfo.userInfo] : []);
});
module.exports = router;

// if (resInfo.result) {
//   // 로그인 성공 했으면 세션에 저장
//   req.session.user = resInfo.userInfo.email;
//   req.session.save(function (err) {
//     if (err) throw err;
//     res.send({
//       result: true,
//       email: resInfo.userInfo.email,
//       name: resInfo.userInfo.name,
//       auth: resInfo.userInfo.auth,
//     });
//   });
// } else {
//   // 로그인 실패
//   res.send({ result: false, message: "회원 정보가 존재하지 않습니다." });
// }
