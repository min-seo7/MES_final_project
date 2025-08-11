//원자재(모달용)
let matList = `SELECT material_id, 
	               material_name,
	               material_type,
                      unit       
               FROM material
               WHERE status = '활성'
               AND material_type = '원자재'`;

//공급거래처 모달
let suppliesPartnerList = ``;

//제품(모달용)
let productList = `SELECT product_id, 
                          product_type,
                          product_name
                   FROM product
                   WHERE status = '활성'`;

module.exports = { matList, productList };
