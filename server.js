var express = require("express");
var app = express();
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(require('express-session')({ secret: 'encodekey', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      res.setHeader('Access-Control-Allow-Credentials', true);
      next();
  });


var records = [
    { id: 1, username: '9170608140', password: 'ashutosh', displayName: 'admin', emails: [ { value: 'user1@domain.com' } ] }
  , { id: 2, username: '9170608141', password: 'ashutoshsingh', displayName: 'user', emails: [ { value: 'user2@domain.com' } ] }
];

// var api = require("./api");
// var db = require("./app");
// api.init(app);

passport.use(new localStrategy(
  function(username, password, cb) {
    findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});


app.post('/login', passport.authenticate('local', { failureRedirect: '/loginFailed' }),
  function(req, res) {
    res.redirect('/');
});


app.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
  });

app.get('/login',
  function(req, res){
    res.render('login');
  });

app.get('/loginFailed',
  function(req, res){
    res.render('Loginfailed');
  });
  
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/loginFailed' }),
  function(req, res) {
    res.redirect('/');
  });
  
app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

app.get('/profile',
  function(req, res){
    res.render('profile', { user: req.user });
  });

var findById = function(id, cb) {
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
}

var findByUsername = function(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}
app.listen(3000);



