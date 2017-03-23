var express = require('express');
var url = require('url');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest:'public/images/'});
var fs = require('fs');
const ejs = require('ejs');
const mysql = require('mysql');
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
   user: '9team',
   password: 'gachon654321',
   database: '9team',
});


router.get('/postingView', function(req,res){
	//url 가져오기
	var pathname = url.parse(req.url);
	//url 파싱
	console.log(pathname);
	var tmp = pathname.query.toString();
	var tmp2 = tmp.split('=');
        var id = req.cookies.id;
/* 
   tmp를 parsing했는데 query의 첫문장이 newComment이면
   기존의 comment를 수정했다는 의미 
*/

        if(tmp2[0]=="newComment"){
           var newcmt1 = tmp2[1].split('&')[0];
           var newcmt = decodeURI(newcmt1);
           var postingId = tmp2[2].split('&')[0];
           var commentId=tmp2[3].split('#')[0];
/* 
   수정할 comment를 url로 받아와 decode해준다음 newcmt변수에 저장 
   postingId, commentId도 같이 받아옴
*/

           var params=[newcmt, commentId];
	   //comment 테이블에서 정보 가져오기
           client.query('SELECT * from comment WHERE commentId = ?', commentId, (e,r)=>{
     	 	  if(r[0].userId!=id){
          	 	 res.write("<html><body><script>alert('댓글 작성자 본인이 아닙니다'); window.location='/postingView?postingId=<%=postingId%>';</script></body>");
      		  }else{        /* 작성자 본인이 맞으면 댓글 수정 기능 수행 */
           		 client.query('UPDATE comment SET commentContent = ? WHERE commentId =?', params,(err,re)=>{
          			 res.writeHead(302,{'location':'postingView?postingId='+postingId});
          			 res.end();
          		 });
         	  }
           });
        } 
        else{
/*
   query의 첫단어가 newComment가 아니라면 
   여행일지 조회 action 수행
*/

		var postingId = tmp2[1];
/*

   postingID를 통해 posting객체를 가져와서 render해주기
*/
		client.query('SELECT * FROM posting WHERE postingId =?',postingId,(error, result)=>{
			if(result[0]){
            			var postingId = result[0].postingId;
            			var userNumber = result[0].userNumber;
            			var userId = result[0].userId;
            			var postingCategory = result[0].postingCategory;
            			var postingTitle = result[0].postingTitle;
            			var postingContent = result[0].postingContent;
            			var postingImage = result[0].postingImage;
            			var postingDate = result[0].postingDate;
            			var positionLon = result[0].positionLon;
            			var positionLat = result[0].positionLat;
            			pool.getConnection(function(err, connection){
					var sqlForSelectList = "SELECT * FROM comment WHERE postingId = ?";
					connection.query(sqlForSelectList, postingId, function(err,rows){
						if(err){
							console.error("err : "+ err);
						}else{
							console.log("rows: " + JSON.stringify(rows)); 	
							res.render('postingView.ejs',{postingId:postingId, userNumber:userNumber, userId:userId, postingCategory:postingCategory, postingTitle:postingTitle, postingContent:postingContent,postingImage:postingImage,postingDate:postingDate,positionLon:positionLon,positionLat:positionLat,rows:rows});
						}
					});
				});
				
     			 }
  		});
      }
});

module.exports = router;
