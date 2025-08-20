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

  console.log("DB list:", resInfo.userInfo);

//로그인성공(resInfo.result=true) 했으면 세션에 저장
  if (resInfo.result) {
  req.session.user = resInfo.userInfo.employee_id;

 console.log("세션에 저장된 user:", req.session.user)

  req.session.save(function (err) {
    if (err) throw err;
    res.send({
      result: true,
      eNo: resInfo.userInfo.employee_id,
      name: resInfo.userInfo.name,
      auth: resInfo.userInfo.auth,
      pwChange: resInfo.userInfo.pw_change
    });
  });
} else {
  // 로그인 실패
  res.send({ result: false, message: "회원 정보가 존재하지 않습니다." });
}
});
//로그인 상태 확인, App.vue
//새로고침시, /check-session을 호출해서 서버 세션에 user가 있으면 다시 store.setUser() 해줌.
router.get("/check-session", (req, res) => { 
  if (req.session.user) {
    res.send({
      result: true,
      message: "로그인 상태입니다.",
      user: req.session.user, // employee_id
    });
  } else {
    res.send({
      result: false,
      message: "로그인되어 있지 않습니다.",
    });
  }
});

//로그아웃
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.send({ result: true, message: "로그아웃 성공" });
  });
});

module.exports = router;

