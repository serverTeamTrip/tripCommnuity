const express =require('express');
const router = express.Router();
const mysql = require('mysql');
const client = mysql.createConnection({
   host: 'localhost',
   port: 3306,
   user: '9team',
   password: 'gachon654321',
   database: '9team'
});

router.get('/notification', function(req,res,next){
        res.render('notification.ejs');
});


module.exports = router;
