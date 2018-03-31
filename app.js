const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');

var db               = require('./config/db');

const path           = require('path');
var routes           = require('./routes');
const app            = express();

const port           = 8080;



MongoClient.connect(db.url, (err, db) => {
   app.use(bodyParser.urlencoded({ extended: true }));
   app.use(bodyParser.json());
   //app.use(express.static(path.join(__dirname, 'public')));

   if (err) return console.log(err)
   var data = db.db('Configomatic');
   routes(app, data);
   app.listen(port, () => {
    console.log('On est en vie sur le port  : ' + port);
  });

  app.get('/', function(req, res, next) {
    res.redirect('/home');
  });

  //app.get('/api', function(req, res, next) {
  //  res.sendFile(__dirname + '/public/index.html')
 //})
})
