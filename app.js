const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path'); // path 모듈 추가

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '0321',
  database: 'uenergy'
};

const connection = mysql.createConnection(dbConfig);

connection.connect(err => {
  if (err) {
    console.error('MySQL 연결 오류:', err);
  } else {
    console.log('MySQL 연결 성공');
  }
});
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());


// public 폴더의 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/modules', (req, res) => {
  const sqlQuery = 'SELECT * FROM module'; //module table
  
  connection.query(sqlQuery, (err, results) => {
    if (err) {
      console.error('SQL 쿼리 오류: ' + err.message);
      res.status(500).json({ error: '서버 오류' });
      return;
    }
    
    // send client
    res.json(results);
  });
});

app.get('/api/module', (req, res) => {
  // module id
  const moduleId = req.query.id;

  const query = 'SELECT * FROM module WHERE id = ?'; // module id 조회
  connection.query(query, [moduleId], (err, results) => {
    if (err) {
      console.error('MySQL 쿼리 오류: ' + err.message);
      res.status(500).json({ error: '서버 오류' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: '모듈을 찾을 수 없습니다.' });
    } else {
      // response client
      const moduleInfo = results[0];
      res.json(moduleInfo);
    }
  });
});

app.post('/app.js', (req, res) => {
  console.log(req.body);
  const moduleData = req.body;
  // SQL Query
  const sql = 'INSERT INTO module (volume, company, collplant, startyear, regdate, efficiency, record, selldate, installloc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

  // SQL Query Execution
  connection.query(sql, [
    moduleData.volume,
    moduleData.company,
    moduleData.collplant,
    moduleData.startyear,
    moduleData.regdate,
    moduleData.efficiency,
    moduleData.record,
    moduleData.selldate,
    moduleData.installloc
  ], (err, result) => {
    if (err) {
      console.error('데이터베이스 쿼리 오류:', err); // 오류 출력
      res.status(500).json({ error: '데이터베이스 오류' });
    } else {
      console.log('데이터베이스에 데이터 삽입 성공');
      
      res.redirect('/index.html');
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
});
