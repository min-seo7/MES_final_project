// 사원번호 모달 조회
const selectEmployeeIdModal = `
SELECT employee_id,
       name,
       department,
       auth,
       status
FROM employee`;

const selectFlowchartNameModal = `
SELECT flow_name
FROM flowchart`;

const selectProductIdModal = `
SELECT product_id,
       product_name,
       product_type,
       product_form
FROM product`;

const selectWarehouseModal = `
SELECT warehouse
FROM warehouse`;

const selectLocationModal = `
SELECT location
FROM warehouse`;

const selectWarehouseTypeModal = `
SELECT warehouse_type
FROM warehouse`;

const selectProductNameModal = `
SELECT product_name,
       product_id,
       product_type,
       product_form
FROM product`;

const selectProcessIdModal = `
SELECT process_id,
       process_name
FROM process`;

const selectLineNameModal = `
SELECT line_name
FROM line`;

const selectEquipmentIdModal = `
SELECT equipment_id,
       equipment_name
FROM equipment`;

const selectMaterialNameModal = `
SELECT material_name,
       material_id,
       material_type
FROM material`;

const selectProcessNameModal = `
SELECT process_name
FROM process`;

// 거래처명 모달 조회
const selectPartnerName = `
SELECT distinct partner_name
FROM partner`;

// 창고조회
const selectWarehouseList = `
 SELECT warehouse_id,
        warehouse,
        zone,
        sub_zone,
        floor,
        location,
        warehouse_type,
        status
FROM warehouse
WHERE 1=1
  AND warehouse_id = COALESCE(?, warehouse_id)
  AND warehouse = COALESCE(?, warehouse)
  AND location = COALESCE(?, location)
  AND warehouse_type = COALESCE(?, warehouse_type)
  AND status = COALESCE(?, status)`;

// 마지막 창고id 조회
const selectMaxWarehouseId = `
  SELECT MAX(warehouse_id) AS max_WH_id
  FROM warehouse
  FOR UPDATE
`;

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
const selectProductList = `
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
       product_category,
       status
FROM product
WHERE 1=1
  AND product_id = COALESCE(?, product_id)
  AND product_name = COALESCE(?, product_name)
  AND product_type = COALESCE(?, product_type)
  AND product_form = COALESCE(?, product_form)
  AND status = COALESCE(?, status)`;

// 마지막 제품 ID 조회
const selectMaxProductId = `
  SELECT MAX(product_id) AS max_product_id
  FROM product
  FOR UPDATE
`;
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
			product_category,
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
    product_category = ?,
    status = ?
WHERE  product_id = ?`;

// 자재 조회
const selectMaterialList = `
SELECT material_id,
       material_name,
       material_type,
       specification,
       unit,
       storage_condition,
       safety_stock,
       safety_stock_unit,
       status
FROM material
WHERE 1=1
  AND material_id = COALESCE(?, material_id)
  AND material_name = COALESCE(?, material_name)
  AND status = COALESCE(?, status)`;

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

// 거래처 전체조회
const selectPartnerList = `
SELECT partner_id
       , partner_type
       , partner_name
       , manager
       , main_tel
       , email
       , address
       , business_no
       , status
FROM partner
WHERE 1=1
  AND partner_id = COALESCE(?, partner_id)
  AND partner_name = COALESCE(?, partner_name)
  AND partner_type = COALESCE(?, partner_type)
  AND status = COALESCE(?, status)
`;

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

// 마지막 partner_id 조회
const selectMaxPartnerId = `
  SELECT MAX(partner_id) AS max_partner_id
  FROM partner
  FOR UPDATE
`;

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
WHERE partner_id = ?`;

// 거래처 수정
const updateBom = `
UPDATE bom
SET  status = ?
WHERE bom_id = ?`;

// 사원 수정
const updateEmployee = `
UPDATE employee
SET  name = ?,
     department = ?,
     phone = ?,
     email = ?,
     hire_date = ?,
     leave_date = ?,
     auth = ?,
     status = ?
WHERE employee_id = ?`;

// 흐름도 조회
const selectFlowchartList = `
SELECT f.flow_id
       , f.flow_name
       , f.product_id
       , p.product_name
       , f.note
       , DATE_FORMAT(f.create_date, '%Y-%m-%d') as create_date
       , f.status
FROM flowchart f INNER JOIN product p
			ON f.product_id = p.product_id
WHERE 1=1
  AND f.flow_id = COALESCE(?, f.flow_id)
  AND f.flow_name = COALESCE(?, f.flow_name)
  AND f.product_id = COALESCE(?, f.product_id)
  AND p.product_name = COALESCE(?, p.product_name)
  AND f.status = COALESCE(?, f.status)
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
                   ON f.process_id = p.process_id
WHERE f.flow_id = ?`;

