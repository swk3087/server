const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// API 토큰 설정
const API_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjkxY2EyNzgxLWYwNjEtNGQ0MC1iOGRmLWI0N2VkOTNlZjcxYyIsImlhdCI6MTczNjMyOTMzOSwic3ViIjoiZGV2ZWxvcGVyLzY5MDNmMmIwLWFmM2ItZGI4My00OGUzLTE5MGRlMjMyZGNkMCIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiMTMuMjI4LjIyNS4xOSIsIjE4LjE0Mi4xMjguMjYiLCI1NC4yNTQuMTYyLjEzOCJdLCJ0eXBlIjoiY2xpZW50In1dfQ.4e-o29JUULnib_769KCmbyWRQnRq_NZyImTVAvISCCchl8FOtZ3o1SLt4EJy9MaRb4PFH_I6DbCxWsgoYcfL7w"
// 서버 설정
const PORT = 8080;

// HTML 파일 경로
const HTML_FILE = path.join(__dirname, '1ndex.html');

// 서버 생성
const server = http.createServer((req, res) => {
  // 현재 시간 추가
  const timestamp = new Date().toISOString(); // ISO 8601 형식으로 날짜와 시간 표시

  // 클라이언트의 IP 주소 추출
  const clientIp = req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

  // 요청 로그 출력
  console.log(`[${timestamp}] Received request from IP: ${clientIp}`);
  console.log(`[${timestamp}] Request Method: ${req.method}`);
  console.log(`[${timestamp}] Request URL: ${req.url}`);

  if (req.method === 'GET' && req.url === '/') {
    // HTML 파일 제공
    fs.readFile(HTML_FILE, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Failed to load HTML file.');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else if (req.method === 'GET' && req.url.startsWith('/player/')) {
    // API 요청 처리
    const playerTag = req.url.split('/')[2];

    if (!playerTag) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Player tag is required.');
      return;
    }

    const apiUrl = `https://api.brawlstars.com/v1/players/%23${playerTag}`;
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    };

    https.get(apiUrl, options, (apiRes) => {
      let data = '';

      apiRes.on('data', (chunk) => {
        data += chunk;
      });

      apiRes.on('end', () => {
        res.writeHead(apiRes.statusCode, { 'Content-Type': 'application/json' });
        res.end(data);
      });
    }).on('error', (err) => {
      console.error(`[${timestamp}] Error: ${err.message}`);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Failed to fetch player data.');
    });
  } else {
    // 404 Not Found 처리
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// 서버 실행
server.listen(PORT, () => {
  const timestamp = new Date().toISOString();
  console.log("server start!");
});
