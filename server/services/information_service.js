const mariadb = require("../database/mapper.js");
const sqlList = require("../database/sqlList"); // SQL mapper 불러오기

// 창고 조회
const findAllWarehouse = async (warehouseInfo) => {
  const insertData = [
    warehouseInfo.warehouseId ?? null,
    warehouseInfo.warehouse ?? null,
    warehouseInfo.location ?? null,
    warehouseInfo.warehouseType ?? null,
    warehouseInfo.status ?? null,
  ];
  let list = await mariadb.query("selectWarehouseList", insertData);
  return list;
};

// 창고 등록
const insertWarehouse = async (warehouseInfo) => {
  let conn;
  try {
    conn = await mariadb.getConnection();
    await conn.beginTransaction();

    // 1. 마지막 ID 조회 (락 걸림)
    const rows = await conn.query(sqlList.selectMaxWarehouseId);
    const maxId = rows?.[0]?.max_WH_id || null;

    // 2. 새 ID 생성
    let newWarehouseId = "WH001";
    if (maxId) {
      const lastNum = parseInt(maxId.replace(/\D/g, ""), 10);
      if (!isNaN(lastNum)) {
        newWarehouseId = `WH${String(lastNum + 1).padStart(3, "0")}`;
      }
    }

    // 3. INSERT 실행
    await conn.query(sqlList.insertWarehouse, [
      newWarehouseId,
      warehouseInfo.warehouse,
      warehouseInfo.zone,
      warehouseInfo.subZone,
      warehouseInfo.floor,
      warehouseInfo.location,
      warehouseInfo.warehouseType,
      warehouseInfo.status,
    ]);

    // 4. 커밋
    await conn.commit();
    return { success: true, newWarehouseId };
  } catch (err) {
    if (conn) await conn.rollback();
    console.error("insertWarehouse Error:", err);
    return { success: false, error: err.message };
  } finally {
    if (conn) conn.release();
  }
};