// 흐름도 detail 등록
const insertDetailFlowchart = `
INSERT INTO flowchart_detail (flow_id,
                              process_id,
                              use_order,
                              status)
VALUES (?,?,?,?)`;

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
            ON l.equipment_id = e.equipment_id
WHERE l.line_id = ?`;

// 라인 detail 등록
const insertDetailLine = `
INSERT INTO line_detail (line_id, 
                          equipment_id, 
                          process_id, 
                          use_order, 
                          status)
VALUES (?,?,?,?,?);`;

// 라인 detail 수정
const updateDetailLine = `
UPDATE line_detail
SET equipment_id = ?,
    process_id = ?,
    use_order = ?,
    status = ?`;

// 라인조회
const selectLineList = `
SELECT l.line_id
     , l.line_name
     , l.flow_id
     , f.flow_name
     , l.product_id
     , p.product_name
     , l.note
     , DATE_FORMAT(l.created_date, '%Y-%m-%d') AS created_date
     , l.status
FROM line l
INNER JOIN product p ON l.product_id = p.product_id
INNER JOIN flowchart f ON l.flow_id = f.flow_id
WHERE 1=1
  AND l.line_id   = COALESCE(?, l.line_id)
  AND l.line_name = COALESCE(?, l.line_name)
  AND EXISTS (
        SELECT 1
        FROM line_detail d
        WHERE d.line_id = l.line_id
          AND (? IS NULL OR d.process_id   = ?)
          AND (? IS NULL OR d.equipment_id = ?)
      )
  AND l.status = COALESCE(?, l.status)
`;

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

// 마지막 process_id 조회
const selectMaxProcessId = `
  SELECT MAX(process_id) AS max_process_id
  FROM process
  FOR UPDATE
`;

// 공정등록
const insertProcess = `
 INSERT INTO process (process_id,
					            process_name,
                      is_inspection,
                      status)
VALUES (?,?,?,?)
`;

// 공정조회
const selectProcessList = `
SELECT process_id,
       process_name,
       is_inspection,
       status
FROM process
WHERE 1=1
  AND process_id = COALESCE(?, process_id)
  AND process_name = COALESCE(?, process_name)
  AND status = COALESCE(?, status)`;

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
       ON b.product_id = p.product_id
WHERE 1=1
  AND b.bom_id = COALESCE(?, b.bom_id)
  AND p.product_name = COALESCE(?, p.product_name)
  AND p.product_type = COALESCE(?, p.product_type)
  AND b.status = COALESCE(?, b.status)`;

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
     where b.bom_id = ?`;

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

// 마지막 material_id 조회
const selectMaxMaterialId = `
  SELECT MAX(material_id) AS max_material_id
  FROM material
  FOR UPDATE
`;

// 마지막 line_id 조회
const selectMaxLineId = `
  SELECT MAX(line_id) AS max_line_id
  FROM line
  FOR UPDATE
`;

// 마지막 flow_id 조회
const selectMaxFlowId = `
  SELECT MAX(flow_id) AS max_flow_id
  FROM flowchart
  FOR UPDATE
`;

// 마지막 bom_id 조회
const selectMaxBOMId = `
  SELECT MAX(bom_id) AS max_bom_id
  FROM bom
  FOR UPDATE
`;

// 마지막 emp_id 조회
const selectMaxEmpId = `
  SELECT MAX(employee_id) AS max_emp_id
  FROM employee
  FOR UPDATE
`;




module.exports = {
  selectMaxMaterialId,
  updateBom,
  updateEmployee,
  selectWarehouseTypeModal,
  selectProductIdModal,
  selectWarehouseModal,
  selectLocationModal,
  selectProcessNameModal,
  selectMaterialNameModal,
  selectProcessIdModal,
  selectLineNameModal,
  selectEquipmentIdModal,
  selectProductNameModal,
  selectFlowchartNameModal,
  selectMaxEmpId,
  selectMaxBOMId,
  selectMaxFlowId,
  selectMaxLineId,
  selectMaxPartnerId,
  selectMaxProcessId,
  selectMaxProductId,
  selectMaxWarehouseId,
  insertEmployee,
  selectEmployeeList,
  selectBomList,
  selectBomDetail,
  insertProcess,
  selectProcessList,
  updateProcess,
  insertBOM,
  insertDetailBOM,
  SelectMaxBOMId,
  selectLineList,
  insertLine,
  updateLine,
  selectDetailLine,
  insertDetailLine,
  updateDetailLine,
  selectFlowchartList,
  selectDetailFlowchart,
  insertFlowchart,
  insertDetailFlowchart,
  updateFlowchart,
  updateDetailFlowchart,
  selectPartnerList,
  insertPartner,
  updatePartner,
  selectMaterialList,
  insertMaterial,
  updateMaterial,
  selectProductList,
  insertProduct,
  updateProduct,
  selectWarehouseList,
  insertWarehouse,
  updateWarehouse,
  selectEmployeeIdModal,
  selectPartnerName,
};
