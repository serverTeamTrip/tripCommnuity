const express=require('express');
const router = express.Router();
const fs = require('fs');
const ejs = require('ejs');
const mysql = require('mysql');
const client = mysql.createConnection({
   host:'localhost',
   port:3306,
   user:'9team',
   password:'gachon654321',
   database:'9team'
});

router.post('/postingComment', (req, res)=>{
	//아이디 쿠기에서 가져오기
	var id = req.cookies.id;
	var comment = req.body.comment;
	var postingId = req.body.postingId;
	var d = new Date();
        var today = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
	//user 테이블에서 회원번호 가져오기
	client.query('SELECT userNumber FROM user WHERE userId = ?', id, (error, result)=>{
		if(result[0].userNumber){
			var params = [postingId, result[0].userNumber, id, comment, today];
			//가져온 회원번호와 댓글, 여행일지 번호, 댓글 등록 날짜 comment 테이블에 저장하기
			client.query('INSERT INTO comment(postingId, userNumber, userId, commentContent, commentDate) VALUES(?,?,?,?,?)', params, (error, result)=>{
				if(error){
					console.log(error);
				}else{
					console.log("DB SUCCESS");
					//postingView url에 postingId 같이 넘기기
					res.writeHead(302,{'location':'postingView?postingId='+postingId});
            				res.end();
				}
			});
		}
	});
});
				


module.exports=router;
