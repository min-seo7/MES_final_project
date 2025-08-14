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
//(모달)보관창고 출력
let warehouseList = async () => {
  let warehouseList = await mariadb.query("warehouseListQuery");
  return warehouseList;
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
  let purchaseList = await mariadb.query("purchaseListQuery");
  return purchaseList;
};
//발주취소
let purCancel = async (cancelList) => {
  for (let cancel of cancelList) {
    await mariadb.query("purchaseCancelQuery", [
      cancel.pur_no,
      cancel.material_id,
    ]);
  }
};

//자재관리===================================================================
//자재입고
//자재입고대기목록
let matPandingList = async () => {
  let matPandingList = await mariadb.query("MatPandigListQuery");
  return matPandingList;
};
//자재lot등록
let matLotInsert = async (matInfoList) => {
  for (let matInfo of matInfoList) {
    await mariadb.query("matInsertQuery", [
      matInfo.material_id,
      matInfo.init_qty,
      matInfo.warehouse,
      matInfo.comm,
      matInfo.materialOrder_num,
      matInfo.purch_id,
    ]);
  }
};
//자재lot리스트(입고)
let matLotList = async () => {
  let matLotList = await mariadb.query("matLotListQuery");
  return matLotList;
};
//반품처리
let matReturn = async (matReturnInfoList) => {
  for (let matReturnInfo of matReturnInfoList) {
    await mariadb.query("matReturnQuery", [matReturnInfo.purch_id]);
  }
};
//입고취소
let matLotCancel = async (matLotCancelInfoList) => {
  for (let matLotCancelInfo of matLotCancelInfoList) {
    await mariadb.query("matLotCancelQuery", [matLotCancelInfo.lot_no]);
  }
};
//제품관리============================================================================
//제품입고
//
//제품출고
//
//제품출고대기목록
//
//제품출고목록

module.exports = {
  matList,
  prdList,
  masterInfo,
  subInfo,
  partnerList,
  purchaseList,
  purCancel,
  warehouseList,
  matPandingList,
  matLotInsert,
  matLotList,
  matReturn,
  matLotCancel,
};
