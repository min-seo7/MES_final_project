//app.js : 시작파일 -> 관련파일 끌어옴
const express = require("express");
const app = express();

// 2.미들웨어(제공하는 서비스 따라 제공.) 위치따라 몇개의 라우팅 동작 x 미들웨어 위 라우팅은 아래
// 컨텐트타입 다루면 body-parse
//json데이터 포맷은 get 사용x ,post or put
//get 방식 주고 받을때는 쿼리스트링
//application.
app.use(express.urlencoded({ extended: false }));
//application.json
app.use(express.json());

//server실행
app.listen(3000, () => {
  console.log("server start");
  console.log("http://localhost:3000");
});

// 3. 라우팅
const informationRouter = require("./routers/information_router.js");
const salesRouter = require("./routers/sales_router.js");
const stockRouter = require("./routers/stock_router.js");
const productionRouter = require("./routers/production_router.js");
const equipmentRouter = require("./routers/equipment_router.js");
const testRouter = require("./routers/test_router.js");

//기본라우팅
app.get("/", (req, res) => {
  res.send("Welcome!!");
});

app.use("/api/information", informationRouter);
app.use("/api/sales", salesRouter);
app.use("/api/stock", stockRouter);
app.use("/api/production", productionRouter);
app.use("/api/equipment", equipmentRouter);
app.use("/api/test", testRouter);
