const mariadb = require("../database/mapper.js");

// 창고 조회
const findAllWarehouse = async () => {
  let list = await mariadb.query("selectWarehouse");
  return list;
};

// 창고 등록
const insertWarehouse = async (warehouseInfo) => {
  const insertData = convertToArray(warehouseInfo, [
    "warehouseId",
    "warehouse",
    "zone",
    "subZone",
    "floor",
    "location",
    "warehouseType",
    "status",
  ]);

  const result = await mariadb.query("insertWarehouse", insertData);
  return result;
};

// 창고 수정
const updateWarehouse = async (warehouseInfo) => {
  const insertData = convertToArray(warehouseInfo, [
    "warehouseName",
    "zone",
    "subZone",
    "floor",
    "location",
    "warehouseType",
    "status",
    "warehouseId",
  ]);

  const result = await mariadb.query("updateWarehouse", insertData);
  return result;
};

// 제품 조회
const findAllProduct = async () => {
  let list = await mariadb.query("selectProduct");
  return list;
};

// 제품 등록
const insertProduct = async (productInfo) => {
  const insertData = convertToArray(productInfo, [
    "productId",
    "productType",
    "productForm",
    "productName",
    "specification",
    "unit",
    "expiration",
    "expirationUnit",
    "storageCondition",
    "safetyStock",
    "safetyStockUnit",
    "manual",
    "status",
  ]);

  const result = await mariadb.query("insertProduct", insertData);
  return result;
};

// 제품 수정
const updateProduct = async (productInfo) => {
  const insertData = convertToArray(productInfo, [
    "productType",
    "productForm",
    "productName",
    "specification",
    "unit",
    "expirationDate",
    "expirationDateUnit",
    "storageCondition",
    "safetyStock",
    "safetyStockUnit",
    "productManual",
    "status",
    "productId",
  ]);

  const result = await mariadb.query("updateProduct", insertData);
  return result;
};

// 자재 조회
const findAllMaterial = async () => {
  let list = await mariadb.query("selectMaterial");
  return list;
};

// 자재 등록
const insertMaterial = async (materialInfo) => {
  const insertData = convertToArray(materialInfo, [
    "materialId",
    "materialName",
    "materialType",
    "specification",
    "unit",
    "storageCondition",
    "safetyStock",
    "safetyStockUnit",
    "status",
  ]);

  const result = await mariadb.query("insertMaterial", insertData);

  return result;
};

// 자재 수정
const updateMaterial = async (materialInfo) => {
  const insertData = convertToArray(materialInfo, [
    "materialName",
    "materialType",
    "specification",
    "unit",
    "storageCondition",
    "safetyStock",
    "safetyStockUnit",
    "status",
    "materialId",
  ]);

  const result = await mariadb.query("updateMaterial", insertData);
  return result;
};

// 거래처 조회
const findAllPartner = async () => {
  let list = await mariadb.query("selectPartner");
  return list;
};

// 거래처 등록
const insertPartner = async (partnerInfo) => {
  const insertData = convertToArray(partnerInfo, [
    "partnerId",
    "partnerType",
    "partnerName",
    "manager",
    "mainTel",
    "email",
    "address",
    "businessNo",
    "status",
  ]);

  const result = await mariadb.query("insertPartner", insertData);
  return result;
};

// 거래처 수정
const updatePartner = async (partnerInfo) => {
  const insertData = convertToArray(partnerInfo, [
    "partnerType",
    "partnerName",
    "manager",
    "mainTel",
    "email",
    "address",
    "businessNo",
    "status",
  ]);

  const result = await mariadb.query("updatePartner", insertData);
  return result;
};

// 흐름도 Detail 조회
const findAllDetailFlowchart = async () => {
  let list = await mariadb.query("selectDetailFlowchart");
  return list;
};

// 흐름도 Detail 등록
const insertDetailFlowchart = async (flowInfo) => {
  const insertData = convertToArray(flowInfo, [
    "processId",
    "useOrder",
    "status",
  ]);

  const result = await mariadb.query("insertDetailFlowchart", insertData);
  return result;
};

// 흐름도 detail 수정
const updateDetailFlowchart = async (flowInfo) => {
  const insertData = convertToArray(flowInfo, [
    "processId",
    "useOrder",
    "status",
    "flowId",
  ]);

  const result = await mariadb.query("updateDetailFlowchart", insertData);
  return result;
};

//흐름도 목록 조회
const findAllFlowchart = async () => {
  let list = await mariadb.query("selectFlowchart");
  return list;
};

// 흐름도 등록
const insertFlowchart = async (flowInfo) => {
  const insertData = convertToArray(flowInfo, [
    "flowId",
    "flowName",
    "productId",
    "note",
    "status",
  ]);

  const result = await mariadb.query("insertFlowchart", insertData);
  return result;
};

// 흐름도 수정
const updateFlowchart = async (flowInfo) => {
  const insertData = convertToArray(flowInfo, [
    "flowName",
    "productId",
    "note",
    "status",
    "flowId",
  ]);

  const result = await mariadb.query("updateFlowchart", insertData);
  return result;
};

// 라인 Detail 조회
const findAllDetailLine = async () => {
  let list = await mariadb.query("selectDetailLine");
  return list;
};

