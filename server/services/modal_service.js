const mariadb = require("../database/mapper.js");

// 사원 조회
const getEmployeeList = async () => {
  let list = await mariadb.query("selectWarehouse");
  return list;
};

//로그인
const login = async (loginInfo) => {
  let list = await mariadb.query("loginQuery", [loginInfo.eId]);

  console.log("loginInfo", loginInfo);//loginInfo { eId: 'E001', password: 'E001' }
  console.log("list[0].login_pw", list[0].login_pw);

  let userInfo = null;
  if (list.length == 1) {
    // 해당 회원 정보 존재
    let info = list[0];
    if (info.login_pw == loginInfo.password) {
      userInfo = info;
    }
  }
  return {
    result: userInfo != null,
    userInfo,
  };
};

module.exports = {
  login,
};
