
var express = require('express');
var url = require('url');
var router = express.Router();
//파일 업로드를 위한 multer 모듈 사용
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

router.get('/posting', function(req, res) {
	//url 파싱
	var pathname = url.parse(req.url);
	console.log(pathname);
	var tmp = pathname.query.toString();
	console.log(tmp);
	var tmp2 = tmp.split('&');
    /*여행일지 등록시 lat, lng 위경도를 받아옴*/
	var lat = tmp2[0];
	var lng = tmp2[1];
        if(tmp){
	res.render('posting',{lat:lat, lng:lng});
        } /*받아온 위경도를 다시 posting.jade로 전달*/
});
router.post('/posting', upload.any(), function(req, res, next){
	var id = req.cookies.id;
	var category = req.body.category;
	var title = req.body.title;
	var content = req.body.content;
	var d = new Date();
	var today = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
	var lat = req.body.lat;
	var lng = req.body.lng;
        //파일 path 설정
	var path ='./images/';
	//파일 원본이름으로 저장
        var realpath = path +req.files[0].originalname;
        //서버에 저장될 파일 이름 rename
	var rename1 = '/home/9team/src1.0/public/images/'+req.files[0].filename;
        var rename2 = '/home/9team/src1.0/public/images/'+req.files[0].originalname;
	fs.rename(rename1, rename2, function(err){
		if(err){
			console.log(err);
		}else {
			console.log("rename success");
		}
	});
	//누락정보 존재시
	if((title=='')||(content=='')||(path=='')){
		console.log("여행일지 입력정보 누락");
                res.write("<html><body><script>alert('여행일지 입력정보 누락 다시 입력해주세요.'); window.location='/posting';</script></body></html>");
        }//누락정보 없을시
        else{
		client.query('SELECT userNumber from user WHERE userId = ?', id, (error, result)=>{
			if(result[0].userNumber){	 
				var params = [result[0].userNumber, id, category, title, content, realpath, today, lng, lat];
				console.log("여행일지 등록을 시작합니다.");
				client.query('INSERT INTO posting(userNumber, userId, postingCategory, postingTitle, postingContent, postingImage, postingDate, positionLon, positionLat) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',params, (err, result) => {
                        		if(err){
                                		console.log("DB FAIL");
                                		console.log(err);
                        		} else {
                                		console.log("DB SUCCESS");
						fs.readFile('views/postingsuccess.ejs', 'utf-8', function(error, data){
						console.log(data);
						res.writeHead(200, {'content-Type':'text/html'});
						res.end(ejs.render(data));
					});
					}				
       				 });
	
			}
	});
	}	
});

/* images업로드할때 저장되는 경로설정 */
exports.upload = function(req, res){
   upload(req,res,function(err){
      console.log(req.file);
        fs.readFile(req.file.image.path, function(err,data){
           var dirname = "/home/9team/src1.0/public/images";
           var newPath = dirname + req.body.filename;
           fs.writeFile(newPath, data, function(err){
             if(err){
                console.log('error upload');
                res.end();
             }
             console.log('file is uploaded');
             res.end();
            });
         });
   });
};

module.exports = router;
