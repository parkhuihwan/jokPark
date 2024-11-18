const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = 41118;

// 인증서 파일 로드
const options = {
  ca: fs.readFileSync(path.join(__dirname, 'cert', 'rootCA.pem')), // Root CA 인증서
  cert: fs.readFileSync(path.join(__dirname, 'cert', 'server.crt')), // 서버 인증서
  key: fs.readFileSync(path.join(__dirname, 'cert', 'server.key')), // 서버 개인 키
};

// 정적 파일 제공
app.use(express.static('public'));

// 기본 라우트
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// HTTPS 서버 시작
https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS Server is running on https://localhost:${PORT}`);
});


