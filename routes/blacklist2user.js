const express=require('express');
const router = express.Router();
const mysql = require('mysql');
const client = mysql.createConnection({
   host:'localhost',
   port:3306,
   user:'9team',
   password:'gachon654321',
   database:'9team'
});
//url 
var url= require('url');

router.get('/blacklist2user', function(req,res){
//url 가져오기
var pathname = url.parse(req.url);
//url 파싱
   console.log(pathname);
   var tmp = pathname.query.toString();
   var tmp2 = tmp.split('=');
   var userId = tmp2[1];
//userID 가져오기 
   console.log(userId);   

//일단 user에서 가져오기 number
   client.query('SELECT * FROM user WHERE userId =?',userId,(error, result)=>{
      if(result){
 console.log(result[0].userNumber);
         var userNumber = result[0].userNumber;
         //blacklist db에서 삭제하기
            client.query('DELETE FROM blacklist WHERE userNumber = ?',userNumber,(error,result)=>{
               res.writeHead(302, {'location':'blacklist-admin'});
               res.end();
            });
         //}
         //});
      }
   });


});

module.exports=router;

