// 사원번호 모달 조회
const selectEmployeeIdModal = `
SELECT employee_id,
       name,
       department,
       auth,
       status
FROM employee`;

// 창고조회
const selectWarehouse = `
 SELECT warehouse_id,
        warehouse,
        zone,
        sub_zone,
        floor,
        location,
        warehouse_type,
        status
FROM warehouse`;

// 창고등록
const insertWarehouse = `
INSERT INTO warehouse (warehouse_id,
			warehouse,
			zone,
			sub_zone,
			floor,
			location,
			warehouse_type,
			status)
VALUES (?,?,?,?,?,?,?,?)`;

// 창고수정
const updateWarehouse = `
UPDATE warehouse
SET warehouse = ?,
    zone = ?,
    sub_zone = ?,
    floor = ?,
    location = ?,
    warehouse_type = ?,
    status = ?
WHERE warehouse_id = ?`;

// 제품조회
const selectProduct = `
SELECT product_id,
       product_type,
       product_form,
       product_name,
       specification,
       unit,
       expiration_date,
       expiration_date_unit,
       storage_condition,
       safety_stock,
       safety_stock_unit,
       product_manual,
       status
FROM product`;

// 제품등록
const insertProduct = `
INSERT INTO product (product_id,
			product_type,
			product_form,
			product_name,
			specification,
			unit,
			expiration_date,
			expiration_date_unit,
			storage_condition,
			safety_stock,
			safety_stock_unit,
			product_manual,
			status)
VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;

// 제품수정
const updateProduct = `
UPDATE product
SET product_type = ?,
    product_form = ?,
    product_name = ?,
    specification = ?,
    unit = ?,
    expiration_date = ?,
    expiration_date_unit = ?,
    storage_condition = ?,
    safety_stock = ?,
    safety_stock_unit = ?,
    product_manual = ?,
    status = ?
WHERE  product_id = ?`;

// 자재 조회
const selectMaterial = `
SELECT material_id,
       material_name,
       material_type,
       specification,
       unit,
       storage_condition,
       safety_stock,
       safety_stock_unit,
       status
FROM material`;

// 자재 등록
const insertMaterial = `
INSERT INTO material (material_id
                      , material_name
                      , material_type
                      , specification
                      , unit
                      , storage_condition
                      , safety_stock
                      , safety_stock_unit
                      , status)
VALUES (?,?,?,?,?,?,?,?,?)`;

// 자재 수정
const updateMaterial = `
UPDATE material
SET  material_name = ?
     , material_type = ?
     , specification = ?
     , unit = ?
     , storage_condition = ?
     , safety_stock = ?
     , safety_stock_unit = ?
     , status = ?
WHERE material_id = ?`;

// 거래처 조회
const selectPartner = `
SELECT partner_id
       , partner_type
       , partner_name
       , manager
       , main_tel
       , email
       , address
       , business_no
       , status
FROM partner`;

// 거래처 등록
const insertPartner = `
INSERT INTO partner (partner_id,
                      partner_type,
                      partner_name,
                      manager,
                      main_tel,
                      email,
                      address,
                      business_no,
                      status)
VALUES (?,?,?,?,?,?,?,?,?)`;

// 거래처 수정
const updatePartner = `
UPDATE partner
SET  partner_type = ?,
     partner_name = ?,
     manager = ?,
     main_tel = ?,
     email = ?,
     address = ?,
     business_no = ?,
     status = ?
WHERE partner_id = 'SUP001'`;

// 흐름도 조회
const selectFlowchart = `
SELECT f.flow_id
       , f.flow_name
       , f.product_id
       , p.product_name
       , f.note
       , DATE_FORMAT(f.create_date, '%Y-%m-%d') as create_date
       , f.status
FROM flowchart f INNER JOIN product p
			ON f.product_id = p.product_id
 `;

// 흐름도 등록
const insertFlowchart = `
INSERT INTO flowchart (flow_id,
                       flow_name,
                       product_id,
                       note,
                       status)
VALUES (?,?,?,?,?)`;

// 흐름도 수정
const updateFlowchart = `
UPDATE flowchart
SET flow_name = ?,
    product_id = ?,
    note = ?,
    status = ?
WHERE flow_id = ?`;

// 흐름도 detail 조회
const selectDetailFlowchart = `
SELECT f.process_id
       , p.process_name
       , f.use_order
       , f.status
