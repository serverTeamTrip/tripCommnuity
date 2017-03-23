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

router.get('/blacklist-admin', function(req,res,next){
   pool.getConnection(function(err, connection){
      var sqlForSelectList = "SELECT U.userId, U.userName, U.userEmail, U.userDate FROM user U INNER JOIN blacklist B WHERE U.userNumber=B.userNumber";
      connection.query(sqlForSelectList, function(err,rows){
        if(err) console.error("err : "+ err);
        console.log("rows: " + JSON.stringify(rows));
        /*blacklistList.ejs에 db에서 불러온값들 rows로 넘기기*/
        res.render('blacklistList.ejs', {title: '블랙리스트', rows: rows});
        connection.release();
      });
   });
});


module.exports = router;
