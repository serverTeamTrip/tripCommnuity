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

router.get('/posting-admin', function(req,res,next){
	//posting 테이블에서 가져온 data를 rows 객체에 매핑 후 ejs로 랜더
	pool.getConnection(function(err, connection){
		var sqlForSelectList = "SELECT postingId, userId, postingCategory, postingTitle, postingContent, postingImage, postingDate FROM posting";
		connection.query(sqlForSelectList, function(err,rows){
			if(err) console.error("err : "+ err);
			console.log("rows: " + JSON.stringify(rows));
			//여행일지 리스트 파일 열기
			res.render('postingList-admin.ejs', {title: '여행일지 리스트', rows: rows});
			connection.release();
		});
	});
});

module.exports = router;

