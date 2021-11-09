var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var fileRouter = require('./routes/file');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var uploadRouter = require('./routes/upload');

var app = express();

// app.use(express.static(path.join(__dirname, 'public')));

//환경 변수 불러오기
const env = process.env;

//sequelize 관련
const models = require("./models/index.js");
const { user } = require('./models');
// const tables = require("./models");

//google social login 관련
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { selectColor } = require('debug');
const session = require('express-session');

//유저 인증
const authenticateUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(301).redirect('/login');
  }
};


//db 연결
models.sequelize.sync().then( () => {
    console.log(" DB 연결 성공");
}).catch(err => {
    console.log("연결 실패");
    console.log(err);
})

//session 설정
app.use(session({
  secret: env.SECRET_CODE,
  cookie: { maxAge: 60 * 60 * 1000 },
  resave: true,
  saveUninitialized: false
}));

//passport 구동과 session 연결
app.use(passport.initialize());
app.use(passport.session());



//passport setting

//세션에 정보 저장
passport.serializeUser((user, done) => {
  done(null, user.id); // user객체가 deserializeUser로 전달됨.
});

//request 올 때마다 세션 유효성 확인
passport.deserializeUser((id, done) => {
  done(null, id); // 여기의 user가 req.user가 됨
});

passport.use(new GoogleStrategy({
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  }, async function(accessToken, refreshToken, profile, done) {
    
    console.log(profile);

    const [user_result, created] = await user.findOrCreate({
      where : {googleid : profile.id}
    });

    //데이터 확인
    console.log(user_result.googleid);

    return done(null, profile);
  }
));




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));





// app.use('/', indexRouter);

app.use('/', loginRouter);
app.use('/login', loginRouter);
app.use('/file', authenticateUser, fileRouter); //나중에 이걸로 바꾸기
app.use('/upload', authenticateUser, uploadRouter); //나중에 이걸로 바꾸기
// app.use('/folder', authenticateUser, folderRouter); //폴더 생성

// app.use('/users', usersRouter);

//google social login
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
);

// 인증 성공
app.get('/auth/google/callback',
	passport.authenticate('google', {
  	failureRedirect: '/auth/google',
  	successRedirect: '/file'
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
