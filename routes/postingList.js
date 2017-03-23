const fs = require('fs');
const ejs = require('ejs');
const express =require('express');
const router = express.Router();
const mysql = require('mysql');
const client = mysql.createConnection({
   host: 'localhost',
   port: 3306,
   user: '9team',
   password: 'gachon654321',
   database: '9team'
});
var pool = mysql.createPool({
   connectionLimit:3,
   host:'localhost',
   user: '9team',
   password: 'gachon654321',
   database: '9team',
});
//posting 테이블로부터 data를 가져와 rows 객체에 매핑 후 ejs로 랜더링
router.get('/postingList', function(req,res,next){
	pool.getConnection(function(err, connection){
	var sqlForSelectList = "SELECT postingId, userId, postingCategory, postingTitle, postingContent, postingImage, postingDate FROM posting";
		connection.query(sqlForSelectList, function(err,rows){
		if(err) console.error("err : "+ err);
			console.log("rows: " + JSON.stringify(rows));
			//여행일지 리스트 파일 열기 
			res.render('postingList.ejs', {title: '여행일지 리스트', rows: rows});
			connection.release();
		});
	});
});

module.exports = router;
