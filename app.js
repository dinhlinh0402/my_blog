const express = require('express');
// const port = 3000;
var config = require('config');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');

var socketio = require('socket.io');

const app = express();
// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
    extended: true,
}));

app.set('trust proxy', 1); // trust first proxy
app.use(session({
  secret: config.get("secret_key"),
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// app.set('views', path.join(__dirname, 'apps/views'));
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'apps','views'));
app.set('views',__dirname + '/apps/views');



// Static folder
app.use('/static', express.static(__dirname + '/public'));

const controllers = require('./apps/controllers');

app.use(controllers);

var host = config.get('server.host');
var port = config.get('server.port');

var server = app.listen(port, host, () => {
    console.log(`App listening at http://localhost:${port}`);
});

var io = socketio(server);

var socketcontrol = require('./apps/common/socketcontrol')(io);