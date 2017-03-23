const express =require('express');
const router = express.Router();
const crypto = require('crypto');
const fs = require('fs');
const ejs = require('ejs');
const mysql = require('mysql');

//복호화 함수
var key = '9team';
var deci = function(pass, key){
        var decipher = crypto.createDecipher('aes192', key);
        decipher.update(pass, 'base64', 'utf8');
        var decipheredOutput = decipher.final('utf8');
        return decipheredOutput;
}

const client = mysql.createConnection({
   host: 'localhost',
   port: 3306,
   user: '9team',
   password: 'gachon654321',
   database: '9team'
});

router.post('/password', (req, res)=>{
   var id = req.body.userId;
   var name = req.body.userName;
   var email = req.body.userEmail;
   var params = [id, name, email];
   client.query('SELECT userPassword from user WHERE userId = ? AND userName = ? AND userEmail = ? ',params,(error,result)=>{
      if(result[0]){
	 //비밀번호 찾기 성공 뷰
         fs.readFile('views/pwsuccess.ejs', 'utf-8', function(error, data){
                res.writeHead(200, {'content-Tpye':'text/html'});
                res.end(ejs.render(data, {
                        passwd:deci(result[0].userPassword, key)}));
         });
      }
      else{
 	 //비밀번호 찾기 실패 뷰
         fs.readFile('views/pwfail.ejs', 'utf-8', function(error, data){
                res.writeHead(200, {'content-Tpye':'text/html'});
                res.end(ejs.render(data));
                        });

      }
   });
});


module.exports = router;


