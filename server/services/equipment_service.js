const mariadb = require("../database/mapper.js");
const sqlList = require("../database/sqlList.js");
// const express = require('express');
const path = require('path');
// const app = express();

// 업로드 폴더 static 제공



/* ---------- 공통 유틸 ---------- */
const norm = (v) => {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s.length > 0 ? s : null;
};
const formatDate = (val) => {
  if (!val) return null;
  if (typeof val === "string") return val.slice(0, 10);
  return val.toISOString().slice(0, 10);
};
const fmtDate = formatDate;

/* ---------- 설비점검 페이지 (기존) ---------- */
const findInspectionList = async () => {
  return await mariadb.query("selectInspectionList");
};

const findInspectionByFilter = async (q = {}) => {
  const paramsOr = [
    norm(q.insp_code), norm(q.insp_code),
    norm(q.eq_id),     norm(q.eq_id),
    norm(q.insp_type), norm(q.insp_type),
    norm(q.date_from), norm(q.date_from),
    norm(q.date_to),   norm(q.date_to),
    norm(q.next_from), norm(q.next_from),
    norm(q.next_to),   norm(q.next_to),
    Number(q.size) || 20,
    Number(q.page) ? (Number(q.page) - 1) * (Number(q.size) || 20) : 0,
  ];

  // 🔽 여기서 AND → OR 로 완전히 교체
  return await mariadb.query("selectInspectionListByFilterOr", paramsOr);
};

const findInspectionDistinct = async (field, page = 1, size = 5) => {
  let listSql = "",
    countSql = "";
  switch (field) {
    case "insp_code":
      listSql = "distinctInspCode";
      countSql = "countDistinctInspCode";
      break;
    case "eq_id":
      listSql = "distinctEqId";
      countSql = "countDistinctEqId";
      break;
    case "insp_type":
      listSql = "distinctInspType";
      countSql = "countDistinctInspType";
      break;
    case "insp_date":
      listSql = "distinctInspDate";
      countSql = "countDistinctInspDate";
      break;
    case "next_date":
      listSql = "distinctNextDate";
      countSql = "countDistinctNextDate";
      break;
    default:
      return { items: [], total: 0, page, size };
  }
  const total = (await mariadb.query(countSql))[0].total;
  const rows = await mariadb.query(listSql, [size, (page - 1) * size]);
  const items = rows.map((r) => Object.values(r)[0]);
  return { items, total, page, size };
};

/* ---------- ★ 설비점검 단건/등록/수정 + 디테일 ---------- */

const findInspectionOne = async (inspId) => {
  if (!inspId) return null;
  const rows = await mariadb.query("selectInspectionOne", [inspId]);
  if (!rows || rows.length === 0) return null;

  const master = rows[0];
  const details = await mariadb.query("selectInspectionDetails", [inspId]);
  return {
    ...master,
    inspectionDate: fmtDate(master.inspectionDate),
    nextDate: fmtDate(master.nextDate),
    details: (details || []).map((d) => ({
      item: d.item ?? "",
      result: d.result ?? "",
      action: d.action ?? "",
    })),
  };
};

