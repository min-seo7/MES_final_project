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

//(모달)거래처목록 출력
let partnerList = async () => {
  let partnerList = await mariadb.query("partnerListQuery");
  return partnerList;
};

//발주등록========================================================================
//마스터T 기본정보 등록
let masterInfo = async (masterInfoData) => {
  let result = await mariadb.query("masterInfoPro", [
    masterInfoData.partner_id,
    masterInfoData.re_date,
    masterInfoData.due_date,
    masterInfoData.manager,
  ]);
  return result[0][0].pur_no; // result 중 purchase_no 반환
};
//서브T 등록
let subInfo = async (subDataList) => {
  for (let subData of subDataList) {
    await mariadb.query("subInfoQuery", [
      subData.material_id,
      subData.pur_qty,
      subData.comm,
      subData.pur_no,
    ]);
  }
};

//발주목록 =========================================================================
//리스트
let purchaseList = async () => {
  let purchaseList = await mariadb.query("purchaseListVwQuery");
  return purchaseList;
};
//발주취소
let purCancel = async (cancelList) => {
  for (let cancle of cancelList) {
    await mariadb.query("purchaseCancelQuery", [
      cancle.pur_no,
      cancle.material_id,
    ]);
  }
};

module.exports = {
  matList,
  prdList,
  masterInfo,
  subInfo,
  partnerList,
  purchaseList,
  purCancel,
};
