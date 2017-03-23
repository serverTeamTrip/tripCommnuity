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

//posting 테이블에 저장된 데이터 들을 rows 객체에 저장 후ejs파일로 랜더링.
router.get('/postingList-admin', function(req,res,next){
	pool.getConnection(function(err, connection){
		var sqlForSelectList = "SELECT postingId, userId, postingCategory, postingTitle, postingContent, postingImage, postingDate FROM posting";
		connection.query(sqlForSelectList, function(err,rows){
			if(err) console.error("err : "+ err);
			console.log("rows: " + JSON.stringify(rows));
			res.render('postingList-admin.ejs', {title: '여행일지 리스트', rows: rows});
			connection.release();
		});
	});
});

module.exports = router;

