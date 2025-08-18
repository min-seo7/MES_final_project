// getEmployeeId
const selectEmployeeIdModal = `
SELECT employee_id,
       name,
       department,
       auth,
       status
FROM employee`;

module.exports = {
  selectEmployeeIdModal,
};
