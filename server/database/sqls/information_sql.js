// bom 조회
const selectBomList = `
SELECT b.bom_id,
       b.product_id,
       p.product_name,
       p.product_type,
       DATE_FORMAT(b.created_date, '%Y-%m-%d') as created_date,
       b.status
FROM bom b 
	     INNER JOIN product p
       ON b.product_id = p.product_id`;

// bom detail 조회
const selectBomDetail = `
SELECT m.material_id,
       m.material_name,
       b.unit,
       b.mix_ratio,
       b.required_qty,
       b.total_qty,
       b.status
FROM bom_detail b
	 INNER JOIN material m
     ON b.material_id = m.material_id
     where b.bom_id = 'bom001'`;
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
       DATE_FORMAT(hire_date, '%Y-%m-%d') as hire_date,
       DATE_FORMAT(leave_date, '%Y-%m-%d') as leave_date,
       auth,
       status,
       pw_change
FROM employee;
`;

module.exports = {
  insertEmployee,
  selectEmployeeList,
  selectBomList,
  selectBomDetail,
};