// 라인 Detail 등록
const insertDetailLine = async (lineInfo) => {
  const insertData = convertToArray(lineInfo, [
    "equipmentId",
    "processId",
    "useOrder",
    "status",
  ]);

  const result = await mariadb.query("insertDetailLine", insertData);
  return result;
};

// 라인 detail 수정
const updateDetailLine = async (lineInfo) => {
  const insertData = convertToArray(lineInfo, [
    "equipmentId",
    "processId",
    "useOrder",
    "status",
    "lineId",
  ]);

  const result = await mariadb.query("updateDetailLine", insertData);
  return result;
};

// 라인 목록 조회
const findAllLine = async () => {
  let list = await mariadb.query("selectLine");
  return list;
};

// 라인 등록
const insertLine = async (lineInfo) => {
  const insertData = convertToArray(lineInfo, [
    "lineId",
    "lineName",
    "flowId",
    "productId",
    "note",
    "status",
  ]);

  const result = await mariadb.query("insertLine", insertData);
  return result;
};

// 라인 수정
const updateLine = async (lineInfo) => {
  const insertData = convertToArray(lineInfo, [
    "lineName",
    "flowId",
    "productId",
    "note",
    "status",
    "lineId",
  ]);

  const result = await mariadb.query("updateLine", insertData);
  return result;
};

// 공정 목록 조회
const findAllProcess = async () => {
  let list = await mariadb.query("selectProcess");
  return list;
};

// 공정 등록
const insertProcess = async (processInfo) => {
  const insertData = convertToArray(processInfo, [
    "processId",
    "processName",
    "isInspection",
    "status",
  ]);

  const result = await mariadb.query("insertProcess", insertData);
  return result;
};

// 공정 수정
const updateProcess = async (processInfo) => {
  const insertData = convertToArray(processInfo, [
    "processName",
    "isInspection",
    "status",
    "processId",
  ]);

  const result = await mariadb.query("updateProcess", insertData);
  return result;
};

// 전체 BOM 목록 조회
const findAllBOM = async () => {
  let list = await mariadb.query("selectBomList");
  return list;
};

// BOM 상세정보 조회
const findDetailBOM = async () => {
  let list = await mariadb.query("selectBomDetail");
  return list;
};

// BOM 등록
const insertBOM = async (bomInfo) => {
  const insertData = convertToArray(bomInfo, ["bomId", "prodId", "status"]);

  const result = await mariadb.query("insertBOM", insertData);
  return result;
};

// BOM_detail 등록
const insertDetailBOM = async (bomInfo) => {
  const insertData = convertToArray(bomInfo, [
    "materialId",
    "unit",
    "mixRatio",
    "requiredQty",
    "totalQty",
    "status",
  ]);

  const result = await mariadb.query("insertDetailBOM", insertData);
  return result;
};

// 전체 사원 목록 조회
const findAllEmployees = async () => {
  let list = await mariadb.query("selectEmployeeList");
  return list;
};

// 사원 등록
const insertEmployee = async (employeeInfo) => {
  // 날짜 직접 포맷팅
  const formatDateToYMD = (isoDate) => {
    if (!isoDate) return null;
    const d = new Date(isoDate);
    if (isNaN(d)) return null;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  employeeInfo.hire_date = formatDateToYMD(employeeInfo.hireDate);
  employeeInfo.leave_date = formatDateToYMD(employeeInfo.leaveDate);

  const insertData = convertToArray(employeeInfo, [
    "empId",
    "name",
    "dept",
    "phone",
    "email",
    "hire_date",
    "leave_date",
    "auth",
    "status",
  ]);

  const result = await mariadb.query("insertEmployee", insertData);
  return result;
};

// insert + id 받아오기
// const resInfo = await mariadb.query("insertEmployee", insertData);

// insert 성공 시 → employee_id 업데이트
//   if (resInfo.insertId > 0) {
//     const newId = resInfo.insertId;
//     const newEmpId = `E${String(newId).padStart(3, "0")}`;

//     await mariadb.query("updateEmployeeId", [newEmpId, newId]);

//     return {
//       result: true,
//       id: newId,
//       employee_id: newEmpId,
//     };
//   } else {
//     return { result: false };
//   }
// };

// 객체를 배열로 변환하는 매서드
function convertToArray(obj, columns) {
  return columns.map((col) => obj[col]);
}

module.exports = {
  findAllEmployees,
  insertEmployee,
  findAllBOM,
  findDetailBOM,
  insertBOM,
  findAllProcess,
  insertProcess,
  insertDetailBOM,
  updateProcess,
  findAllLine,
  insertLine,
  updateLine,
  updateDetailLine,
  findAllDetailLine,
  insertDetailLine,
  findAllFlowchart,
  findAllDetailFlowchart,
  insertFlowchart,
  insertDetailFlowchart,
  updateDetailFlowchart,
  updateFlowchart,
  findAllPartner,
  insertPartner,
  updatePartner,
  findAllMaterial,
  insertMaterial,
  updateMaterial,
  findAllProduct,
  insertProduct,
  updateProduct,
  findAllWarehouse,
  insertWarehouse,
  updateWarehouse,
};
