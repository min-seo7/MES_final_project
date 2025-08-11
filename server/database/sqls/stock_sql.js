//원자재(모달용)
let matListQuery = `SELECT material_id, 
	               material_name,
	               material_type,
                      unit       
               FROM material
               WHERE status = '활성'
               AND material_type = '원자재'`;

//공급거래처 모달
let suppliesPartnerList = ``;

//제품(모달용)
let productListQuery = `SELECT product_id, 
                          product_type,
                          product_name
                   FROM product
                   WHERE status = '활성'`;


//발주
//마스터T 기본정보 등록
let masterInfoQuery = `INSERT INTO tbl_purchase (partner_id, re_date, due_date, manager)
                  VALUES (?, ?, ?, ?)`;

let subInfoQuery = `INSERT INTO tbl_purchase_detail (material_id, pur_qty, comm, purchase_no)
               VALUES (?, ?, ?, ?)`;
module.exports = { matListQuery, productListQuery, masterInfoQuery, subInfoQuery};
