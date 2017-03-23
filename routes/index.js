var express = require('express');
var router = express.Router();
var url = require('url');
const mysql = require('mysql');
const client = mysql.createConnection({
   host:'localhost',
   port:3306,
   user:'9team',
   password:'gachon654321',
   database: '9team'
});

router.get('/', function(req, res, next) {
  res.render('index');
});
exports.logout=function(req,res){
   req.session.login='logout';
   res.status(200);
   res.redirect('/');
};
module.exports = function(io){
   io.on('connection', function(socket){

   console.log("please");
   });
   return router;
}
module.exports = router;
