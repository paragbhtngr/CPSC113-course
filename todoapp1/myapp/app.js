var express = require('express');
var exphbs = require('express-handlebars');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var Users = require('./models/users.js');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {secure: 'auto'}
}));

app.use(function(req, res, next){
  console.log('req.session =', req.session);
  if(req.session.userId){
      Users.findById(req.session.userId, function(err, user){
        if(!err){
          res.locals.currentUser = user;
        }
        next();
      });
  }else {
    next();
  }
});

app.get('/', function(req, res) {
  Users.count(function(err, users){
    if(err) {
      res.send('error getting users');
    }else {
      res.render('home', {
        userCount: users.length,
        currentUser: res.locals.currentUser
      });
    }
  });
});

app.post('/user/register', function(req, res) {
  if(req.body.password !== req.body.password_confirmation){
    return res.render('home', {errors: "Password and Password confirmation do not match"});
  }
  var newUser = new Users();
  newUser.hashed_password = req.body.password;
  newUser.email = req.body.email;
  newUser.name = req.body.fl_name;
  newUser.save(function(err, user){
    req.session.userId = user._id;
    if(err){
      res.render('home', {errors: err});
    }else {
      res.redirect('/');
    }
  });
  console.log('The user has the email address', req.body.email);
});

app.get('/user/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
