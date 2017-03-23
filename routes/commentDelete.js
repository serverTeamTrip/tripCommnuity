const express = require('express');
const router = express.Router();
const mysql = require('mysql');
var url = require('url');
const client = mysql.createConnection({
   host:'localhost',port:3306,user:'9team',password:'gachon654321',database:'9team'});

router.get('/commentDelete', function(req,res){
   var id = req.cookies.id;
   var pathname = url.parse(req.url);
   var tmp = pathname.query.toString();
   var tmp2 = tmp.split('=');

   /*query문받아서 parsing해서 commentId값 받아오기 */
   var commentId = tmp2[1];
   var postingId ;

   client.query('SELECT * FROM comment WHERE commentId = ?',commentId,(error, result)=>{
      if(result[0]){
            postingId = result[0].postingId;
         /*작성자 본인이 맞으면 comment삭제해주기*/
         if(result[0].userId==id){
            client.query('DELETE from comment WHERE commentId = ?' , commentId,(error, rest)=>{
               res.writeHead(302,{'location':'postingView?postingId='+postingId});
               res.end();
             });
         }else{  /*댓글작성자 본인이 아니면 alert해주고 redirect*/
              res.write("<html><body><script>alert('댓글 작성자 본인이 아닙니다'); window.location.replace('postingView?postingId='+ postingId);</script></body>");
         }
      }
   });
});

/*post는 관리자가 댓글을 삭제할때 post로 route해줌*/
router.post('/commentDelete', function(req,res){
   var id = req.cookies.id;
   var cnt = 0;
   if(req.body.chk_del){
      var tmp= req.body.chk_del.toString();
      var tmp2= tmp.split(',');
      cnt = tmp2.length;
      /*cnt는 선택된 comment의 count*/
   }
   if(cnt==0){  /*아무 comment도 선택하지않고 삭제를 눌렀을 경우*/
      res.write("<html><body><script>alert('삭제할 댓글을 체크해주세요'); window.location='/comment-admin';</script></body>");
   }
   else{
      var v = 0 ;
      for(var i = 0; i<cnt; i++)
      {
          if(id=='root'){   /*관리자권한인것을 다시한번확인*/
             client.query('delete from comment where commentId = ?', tmp2[i],(error,value)=>{
               v++;
               if(v==cnt){
                  res.writeHead(302, {'location':'comment-admin'});
                  res.end();
               }
           });
          }
      }
  }
});
             

module.exports=router;

