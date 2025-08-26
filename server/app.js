// app.js ?�정??
require("dotenv").config({ path : './.env'});
const express = require("express");
const cors = require("cors");
const app = express();
const session = require("express-session");
const path = require("path");

// 1. 미들?�어 ?�정 (CORS, body-parser)
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.CLIENT_URL], // ?�� 배포 주소�?ENV ?�일?�서 가?�오?�록 ?�정
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// 2. ?�션 미들?�어 ?�정 (모든 ?�우???�에 ?�치)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // 배포 ?�에�?true
      maxAge: 3600000,
    },
  })
);

// 3. ?�우???�일 require
const informationRouter = require("./routers/information_router.js");
const salesRouter = require("./routers/sales_router.js");
const stockRouter = require("./routers/stock_router.js");
const productionRouter = require("./routers/production_router.js");
const equipmentRouter = require("./routers/equipment_router.js");
const testRouter = require("./routers/test_router.js");
const modalRouter = require("./routers/modal_router.js");

// 4. API ?�우???�록
app.use("/api/information", informationRouter);
app.use("/api/sales", salesRouter);
app.use("/api/stock", stockRouter);
app.use("/api/production", productionRouter);
app.use("/api/equipment", equipmentRouter);
app.use("/api/test", testRouter);
app.use("/api/modal", modalRouter);

// 5. ?�적 ?�일 ?�빙 ?�거 (Nginx가 ?�당)
// 만약 Nginx�??�용?�다�??�래 코드???�거?�거??주석 처리?�는 것이 좋습?�다.
// const publicPath = path.join(__dirname, "public");
// app.use(express.static(publicPath));

// 6. Vue ?�우???�?�드카드 ?�거 (Nginx가 ?�당)
// Nginx가 모든 ?�청??index.html�?보내주�?�?Express?�서 index.html??직접 ?�빙?�는 것�? 불필?�합?�다.
// app.get("/", function (req, res, next) { ... });
// app.use((req, res) => { ... });

// 5. ?�적 ?�일 ?�빙 추�? (public ?�더 ?�의 ?�적 ?�일)
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// 6. Vue ?�우???�?�드카드 추�? (Nginx ?�용 ??충돌 가?�성 ?�음)
// API ?�우???�의 모든 ?�청??index.html�?리디?�션?�여 Vue Router가 처리?�게 ?�니??
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"), (err) => {
    if (err) {
      console.error("Failed to send index.html:", err);
      res.status(500).send("Internal Server Error");
    }
  });
});

// 7. ?�버 ?�행
app.listen(3000, () => {
  console.log("server start");
  console.log("http://localhost:3000");
});
