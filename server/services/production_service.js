const mariadb = require("../database/mapper.js");

const startWork = async (details) => {
  const result = [];
  console.log(details);
  for (const info of details) {
    const insertData = [
      info.p_st_date,
      info.p_ed_date,
      info.prd_noworder_qty,
      info.line_id,
      // info.status,
      info.product_name,
      info.plan_detail_no || null,
    ];
    const res = await mariadb.query("startWork", insertData);
    result.push(res);
  }
  return result;
};

// 객체를 배열로 변환하는 매서드
function convertToArray(obj, columns) {
  return columns.map((col) => obj[col]);
}

module.exports = { startWork };
