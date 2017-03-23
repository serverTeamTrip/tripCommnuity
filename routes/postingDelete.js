const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const client = mysql.createConnection({
   host:'localhost',port:3306,user:'9team',password:'gachon654321',database:'9team'});

//const event = require('events');
//EventEmitter = require('events').EventEmitter;



router.post('/postingDelete', function(req,res){
   var id = req.cookies.id;
   var cnt = 0;
   if(req.body.chk_del){
   var tmp = req.body.chk_del.toString();
   var tmp2 = tmp.split(',');
   cnt = tmp2.length;
   }
   if(cnt==0){
      res.write("<html><body><script>alert('삭제할 여행일지를 체크해주세요'); window.location='/posting-admin';</script></body>");
   }
   else{
      var v = 0;
      for(var i=0; i<cnt; i++)
      {
         var params = [ tmp2[i], id];
         if(id=='root'){  /*관리자 여행일지 삭제 */
             client.query('delete from posting where postingId =? ', tmp2[i],(error,value)=>{
               v++;
               if(v==cnt){
                  res.writeHead(302,{'location':'posting-admin'});
                  res.end();
               }
             });    
         }else{ 
         
         client.query('select userId from posting where postingId = ?',tmp2[i],(error,result)=>{
           if(result[0].userId!=id){
      res.write("<html><body><script>alert('여행일지 작성자 본인이 아닙니다'); window.location='/postingList';</script></body>");
           }else{ 
                  client.query('delete from posting where postingId = ? AND userId = ?',params,(error,value)=>{
                      console.log(tmp2[i],': posting삭제');
                      v++;
                      if(v==cnt){
                         res.writeHead(302,{'location':'postingList'});
                         res.end();
                      }
                 });
           }
           });
         }
      }
   }
});

module.exports=router;

