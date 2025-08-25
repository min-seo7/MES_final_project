// app.js 수정안

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const session = require("express-session");
const path = require("path");

// 1. 미들웨어 설정 (CORS, body-parser)
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.CLIENT_URL], // 🚨 배포 주소를 ENV 파일에서 가져오도록 수정
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// 2. 세션 미들웨어 설정 (모든 라우터 위에 위치)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // 배포 시에만 true
      maxAge: 3600000,
    },
  })
);

// 3. 라우터 파일 require
const informationRouter = require("./routers/information_router.js");
const salesRouter = require("./routers/sales_router.js");
const stockRouter = require("./routers/stock_router.js");
const productionRouter = require("./routers/production_router.js");
const equipmentRouter = require("./routers/equipment_router.js");
const testRouter = require("./routers/test_router.js");
const modalRouter = require("./routers/modal_router.js");

// 4. API 라우팅 등록
app.use("/api/information", informationRouter);
app.use("/api/sales", salesRouter);
app.use("/api/stock", stockRouter);
app.use("/api/production", productionRouter);
app.use("/api/equipment", equipmentRouter);
app.use("/api/test", testRouter);
app.use("/api/modal", modalRouter);

// 5. 정적 파일 서빙 제거 (Nginx가 담당)
// 만약 Nginx를 사용한다면 아래 코드는 제거하거나 주석 처리하는 것이 좋습니다.
// const publicPath = path.join(__dirname, "public");
// app.use(express.static(publicPath));

// 6. Vue 라우팅 와일드카드 제거 (Nginx가 담당)
// Nginx가 모든 요청을 index.html로 보내주므로 Express에서 index.html을 직접 서빙하는 것은 불필요합니다.
// app.get("/", function (req, res, next) { ... });
// app.use((req, res) => { ... });

// 5. 정적 파일 서빙 추가 (public 폴더 내의 정적 파일)
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// 6. Vue 라우팅 와일드카드 추가 (Nginx 사용 시 충돌 가능성 있음)
// API 라우터 외의 모든 요청을 index.html로 리디렉션하여 Vue Router가 처리하게 합니다.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"), (err) => {
    if (err) {
      console.error("Failed to send index.html:", err);
      res.status(500).send("Internal Server Error");
    }
  });
});

// 7. 서버 실행
app.listen(3000, () => {
  console.log("server start");
  console.log("http://localhost:3000");
});
