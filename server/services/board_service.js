const mariadb = require("../database/mapper.js");

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
};
