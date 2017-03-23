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

router.post('/postingSearch', function(req,res,next){
	//search 변수를 통해 검색어 가져오기
	var search = req.body.search;
	//검색어 미존재 시
	if(search!=' '){
		pool.getConnection(function(err, connection){	
		var sqlForSelectList = "SELECT * FROM posting where postingTitle like '%"+search+"%'";
		connection.query(sqlForSelectList, function(err,rows){
			console.log(sqlForSelectList);
        		if(err) console.error("err : "+ err);
        			console.log("rows: " + JSON.stringify(rows));
        			res.render('searchList.ejs', {title: '검색 리스트', rows: rows});
			        connection.release();
     		 });
   		 });
  	}
});




module.exports = router;
