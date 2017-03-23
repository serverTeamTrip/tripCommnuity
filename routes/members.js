const express =require('express');
const router = express.Router();
const crypto = require('crypto');
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
var key = '9team';
//암호화 함수
var ci = function(pass, key){
   var cipher= crypto.createCipher('aes192', key);
   cipher.update(pass, 'utf8','base64');
   var cipheredOutput = cipher.final('base64');
   return cipheredOutput;
}

router.post('/members', (req, res)=>{
   // console.log("good");
   //res.render('index', { title: 'Express' });
   var id = req.body.userId;
   var name = req.body.userName;
   var email = req.body.userEmail;
   var password = req.body.userPassword;
   var passwordck = req.body.userPasswordck;
   var pass = ci(password, key);
   var d = new Date();
   var today = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
   var params = [id,name,pass,email,today];
   
   //누락된 정보가 없는지 확인.
   if((name=='')||(id=='')||(email=='')||(password=='')||(passwordck=='')){
      console.log('회원가입 입력정보 누락');
      res.write("<html><body><script>alert('회원가입 입력정보 누락 다시  입력해주세요'); window.location='/members';</script></body>");
   }/*누락된 정보가 없을 시*/
   else{
      
        //관리자 아이디인 root로 가입하는 것 방지
        if(id=='root'){
           console.log('root로는 회원가입을 할수 없습니다');
           res.writeHeader(200,{"Content-Type":"text/html"});
           res.write("<html><body><script>alert('root id is not possible');</script></body>");
           res.end();

        }
        else{
           if(password == passwordck){
              client.query('SELECT * from user WHERE userId = ?',id,(error,value)=>{
              if(value[0]){
                 console.log('이미 등록된 id입니다');
		 //회원가입 실패 창 띄우기
                 fs.readFile('views/memberfail.ejs','utf-8',function(error,data){
                 res.writeHead(200,{'content-Type':'text/html'});
                 res.end(ejs.render(data));
                 });
              }
              else{
	         client.query('INSERT INTO user(userId, userName, userPassword, userEmail, userDate) VALUES (?, ?, ?, ?, ?)',params, (err, result) => {
   	            if(err){
		         console.log("DB 저장 FAIL");
		         console.log(err);
	            }
	            else {
	  	         console.log("DB 저장 SUCCESS");
                         fs.readFile('views/membersuccess.ejs', 'utf-8', function(error, data){
                            res.writeHead(200,{'content-Type':'text/html'});
                            res.end(ejs.render(data,{id:params[0]}));
                         });
	            }
                 });
              }
           });
         }
       else{
           res.write("<html><body><script>alert('비밀번호 불일치 확인바랍니다'); window.location='/members';</script></body>");
       }
   }
   }
});

module.exports = router;
