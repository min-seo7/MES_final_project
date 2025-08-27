const testSql = {
  // 검사항목조회
  selectItem: `
        SELECT testitem_code, 
        product_type, 
        item_name, 
        unit, 
        fixedStandard, 
        createdBy, 
        DATE_FORMAT(createdAt, '%Y-%m-%d'),
        purpose_name, 
        purpose_id
FROM testitem
ORDER BY testitem_code DESC`,
  // 검사항목 필터링조회
  selectItemdetail: `
      SELECT
        testitem_code,
        product_type,
        item_name,
        unit,
        fixedStandard,
        purpose_name,
        createdBy,
        DATE_FORMAT(createdAt, '%Y-%m-%d') AS createdAt
      FROM testitem
      WHERE (? IS NULL OR product_type = ?)
        AND (? IS NULL OR purpose_name = ?)
      ORDER BY testitem_code DESC`,

  // 검사항목등록
  insertItem: `
        INSERT INTO testitem(product_type, 
        item_name,
        unit,
        fixedStandard,
        createdBy,
        purpose_name,
        purpose_id)
        VALUES(?,?,?,?,?,?,?)
        `,

  // 자재 입고검사 대기목록
  selectInspecWaitList: `
        SELECT
            P.seq AS 자재검수번호, 
            PD.pur_no AS 발주번호,
            PD.purch_id AS 구매번호,       
            PD.material_id AS 자재코드,   
            PD.pur_qty AS 수량_EA,         
            PD.comm AS 메모,
            P.manager AS 담당자,
            mat.material_name AS 자재명,
            DATE_FORMAT(P.due_date, '%Y-%m-%d') AS 등록날짜,
            PD.inspStatus AS 상태      
        FROM
            tbl_purchase_detail AS PD
        INNER JOIN
            tbl_purchase AS P
        ON
            PD.pur_no = P.pur_no
        INNER JOIN material as mat
        ON PD.material_id = mat.material_id
        WHERE PD.inspStatus= '대기' 
        ORDER BY P.due_date DESC`,

  // 자재 입고검사 완료목록
  selectInspecFinList: `
        SELECT 
        materialOrder_num AS 검수번호,
        purch_id AS 구매번호,
        material_code AS 자재코드,
        mat.material_name AS 자재명,
        insertquantity AS 수량_EA,
        DATE_FORMAT(createdAt,'%Y-%m-%d') AS 등록날짜,
        result AS 검사결과,
        DATE_FORMAT(inspection_date, '%Y-%m-%d') AS 검사완료날짜
    FROM material_Inspection MI
    LEFT JOIN material mat ON MI.material_code = mat.material_id
    WHERE (? IS NULL OR purch_id LIKE CONCAT('%', ?, '%'))
      AND (? IS NULL OR material_code LIKE CONCAT('%', ?, '%'))
    ORDER BY materialOrder_num DESC`,

  // 제품품질검사 대기목록
  selectpdInspecWaitList: `
        SELECT 
            pf_code AS 실적코드,
            product_id AS 제품코드,
            prd_name AS 제품명,
            qty AS 생산수량,
            DATE_FORMAT(w_ed_date, '%Y-%m-%d') AS 실적등록날짜,
            '대기' AS 상태
        FROM performance
        WHERE 
            inspStatus = '대기' AND 
            process_id IN ('PR010', 'PR013', 'PR019')
        `,
  // 제품 품질 검사 완료 목록
  selectPrdTestFinList: `SELECT
        T1.pf_code AS 실적코드,
        T1.product_id AS 제품코드,
        T1.prd_name AS 제품명,
        T1.result AS 검사결과,
        T1.qty AS 생산수량,
        T1.inspector_id AS 검사자,
        DATE_FORMAT(T2.w_ed_date, '%Y-%m-%d') AS 실적등록날짜,
        DATE_FORMAT(T1.createdAt, '%Y-%m-%d') AS 검사완료날짜
      FROM product_inspection T1
      INNER JOIN performance T2
      ON T1.pf_code = T2.pf_code
      WHERE (? IS NULL OR T1.pf_code LIKE CONCAT('%', ?, '%'))
        AND (? IS NULL OR T1.product_id LIKE CONCAT('%', ?, '%'))
      ORDER BY T1.pf_code DESC`,
  // 제품 품질 검사 상세 내역 조회
  selectPrdTestDetail: `
        SELECT 
            item_name AS 검사항목, 
            measuredValue AS 측정값, 
            judgment AS 판정,
            fixedStandard AS 허용범위
        FROM product_inspection_detail
        WHERE pf_code = ?`,
  // 제품 품질 검사 등록 (INSERT)
  insertPrdInsp: `
        INSERT INTO product_inspection (
            pf_code,
            product_id,
            prd_name,
            result,
            qty,
            remark,
            inspector_id,
            createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
  // 제품 품질 검사 상세 내역 등록 (INSERT)
  insertPrdInspDetail: `
        INSERT INTO product_inspection_detail (
            pf_code,
            item_name,
            fixedStandard,
            measuredValue,
            judgment
        ) VALUES (?, ?, ?, ?, ?)`,
  // Performance 테이블 상태 업데이트
  updatePrdStatus: `
        UPDATE performance
        SET inspStatus = '완료'
        WHERE pf_code = ?`,
  // 검사등록 (material)
  insertInsp: `
        INSERT INTO material_Inspection (
            material_code,
            inspection_date,
            inspector_id,
            result,
            remark,
            createdAt,
            purch_id,
            insertquantity,
            qty,
            inspStatus
        ) VALUES (?, NOW(), ?, ?, ?, NOW(), ?, ?, ?, ?)`,

  // tbl_purchase_detail테이블 조회
  selectPD: `
        SELECT *
        FROM tbl_purchase_detail`,

  // 합불판정update
  defUpdate: `
        UPDATE tbl_purchase_detail
        SET inspStatus = '완료'
        WHERE inspStatus = '대기' AND purch_id = ?`,

  // 검사항목 삭제
  deleteTestItem: `
        DELETE FROM testitem
        WHERE testitem_code = ?`,
  // 검사항목
  getProductTypes: `SELECT code, name as Type FROM product_type`,
  getInspPurposes: `SELECT code, name as Type FROM insp_purpose`,
  getInspItems: `SELECT code, name as Type FROM insp_item`,
  getOperators: `SELECT code, symbol as Type FROM operator_type`,
  getUnits: `SELECT code, name as Type FROM unit_type`,

  // 제품유형별검사항목조회
  selectTestItemByProductType: `
        SELECT *
        FROM testitem
        WHERE product_type IN (SELECT product_name FROM product WHERE product_id = ?)`,
};

module.exports = testSql;
