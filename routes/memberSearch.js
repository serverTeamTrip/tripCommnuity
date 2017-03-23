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

router.post('/memberSearch', function(req,res,next){
	//검색어를 userId로 매핑
        var userId = req.body.search;
        if(userId!=' '){
                pool.getConnection(function(err, connection){
		//쿼리문에 일치하는 값들을 rows 객체로 받아 ejs에 랜더링
                var sqlForSelectList = "SELECT * FROM user where userId like '%"+userId+"%'";
                connection.query(sqlForSelectList, function(err,rows){
                        console.log(sqlForSelectList);
                        if(err) console.error("err : "+ err);
                                console.log("rows: " + JSON.stringify(rows));
				//회원 검색 리스트 파일 열기
                                res.render('memberSearchList.ejs', {title: '회원 검색 리스트', rows: rows});
                                connection.release();
      });
   });
  }
});




module.exports = router;


