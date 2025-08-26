// app.js ?˜ì •??
require("dotenv").config({ path : './.env'});
const express = require("express");
const cors = require("cors");
const app = express();
const session = require("express-session");
const path = require("path");

// 1. ë¯¸ë“¤?¨ì–´ ?¤ì • (CORS, body-parser)
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.CLIENT_URL], // ?š¨ ë°°í¬ ì£¼ì†Œë¥?ENV ?Œì¼?ì„œ ê°€?¸ì˜¤?„ë¡ ?˜ì •
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// 2. ?¸ì…˜ ë¯¸ë“¤?¨ì–´ ?¤ì • (ëª¨ë“  ?¼ìš°???„ì— ?„ì¹˜)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ë°°í¬ ?œì—ë§?true
      maxAge: 3600000,
    },
  })
);

// 3. ?¼ìš°???Œì¼ require
const informationRouter = require("./routers/information_router.js");
const salesRouter = require("./routers/sales_router.js");
const stockRouter = require("./routers/stock_router.js");
const productionRouter = require("./routers/production_router.js");
const equipmentRouter = require("./routers/equipment_router.js");
const testRouter = require("./routers/test_router.js");
const modalRouter = require("./routers/modal_router.js");

// 4. API ?¼ìš°???±ë¡
app.use("/api/information", informationRouter);
app.use("/api/sales", salesRouter);
app.use("/api/stock", stockRouter);
app.use("/api/production", productionRouter);
app.use("/api/equipment", equipmentRouter);
app.use("/api/test", testRouter);
app.use("/api/modal", modalRouter);

// 5. ?•ì  ?Œì¼ ?œë¹™ ?œê±° (Nginxê°€ ?´ë‹¹)
// ë§Œì•½ Nginxë¥??¬ìš©?œë‹¤ë©??„ëž˜ ì½”ë“œ???œê±°?˜ê±°??ì£¼ì„ ì²˜ë¦¬?˜ëŠ” ê²ƒì´ ì¢‹ìŠµ?ˆë‹¤.
// const publicPath = path.join(__dirname, "public");
// app.use(express.static(publicPath));

// 6. Vue ?¼ìš°???€?¼ë“œì¹´ë“œ ?œê±° (Nginxê°€ ?´ë‹¹)
// Nginxê°€ ëª¨ë“  ?”ì²­??index.htmlë¡?ë³´ë‚´ì£¼ë?ë¡?Express?ì„œ index.html??ì§ì ‘ ?œë¹™?˜ëŠ” ê²ƒì? ë¶ˆí•„?”í•©?ˆë‹¤.
// app.get("/", function (req, res, next) { ... });
// app.use((req, res) => { ... });

// 5. ?•ì  ?Œì¼ ?œë¹™ ì¶”ê? (public ?´ë” ?´ì˜ ?•ì  ?Œì¼)
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// 6. Vue ?¼ìš°???€?¼ë“œì¹´ë“œ ì¶”ê? (Nginx ?¬ìš© ??ì¶©ëŒ ê°€?¥ì„± ?ˆìŒ)
// API ?¼ìš°???¸ì˜ ëª¨ë“  ?”ì²­??index.htmlë¡?ë¦¬ë””?‰ì…˜?˜ì—¬ Vue Routerê°€ ì²˜ë¦¬?˜ê²Œ ?©ë‹ˆ??
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"), (err) => {
    if (err) {
      console.error("Failed to send index.html:", err);
      res.status(500).send("Internal Server Error");
    }
  });
});

// 7. ?œë²„ ?¤í–‰
app.listen(3000, () => {
  console.log("server start");
  console.log("http://localhost:3000");
});
