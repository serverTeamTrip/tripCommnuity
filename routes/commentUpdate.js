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

/*tmp file*/
/*tmp file*/
/*tmp file*/
/*tmp file*/
/*tmp file*/
/*tmp file*/
/*tmp file*/
/*tmp file*/
/*tmp file*/
/*tmp file*/

router.post('/commentUpdate', (req, res)=>{
	var id = req.cookies.id;
	var commentId = req.body.commentId;
	var postingId = req.body.postingId;
        var comment = req.body.newComment;
        console.log(id, commentId, postingId, comment);
        res.end('hihi');
});
				


module.exports=router;
