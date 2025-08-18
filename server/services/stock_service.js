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
//부족자재목록출력
let lessMatList = async () => {
  let lessMatList = await mariadb.query("lessMatListQuery");
  return lessMatList;
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
//조회
async function getSearchPurchaseList(filters) {
  let sql = mariadb.sqlList.purchaseSearchQuery;
  console.log("purchaseSearchQuery:", mariadb.sqlList.purchaseSearchQuery);
  let params = [];

  if (filters.registerDate) {
    sql += " AND m.re_date = ?";
    params.push(filters.registerDate);
  }
  if (filters.orderNumber) {
    sql += " AND m.pur_no LIKE ?";
    params.push(`%${filters.orderNumber}%`);
  }
  if (filters.materialCode) {
    sql += " AND s.material_id LIKE ?";
    params.push(`%${filters.materialCode}%`);
  }
  if (filters.materialName) {
    sql += " AND b.material_name LIKE ?";
    params.push(`%${filters.materialName}%`);
  }

  sql += " ORDER BY m.re_date DESC";  
  
  const conn = await mariadb.getConnection();
  try {
    const rows = await conn.query(sql, params);
    return rows;
  } finally {
    conn.release();
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
//제품입고대기목록
let prdPendigList = async () => {
  let prdPendingList = await mariadb.query("prdPendigListQuery");
  console.log(prdPendingList)
  return prdPendingList;
};
//제품lot등록
let prdLotInsert = async (prdInfoList) => {
  for (let prdInfo of prdInfoList) {
    await mariadb.query("prdInsertQuery", [
      prdInfo.product_id,
      prdInfo.init_qty,
      prdInfo.warehouse,
      prdInfo.comm,
      prdInfo.inspection_id,
    ]);
  }
};
//제품lot리스트(입고)
let prdLotList = async () => {
  let prdLotList = await mariadb.query("prdLotListQuerty");
  return prdLotList;
};
//입고취소
let prdLotCancel = async (prdLotCancelInfoList) => {
  for (let prdLotCancelInfo of prdLotCancelInfoList) {
    await mariadb.query("prdLotCancelQuery", [prdLotCancelInfo.prd_lot_no]);
  }
};

//제품출고===========================
//
//제품출고대기목록
let prdOutWaitList = async () => {
  let prdOutWaitList = await mariadb.query("prdShipWaitListQurey");
  return prdOutWaitList;
};
//제품출고목록

//재고조회=========================================================================
////////////////////제품조회
//제품첫목록
let prdSearchtList = async () => {
  let prdSearchtList = await mariadb.query("searchPrdListQuery");
  return prdSearchtList;
};
//조회
async function getSearchPrdLotList(filters) {
  let sql = mariadb.sqlList.searchPrdLotSearchQuery;
  let params = [];

  if (filters.prdLotNo) {
    sql += " AND pl.lot_no = ?";
    params.push(filters.prdLotNo);
  }
  if (filters.prdCode) {
    sql += " AND pl.product_id LIKE ?";
    params.push(`%${filters.prdCode}%`);
  }
  if (filters.prdName) {
    sql += " AND p.product_name LIKE ?";
    params.push(`%${filters.prdName}%`);
  }
  if (filters.warehouse) {
    sql += " AND pl.warehouse LIKE ?";
    params.push(`%${filters.warehouse}%`);
  }

  sql += " ORDER BY pl.open_date DESC";  
  
  const conn = await mariadb.getConnection();
  try {
    const rows = await conn.query(sql, params);
    return rows;
  } finally {
    conn.release();
  }
};
/////////////////////자재조회=================
//자재첫목록
let matSearchtList = async () => {
  let matSearchtList = await mariadb.query("searchMatListQuery");
  return matSearchtList;
};
//조회
async function getSearchMatLotList(filters) {
  let sql = mariadb.sqlList.searchMatLotSearchQuery;
  let params = [];

  if (filters.matLotNo) {
    sql += " AND  ml.lot_no = ?";
    params.push(filters.matLotNo);
  }
  if (filters.matCode) {
    sql += " AND ml.material_id LIKE ?";
    params.push(`%${filters.matCode}%`);
  }
  if (filters.matName) {
    sql += " AND m.material_name LIKE ?";
    params.push(`%${filters.matName}%`);
  }
  if (filters.warehouse) {
    sql += " AND ml.warehouse LIKE ?";
    params.push(`%${filters.warehouse}%`);
  }

  sql += " ORDER BY ml.open_date DESC";  
  
  const conn = await mariadb.getConnection();
  try {
    const rows = await conn.query(sql, params);
    return rows;
  } finally {
    conn.release();
  }
};

//폐기물==================================================
//목록
let wasteList = async () => {
  let wasteList = await mariadb.query("wasteListQurey");
  return wasteList;
};
//등록
let wasteInfoUpdate = async (wasteInfoList) => {
  for (let wasteInfo of wasteInfoList) {
    await mariadb.query("wasteOutQuery", [
      wasteInfo.out_date,
      wasteInfo.partner_id,
      wasteInfo.comm,
      wasteInfo.seq,
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
  warehouseList,
  matPandingList,
  matLotInsert,
  matLotList,
  matReturn,
  matLotCancel,
  prdOutWaitList,
  getSearchPurchaseList,
  prdPendigList,
  prdLotInsert,
  prdLotList,
  lessMatList,
  matSearchtList,
  getSearchMatLotList,
  prdSearchtList,
  getSearchPrdLotList,
  prdLotCancel,
  wasteList,
  wasteInfoUpdate,
};
