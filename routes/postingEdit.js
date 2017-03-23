const express=require('express');
const router = express.Router();
var multer = require('multer');
var upload = multer({dest: '~/src0.8/public/images/'});
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
var url= require('url');

router.get('/postingEdit', function(req,res){
	//url 가져오기
	var pathname = url.parse(req.url);
	//url 파싱
	console.log(pathname);
	var tmp = pathname.query.toString();
	var tmp2 = tmp.split('=');
	var postingId = tmp2[1];
	//postingID 가져오기 
	var id = req.cookies.id;
	//DB에서 posting Data  가져오기 
	client.query('SELECT * FROM posting WHERE postingId =?',postingId,(error, result)=>{
		if(result[0].userId!=id){
			res.write("<html><body><script>alert('작성자 본인이 아닙니다'); window.location='/postingList';</script></body>");
		}else{
			//DB data를 변수에 매칭
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
            		res.render('postingEdit',{postingId:postingId, userNumber:userNumber, userId:userId, postingCategory:postingCategory, postingTitle:postingTitle, postingContent:postingContent,postingImage:postingImage,postingDate:postingDate,positionLon:positionLon,positionLat:positionLat});
             
    		}
 	});
});

router.post('/postingEdit', upload.any(), function(req, res, next){
	//postingID 가져오기
	var postingId = req.body.postingId;
	var id = req.cookies.id;
        var category = req.body.category;
        var title = req.body.title;
        var content = req.body.content;
        var d = new Date();
        var today = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
        var path = req.files[0].path.toString()+'.png';
	var params =[category, title, content, path, postingId];
        //누락정보 존재시
        if((title=='')||(content=='')||(path=='')){
                console.log("여행일지 입력정보 누락");
                res.write("<html><body><script>alert('여행일지 입력정보 누락 다시 입력해주세요.'); window.location='/posting';</script></body></html>");
        }//누락정보 없을시
        else{

		client.query('UPDATE posting set postingCategory=?, postingTitle=?, postingContent=?, postingImage=? where postingId=?', params, (err, result)=>{
			if(err){
				console.log("DB FAIL");
				console.log(err);
			}else{
				console.log("DB SUCCESS");
                                fs.readFile('views/postingEditsuccess.ejs', 'utf-8', function(error, data){
                                                console.log(data);
                                                res.writeHead(200, {'content-Type':'text/html'});
                                                res.end(ejs.render(data));
                                        });
                                        }
                                 });


       
	 }
});
module.exports=router;

