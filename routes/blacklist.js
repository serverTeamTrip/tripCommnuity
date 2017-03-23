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

router.get('/blacklist', function(req,res){
//url 가져오기
var pathname = url.parse(req.url);
//url 파싱
   console.log(pathname);
   var tmp = pathname.query.toString();
   var tmp2 = tmp.split('=');
   var userId = tmp2[1];
//userID 가져오기 
   console.log(userId);   
//user DB 가져오기
   client.query('SELECT * FROM user WHERE userId =?',userId,(error, result)=>{
         if(result){
	    console.log(result[0].userNumber);
            var userNumber = result[0].userNumber;
            var params=[userNumber,userId];
            //blacklist db에 추가하기
            client.query('select * from blacklist WHERE userNumber = ?',userNumber,(error,resu)=>{
   	       if(resu[0]){
        	    res.write("<html><body><script>alert('이미 블랙리스트에 등록되어있습니다'); window.location='/member-admin';</script></body>");  
       		    res.end();
      	       }else{
            	    client.query('INSERT INTO blacklist(userNumber, userId) VALUES(?,?)',params,(error,result)=>{
            	    res.writeHead(302, {'location':'member-admin'});
                    res.end();
                    });
               }
           });
         }else{
            res.write("<html><body><script>alert('일치하는 회원이없습니다');</script></body>");
            res.end();
         }
   });


});

module.exports=router;