// 창고 수정
const updateWarehouse = async (warehouseInfo) => {
  const insertData = convertToArray(warehouseInfo, [
    "warehouse",
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
const findAllProduct = async (productInfo) => {
  const insertData = [
    productInfo.productId ?? null,
    productInfo.productName ?? null,
    productInfo.productType ?? null,
    productInfo.productForm ?? null,
    productInfo.status ?? null,
  ];
    try {
    let list = await mariadb.query("selectProductList", insertData);
    
    // 🚨 핵심 수정: list가 undefined이거나 null인 경우 빈 배열을 반환하도록 보장합니다.
    if (!list) {
        console.log("DB 쿼리 결과가 없습니다. 빈 배열을 반환합니다.");
        return [];
    }
    
    // DB에서 정상적으로 배열을 반환한 경우 그대로 반환
    return list; 
    
  } catch (error) {
    console.error("DB 쿼리 오류:", error);
    // 쿼리 실패 시에도 빈 배열 반환 또는 오류 던지기
    throw error; 
  }
};

// 제품 등록
const insertProduct = async (productInfo) => {
  let conn;
  try {
    conn = await mariadb.getConnection();
    await conn.beginTransaction();

    // 1. 마지막 product_id 조회 (락)
    const rows = await conn.query(sqlList.selectMaxProductId);
    const maxId = rows?.[0]?.max_product_id || null;

    // 2. 새로운 product_id 생성 (예: PR001, PR002 ...)
    let newProductId = "P001";
    if (maxId) {
      const lastNum = parseInt(maxId.replace(/\D/g, ""), 10);
      if (!isNaN(lastNum)) {
        newProductId = `P${String(lastNum + 1).padStart(3, "0")}`;
      }
    }

    if (productInfo.productForm === "분말형") {
      productInfo.productCategory = "CAT001";
    } else if (productInfo.productForm === "과립형") {
      productInfo.productCategory = "CAT002";
    } else if (productInfo.productForm === "액상형") {
      productInfo.productCategory = "CAT003";
    }
    // 3. INSERT 실행
    const insertData = [
      newProductId,
      productInfo.productType,
      productInfo.productForm,
      productInfo.productName,
      productInfo.specification,
      productInfo.unit,
      productInfo.expiration,
      productInfo.expirationUnit,
      productInfo.storageCondition,
      productInfo.safetyStock,
      productInfo.safetyStockUnit,
      productInfo.productCategory,
      productInfo.status,
    ];

    await conn.query(sqlList.insertProduct, insertData);

    // 4. 커밋
    await conn.commit();

    return { success: true, newProductId };
  } catch (err) {
    if (conn) await conn.rollback();
    console.error("insertProduct Error:", err);
    return { success: false, error: err.message };
  } finally {
    if (conn) conn.release();
  }
};

// 제품 수정
const updateProduct = async (productInfo) => {
  if (productInfo.productForm === "분말형") {
    productInfo.productCategory = "CAT001";
  } else if (productInfo.productForm === "과립형") {
    productInfo.productCategory = "CAT002";
  } else if (productInfo.productForm === "액상형") {
    productInfo.productCategory = "CAT003";
  }
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
    "productCategory",
    "status",
    "productId",
  ]);

  const result = await mariadb.query("updateProduct", insertData);
  return result;
};

// 자재 조회
const findAllMaterial = async (materialInfo) => {
  const insertData = [
    materialInfo.materialId ?? null,
    materialInfo.materialName ?? null,
    materialInfo.status ?? null,
  ];
  let list = await mariadb.query("selectMaterialList", insertData);
  return list;
};

// 자재 등록
const insertMaterial = async (materialInfo) => {
  let conn;
  try {
    conn = await mariadb.getConnection();
    await conn.beginTransaction();

    // 1. 마지막 material_id 조회 (락)
    const rows = await conn.query(sqlList.selectMaxMaterialId);
    const maxId = rows?.[0]?.max_material_id || null;

    // 2. 새로운 material_id 생성 (MAT001, MAT002 ...)
    let newMaterialId = "MAT001";
    if (maxId) {
      const lastNum = parseInt(maxId.replace(/\D/g, ""), 10);
      if (!isNaN(lastNum)) {
        newMaterialId = `MAT${String(lastNum + 1).padStart(3, "0")}`;
      }
    }

    // 3. INSERT 실행
    const insertData = [
      newMaterialId,
      materialInfo.materialName,
      materialInfo.materialType,
      materialInfo.specification,
      materialInfo.unit,
      materialInfo.storageCondition,
      materialInfo.safetyStock,
      materialInfo.safetyStockUnit,
      materialInfo.status,
    ];

    await conn.query(sqlList.insertMaterial, insertData);

    // 4. 커밋
    await conn.commit();

    return { success: true, newMaterialId };
  } catch (err) {
    if (conn) await conn.rollback();
    console.error("insertMaterial Error:", err);
    return { success: false, error: err.message };
  } finally {
    if (conn) conn.release();
  }
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

// 거래처명 조회
const findAllpartnerName = async () => {
  let list = await mariadb.query("selectPartnerName");
  return list;
};

// 거래처 조회
const findAllPartner = async (partnerInfo) => {
  const insertData = [
    partnerInfo.partnerId ?? null,
    partnerInfo.partnerName ?? null,
    partnerInfo.partnerType ?? null,
    partnerInfo.status ?? null,
  ];

  let list = await mariadb.query("selectPartnerList", insertData);
  return list;
};

// 거래처 등록
const insertPartner = async (partnerInfo) => {
  let conn;
  try {
    conn = await mariadb.getConnection();
    await conn.beginTransaction();

    // 1. 마지막 partner_id 조회 (락)
    const rows = await conn.query(sqlList.selectMaxPartnerId);
    const maxId = rows?.[0]?.max_partner_id || null;

    // 2. 새로운 partner_id 생성 (PAT001, PAT002 ...)
    let newPartnerId = "PAT001";
    if (maxId) {
      const lastNum = parseInt(maxId.replace(/\D/g, ""), 10);
      if (!isNaN(lastNum)) {
        newPartnerId = `PAT${String(lastNum + 1).padStart(3, "0")}`;
      }
    }

    // 3. INSERT 실행
    const insertData = [
      newPartnerId,
      partnerInfo.partnerType,
      partnerInfo.partnerName,
      partnerInfo.manager,
      partnerInfo.mainTel,
      partnerInfo.email,
      partnerInfo.address,
      partnerInfo.businessNo,
      partnerInfo.status,
    ];

    await conn.query(sqlList.insertPartner, insertData);

    // 4. 커밋
    await conn.commit();

    return { success: true, newPartnerId };
  } catch (err) {
    if (conn) await conn.rollback();
    console.error("insertPartner Error:", err);
    return { success: false, error: err.message };
  } finally {
    if (conn) conn.release();
  }
};

// 사원 수정
const updateEmployee = async (employeeInfo) => {
  const insertData = convertToArray(employeeInfo, [
    "name",
    "department",
    "phone",
    "email",
    "hireDate",
    "leaveDate",
    "auth",
    "status",
    "employeeId",
  ]);

  const result = await mariadb.query("updateEmployee", insertData);
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
    "partnerId",
  ]);

  const result = await mariadb.query("updatePartner", insertData);
  return result;
};

