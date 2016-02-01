var express = require('express');
var exphbs = require('express-handlebars');
var app = express();
var bodyParser = require('body-parser');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/', function(req, res) {
  res.render('home');
});

app.post('/user/register', function(req, res) {
  res.send(req.body);
  console.log('The user has the email address', req.body.email);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
