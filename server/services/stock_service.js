const mariadb = require("../database/mapper.js");

//(모달)자재목록 출력
let matList = async () => {
  let matList = await mariadb.query("matListQuery");
  return matList;
};

//(모달)제품목록 출력
let prdList = async () => {
  let prdList = await mariadb.query("productListQuery");
  return prdList;
};

//발주
//마스터T 기본정보 등록
let masterInfo = async (masterInfoData) => {
    let result = await mariadb.query("masterInfoQuery", [
        masterInfoData.partner_id,
        masterInfoData.re_date,
        masterInfoData.due_date,
        masterInfoData.manager
    ]);
    return result.insertId; // result 중 purchase_no 반환 
};
//서브T 등록 
let subInfo  = async (subInfoData) => {
    await mariadb.query("subInfoQuery", [
        subInfoData.material_id,
        subInfoData.pur_qty,
        subInfoData.comm,
        subInfoData.purchase_no
    ]);
};

module.exports = { matList, prdList, masterInfo, subInfo };
