//const mariadb = require("../database/mapper.js");
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
      ];
      await conn.query(sqlList.insertPrdOrderDetail, insertedDetail);
    }

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
const selectProcessList = async () => {
  let list = await query(sqlList.selectProcessList); 
  return list;
};

module.exports = { startWork , selectProcessList};
