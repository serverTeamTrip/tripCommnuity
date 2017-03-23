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

router.get('/comment-admin', function(req,res,next){
	pool.getConnection(function(err, connection){
		//쿼리문 저장
		var sqlForSelectList = "SELECT * FROM comment"; 
      		connection.query(sqlForSelectList, function(err,rows){
		//불러온 데이터를 rows에 저장하여 ejs로 보내기
        	if(err) console.error("err : "+ err);
        		console.log("rows: " + JSON.stringify(rows));
        		res.render('commentList.ejs', {title: '댓글 리스트', rows: rows});
			connection.release();
      		});
   	});
});

module.exports = router;
