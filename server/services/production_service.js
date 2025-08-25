const mariadb = require("../database/mapper.js");
const { query, getConnection, sqlList } = require("../database/mapper.js");

// 객체를 배열로 변환하는 매서드
function convertToArray(obj, columns) {
  return columns.map((col) => obj[col]);
}

// yy-MM-dd HH:mm:ss 포맷으로 변환하는 함수
const formatToDatabaseDatetime = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);

  // 날짜 구성 요소 추출
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 작업지시 함수
const startWork = async (director, plan_detail_no, details) => {
  let conn;
  try {
    conn = await getConnection();
    // 1. DB 연결을 얻고 트랜잭션 시작
    await conn.beginTransaction();

    // 2. 데이터베이스에서 마지막 주문번호 조회
    const [lastOrderRow] = await conn.query(sqlList.SelectMaxOrdNo);
    // 3. 시퀀스를 사용하지 않고 고유코드생성
    let newOrderId;
    if (lastOrderRow && lastOrderRow.max_ord_no) {
      // 'ord20250813-001' -> '001' -> 1 -> 2 -> '002' -> 'ord20250813-002'
      const lastNum = parseInt(lastOrderRow.max_ord_no.split("-")[1], 10);
      const newNum = lastNum + 1;
      const formattedNum = String(newNum).padStart(3, "0");
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // '20250813'
      newOrderId = `ord${today}-${formattedNum}`;
    } else {
      // 주문이 없을 경우 'ordYYYYMMDD-001'로 시작
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      newOrderId = `ord${today}-001`;
    }

    // 4. 마스터 테이블인 production_order 테이블에 데이터 삽입
    await conn.query(sqlList.insertPrdOrder, [newOrderId, director]);
    // 5. 1개 또는 1개이상의 배열인경우 판단하여 반환
    const detailsArray = Array.isArray(details) ? details : [details];
    // 6. for문을 돌며 prd_order_detail에 데이터 삽입
    for (const info of detailsArray) {
      // const formattedStartDate = formatToDatabaseDatetime(info.p_st_date);
      // const formattedEndDate = formatToDatabaseDatetime(info.p_ed_date);
      // 1건 또는 여러 건의 지시를 모두 처리
      // 가져온 생산계획코드를 임시 저장
      const detailPlanNo = info.plan_detail_no || plan_detail_no || null;
      const insertedDetail = [
        // formattedStartDate,
        // formattedEndDate,
        info.p_st_date,
        info.p_ed_date,
        info.prd_noworder_qty,
        info.line_id,
        info.product_name,
        newOrderId,
        detailPlanNo,
        info.specification,
        info.unit,
        info.prd_form,
        info.product_id,
      ];

      await conn.query(sqlList.insertPrdOrderDetail, insertedDetail);
    }
    await conn.query(sqlList.insertPrdFlow, [newOrderId]);
    // 7. 모든 작업이 성공하면 커밋
    await conn.commit();
    return { success: true, message: "작업 지시가 성공적으로 등록되었습니다." };
  } catch (error) {
    // 8. 중간에 오류가 발생하면 롤백
    if (conn) await conn.rollback();
    throw error;
  } finally {
    // 9. 연결 해제
    if (conn) conn.release();
  }
};

// const insertProductionFlow = async () => {
//   let conn;
//   try {
//     conn = await getConnection();
//     await conn.query(sqlList.insertPrdFlow);
//     await conn.commit();
//     return {
//       success: true,
//       message: "공정흐름도가 성공적으로 등록되었습니다.",
//     };
//   } catch (error) {
//     // 8. 중간에 오류가 발생하면 롤백
//     if (conn) await conn.rollback();
//     throw error;
//   } finally {
//     // 9. 연결 해제
//     if (conn) conn.release();
//   }
// };

