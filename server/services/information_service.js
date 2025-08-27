const mariadb = require("../database/mapper.js");
const sqlList = require("../database/sqlList"); // SQL mapper ë¶ˆëŸ¬?¤ê¸°

// ì°½ê³  ì¡°íšŒ
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

// ì°½ê³  ?±ë¡
const insertWarehouse = async (warehouseInfo) => {
  let conn;
  try {
    conn = await mariadb.getConnection();
    await conn.beginTransaction();

    // 1. ë§ˆì?ë§?ID ì¡°íšŒ (??ê±¸ë¦¼)
    const rows = await conn.query(sqlList.selectMaxWarehouseId);
    const maxId = rows?.[0]?.max_WH_id || null;

    // 2. ??ID ?ì„±
    let newWarehouseId = "WH001";
    if (maxId) {
      const lastNum = parseInt(maxId.replace(/\D/g, ""), 10);
      if (!isNaN(lastNum)) {
        newWarehouseId = `WH${String(lastNum + 1).padStart(3, "0")}`;
      }
    }

    // 3. INSERT ?¤í–‰
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

    // 4. ì»¤ë°‹
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

// ì°½ê³  ?˜ì •
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

// ?œí’ˆ ì¡°íšŒ
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
    
    // ?š¨ ?µì‹¬ ?˜ì •: listê°€ undefined?´ê±°??null??ê²½ìš° ë¹?ë°°ì—´??ë°˜í™˜?˜ë„ë¡?ë³´ìž¥?©ë‹ˆ??
    if (!list) {
        console.log("DB ì¿¼ë¦¬ ê²°ê³¼ê°€ ?†ìŠµ?ˆë‹¤. ë¹?ë°°ì—´??ë°˜í™˜?©ë‹ˆ??");
        return [];
    }
    
    // DB?ì„œ ?•ìƒ?ìœ¼ë¡?ë°°ì—´??ë°˜í™˜??ê²½ìš° ê·¸ë?ë¡?ë°˜í™˜
    return list; 
    
  } catch (error) {
    console.error("DB ì¿¼ë¦¬ ?¤ë¥˜:", error);
    // ì¿¼ë¦¬ ?¤íŒ¨ ?œì—??ë¹?ë°°ì—´ ë°˜í™˜ ?ëŠ” ?¤ë¥˜ ?˜ì?ê¸?    throw error; 
  }
};

