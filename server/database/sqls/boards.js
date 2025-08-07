//Table : t_board_board

//조건없이 전체조회
const selectBoardList = `
SELECT  no,
	      title,
        writer,
        content,
        created_date
FROM t_board_board
ORDER BY no
`;

//등록
const boardInsert = `
INSERT  INTO t_board_board (title, writer, content)
VALUES (?,?,?)
`;

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
  selectBoardList,
  boardInsert,
  insertEmployee,
  selectEmployeeList,
};
