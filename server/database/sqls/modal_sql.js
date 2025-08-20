// getEmployeeId
const selectEmployeeIdModal = `
SELECT employee_id,
       name,
       department,
       auth,
       status
FROM employee`;

//로그인
const loginQuery = `SELECT employee_id,
       login_pw,
       name,
       auth,
       pw_change
FROM employee
where employee_id = ?`;

module.exports = {
  selectEmployeeIdModal,
  loginQuery,
};
