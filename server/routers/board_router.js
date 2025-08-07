//라우터 모듈

const express = require("express");
const router = express.Router();

//라우팅 = 사용자의 요청(URI+METHOD) + Service + 응답형태(View or Data),파일따로 분리 권장
const boardService = require("../services/board_service.js");
//전체조회 , 동일 url은 주소는 같지만
router.get("/boards", async (req, res) => {
  let list = await boardService.findAll();
  res.send(list);
});

//등록
router.post("/boards", async (req, res) => {
  let board = req.body;
  let result = await boardService.addNew(board);
  res.send(result);
});

//이 코드 이상으로는 코드 실행 불가능,이 부분이 가장 마지막에 동작하는 곳에 존재해야함
module.exports = router;
// 이 곳에 코드 작성하면 코드 실행?죽은코드