// ?œí’ˆ ?±ë¡
const insertProduct = async (productInfo) => {
  let conn;
  try {
    conn = await mariadb.getConnection();
    await conn.beginTransaction();

    // 1. ë§ˆì?ë§?product_id ì¡°íšŒ (??
    const rows = await conn.query(sqlList.selectMaxProductId);
    const maxId = rows?.[0]?.max_product_id || null;

    // 2. ?ˆë¡œ??product_id ?ì„± (?? PR001, PR002 ...)
    let newProductId = "P001";
    if (maxId) {
      const lastNum = parseInt(maxId.replace(/\D/g, ""), 10);
      if (!isNaN(lastNum)) {
        newProductId = `P${String(lastNum + 1).padStart(3, "0")}`;
      }
    }

    if (productInfo.productForm === "ë¶„ë§??) {
      productInfo.productCategory = "CAT001";
    } else if (productInfo.productForm === "ê³¼ë¦½??) {
      productInfo.productCategory = "CAT002";
    } else if (productInfo.productForm === "?¡ìƒ??) {
      productInfo.productCategory = "CAT003";
    }
    // 3. INSERT ?¤í–‰
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

    // 4. ì»¤ë°‹
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

// ?œí’ˆ ?˜ì •
const updateProduct = async (productInfo) => {
  if (productInfo.productForm === "ë¶„ë§??) {
    productInfo.productCategory = "CAT001";
  } else if (productInfo.productForm === "ê³¼ë¦½??) {
    productInfo.productCategory = "CAT002";
  } else if (productInfo.productForm === "?¡ìƒ??) {
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

// ?ìž¬ ì¡°íšŒ
const findAllMaterial = async (materialInfo) => {
  const insertData = [
    materialInfo.materialId ?? null,
    materialInfo.materialName ?? null,
    materialInfo.status ?? null,
  ];
  let list = await mariadb.query("selectMaterialList", insertData);
  return list;
};

// ?ìž¬ ?±ë¡
const insertMaterial = async (materialInfo) => {
  let conn;
  try {
    conn = await mariadb.getConnection();
    await conn.beginTransaction();

    // 1. ë§ˆì?ë§?material_id ì¡°íšŒ (??
    const rows = await conn.query(sqlList.selectMaxMaterialId);
    const maxId = rows?.[0]?.max_material_id || null;

    // 2. ?ˆë¡œ??material_id ?ì„± (MAT001, MAT002 ...)
    let newMaterialId = "MAT001";
    if (maxId) {
      const lastNum = parseInt(maxId.replace(/\D/g, ""), 10);
      if (!isNaN(lastNum)) {
        newMaterialId = `MAT${String(lastNum + 1).padStart(3, "0")}`;
      }
    }

    // 3. INSERT ?¤í–‰
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

    // 4. ì»¤ë°‹
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

// ?ìž¬ ?˜ì •
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

// ê±°ëž˜ì²˜ëª… ì¡°íšŒ
const findAllpartnerName = async () => {
  let list = await mariadb.query("selectPartnerName");
  return list;
};

// ê±°ëž˜ì²?ì¡°íšŒ
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

// ê±°ëž˜ì²??±ë¡
const insertPartner = async (partnerInfo) => {
  let conn;
  try {
    conn = await mariadb.getConnection();
    await conn.beginTransaction();

    // 1. ë§ˆì?ë§?partner_id ì¡°íšŒ (??
    const rows = await conn.query(sqlList.selectMaxPartnerId);
    const maxId = rows?.[0]?.max_partner_id || null;

    // 2. ?ˆë¡œ??partner_id ?ì„± (PAT001, PAT002 ...)
    let newPartnerId = "PAT001";
    if (maxId) {
      const lastNum = parseInt(maxId.replace(/\D/g, ""), 10);
      if (!isNaN(lastNum)) {
        newPartnerId = `PAT${String(lastNum + 1).padStart(3, "0")}`;
      }
    }

    // 3. INSERT ?¤í–‰
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

    // 4. ì»¤ë°‹
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

// ?¬ì› ?˜ì •
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

// ê±°ëž˜ì²??˜ì •
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

// bom ?˜ì •
const updateBom = async (bomInfo) => {
  const insertData = convertToArray(bomInfo, ["status", "bomId"]);

  const result = await mariadb.query("updateBom", insertData);
  return result;
};

// ?ë¦„??Detail ì¡°íšŒ
const findAllDetailFlowchart = async (flowInfo) => {
  const insertData = convertToArray(flowInfo, ["flowId"]);
  let list = await mariadb.query("selectDetailFlowchart", insertData);
  return list;
};

// ?ë¦„??Detail ?±ë¡
const insertDetailFlowchart = async (flowInfo) => {
  const insertData = convertToArray(flowInfo, [
    "processId",
    "useOrder",
    "status",
  ]);

  const result = await mariadb.query("insertDetailFlowchart", insertData);
  return result;
};

// ?ë¦„??detail ?˜ì •
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

//?ë¦„??ëª©ë¡ ì¡°íšŒ
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

//  ?±ë¡
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

// ?ë¦„?„ë“±ë¡?+ ?ì„¸?±ë¡
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

    // 3. ?ë¦„???±ë¡
    await conn.query(sqlList.insertFlowchart, [
      newFlowId,
      flowInfo.flowName,
      flowInfo.productId,
      flowInfo.note,
      flowInfo.status,
    ]);

    // 4. ?ë¦„???ì„¸ ?±ë¡
    for (const detail of flowDetails) {
      await conn.query(sqlList.insertDetailFlowchart, [
        newFlowId,
        detail.processId,
        detail.useOrder,
        detail.status,
      ]);
    }

    // 5. ì»¤ë°‹
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

// ?ë¦„???˜ì •
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

// ?¼ì¸ Detail ì¡°íšŒ
const findAllDetailLine = async (lineInfo) => {
  const insertData = convertToArray(lineInfo, ["lineId"]);
  let list = await mariadb.query("selectDetailLine", insertData);
  return list;
};

// ?¼ì¸ Detail ?±ë¡
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

// ?¼ì¸ detail ?˜ì •
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

// ?¼ì¸ ëª©ë¡ ì¡°íšŒ
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

// ?¼ì¸ ?±ë¡
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

    // 1. ë§ˆì?ë§?line_id ì¡°íšŒ (??
    const rows = await conn.query(sqlList.selectMaxLineId);
    const maxId = rows?.[0]?.max_line_id || null;
    console.log("Max ID ì¡°íšŒ ê²°ê³¼:", rows?.[0]?.max_line_id);

    let newLineId = "L003";
    if (maxId) {
      const lastNum = parseInt(maxId.replace(/\D/g, ""), 10);
      if (!isNaN(lastNum)) {
        newLineId = `L${String(lastNum + 1).padStart(3, "0")}`;
      }
    }
    console.log("?ì„±??new ID:", newLineId);
    // 3. ?¼ì¸ ?±ë¡
    const insertLineResult = await conn.query(sqlList.insertLine, [
      newLineId,
      lineInfo.lineName,
      lineInfo.productId,
      lineInfo.note,
      lineInfo.status,
    ]);

    // [ì¶”ê?] INSERT ?±ê³µ ?¬ë? ë¡œê·¸ ?•ì¸
    console.log("Insert Line Result:", insertLineResult);

    // 4. ?¼ì¸ ?ì„¸ ?±ë¡
    for (const detail of lineDetails) {
      await conn.query(sqlList.insertDetailLine, [
        newLineId,
        detail.equipmentId,
        detail.processId,
        detail.useOrder,
        detail.status,
      ]);
    }

    // 5. ì»¤ë°‹
    await conn.commit();
    console.log("Transaction committed successfully."); // [ì¶”ê?] ì»¤ë°‹ ?±ê³µ ë¡œê·¸

    return { success: true, newLineId };
  } catch (err) {
    if (conn) await conn.rollback();
    console.error("insertAllLine Error:", err);
    console.log("Transaction rolled back."); // [ì¶”ê?] ë¡¤ë°± ë¡œê·¸

    // [?˜ì •] ?¤ë¥˜ê°€ ë°œìƒ?˜ë©´, err.messageë¥??•í™•??ë°˜í™˜?˜ì—¬ ?„ë¡ ?¸ì—”?œì—???????ˆê²Œ ?©ë‹ˆ??
    return { success: false, error: err.message };
  } finally {
    if (conn) conn.release();
  }
};

// ?¼ì¸ ?˜ì •
const updateLine = async (lineInfo) => {
  const insertData = convertToArray(lineInfo, [
    "lineName",
    "productId",
    "note",
    "status",
    "lineId",
  ]);

  const result = await mariadb.query("updateLine", insertData);
  return result;
};

// ê³µì • ëª©ë¡ ì¡°íšŒ
const findAllProcess = async (processInfo) => {
  const insertData = [
    processInfo.processId ?? null,
    processInfo.processName ?? null,
    processInfo.status ?? null,
  ];
  let list = await mariadb.query("selectProcessList", insertData);
  return list;
};

// ê³µì • ?±ë¡
const insertProcess = async (processInfo) => {
  let conn;
  try {
    conn = await mariadb.getConnection();
    await conn.beginTransaction();

    // 1. ë§ˆì?ë§?process_id ì¡°íšŒ (??
    const rows = await conn.query(sqlList.selectMaxProcessId);
    const maxId = rows?.[0]?.max_process_id || null;

    // 2. ?ˆë¡œ??process_id ?ì„± (PR001, PR002 ...)
    let newProcessId = "PR001";
    if (maxId) {
      const lastNum = parseInt(maxId.replace(/\D/g, ""), 10);
      if (!isNaN(lastNum)) {
        newProcessId = `PR${String(lastNum + 1).padStart(3, "0")}`;
      }
    }

    // 3. INSERT ?¤í–‰
    const insertData = [
      newProcessId,
      processInfo.processName,
      processInfo.isInspection,
      processInfo.status,
    ];

    await conn.query(sqlList.insertProcess, insertData);

    // 4. ì»¤ë°‹
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

// ê³µì • ?˜ì •
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

// ?„ì²´ BOM ëª©ë¡ ì¡°íšŒ
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

// BOM ?ì„¸?•ë³´ ì¡°íšŒ
const findDetailBOM = async (bomInfo) => {
  const insertData = [bomInfo.bomId ?? null];
  let list = await mariadb.query("selectBomDetail", insertData);
  return list;
};

// BOM ?±ë¡
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

    // 1. ë§ˆì?ë§?bom_id ì¡°íšŒ
    const rows = await conn.query(sqlList.selectMaxBOMId);
    const maxId = rows?.[0]?.max_bom_id || null;

    // 2. ?ˆë¡œ??bom_id ?ì„± (BOM001, BOM002 ...)
    let newBOMId = "BOM001";
    if (maxId) {
      const lastNum = parseInt(maxId.replace(/\D/g, ""), 10);
      if (!isNaN(lastNum)) {
        newBOMId = `BOM${String(lastNum + 1).padStart(3, "0")}`;
      }
    }

    // 3. BOM ?±ë¡
    await conn.query(sqlList.insertBOM, [
      newBOMId,
      bomInfo.prodId,
      bomInfo.status,
    ]);

    // 4. BOM ?ì„¸ ?±ë¡ (?¬ëŸ¬ê±?
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

    // 5. ì»¤ë°‹
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

// BOM_detail ?±ë¡
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

// ?„ì²´ ?¬ì› ëª©ë¡ ì¡°íšŒ
// const findAllEmployees = async () => {
//   let list = await mariadb.query("selectEmployeeList");
//   return list;
// };

// ?¬ì› ?±ë¡
const insertEmployee = async (employeeInfo) => {
  let conn;
  try {
    conn = await mariadb.getConnection();
    await conn.beginTransaction();

    // 1. ë§ˆì?ë§?emp_id ì¡°íšŒ (mapper.query ?¬ìš©)
    const rows = await mariadb.query("selectMaxEmpId"); // alias ê¸°ë°˜
    const maxId = rows?.[0]?.max_emp_id || null;

    // 2. ?ˆë¡œ??emp_id ?ì„± (E001, E002 ...)
    let newEmpId = "E001";
    if (maxId) {
      const lastNum = parseInt(maxId.replace(/\D/g, ""), 10);
      if (!isNaN(lastNum)) {
        newEmpId = `E${String(lastNum + 1).padStart(3, "0")}`;
      }
    }

    // 3. ? ì§œ ?¬ë§·??    const formatDateToYMD = (isoDate) => {
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
    // 4. INSERT ?¤í–‰ (alias ê·¸ë?ë¡??¬ìš©)
    const insertData = [
      newEmpId,
      newEmpId,
      pwchange,
      employeeInfo.name,
      employeeInfo.department, // ê¸°ì¡´ ì½”ë“œ?ì„œ??dept?€?”ë° employeeInfo.departmentë¡??˜ì •
      employeeInfo.phone,
      employeeInfo.email,
      hireDate,
      leaveDate,
      employeeInfo.auth,
      employeeInfo.status,
    ];

    await mariadb.query("insertEmployee", insertData);

    // 5. ì»¤ë°‹
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

// insert + id ë°›ì•„?¤ê¸°
// const resInfo = await mariadb.query("insertEmployee", insertData);

// insert ?±ê³µ ????employee_id ?…ë°?´íŠ¸
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

// ê°ì²´ë¥?ë°°ì—´ë¡?ë³€?˜í•˜??ë§¤ì„œ??function convertToArray(obj, columns) {
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