FROM flowchart_detail f INNER JOIN process p
                   ON f.process_id = p.process_id`;

// 흐름도 detail 등록
const insertDetailFlowchart = `
INSERT INTO flowchart_detail (flow_id,
                              process_id,
                              use_order,
                              status)
VALUES ('flow001',?,?,?)`;

// 흐름도 detail 수정
const updateDetailFlowchart = `
UPDATE flowchart_detail 
SET process_id = ?,
    use_order = ?,
    status = ?
WHERE flow_id = ?`;

// 라인 detail 조회
const selectDetailLine = `
SELECT l.process_id
       , p.process_name
       , l.equipment_id
       , e.equipment_name
       , l.use_order
       , l.status
FROM line_detail l INNER JOIN process p
			ON l.process_id = p.process_id
            INNER JOIN equipment e
            ON l.equipment_id = e.equipment_id`;

// 라인 detail 등록
const insertDetailLine = `
INSERT INTO line_detail (line_id, 
                          equipment_id, 
                          process_id, 
                          use_order, 
                          status)
VALUES ('line001',?,?,?,?);`;

// 라인 detail 수정
const updateDetailLine = `
UPDATE line_detail
SET equipment_id = ?,
    process_id = ?,
    use_order = ?,
    status = ?`;

// 라인조회
const selectLine = `
SELECT l.line_id
		, l.line_name
        , l.flow_id
        , f.flow_name
        , l.product_id
        , p.product_name
        , l.note
        , DATE_FORMAT(l.created_date, '%Y-%m-%d') as created_date
        , l.status
FROM line l INNER JOIN product p
	        ON l.product_id = p.product_id
            INNER JOIN flowchart f
            ON l.flow_id = f.flow_id`;

// 라인등록
const insertLine = `
INSERT INTO line (line_id,
                  line_name,
                  flow_id,
                  product_id,
                  note,
                  status)
VALUES (?,?,?,?,?,?)`;

// 라인수정
const updateLine = `
UPDATE line
SET line_name = ?,
    flow_id = ?,
    product_id = ?,
    note = ?,
    status = ?
WHERE line_id = ?`;

// 공정등록
const insertProcess = `
 INSERT INTO process (process_id,
					            process_name,
                      is_inspection,
                      status)
VALUES (?,?,?,?)
`;

// 공정조회
const selectProcess = `
SELECT process_id,
       process_name,
       is_inspection,
       status
FROM process`;

// 공정수정
const updateProcess = `
UPDATE process
SET process_name = ?, 
    is_inspection = ?, 
    status = ?
WHERE process_id = ?`;

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
     where b.bom_id = 'bom004'`;

// BOM코드 조회
const SelectMaxBOMId = `
SELECT MAX(bom_id) AS max_bom_id
FROM bom
`;

// bom등록
const insertBOM = `
INSERT INTO bom(bom_id,
                product_id,
                status)
VALUES (?,?,?)
`;

// bom detail 등록
const insertDetailBOM = `
INSERT INTO bom_detail(bom_id,
                       material_id,
                       unit,
                       mix_ratio,
                       required_qty,
                       total_qty,
                       status)
VALUES (?,?,?,?,?,?,?)
`;

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
FROM employee
WHERE 1=1
  AND employee_id = COALESCE(?, employee_id)
  AND department = COALESCE(?, department)
  AND auth = COALESCE(?, auth)
  AND status = COALESCE(?, status)
`;

module.exports = {
  insertEmployee,
  selectEmployeeList,
  selectBomList,
  selectBomDetail,
  insertProcess,
  selectProcess,
  updateProcess,
  insertBOM,
  insertDetailBOM,
  SelectMaxBOMId,
  selectLine,
  insertLine,
  updateLine,
  selectDetailLine,
  insertDetailLine,
  updateDetailLine,
  selectFlowchart,
  selectDetailFlowchart,
  insertFlowchart,
  insertDetailFlowchart,
  updateFlowchart,
  updateDetailFlowchart,
  selectPartner,
  insertPartner,
  updatePartner,
  selectMaterial,
  insertMaterial,
  updateMaterial,
  selectProduct,
  insertProduct,
  updateProduct,
  selectWarehouse,
  insertWarehouse,
  updateWarehouse,
  selectEmployeeIdModal,
};
