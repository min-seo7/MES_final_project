
// 사원등록
const insertEmployee = `
INSERT INTO employee(employee_id,
                    name,
                    department,
                    phone,
                    email,
                    hire_date,
                    leave_date,
                    auth,
                    status)
VALUES (?,?,?,?,?,?,?,?,?)
`;

// 사원조회
const selectEmployeeList = `
SELECT employee_id,
       name,
       department,
       phone,
       email,
       login_pw,
       hire_date,
       leave_date,
       auth,
       status,
       pw_change
FROM employee;
`;

module.exports = {
  insertEmployee,
  selectEmployeeList,
};