const registerInspection = async (InspInfo = {}) => {
  // if (!(data.equipmentCode || "").trim()) throw new Error("설비코드 필수");
  // if (!(data.inspectionType || "").trim()) throw new Error("점검유형 필수");
  // if (!data.inspectionDate) throw new Error("점검일 필수");
  // if (!(data.manager || "").trim()) throw new Error("점검책임자 필수");

  // const inspectionCode =
  //   (data.inspectionCode || "").trim() && data.inspectionCode !== "자동생성"
  //     ? data.inspectionCode.trim()
  //     : genInspectionCode();

  // await mariadb.query("insertInspection", [
  //   inspectionCode,
  //   data.equipmentCode.trim(),
  //   data.inspectionType.trim(),
  //   data.inspectionCycle || null,
  //   fmtDate(data.inspectionDate),
  //   fmtDate(data.nextDate),
  //   data.manager.trim(),
  //   data.note || null,
  //   data.lastResult || null,
  // ]);

  // if (Array.isArray(data.details)) {
  //   for (const d of data.details) {
  //     await mariadb.query("insertInspectionDetail", [
  //       inspectionCode,
  //       d?.item || "",
  //       d?.result || "",
  //       d?.action || "",
  //     ]);
  //   }
  // }
  // return { inspectionCode };

  let conn;
  try {
    console.log(InspInfo);
    conn = await mariadb.getConnection();
    await conn.beginTransaction();

    const rows = await conn.query(sqlList.selectMaxInspId);
    const maxId = rows?.[0]?.max_insp_id || null;

    let newInspId = "INSP001";
    if (maxId) {
      const lastNum = parseInt(maxId.replace(/\D/g, ""), 10);
      if (!isNaN(lastNum)) {
        newInspId = `INSP${String(lastNum + 1).padStart(3, "0")}`;
      }
    }

    // 3. 날짜 포맷팅 함수
    const formatDateToYMD = (isoDate) => {
      if (!isoDate) return null;
      const d = new Date(isoDate);
      if (isNaN(d)) return null;
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const inspectionDate = formatDateToYMD(InspInfo.inspectionDate);
    const nextDate = formatDateToYMD(InspInfo.nextDate);
    console.log(newInspId);

    await conn.query(sqlList.insertInspection, [
      newInspId,
      InspInfo.equipmentCode.trim() || null,
      InspInfo.inspectionType.trim() || null,
      InspInfo.inspectionCycle || null,
      inspectionDate || null,
      nextDate || null,
      InspInfo.manager.trim() || null,
      InspInfo.note || null,
      InspInfo.lastResult || null,
    ]); // 여기가 insert 부분

    if (Array.isArray(InspInfo.details)) {
      for (const detail of InspInfo.details) {
        await conn.query(sqlList.insertInspectionDetail, [
          newInspId,
          detail?.item || "",
          detail?.result || "",
          detail?.action || "",
        ]);
      }
    }

    // 5. 커밋
    await conn.commit();
    return { success: true, newInspId };
  } catch (err) {
    if (conn) await conn.rollback();
    console.error("insertInspection Error:", err);
    return { success: false, error: err.message };
  } finally {
    if (conn) conn.release();
  }
};

const updateInspection = async (data = {}) => {
  if (!String(data.inspectionCode || "").trim())
    throw new Error("점검코드 누락");
  if (!String(data.equipmentCode || "").trim())
    throw new Error("설비코드 필수");
  if (!String(data.inspectionType || "").trim())
    throw new Error("점검유형 필수");
  if (!data.inspectionDate) throw new Error("점검일 필수");
  if (!String(data.manager || "").trim()) throw new Error("점검책임자 필수");

  await mariadb.query("updateInspection", [
    String(data.equipmentCode || "").trim(),
    String(data.inspectionType || "").trim(),
    data.inspectionCycle || null,
    fmtDate(data.inspectionDate),
    fmtDate(data.nextDate),
    String(data.manager || "").trim(),
    data.note || null,
    String(data.inspectionCode || "").trim(),
  ]);

  await mariadb.query("deleteInspectionDetails", [
    String(data.inspectionCode || "").trim(),
  ]);

  if (Array.isArray(data.details)) {
    for (const d of data.details) {
      await mariadb.query("insertInspectionDetail", [
        String(data.inspectionCode || "").trim(),
        String(d?.item || "").trim(),
        String(d?.result || "").trim(),
        String(d?.action || "").trim(),
      ]);
    }
  }

  return { success: true };
};

/* ---------- 설비정보 등록/수정 페이지 (기존) ---------- */
const getDistinct = async (field) => {
  let sql = "";
  switch (field) {
    case "equipment_id":
      sql = "distinctEquipmentCode";
      break;
    case "equipment_type":
      sql = "distinctEquipmentType";
      break;
    case "equipment_name":
      sql = "distinctEquipmentName";
      break;
    case "location":
      sql = "distinctLocation";
      break;
    case "status":
      sql = "distinctStatus";
      break;
    default:
      return [];
  }
  const rows = await mariadb.query(sql);
  return rows.map((r) => Object.values(r)[0]);
};

const searchEquipment = async (q = {}, page = 1, size = 10) => {
  const params = [
    q.equipment_id || null,
    q.equipment_id || null,
    q.equipment_type || null,
    q.equipment_type || null,
    q.equipment_name || null,
    q.equipment_name || null,
    q.location || null,
    q.location || null,
    q.status || null,
    q.status || null,
    size,
    (page - 1) * size,
  ];
  const items = await mariadb.query("searchEquipment", params);
  const total = (await mariadb.query("countEquipment", params.slice(0, -2)))[0]
    .total;
  return { items, total, page, size };
};

// 설비 등록 설비코드 생성
const insertEquipment = async (equipmentInfo) => {
  let conn;
  try {
    console.log(equipmentInfo);
    conn = await mariadb.getConnection();
    await conn.beginTransaction();

    const rows = await conn.query(sqlList.selectMaxEqId);
    const maxId = rows?.[0]?.max_eq_id || null;

    let newEqId = "EQ001";
    if (maxId) {
      const lastNum = parseInt(maxId.replace(/\D/g, ""), 10);
      if (!isNaN(lastNum)) {
        newEqId = `EQ${String(lastNum + 1).padStart(3, "0")}`;
      }
    }

    // 3. 날짜 포맷팅 함수
    const formatDateToYMD = (isoDate) => {
      if (!isoDate) return null;
      const d = new Date(isoDate);
      if (isNaN(d)) return null;
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const purchaseDate = formatDateToYMD(equipmentInfo.purchaseDate);
    const startDate = formatDateToYMD(equipmentInfo.startDate);
    console.log(newEqId);
    await conn.query(sqlList.insertEquipment, [
      newEqId || null, // equipment_id
      equipmentInfo.equipmentType || null, // equipment_type
      equipmentInfo.equipmentName || null, // equipment_name
      equipmentInfo.manufacturer || null, // manufacturer
      equipmentInfo.serialNo || null, // serial_no
      equipmentInfo.safetyStandard || null, // safety_standard
      equipmentInfo.operationManual || null, // operation_manual
      purchaseDate || null, // purchase_date
      startDate || null, // start_date
      equipmentInfo.location || null, // location
      equipmentInfo.status || null, // status
    ]);

    // 5. 커밋
    await conn.commit();

    return { success: true, newEqId };
  } catch (err) {
    if (conn) await conn.rollback();
    console.error("insertEquipment Error:", err);
    return { success: false, error: err.message };
  } finally {
    if (conn) conn.release();
  }
};

/* ---------- 설비정보 조회페이지 (기존) ---------- */
const findEquipmentInfoPage = async (page = 1, size = 10) => {
  const items = await mariadb.query("selectEquipmentInfoPage", [size, (page - 1) * size]);
  const total = (await mariadb.query("countEquipmentInfoAll"))[0].total;
  return { items, total, page, size };
};


const searchEquipmentInfo2 = async (q = {}, page = 1, size = 10) => {
  const ei = norm(q.equipment_id);
  const et = norm(q.equipment_type);
  const en = norm(q.equipment_name);
  const lc = norm(q.location);
  const st = norm(q.status);

  const paramsSel = [
  norm(q.equipment_id),   norm(q.equipment_id),
  norm(q.equipment_type), norm(q.equipment_type),
  norm(q.equipment_name), norm(q.equipment_name),
  norm(q.location),       norm(q.location),
  norm(q.status),         norm(q.status),
  size, (page - 1) * size,
];

  const paramsCnt = [
    ei, ei,
    et, et,
    en, en,
    lc, lc,
    st, st,
  ];

  // 디버그용
  console.log("[searchEquipmentInfo2] paramsSel =", paramsSel);

  const items = await mariadb.query("selectEquipmentInfoSearchAnd", paramsSel);
  const total = (await mariadb.query("countEquipmentInfoSearchAnd", paramsCnt))[0].total;

  console.log('DEBUG status param:', q.status, '→ norm:', norm(q.status));
  return { items, total, page, size };
};




// 🔹 DISTINCT (모달용)
const findEquipmentInfoDistinct = async (field, page = 1, size = 5) => {
  let listSql = "", countSql = "";
  switch (field) {
    case "equipment_id": listSql = "distinctEqId2"; countSql = "countDistinctEqId2"; break;
    case "equipment_type": listSql = "distinctEqType2"; countSql = "countDistinctEqType2"; break;
    case "equipment_name": listSql = "distinctEqName2"; countSql = "countDistinctEqName2"; break;
    case "location": listSql = "distinctLoc2"; countSql = "countDistinctLoc2"; break;
    case "status": listSql = "distinctStatus2"; countSql = "countDistinctStatus2"; break;
    default: return { items: [], total: 0, page, size };
  }
  const total = (await mariadb.query(countSql))[0].total;
  const rows = await mariadb.query(listSql, [size, (page - 1) * size]);
  const items = rows.map((r) => Object.values(r)[0]);
  return { items, total, page, size };
};

const findOneEquipment = async (q = {}) => {
  const id = (q.equipment_id || "").trim();
  if (!id) return null;
  const rows = await mariadb.query("selectEquipmentOne", [id]);
  return rows[0] || null;
};

const searchEquipment2 = async (q = {}, page = 1, size = 10) => {
  const params = [
    q.equipment_id || null,
    q.equipment_id || null,
    q.equipment_type || null,
    q.equipment_type || null,
    q.equipment_name || null,
    q.equipment_name || null,
    q.location || null,
    q.location || null,
    q.status || null,
    q.status || null,
    size,
    (page - 1) * size,
  ];
  const items = await mariadb.query("searchEquipment", params);
  const total = (await mariadb.query("countEquipment", params.slice(0, -2)))[0]
    .total;
  return { items, total, page, size };
};

// 설비정보 수정
const updateEquipment = async (data = {}) => {
  const params = [
    (data.equipmentName ?? "").trim(),
    (data.manufacturer ?? "").trim(),
    (data.serialNo ?? "").trim(),
    formatDate(data.purchaseDate),
    formatDate(data.startDate),
    (data.equipmentType ?? "").trim(),
    (data.location ?? "").trim(),
    (data.status ?? "").trim(),
    (data.equipmentCode ?? "").trim(), // PK
  ];
  return await mariadb.query("updateEquipment", params);
};

// 설비정보 등록/수정페이지 설비코드 자동생성

// 비가동 페이지

/* ===== 비가동 목록 조회 ===== */
async function getDowntimeList({ eq_id, offset, size }) {
  // 데이터 목록
  const rows = await mariadb.query("selectDowntimeList", [
    eq_id,
    eq_id,
    offset,
    size,
  ]);

  // 전체 건수
  const totalRows = await mariadb.query("countDowntimeList", [eq_id, eq_id]);

  return { rows, total: totalRows[0].cnt };
}

// 비가동

// 설비코드 목록 조회 (단순 페이지네이션)
const getCodeList = async (page = 1, size = 5) => {
  const offset = (page - 1) * size;
  const items = await mariadb.query("selectCodeList", [offset, size]); // eq_id, eq_name
  const total = (await mariadb.query("countEquipment2"))[0].cnt;
  return { items, total, page, size };
};

// 비가동 등록 (id 자동증가라 id 제외)
const registDowntime = async (form = {}) => {
  const result = await mariadb.query("insertDowntime", [
    form.equipment_id,
    form.repair_id,
    form.inspection_id,
    form.fault_type,
    form.fault_dtime,
    form.restart_dtime,
    form.note,
    form.status,
  ]);
  return { id: result.insertId };
};

// 비가동 수정 (WHERE id=?)
const updateDowntime = async (form = {}) => {
  await mariadb.query("updateDowntime", [
    form.equipment_id,
    form.repair_id,
    form.inspection_id,
    form.fault_type,
    form.fault_dtime,
    form.restart_dtime,
    form.note,
    form.status,
    form.id,
  ]);
  return { id: form.id };
};

// 설비수리 페이지

/* ===== 설비수리: 목록(기본) ===== */
const getRepairList = async (page = 1, size = 10) => {
  const offset = (page - 1) * size;
  const items = await mariadb.query("selectRepairList", [
    null,
    null,
    null,
    null,
    size,
    offset,
  ]);
  const total =
    (await mariadb.query("countRepairList", [null, null, null, null]))[0]
      ?.total ?? 0;
  return { items, total, page, size };
};

/* ===== 설비수리 조건검색 조회 ===== */
const searchRepairList = async (q = {}) => {
  const page = Math.max(parseInt(q.page || 1, 10), 1);
  const size = Math.max(parseInt(q.size || 10, 10), 1);
  const offset = (page - 1) * size;

  const params = [
    q.repair_id ?? null,
    q.repair_id ?? null,
    q.eq_id ?? null,
    q.eq_id ?? null,
    q.status ?? null,
    q.status ?? null,
    q.date_from ?? null,
    q.date_from ?? null,
    q.date_to ?? null,
    q.date_to ?? null,
    size,
    offset,
  ];

  const items = await mariadb.query("searchRepairList", params);
  const total =
    (await mariadb.query("countRepairListWithFilter", params.slice(0, -2)))[0]
      ?.total ?? 0;

  return { items, total, page, size };
};

/* ===== DISTINCT (설비수리모달) ===== */
const getRepairDistinct = async (field, page = 1, size = 5) => {
  if (field !== "repair_id") return { items: [], total: 0, page, size }

  const offset = (page - 1) * size
  const rows = await mariadb.query("distinctRepair", [size, offset])
  const countRows = await mariadb.query("countDistinctRepair")

  const items = rows.map((r) => Object.values(r)[0])
  const total = countRows[0].total   // ✅ 전체 건수 반환
  return { items, total, page, size }
}

// 설비수리 자동생성
const registerRepair = async (repairInfo = {}) => {
  let conn;
  try {
    conn = await mariadb.getConnection();
    await conn.beginTransaction();

    // 1) 마지막 수리코드 가져오기
    const rows = await conn.query(sqlList.selectMaxRepairId);
    const maxId = rows?.[0]?.max_repair_id || null;

    let newRepairId = "R001";
    if (maxId) {
      const lastNum = parseInt(maxId.replace(/\D/g, ""), 10);
      if (!isNaN(lastNum)) {
        newRepairId = `R${String(lastNum + 1).padStart(3, "0")}`;
      }
    }

    // 2) 날짜 처리 (newData 기본값 적용)
    //    👉 fault_dtime은 NOT NULL 이므로 값 없으면 현재시간으로 대체
    const faultDate   = repairInfo.faultDate   || new Date();
    const restartDate = repairInfo.restartDate || null;
    const startDate   = repairInfo.repairStartDate || null;
    const endDate     = repairInfo.repairEndDate   || null;

    // 3) 마스터 등록
    await conn.query(sqlList.insertRepair, [
      newRepairId,                              // repair_id
      repairInfo.equipmentCode?.trim() || null, // equipment_id (FK)
      faultDate,                                // fault_dtime (필수, new Date() 보정)
      restartDate,                              // restart_dtime
      startDate,                                // 수리시작일
      endDate,                                  // 수리종료일
      repairInfo.manager?.trim() || null,       // 수리자
      repairInfo.repairReason?.trim() || null,  // 사유
      repairInfo.status || "대기",              // 상태
    ]);

    // 4) 디테일 등록
    if (Array.isArray(repairInfo.details)) {
      for (const d of repairInfo.details) {
        // 비어있는 행은 스킵
        if (!d.item && !d.result && !d.action) continue;

        await conn.query(sqlList.insertRepairDetail, [
          newRepairId,        // repair_id FK
          d.item   || "",     // 수리항목
          d.result || "",     // 수리결과
          d.action || "",     // 조치사항
        ]);
      }
    }

    // 5) 커밋
    await conn.commit();
    return { success: true, newRepairId };

  } catch (err) {
    if (conn) await conn.rollback();
    console.error("registerRepair Error:", err);
    return { success: false, error: err.message };

  } finally {
    if (conn) conn.release();
  }
};

/* ===== 유틸: 날짜 포맷 ===== */
const toYmd = (v) => {
  if (!v) return null
  const d = new Date(v)
  if (isNaN(d)) return null
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
const toLocal = (v) => {
  // datetime-local: 'YYYY-MM-DDTHH:MM'
  if (!v) return null
  const d = new Date(v)
  if (isNaN(d)) return null
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${day}T${hh}:${mm}`
}

/* ===== 설비수리 단건 조회(마스터+디테일) ===== */
const findOneRepair = async (repairId) => {
  const id = (repairId || '').trim()
  if (!id) return null

  const masterRows = await mariadb.query("selectRepairOne", [id])
  if (!masterRows || masterRows.length === 0) return null
  const m = masterRows[0]

  const detailRows = await mariadb.query("selectRepairDetails", [id])
  const details = (detailRows || []).map(d => ({
    item: d.item ?? '',
    result: d.result ?? '',
    action: d.action ?? ''
  }))

  // ✅ 프론트 폼 스키마에 맞춰 변환
  return {
    equipmentCode: m.equipmentCode || '',
    repairCode: m.repairCode || '',
    faultDate: toLocal(m.faultDate) || null,
    restartDate: toLocal(m.restartDate) || null,      // downtime에 있으면 매핑됨
    repairStartDate: toYmd(m.repairStartDate) || null,
    repairEndDate: toYmd(m.repairEndDate) || null,
    manager: m.manager || '',
    repairReason: m.repairReason || '',
    status: m.status || '대기',
    details: details.length ? details : [{ item: '', result: '', action: '' }]
  }
}

/* ===== 설비수리 수정(마스터+디테일) ===== */
const updateRepair = async (data = {}) => {
  const rid = (data.repairCode || '').trim()
  if (!rid) throw new Error('수정 실패: repairCode 누락')

  let conn
  try {
    conn = await mariadb.getConnection()
    await conn.beginTransaction()

    // 1) 마스터 수정 (equipment_repair)
    await conn.query(sqlList.updateRepairMaster, [
      (data.equipmentCode || null),
      (data.faultDate || null),
      (data.repairStartDate || null),
      (data.repairEndDate || null),
      (data.manager || null),
      (data.repairReason || null),
      (data.status || null),
      rid
    ])

    // 2) 디테일 재작성
    await conn.query(sqlList.deleteRepairDetails, [rid])

    if (Array.isArray(data.details)) {
      for (const d of data.details) {
        if (!d.item && !d.result && !d.action) continue
        await conn.query(sqlList.insertRepairDetail, [
          rid,
          d.item || '',
          d.result || '',
          d.action || ''
        ])
      }
    }

    // 3) (선택) downtime 재가동일시 업데이트: 존재할 때만
    if (data.restartDate) {
      await conn.query(sqlList.updateDowntimeRestartByRepair, [
        data.restartDate,
        rid
      ])
    }

    await conn.commit()
    return { success: true, repairId: rid }
  } catch (err) {
    if (conn) await conn.rollback()
    throw err
  } finally {
    if (conn) conn.release()
  }
}



// 메뉴얼 법 페이지
// ✅ 교체: raw SQL 변수 → 키 문자열
const getManualList = async (page = 1, size = 10) => {
  const offset = (page - 1) * size;
  const items = await mariadb.query("selectEquipmentManualPage", [size, offset]);
  const total = (await mariadb.query("countEquipmentManual"))[0].total;
  return { items, total, page, size };
};

const searchManualList = async (q = {}, page = 1, size = 10) => {
  const offset = (page - 1) * size;

  const paramsSel = [
    q.equipment_id, q.equipment_id,
    q.equipment_type, q.equipment_type,
    q.equipment_name, q.equipment_name,
    q.location, q.location,
    q.status, q.status,
    size, offset
  ];

  const paramsCnt = [
    q.equipment_id, q.equipment_id,
    q.equipment_type, q.equipment_type,
    q.equipment_name, q.equipment_name,
    q.location, q.location,
    q.status, q.status
  ];

  const items = await mariadb.query("searchEquipmentManualAnd", paramsSel);
  const total = (await mariadb.query("countEquipmentManualAnd", paramsCnt))[0].total;

  return { items, total, page, size };
};


module.exports = {
  /* 설비점검(기존) */
  findInspectionList,
  findInspectionByFilter,
  findInspectionDistinct,

  /* ★ 설비점검 단건/등록/수정 */
  findInspectionOne,
  registerInspection,
  updateInspection,

  /* 설비정보(기존) */
  getDistinct,
  searchEquipment,
  insertEquipment,
  updateEquipment,
  findEquipmentInfoPage,
  findEquipmentInfoDistinct,
  findOneEquipment,
  searchEquipmentInfo2,
  searchEquipment2,
  


  //비가동
  getDowntimeList,
  updateDowntime, // 비가동 수정
  getCodeList,
  registDowntime,

  // 설비수리
  getRepairList,
  searchRepairList,
  getRepairDistinct,
  searchRepairList,
  registerRepair,
  findOneRepair,
  updateRepair,
  getManualList,
  searchManualList,
  
};
