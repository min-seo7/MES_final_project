const insertPerform = `
insert into performance(pf_code , wo_no , p_st_date , p_ed_date, eq_code, eq_name, prc_code , prc_name , in_qty , d_cty, qty , line_id, prd_name , e_name, w_st_date, w_ed_date)
values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
`;

module.exports = { insertPerform };
