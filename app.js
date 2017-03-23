var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//mysql add
const mysql = require('mysql');
const crypto = require('crypto');

var app = express();
const http = require('http'),
    util = require('util'),
    fs = require('fs');
var socket_io = require('socket.io');
var io = socket_io();
app.io  = io;


var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var members = require('./routes/members');
var id = require('./routes/id');
var password = require('./routes/password');
var memberDelete = require('./routes/memberDelete');
var postingList = require('./routes/postingList.js');
var posting = require('./routes/posting.js');
var newPassword = require('./routes/newPassword');
var memberList = require('./routes/memberList.js');
var notification = require('./routes/notification.js');
var memberDelete = require('./routes/memberDelete.js');
var blacklist = require('./routes/blacklist.js');
//일반회원으루 전환
var blacklist2user = require('./routes/blacklist2user.js');
//blacklistform
var blacklistList = require('./routes/blacklistList.js');
var postingSearch = require('./routes/postingSearch');
var postingDelete = require('./routes/postingDelete');
var postingEdit = require('./routes/postingEdit');
var postingadmin = require('./routes/posting-admin');
var postingView = require('./routes/postingView');
var postingComment = require('./routes/postingComment');
var memberSearch = require('./routes/memberSearch');
var commentadmin = require('./routes/comment-admin');
var commentDelete = require('./routes/commentDelete');
var commentUpdate = require('./routes/commentUpdate');

var postingAsk = require('./routes/postingAsk');

//mysql db connect
const client = mysql.createConnection({
   host: 'localhost',
   port: 3306,
   user: '9team',
   password: 'gachon654321',
   database: '9team'
});
//-----------create session----------
var createSession = function createSession(){
   return function(req, res, next){


      if(!req.session.login){
          req.session.login = 'logout';
      }
      next();
   };
};



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');//ad
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.session({secret:'keyboard cat', cookie:{maxAge:400000}}));
//app.use(createSession());//session 생성
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
app.use('/users', users);

/*index.jade에서 '회원가입'을 눌렀을때 members.jade를 뛰어주기위해서*/
app.get('/members', function(req, res){
   res.render('members');
});
/* read find id page */
app.get('/id', function(req, res){
   res.render('id');
});
/* read find id page */ 
app.get('/password', function(req,res){
   res.render('password');
});
app.get('/newPassword', function(req,res){
   res.render('newPassword');
});
/*관리자 회원관리 리스트*/
app.get('/member-admin',memberList);
/*블랙리스트리스트*/
app.get('/blacklist-admin',blacklistList);
/*공지사항전파*/
app.get('/notification', notification);
/*여행일지 리스트*/
app.get('/postingList', postingList);
app.get('/posting', posting);
/*여행일지 수정*/
app.get('/postingEdit', postingEdit);
/*관리자 여행일지 관리*/
app.get('/posting-admin', postingadmin);
app.get('/blacklist', blacklist);
app.get('/blacklist2user',blacklist2user);
app.get('/postingView', postingView);
app.get('/comment-admin', commentadmin);
app.get('/commentDelete', commentDelete);
/*marker로 여행일지 조회*/
app.get('/postingAsk', postingAsk);


/*index.jade에서 '로그인'을 눌러서 로그인 신청을 했을때 login.js로가서 회원이 맞는지 확인해주기 위한 route*/
app.post('/login', login);
/* 회원가입*/
app.post('/members',members);
/* 아이디찾기*/
app.post('/id', id);
/* 비밀번호찾기*/
app.post('/password', password);
/*비밀번호변경*/
app.post('/newPassword', newPassword);
app.post('/posting', posting);
app.post('/delete', memberDelete);
app.post('/postingSearch', postingSearch);
app.post('/postingDelete', postingDelete);
app.post('/postingEdit', postingEdit);
app.post('/postingComment', postingComment);
app.post('/memberSearch', memberSearch);
app.post('/commentDelete', commentDelete);
app.post('/commentUpdate', commentUpdate);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


/* socket.io 채팅 기능구현 */

var server_user =[];
var clients = [];
var group_leader = [];
var num = 0;
io.sockets.on("connection", function(socket){
   num++;
   socket.on('sendmsg',function(data){
      data = data+'+'+num ;
      io.sockets.emit('smart',data);
   });
   io.emit("user_connection", socket.id);
   io.emit("server_user", server_user);
   socket.on("create_user", function(data_user){
      server_user.path(data_user);
      io.emit("create_user", data_user);
   });
   socket.on("message", function(data_message){
      io.emit("message", data_message);
   })
   socket.on("disconnect", function(){
      num--;
      var i = 0;
      for(var i = 0; i< server_user.length; i++)
      {
         if(server_user[i].id ==socket.id){
           server_user.splice(i,1);
         }
      }
      io.emit("user_disconnect", socket.id);
      
   });
});

module.exports = app;