// bom 수정
const updateBom = async (bomInfo) => {
  const insertData = convertToArray(bomInfo, ["status", "bomId"]);

  const result = await mariadb.query("updateBom", insertData);
  return result;
};

// 흐름도 Detail 조회
const findAllDetailFlowchart = async (flowInfo) => {
  const insertData = convertToArray(flowInfo, ["flowId"]);
  let list = await mariadb.query("selectDetailFlowchart", insertData);
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
const findAllFlowchart = async (flowchartInfo) => {
  const insertData = [
    flowchartInfo.flowId ?? null,
    flowchartInfo.flowName ?? null,
    flowchartInfo.productId ?? null,
    flowchartInfo.productName ?? null,
    flowchartInfo.status ?? null,
  ];

  let list = await mariadb.query("selectFlowchartList", insertData);
  return list;
};

//  등록
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

// 흐름도등록 + 상세등록
const insertAllFlowchart = async (flowInfo, flowDetails) => {
  let conn;
  try {
    conn = await mariadb.getConnection();
    await conn.beginTransaction();

    const rows = await conn.query(sqlList.selectMaxFlowId);
    const maxId = rows?.[0]?.max_flow_id || null;

    let newFlowId = "FLOW001";
    if (maxId) {
      const lastNum = parseInt(maxId.replace(/\D/g, ""), 10);
      if (!isNaN(lastNum)) {
        newFlowId = `FLOW${String(lastNum + 1).padStart(3, "0")}`;
      }
    }

    // 3. 흐름도 등록
    await conn.query(sqlList.insertFlowchart, [
      newFlowId,
      flowInfo.flowName,
      flowInfo.productId,
      flowInfo.note,
      flowInfo.status,
    ]);

    // 4. 흐름도 상세 등록
    for (const detail of flowDetails) {
      await conn.query(sqlList.insertDetailFlowchart, [
        newFlowId,
        detail.processId,
        detail.useOrder,
        detail.status,
      ]);
    }

    // 5. 커밋
    await conn.commit();

    return { success: true, newFlowId };
  } catch (err) {
    if (conn) await conn.rollback();
    console.error("insertAllFlowchart Error:", err);
    return { success: false, error: err.message };
  } finally {
    if (conn) conn.release();
  }
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
const findAllDetailLine = async (lineInfo) => {
  const insertData = convertToArray(lineInfo, ["lineId"]);
  let list = await mariadb.query("selectDetailLine", insertData);
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
const findAllLine = async (lineInfo) => {
  const insertData = [
    lineInfo.lineId ?? null,
    lineInfo.lineName ?? null,
    lineInfo.processId ?? null,
    lineInfo.processId ?? null,
    lineInfo.equipmentId ?? null,
    lineInfo.equipmentId ?? null,
    lineInfo.status ?? null,
  ];
  let list = await mariadb.query("selectLineList", insertData);
  return list;
};

// 라인 등록
const insertLine = async (lineInfo) => {
  const insertData = convertToArray(lineInfo, [
    "lineId",
    "lineName",
    "productId",
    "note",
    "status",
  ]);

  const result = await mariadb.query("insertLine", insertData);
  return result;
};

const insertAllLine = async (lineInfo, lineDetails) => {
  let conn;
  try {
    conn = await mariadb.getConnection();
    await conn.beginTransaction();
    const fId = await conn.query(
      sqlList.selectFlowIdByProductId,
      lineInfo.productId
    );
    const flowId = fId?.[0]?.flow_id || null;
    // 1. 마지막 line_id 조회 (락)
    const rows = await conn.query(sqlList.selectMaxLineId);
    const maxId = rows?.[0]?.max_line_id || null;
    console.log("Max ID 조회 결과:", rows?.[0]?.max_line_id);

    let newLineId = "L003";
    if (maxId) {
      const lastNum = parseInt(maxId.replace(/\D/g, ""), 10);
      if (!isNaN(lastNum)) {
        newLineId = `L${String(lastNum + 1).padStart(3, "0")}`;
      }
    }
    console.log("생성된 new ID:", newLineId);
    // 3. 라인 등록
    const insertLineResult = await conn.query(sqlList.insertLine, [
      newLineId,
      lineInfo.lineName,
      lineInfo.productId,
      lineInfo.note,
      lineInfo.status,
      flowId,
    ]);

    // [추가] INSERT 성공 여부 로그 확인
    console.log("Insert Line Result:", insertLineResult);

    // 4. 라인 상세 등록
    for (const detail of lineDetails) {
      await conn.query(sqlList.insertDetailLine, [
        newLineId,
        detail.equipmentId,
        detail.processId,
        detail.useOrder,
        detail.status,
      ]);
    }

    // 5. 커밋
    await conn.commit();
    console.log("Transaction committed successfully."); // [추가] 커밋 성공 로그

    return { success: true, newLineId };
  } catch (err) {
    if (conn) await conn.rollback();
    console.error("insertAllLine Error:", err);
    console.log("Transaction rolled back."); // [추가] 롤백 로그

    // [수정] 오류가 발생하면, err.message를 정확히 반환하여 프론트엔드에서 알 수 있게 합니다.
    return { success: false, error: err.message };
  } finally {
    if (conn) conn.release();
  }
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
const findAllProcess = async (processInfo) => {
  const insertData = [
    processInfo.processId ?? null,
    processInfo.processName ?? null,
    processInfo.status ?? null,
  ];
  let list = await mariadb.query("selectProcessList", insertData);
  return list;
};

// 공정 등록
const insertProcess = async (processInfo) => {
  let conn;
  try {
    conn = await mariadb.getConnection();
    await conn.beginTransaction();

    // 1. 마지막 process_id 조회 (락)
    const rows = await conn.query(sqlList.selectMaxProcessId);
    const maxId = rows?.[0]?.max_process_id || null;

    // 2. 새로운 process_id 생성 (PR001, PR002 ...)
    let newProcessId = "PR001";
    if (maxId) {
      const lastNum = parseInt(maxId.replace(/\D/g, ""), 10);
      if (!isNaN(lastNum)) {
        newProcessId = `PR${String(lastNum + 1).padStart(3, "0")}`;
      }
    }

    // 3. INSERT 실행
    const insertData = [
      newProcessId,
      processInfo.processName,
      processInfo.isInspection,
      processInfo.status,
    ];

    await conn.query(sqlList.insertProcess, insertData);

    // 4. 커밋
    await conn.commit();

    return { success: true, newProcessId };
  } catch (err) {
    if (conn) await conn.rollback();
    console.error("insertProcess Error:", err);
    return { success: false, error: err.message };
  } finally {
    if (conn) conn.release();
  }
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
const findAllBOM = async (bomInfo) => {
  const insertData = [
    bomInfo.bomId ?? null,
    bomInfo.productName ?? null,
    bomInfo.productType ?? null,
    bomInfo.status ?? null,
  ];
  let list = await mariadb.query("selectBomList", insertData);
  return list;
};

// BOM 상세정보 조회
const findDetailBOM = async (bomInfo) => {
  const insertData = [bomInfo.bomId ?? null];
  let list = await mariadb.query("selectBomDetail", insertData);
  return list;
};

// BOM 등록
const insertBOM = async (bomInfo) => {
  const insertData = convertToArray(bomInfo, ["bomId", "prodId", "status"]);

  const result = await mariadb.query("insertBOM", insertData);
  return result;
};

const insertAllBOM = async (bomInfo, bomDetails) => {
  let conn;
  try {
    conn = await mariadb.getConnection();
    await conn.beginTransaction();

    // 1. 마지막 bom_id 조회
    const rows = await conn.query(sqlList.selectMaxBOMId);
    const maxId = rows?.[0]?.max_bom_id || null;

    // 2. 새로운 bom_id 생성 (BOM001, BOM002 ...)
    let newBOMId = "BOM001";
    if (maxId) {
      const lastNum = parseInt(maxId.replace(/\D/g, ""), 10);
      if (!isNaN(lastNum)) {
        newBOMId = `BOM${String(lastNum + 1).padStart(3, "0")}`;
      }
    }

    // 3. BOM 등록
    await conn.query(sqlList.insertBOM, [
      newBOMId,
      bomInfo.prodId,
      bomInfo.status,
    ]);

    // 4. BOM 상세 등록 (여러건)
    for (const detail of bomDetails) {
      await conn.query(sqlList.insertDetailBOM, [
        newBOMId,
        detail.materialId,
        detail.unit,
        detail.mixRatio,
        detail.requiredQty,
        detail.totalQty,
        detail.status,
      ]);
    }

    // 5. 커밋
    await conn.commit();
    return { success: true, newBOMId };
  } catch (err) {
    if (conn) await conn.rollback();
    console.error("insertAllBOM Error:", err);
    return { success: false, error: err.message };
  } finally {
    if (conn) conn.release();
  }
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

const findAllMaterialName = async () => {
  let list = await mariadb.query("selectMaterialNameModal");
  return list;
};

const findAllEmployeeId = async () => {
  let list = await mariadb.query("selectEmployeeIdModal");
  return list;
};

const findAllLocationModal = async () => {
  let list = await mariadb.query("selectLocationModal");
  return list;
};

const findAllWarehouseModal = async () => {
  let list = await mariadb.query("selectWarehouseModal");
  return list;
};

const findAllWarehouseTypeModal = async () => {
  let list = await mariadb.query("selectWarehouseTypeModal");
  return list;
};

const findAllProcessName = async () => {
  let list = await mariadb.query("selectProcessNameModal");
  return list;
};
const findAllEquipmentId = async () => {
  let list = await mariadb.query("selectEquipmentIdModal");
  return list;
};

const findAllLineName = async () => {
  let list = await mariadb.query("selectLineNameModal");
  return list;
};

const findAllProcessId = async () => {
  let list = await mariadb.query("selectProcessIdModal");
  return list;
};

const findAllProductName = async () => {
  let list = await mariadb.query("selectProductNameModal");
  return list;
};

const findAllProductId = async () => {
  let list = await mariadb.query("selectProductIdModal");
  return list;
};

const findAllFlowchartName = async () => {
  let list = await mariadb.query("selectFlowchartNameModal");
  return list;
};
const findAllEmployees = async (employeeInfo) => {
  const insertData = convertToArray(employeeInfo, [
    "employeeId",
    "department",
    "auth",
    "status",
  ]);

  let list = await mariadb.query("selectEmployeeList", insertData);
  return list;
};

// 전체 사원 목록 조회
// const findAllEmployees = async () => {
//   let list = await mariadb.query("selectEmployeeList");
//   return list;
// };

// 사원 등록
const insertEmployee = async (employeeInfo) => {
  let conn;
  try {
    conn = await mariadb.getConnection();
    await conn.beginTransaction();

    // 1. 마지막 emp_id 조회 (mapper.query 사용)
    const rows = await mariadb.query("selectMaxEmpId"); // alias 기반
    const maxId = rows?.[0]?.max_emp_id || null;

    // 2. 새로운 emp_id 생성 (E001, E002 ...)
    let newEmpId = "E001";
    if (maxId) {
      const lastNum = parseInt(maxId.replace(/\D/g, ""), 10);
      if (!isNaN(lastNum)) {
        newEmpId = `E${String(lastNum + 1).padStart(3, "0")}`;
      }
    }

    // 3. 날짜 포맷팅
    const formatDateToYMD = (isoDate) => {
      if (!isoDate) return null;
      const d = new Date(isoDate);
      if (isNaN(d)) return null;
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const hireDate = formatDateToYMD(employeeInfo.hireDate);
    const leaveDate = formatDateToYMD(employeeInfo.leaveDate);
    const pwchange = "0";
    // 4. INSERT 실행 (alias 그대로 사용)
    const insertData = [
      newEmpId,
      newEmpId,
      pwchange,
      employeeInfo.name,
      employeeInfo.department, // 기존 코드에서는 dept였는데 employeeInfo.department로 수정
      employeeInfo.phone,
      employeeInfo.email,
      hireDate,
      leaveDate,
      employeeInfo.auth,
      employeeInfo.status,
    ];

    await mariadb.query("insertEmployee", insertData);

    // 5. 커밋
    await conn.commit();

    return { success: true, newEmpId };
  } catch (err) {
    if (conn) await conn.rollback();
    console.error("insertEmployee Error:", err);
    return { success: false, error: err.message };
  } finally {
    if (conn) conn.release();
  }
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
  findAllFlowchartName,
  updateBom,
  updateEmployee,
  findAllProductId,
  findAllWarehouseModal,
  findAllWarehouseTypeModal,
  findAllLocationModal,
  findAllProcessName,
  findAllMaterialName,
  findAllProcessId,
  findAllLineName,
  findAllEquipmentId,
  findAllProductName,
  insertProduct,
  insertAllLine,
  insertAllFlowchart,
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
  findAllpartnerName,
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
  findAllEmployeeId,
  insertAllBOM,
};
