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
}
//자재관리===================================================================
//자재입고
//자재입고대기목록
let matPandingList = async () => {
  let matPandingList = await mariadb.query("MatPandigListQuery");
  return matPandingList;
};
//자재입고대기조회
async function getSearchMatPandingList(filters) {
  let sql = mariadb.sqlList.MatInPandingSearchQuery;
  let params = [];

  if (filters.due_date) {
    sql += " AND p.due_date = ?";
    params.push(filters.due_date);
  }
  if (filters.test_no) {
    sql += " AND d.pur_no LIKE ?";
    params.push(`%${filters.test_no}%`);
  }
  if (filters.mat_Id) {
    sql += " AND t.material_code LIKE ?";
    params.push(`%${filters.mat_Id}%`);
  }
  if (filters.mat_Name) {
    sql += " AND  m.material_name LIKE ?";
    params.push(`%${filters.mat_Name}%`);
  }

  sql += "AND d.pro_status NOT IN ('취소', '입고완료', '반품') AND t.lot_pro NOT IN ('생성', '반품') ORDER BY p.due_date DESC";

  const conn = await mariadb.getConnection();
  try {
    const rows = await conn.query(sql, params);
    return rows;
  } finally {
    conn.release();
  }
};
//자재lot등록
let matLotInsert = async (matInfoList) => {
  for (let matInfo of matInfoList) {
    await mariadb.query("matInsertQuery", [
      matInfo.material_id,
      matInfo.init_qty,
      matInfo.warehouse,
      matInfo.comm,
      matInfo.purch_id,
      matInfo.materialOrder_num,
      matInfo.eName,
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
    await mariadb.query("matReturnQuery", [
      matReturnInfo.comm,
      matReturnInfo.testNo,
      matReturnInfo.purch_id,
    ]);
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
  console.log(prdPendingList);
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
      prdInfo.e_name,
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
//제품입고대기조회
async function getSearchPrdPadingList(filters) {
  let sql = mariadb.sqlList.searchPrdPandingListQuery;
  let params = [];

  if (filters.due_date) {
    sql += " AND pi.createdAt = ?";
    params.push(filters.due_date);
  }
  if (filters.test_no) {
    sql += " AND pi.pf_code LIKE ?";
    params.push(`%${filters.test_no}%`);
  }
  if (filters.product_id) {
    sql += " AND pi.product_id LIKE ?";
    params.push(`%${filters.product_id}%`);
  }
  if (filters.product_name) {
    sql += " AND p.product_name LIKE ?";
    params.push(`%${filters.product_name}%`);
  }

  sql += " AND pi.result = '합격' AND pi.pro_status ='미생성' ORDER BY pi.createdAt DESC";

  const conn = await mariadb.getConnection();
  try {
    const rows = await conn.query(sql, params);
    return rows;
  } finally {
    conn.release();
  }
}
//자제출고==============================
//출고대기목록
let matOutWaitList = async () => {
  let matOutWaitList = await mariadb.query("matReqListQuery");
  return matOutWaitList;
};
//자재출고대기조회
async function getSearchMatOutList(filters) {
  let sql = mariadb.sqlList.SearchMatReqListQuery;
  let params = [];

  if (filters.due_date) {
    sql += " AND mr.req_date = ?";
    params.push(filters.due_date);
  }
  if (filters.wo_no) {
    sql += " AND mr.wo_no LIKE ?";
    params.push(`%${filters.wo_no}%`);
  }
  if (filters.mat_Id) {
    sql += " AND mr.material_id LIKE ?";
    params.push(`%${filters.mat_Id}%`);
  }
  if (filters.mat_Name) {
    sql += " AND  m.material_name LIKE ?";
    params.push(`%${filters.mat_Name}%`);
  }

  sql += " AND mr.material_id NOT IN ('MAT010') AND pro_status = '출고대기' ORDER BY mr.req_date DESC";

  const conn = await mariadb.getConnection();
  try {
    const rows = await conn.query(sql, params);
    return rows;
  } finally {
    conn.release();
  }
};
//자재재고확인(출고과정중)
async function getCheckMatStock(MatIds) {
  let sql = mariadb.sqlList.checkMatStockQuery;
  console.log("checkStock:", mariadb.sqlList.checkMatStockQuery);
  let params = [];

  if (Array.isArray(MatIds) && MatIds.length > 0) {
    const placeholders = MatIds.map(() => "?").join(", ");
    sql += ` AND ml.material_id IN (${placeholders}) AND ml.pro_status NOT IN ('종료', '입고취소')`;
    params.push(...MatIds);
  }

  sql += ` GROUP BY ml.material_id`;

  const conn = await mariadb.getConnection();
  try {
    const rows = await conn.query(sql, params);
    return rows;
  } finally {
    conn.release();
  }
};
//출고등록
let matOusR = async (matInfoList) => {
  for (let matInfo of matInfoList) {
    await mariadb.query("matOutReQuery", [
      matInfo.req_id,
      matInfo.material_id,
      matInfo.order_qty,
      matInfo.comm,
      matInfo.e_name,
    ]);
  }
};
//자재출고완료목록
let matOutList = async () => {
  let matOutList = await mariadb.query("matOutListQuery");
  return matOutList;
};
//자재출고취소
let matOutCancel = async (matOutCancelInfoList) => {
  for (let matOutCancelInfo of matOutCancelInfoList) {
    await mariadb.query("matOutCancelQuery", [matOutCancelInfo.mat_out_no]);
  }
};
//제품출고=======================================================================
//제품출고대기목록
let prdOutWaitList = async () => {
  let prdOutWaitList = await mariadb.query("prdShipWaitListQurey");
  return prdOutWaitList;
};
//제품재고확인(출고중)
async function getCheckStock(productIds) {
  let sql = mariadb.sqlList.checkStockQuery;
  console.log("checkStock:", mariadb.sqlList.checkStockQuery);
  let params = [];

  if (Array.isArray(productIds) && productIds.length > 0) {
    const placeholders = productIds.map(() => "?").join(", ");
    sql += ` AND pl.product_id IN (${placeholders}) AND pl.pro_status NOT IN ('종료', '입고취소')`;
    params.push(...productIds);
  }

  sql += ` GROUP BY pl.product_id`;

  const conn = await mariadb.getConnection();
  try {
    const rows = await conn.query(sql, params);
    return rows;
  } finally {
    conn.release();
  }
}
//제품출고등록
let prdOusR = async (prdoutInfoList) => {
  for (let prdoutInfo of prdoutInfoList) {
    await mariadb.query("prdOutRQuery", [
      prdoutInfo.shipment_id,
      prdoutInfo.product_id,
      prdoutInfo.order_qty,
      prdoutInfo.prtner,
      prdoutInfo.shipartner,
      prdoutInfo.comm,
      prdoutInfo.e_name,
    ]);
  }
};
//제품출고목록
let prdOutList = async () => {
  let prdOutList = await mariadb.query("prdOutListQuery");
  return prdOutList;
};
//제품출고취소
let prdOutCancel = async (prdOutCancelInfoList) => {
  for (let prdOutCancelInfo of prdOutCancelInfoList) {
    await mariadb.query("prdOutCancelQuery", [prdOutCancelInfo.shipment_id]);
  }
};
//제품출고대기조회
async function getSearchOutWaitList(filters) {
  let sql = mariadb.sqlList.prdShipWaitSearchQurey;
  let params = [];

  if (filters.shipment_date) {
    sql += " AND sh.shipment_date = ?";
    params.push(filters.shipment_date);
  }
  if (filters.shipment_id) {
    sql += " AND sh.shipment_id LIKE ?";
    params.push(`%${filters.shipment_id}%`);
  }
  if (filters.product_code) {
    sql += " AND sh.product_code LIKE ?";
    params.push(`%${filters.product_code}%`);
  }
  if (filters.product_name) {
    sql += " AND p.product_name LIKE ?";
    params.push(`%${filters.product_name}%`);
  }

  sql += " AND sh.ship_status = 1 ORDER BY sh.shipment_date DESC";

  const conn = await mariadb.getConnection();
  try {
    const rows = await conn.query(sql, params);
    return rows;
  } finally {
    conn.release();
  }
}
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
    sql += " AND pl.prd_lot_no = ?";
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

  sql +=
    " ORDER BY case pl.pro_status when '사용중' then 1 when '등록' then 2 when '종료' then 3 when '입고취소' then 4 end asc, open_date DESC";

  const conn = await mariadb.getConnection();
  try {
    const rows = await conn.query(sql, params);
    return rows;
  } finally {
    conn.release();
  }
}
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

  sql +=
    " ORDER BY case ml.pro_status when '사용중' then 1 when '등록' then 2 when '종료' then 3 when '입고취소' then 4 end asc, open_date DESC";

  const conn = await mariadb.getConnection();
  try {
    const rows = await conn.query(sql, params);
    return rows;
  } finally {
    conn.release();
  }
}
//반품==================================================
let returnList = async () => {
  let returnList = await mariadb.query("returnListQurey");
  return returnList;
};
//등록
let returnInfoUpdate = async (returnInfoList) => {
  for (let retunInfo of returnInfoList) {
    await mariadb.query("returnReQuery", [
      retunInfo.warehouse,
      retunInfo.re_qty,
      retunInfo.comm,
      retunInfo.id,
    ]);
  }
};
//수정
let returnInfoRe = async (returnInfoList) => {
  for (let returnInfo of returnInfoList) {
    await mariadb.query("updateReturn", [returnInfo.id]);
  }
};
//조회
async function getSearchReturnList(filters) {
  let sql = mariadb.sqlList.searchReturnListQuery;
  let params = [];

  console.log(filters);
  if (filters.due_date) {
    sql += " AND re.return_date = ?";
    params.push(filters.due_date);
  }
  if (filters.orderNo) {
    sql += " AND po.prd_out_no LIKE ?";
    params.push(`%${filters.orderNo}%`);
  }
  if (filters.prdId) {
    sql += " AND re.product_id LIKE ?";
    params.push(`%${filters.prdId}%`);
  }
  if (filters.prdN) {
    sql += " AND p.product_name LIKE ?";
    params.push(`%${filters.prdN}%`);
  }

  sql +=
    " ORDER BY case re.inbound_pro when '대기' then 1 when '확정' then 2 end asc, return_date DESC";

  const conn = await mariadb.getConnection();
  try {
    const rows = await conn.query(sql, params);
    return rows;
  } finally {
    conn.release();
  }
}
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
//수정
let wasteInfoRe = async (wasteInfoList) => {
  for (let wasteInfo of wasteInfoList) {
    await mariadb.query("wasteUpdate", [wasteInfo.seq]);
  }
};
//조회
async function getSearchWasteList(filters) {
  let sql = mariadb.sqlList.wasteSearchQuery;
  let params = [];

  console.log(filters);
  if (filters.out_date) {
    sql += " AND tw.out_date = ?";
    params.push(filters.out_date);
  }
  if (filters.waste_name) {
    sql += " AND waste_name LIKE ?";
    params.push(`%${filters.waste_name}%`);
  }
  if (filters.warehouse) {
    sql += " AND w.warehouse LIKE ?";
    params.push(`%${filters.warehouse}%`);
  }
  if (filters.partner) {
    sql += " AND p.partner_name LIKE ?";
    params.push(`%${filters.partner}%`);
  }

  sql +=
    " ORDER BY case pro_status when '대기' then 1 when '확정' then 2 end asc, re_date DESC";

  const conn = await mariadb.getConnection();
  try {
    const rows = await conn.query(sql, params);
    return rows;
  } finally {
    conn.release();
  }
}
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
  getSearchOutWaitList,
  getSearchWasteList,
  prdOusR,
  prdOutList,
  matOutWaitList,
  matOutList,
  matOusR,
  returnList,
  returnInfoUpdate,
  wasteInfoRe,
  getCheckStock,
  returnInfoRe,
  getCheckMatStock,
  getSearchMatOutList,
  getSearchReturnList,
  getSearchMatPandingList,
  prdOutCancel,
  getSearchPrdPadingList,
  matOutCancel
};
