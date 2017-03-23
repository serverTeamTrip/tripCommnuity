const express =require('express');
const router = express.Router();
const fs = require('fs');
const ejs = require('ejs');
const mysql = require('mysql');
const client = mysql.createConnection({
   host: 'localhost',
   port: 3306,
   user: '9team',
   password: 'gachon654321',
   database: '9team'
});

router.post('/id', (req, res)=>{
   console.log("find id post method");
   var name = req.body.userName;
   var email = req.body.userEmail;
   var params = [name, email];
   //DB에 저장된 사용자 이름과 이메일이 같으면 아이디값 가져오기
   client.query('SELECT userId from user WHERE userName = ? AND userEmail = ?',params,(error,result)=>{
      if(result[0]){
            fs.readFile('views/idsuccess.ejs','utf-8',function(error,data){
            	res.writeHead(200,{'content-Type':'text/html'});
            	res.end(ejs.render(data,{
               		id:result[0].userId}));
            });
      }
      else{
            console.log('잘못된 회원정보입니다'); 
            fs.readFile('views/idfail.ejs', 'utf-8', function(error,data){
            res.writeHead(200, {'content-Type':'text/html'});
            res.end(ejs.render(data));
            });
      }
   });
});
module.exports = router;

