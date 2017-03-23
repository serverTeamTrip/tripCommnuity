const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const client = mysql.createConnection({
   host:'localhost',port:3306,user:'9team',password:'gachon654321',database:'9team'});

router.post('/delete', function(req,res){
   console.log(req.body.chk_del);
   var cnt = 0;
   if(req.body.chk_del){
   var tmp = req.body.chk_del.toString();
   var tmp2 = tmp.split(',');
   
   cnt = tmp2.length;
  /*cnt는 체크된 회원의 갯수*/
   }
   if(cnt==0){
      res.write("<html><body><script>alert('삭제할 회원을 체크해주세요'); window.location='/member-admin';</script></body>");
   }
   else{
      var v = 0;
      for(var i=0; i<cnt; i++)
      {
         client.query('delete from user where userId = ?',tmp2[i],(error,value)=>{
         v++;
         if(v==cnt){
            res.writeHead(302,{'location':'member-admin'});
            res.end();
         }
         });
      }
   }

});

module.exports=router;

