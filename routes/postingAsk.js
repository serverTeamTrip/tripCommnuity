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

/*
  postingAsk.js는 map의 marker 우클릭시 여행일지 조회를 할수 잇도록 route를 해주는 역할 
*/

router.get('/postingAsk', function(req,res){
	//url 가져오기
        var pathname = url.parse(req.url);
	var tmp = pathname.query.toString();
        var lat = tmp.split('&')[0];
        var lng = tmp.split('&')[1];
        var id = req.cookies.id;
        var params = [lat, lng];

/*
  조회한 여행일지의 위경도를 바탕으로 postingId를 찾아내어 redirect
*/
 
	client.query('SELECT * FROM posting WHERE positionLat=? AND positionLon=?',params,(error, result)=>{
		if(result[0]){
            		var postingId = result[0].postingId;
			res.writeHead(302,{'location':'postingView?postingId='+postingId});
                        res.end();	
     		 }
  	});
});

module.exports = router;