const selectPrcList = async () => {
  let conn;
  try {
    conn = await getConnection();
    let list = await conn.query(sqlList.selectProcessList);
    console.log(list);
    return list;
  } catch (error) {
    throw error;
  } finally {
    // 9. 연결 해제
    if (conn) conn.release();
  }
};
const selectOrderList = async () => {
  let conn;
  try {
    conn = await getConnection();
    const list = await conn.query(sqlList.selectOrderList);
    // let list= await conn.query(sqlList.selectOrderList);
    // const했을땐 단일행만 반환하다가 let으로 변경하니 나왔는데 갑자기 또 const로 선언해도 리스트 잘나옴 버근가
    console.log("생산 지시 목록 조회 결과:", list);

    // 날짜 형식을 데이터베이스에 맞게 변환
    return list;
  } catch (error) {
    throw error;
  } finally {
    // 9. 연결 해제
    if (conn) conn.release();
  }
};
// 실적이 등록되지 않은 공정 리스트
const notRegistPrcList = async () => {
  let conn;
  try {
    conn = await getConnection();
    const list = await conn.query(sqlList.notRegistPrcList);
    console.log("등록되지 않은 공정 목록 조회 결과:", list);
    return list;
  } catch (error) {
    throw error;
  } finally {
    if (conn) conn.release();
  }
};
// 실적 등록
const insertPerform = async (payload) => {
  let conn;
  try {
    conn = await getConnection();
    const values = [
      payload.wo_no,
      //payload.pf_code,
      payload.e_name,
      payload.process_id,
      payload.in_qty,
      payload.line_id,
      payload.product_id,
      payload.prd_name,
      payload.specification,
      payload.unit,
      payload.eq_code,
      formatToDatabaseDatetime(payload.w_st_date),
    ];
    const result = await conn.query(sqlList.insertPerform, values);
    if (result) {
      console.log("실적 등록에 성공하였습니다.");
      await conn.commit();
    } else {
      console.log("실적 등록에 실패하였습니다.", result.data);
    }
  } catch (error) {
    throw error;
  } finally {
    if (conn) conn.release();
  }
};
// 등록된 실적데이터데 작업종료일시 등록
const updatePerform = async (payload) => {
  let conn;
  try {
    conn = await getConnection();
    const values = [
      payload.status,
      payload.qty,
      formatToDatabaseDatetime(payload.w_ed_date),
      payload.wo_no, // 조건으로 사용
    ];
    const result = await conn.query(sqlList.updatePerform, values);
    if (result) {
      console.log("실적 수정에 성공하였습니다.");
      await conn.commit();
    } else {
      console.log("실적 수정에 실패하였습니다.", result.data);
    }
  } catch (error) {
    throw error;
  } finally {
    if (conn) conn.release();
  }
};
// 실적 등록시 이전에 등록된 작업자 이름을 조회
const selectEname = async (wo_no, process_id) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.query(sqlList.selectEname, [wo_no, process_id]);
    if (result.length > 0) {
      return result[0].e_name; // 첫 번째 행의 e_name 반환
    } else {
      return null; // 결과가 없을 경우 null 반환
    }
  } catch (error) {
    throw error;
  } finally {
    if (conn) conn.release();
  }
};
// 실적등록시 이전 공정중인지 체크
const checkWoStatus = async (wo_no) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.query(sqlList.selectStatusCheck, [wo_no]);
    const { in_progress_count, completed_count } = result[0];
    // 상태를 결정하는 로직
    if (in_progress_count > 0) {
      return "진행";
    } else if (completed_count > 0) {
      return "완료";
    } else {
      return "대기";
    }
  } catch (error) {
    throw error;
  } finally {
    if (conn) conn.release();
  }
};

const findAllOrder = async () => {
  let list = await mariadb.query("selectAllOrder");
  return list;
};
// BOM 요청 등록
const bomRequestInsert = async (details) => {
  let conn;
  try {
    conn = await getConnection();

    // details 배열의 각 항목을 순회
    for (const detail of details) {
      const { req_qty, bom_id } = detail;

      // 여기서 `sqlList.insertRequestBom` 쿼리에 필요한 값들을 순서대로 전달합니다.
      // 쿼리에 물음표가 두 개라면 [req_qty, bom_id]를 전달
      await conn.query(sqlList.insertRequestBom, [req_qty, bom_id]);
    }

    await conn.commit();
    console.log("BOM 요청이 성공적으로 등록되었습니다.");
    return { success: true, message: "BOM 요청이 성공적으로 등록되었습니다." };
  } catch (error) {
    // 오류 발생 시 롤백
    if (conn) await conn.rollback();
    console.error("BOM 요청 등록에 실패하였습니다.", error);
    throw error;
  } finally {
    if (conn) conn.release();
  }
};
// 작업 지시 목록 출력
const productionOrderList = async () => {
  let conn;
  try {
    conn = await getConnection();
    const list = await conn.query(sqlList.productionOrderList);
    console.log("생산 계획 상세 목록 조회 결과:", list);
    return list;
  } catch (error) {
    throw error;
  } finally {
    if (conn) conn.release();
  }
};
// 모달인듯?
const selectProcessList = async () => {
  let conn;
  try {
    conn = await getConnection();
    const list = await conn.query(sqlList.selectProcessingList);
    console.log("공정 조회 결과:", list);
    return list;
  } catch (error) {
    throw error;
  } finally {
    if (conn) conn.release();
  }
};
// 필터링되지 않은 공정리스트 출력
const selectProcessNotSearchList = async () => {
  let conn;
  try {
    conn = await getConnection();
    const list = await conn.query(sqlList.selectProcessNotSearchList);
    console.log("공정 조회 결과:", list);
    return list;
  } catch (error) {
    throw error;
  } finally {
    if (conn) conn.release();
  }
};
// 실적조회 페이지 필터링
const filterPerformance = async (payload) => {
  let conn;
  try {
    conn = await getConnection();
    const dateValues = [
      payload.w_ed_date || null,
      payload.nextDay || null,
      payload.w_ed_date || null,
    ];
    const otherValues = [
      payload.process_id || null,
      payload.process_id || null,

      payload.line_id || null,
      payload.line_id || null,

      payload.e_name || null,
      payload.e_name || null,

      payload.product_type || null,
      payload.product_type || null,

      payload.product_form || null,
      payload.product_form || null,
    ];
    const values = [...dateValues, ...otherValues];
    const list = await conn.query(sqlList.filterPerformance, values);
    console.log("최종 파라미터:", values);
    console.log("필터링된 실적 조회 결과:", list);
    return list;
  } catch (error) {
    throw error;
  } finally {
    console.log("최종 SQL:", sqlList.filterPerformance);

    if (conn) conn.release();
  }
};
// 제품 리스트 모달창 데이터
const productListModal = async () => {
  let conn;
  try {
    conn = await getConnection();
    const list = await conn.query(sqlList.productListModal);
    console.log("제품 목록 조회 결과:", list);
    return list;
  } catch (error) {
    throw error;
  } finally {
    if (conn) conn.release();
  }
};

