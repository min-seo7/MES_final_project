const express = require("express");
const router = express.Router();

const productionService = require("../services/production_service.js");

const findInspectionList = async () => {
  let list = await mariadb.query("selectFlowchart");
  return list;
};

module.exports = router;
