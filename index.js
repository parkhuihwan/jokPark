const express = require('express');
const session = require('express-session');
const https = require('https');
const fs = require('fs');
const path = require('path');
const app = express();
const jok = require('./jok.js');


const PORT = 41118;

const JOK = new jok();

// 요청 본문(body) 파싱 설정
app.use(express.json()); // JSON 요청 본문 파싱
app.use(express.urlencoded({ extended: true })); // URL-encoded 요청 본문 파싱




// 세션 설정
app.use(
  session({
    secret: 'bomoon', // 세션 암호화 키 (환경 변수 사용 추천)
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // HTTPS를 사용하는 경우 secure: true로 설정
  })
);

// 로그인 체크 미들웨어
function isLoggedIn(req, res, next) {
  if (req.session.isLoggedIn) {
    next();
  } else {
    return res.redirect('/login');
  }
}
// 로그인 페이지
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});
// 로그인 처리
app.post('/login', (req, res) => {
  const { userId, password } = req.body;

  // 간단한 예제: username과 password가 일치하면 로그인 성공 처리
  if (userId == '5555' && password == '4444') {
    req.session.isLoggedIn = true; // 로그인 성공 시 세션 설정
    req.session.userId = userId;
    return res.json({ success: true, redirect: '/' });
  }
  return res.status(401).json({ message: 'Invalid ID or password.' });
});
// 로그아웃 처리
app.post('/logout', (req, res) => {
  req.session.isLoggedIn = false; // 로그인 성공 시 세션 설정
  return res.json({ success: true, redirect: '/' });
});
// 메인페이지`
app.get('/index', isLoggedIn, (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


// makeplayer페이지
app.get('/makePlayers', (req, res) => {
  if (req.session.isLoggedIn) {
    return res.sendFile(__dirname + '/public/makePlayers.html');
  } else {
    return res.redirect('/login');
  }
});
app.get('/getPlayers', (req, res) => {
  res.json({playerList: JOK.getPlayerList()});
});
app.post('/setPlayers', (req, res) => {
  const { playerList } = req.body;
  JOK.setPlayers(playerList);
  return res.json({ success: true, redirect: '/' });
});



//makeDay 페이지
app.get('/makeDay', (req, res) => {
  if (req.session.isLoggedIn) {
    return res.sendFile(__dirname + '/public/makeDay.html');
  } else {
    return res.redirect('/login');
  }
});
app.get('/getMakeDay', (req, res) => {
  res.json({dayPlayerList: JOK.getMakeDay()});
});
app.post('/setMakeDay', (req, res) => {
  const { dayPlayerList } = req.body;
  JOK.setMakeDay(dayPlayerList);
  return res.json({ success: true, redirect: '/' });
});





//makeCustomMatches 페이지
app.get('/makeCustomMatches', (req, res) => {
  if (req.session.isLoggedIn) {
    return res.sendFile(__dirname + '/public/makeCustomMatches.html');
  } else {
    return res.redirect('/login');
  }
});
app.post('/makeMatches', (req, res) => {
  const { winningPlayers, losingPlayers, } = req.body;
  JOK.makeMatch(winningPlayers, losingPlayers);
  return res.json({ success: true, redirect: '/' });
});
app.get('/getMatches', (req, res) => {
  res.json({todayMatches: JOK.getMatches()});
});
app.post('/saveMatches', (req, res) => {
  JOK.saveMatches();
  return res.json({ success: true, redirect: '/' });
});
app.delete('/rollback', (req, res) => {
  JOK.delLastMatch();
  res.status(200).json({ message: `last match was deleted successfully` });
});




//makeMatches 페이지
app.get('/makeRandomMatches', (req, res) => {
  if (req.session.isLoggedIn) {
    return res.sendFile(__dirname + '/public/makeRandomMatches.html');
  } else {
    return res.redirect('/login');
  }
});






// 인증서 파일 로드

const options = {
  ca: fs.readFileSync(path.join(__dirname, 'cert', 'rootCA.pem')), // Root CA 인증서
  cert: fs.readFileSync(path.join(__dirname, 'cert', 'server.crt')), // 서버 인증서
  key: fs.readFileSync(path.join(__dirname, 'cert', 'server.key')), // 서버 개인 키
};

// 인증서 파일 로드
/*
const options = {
  ca: fs.readFileSync(path.join(__dirname, 'gCert', 'ca-bundle.crt')), // Root CA 인증서
  cert: fs.readFileSync(path.join(__dirname, 'gCert', 'star_gigagenie_ai_cert.pem')), // 서버 인증서
  key: fs.readFileSync(path.join(__dirname, 'gCert', 'star_gigagenie_ai_key.pem')), // 서버 개인 키
};
*/
// 정적 파일 제공
//app.use(express.static(path.join(__dirname, 'public')));
// 모든 요청을 index.html로 리다이렉트
app.get(['/*', ''], (req, res) => {
  if (req.session.isLoggedIn) {
    return res.redirect('/index');
  } else {
    return res.redirect('/login')
  }
});
// HTTPS 서버 시작
https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS Server is running on https://localhost:${PORT}`);
});