// 생산 계획 등록
const insertPlan = async (payload) => {
  let conn;
  try {
    conn = await mariadb.getConnection();
    await conn.beginTransaction();

    // 1 마지막 plan_no 조회
    const rows = await conn.query(`
      SELECT plan_no
        FROM production_plan
       ORDER BY plan_no DESC
       LIMIT 1
    `);

    const lastPlanNo = rows?.[0]?.plan_no || null;
    let masterPlanId;

    if (lastPlanNo) {
      const numPart = parseInt(lastPlanNo.split("-")[1], 10);
      masterPlanId = `PNO${new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "")}-${String(numPart + 1).padStart(5, "0")}`;
    } else {
      masterPlanId = `PNO${new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "")}-00001`;
    }
    console.log("생성될 마스터 plan_no:", masterPlanId);

    // 2 마스터 insert
    await conn.query(sqlList.insertMasterPlan, [
      masterPlanId,
      payload.planType,
      payload.planDate,
      payload.planStartDate,
      payload.planEndDate,
      payload.dueDate,
      payload.director,
    ]);

    // 3 디테일 insert 반복
    for (const detail of payload.products) {
      const {
        productCode,
        productname,
        productType,
        specification,
        unit,
        lineId,
        productPlanQty,
        plannedQty,
      } = detail;

      await conn.query(sqlList.insertDetailPlan, [
        productCode,
        productname,
        productType,
        specification,
        unit,
        lineId,
        productPlanQty,
        plannedQty,
        masterPlanId, // 🔑 FK로 마스터 plan_no 전달
      ]);
    }

    await conn.commit();
    console.log("마스터 + 디테일 등록 완료");
  } catch (err) {
    if (conn) await conn.rollback();
    console.error("등록 실패 :", err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

const fetchPlanList = async () => {
  let conn;
  try {
    conn = await getConnection();
    const list = await conn.query(sqlList.fetchPlanList);
    console.log("생산계획 목록 조회 결과:", list);
    return list;
  } catch (error) {
    throw error;
  } finally {
    if (conn) conn.release();
  }
};
// const insertPlan = async (payload) =>{
//    let conn;
//   try {
//     conn = await getConnection();
//     // 트랜잭션 시작
//     await conn.beginTransaction();
//     const masterVal = [
//       payload.planType,
//       payload.planDate,
//       payload.planStartDate,
//       payload.planEndDate,
//       payload.dueDate,
//       payload.director,
//     ];
//     const resultmaser = await conn.query(sqlList.insertMasterPlan, masterVal);
//     let masterPlanId = resultmaser.plan_no;
//     console.log('만들어진 생산계획 번호 : ',resultmaser);
//     for (const detail of payload.products) {
//       const {
//         productCode,
//         productname,
//         productType,
//         specification,
//         unit,
//         lineId,
//         productPlanQty,
//         plannedQty,
//       } = detail;

//       // 여기서 `sqlList.resultdetail` 쿼리에 필요한 값들을 순서대로 전달합니다.
//       // 쿼리에 물음표 갯수마다 [? , ?] 전달
//      await conn.query(sqlList.insertDetailPlan, [
//         productCode,
//         productname,
//         productType,
//         specification,
//         unit,
//         lineId,
//         productPlanQty,
//         plannedQty,
//         masterPlanId
//       ]);
//     }

//     if (resultmaser) {
//       console.log("계획 등록에 성공하였습니다.");
//       await conn.commit();
//     } else {
//       console.log("계획 등록에 실패하였습니다.", resultmaser.data);
//     }
//   } catch (error) {
//     if (conn) await conn.rollback();
//     throw error;
//   } finally {
//     if (conn) conn.release();
//   }
// };

module.exports = {
  findAllOrder,
  startWork,
  //  insertProductionFlow
  selectOrderList,
  notRegistPrcList,
  insertPerform,
  updatePerform,
  selectEname,
  checkWoStatus,
  bomRequestInsert,
  productionOrderList,
  selectProcessList,
  selectProcessNotSearchList,
  filterPerformance,
  productListModal,
  insertPlan,
  fetchPlanList,
};
