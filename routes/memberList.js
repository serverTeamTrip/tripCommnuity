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

router.get('/member-admin', function(req,res,next){
	pool.getConnection(function(err, connection){
		//sql문 저장
		var sqlForSelectList = "SELECT userId, userName, userEmail, userDate FROM user";
		//가져온 데이터를 rows 객체에 저장하여 ejs로 render
		connection.query(sqlForSelectList, function(err,rows){
			if(err) console.error("err : "+ err);
			console.log("rows: " + JSON.stringify(rows));
			res.render('memberList.ejs', {title: '회원 리스트', rows: rows});
			connection.release();
		});
	});
});


module.exports = router;
