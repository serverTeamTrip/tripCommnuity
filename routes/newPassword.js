const express =require('express');
const router = express.Router();
const crypto = require('crypto');
const fs = require('fs');
const ejs = require('ejs');
const mysql = require('mysql');


var key = '9team';
//복호화 함수
var deci = function(pass, key){
        var decipher = crypto.createDecipher('aes192', key);
        decipher.update(pass, 'base64', 'utf8');
        var decipheredOutput = decipher.final('utf8');
        return decipheredOutput;
}
//암호화 함수
var ci = function(pass, key){
	var cipher = crypto.createCipher('aes192', key);
	cipher.update(pass,'utf8','base64');
	var cipheredOutput=cipher.final('base64');
	return cipheredOutput;
}


const client = mysql.createConnection({
   host: 'localhost',
   port: 3306,
   user: '9team',
   password: 'gachon654321',
   database: '9team'
});

router.post('/newPassword', (req, res)=>{
   console.log("change password put method");
   var currentPassword = req.body.currentPassword;
   var pass = ci(currentPassword, key); //암호화된 비밀번호

   var newPassword = req.body.newPassword;
   var passcheck = req.body.newPassword2;
   var newpass = ci(newPassword, key); //암호화된 바꿀 비밀번호   
  
   var id = req.cookies.id;
   var params = [newpass, id];
   if(id=='root'){
      client.query('SELECT adminPassword from admin WHERE adminId = ?', id ,(error,result)=>{
      if(result[0].adminPassword==pass){
	if(currentPassword == newPassword){
	res.write("<html><body><script>alert('현재 비밀번호가 아닌 새로운 비밀번호를 입력해주세요.'); window.location='/newPassword';</script></body>");       
	}else  if(newPassword==passcheck){
	    //DB에 update
            client.query('UPDATE admin set adminPassword = ?',newpass,(error,result2)=>{
                //비밀번호 변경 성공 뷰
                fs.readFile('views/changepwsuccess.ejs', 'utf-8', function(error, data){
                   res.writeHead(200, {'content-Tpye':'text/html'});
                   res.end(ejs.render(data));
                });
            });
         }
         else{
          console.log('패스워드를 다시 확인해주세요');
            res.write("<html><body><script>alert('새로운 비밀번호가 서로 일치하지 않습니다'); window.location='/newPassword';</script></body>");
         }
      }
      else{
         console.log('잘못된 회원정보입니다');
  	 //비밀번호 변경 실패 뷰
         fs.readFile('views/changepwfail.ejs', 'utf-8', function(error, data){
                res.writeHead(200, {'content-Tpye':'text/html'});
                res.end(ejs.render(data));
                        });

      }
      });
    }else{
      client.query('SELECT userPassword from user WHERE userId = ?' , id, (error, result)=>{
      if(result[0].userPassword==pass){
        if(currentPassword == newPassword){
        res.write("<html><body><script>alert('현재 비밀번호가 아닌 새로운 비밀번호를 입력해주세요.'); window.location='/newPassword';</script></body>");
        }else if(newPassword==passcheck){
            client.query('UPDATE user set userPassword = ? WHERE userId = ?',params,(error,result2)=>{
	       //비밀번호 변경 성공  뷰
               fs.readFile('views/changepwsuccess.ejs', 'utf-8', function(error,data){
                  res.writeHead(200, {'content-Type':'text/html'});
                  res.end(ejs.render(data));
               });
            });
         }
         else{
            console.log(' retry ');
            res.write("<html><body><script>alert('새로운 비밀번호가 서로 일치하지 않습니다'); window.location='/newPassword';</script></body></html>");
         }
      }else{
         console.log('잘못된 회원정보입니다');
	 //비밀번호 변경실패 뷰
         fs.readFile('views/changepwfail.ejs', 'utf-8', function(error, data){
                res.writeHead(200, {'content-Tpye':'text/html'});
                res.end(ejs.render(data));
                        });
      }
   });
   }
     

});
module.exports = router;


