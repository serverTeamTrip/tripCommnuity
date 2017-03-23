const express =require('express');
const router = express.Router();
const mysql = require('mysql');
const crypto = require('crypto');
const ejs = require('ejs');
const fs = require('fs');

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
   user:'9team',
   password:'gachon654321',
   database: '9team'
});

var key = '9team';
var ci = function(pass, key){
        var cipher = crypto.createCipher('aes192', key);
        cipher.update(pass, 'utf8', 'base64');
        var cipheredOutput = cipher.final('base64');
        return cipheredOutput;
}

router.post('/login', (req, res)=>{
   var id = req.body.userId;
   var password = req.body.userPassword;
   var pass = ci(password, key); //암호화된 비밀번호
   
   console.log(id, pass);
   /*login시 id가 root인경우 관리자로 로그인*/
   if(id == 'root'){
        client.query('SELECT adminPassword from admin where adminId = ?',id, (error,result)=>{
        if(result[0]){
                if(pass==result[0].adminPassword)
                {
                        console.log('관리자 로그인');
                        res.cookie('id', 'root');
                        res.sendfile('views/admin.html');
                }else{
                        fs.readFile('views/loginfail.ejs', 'utf-8', function(error, data){
                                res.writeHead(200, {'content-Tpye':'text/html'});
                                res.end(ejs.render(data));
                                });

                }
        }
        });

  }else {   /*일반사용자 로그인*/
         client.query('SELECT userPassword from user WHERE userId = ?',id, (error,result)=>{
        if(result[0]){
                if(pass==result[0].userPassword)
                {

                   /* google map에서 marker를 찍기위한 posting의 lat lng받아오기 */
                   pool.getConnection(function(err,connection){
                      var sqlForSelectList = "SELECT positionLat, positionLon FROM posting";
                      connection.query(sqlForSelectList, function(err,rows){
                         if(err) console.error("err: " + err);
                        console.log(rows);
                        console.log("rows: " + JSON.stringify(rows));
                        res.cookie('id', id);

                        /* db에서받아온 posting들의 위경도를 map.ejs로 전달*/
                        res.render('map.ejs',{title: '위경도', rows: rows});
                        connection.release();
                      });
                   });
                }else{
                        fs.readFile('views/loginfail.ejs', 'utf-8', function(error, data){
                                res.writeHead(200, {'content-Tpye':'text/html'});
                                res.end(ejs.render(data));
                                });

                }
        }
   });
}
});
module.exports = router;












