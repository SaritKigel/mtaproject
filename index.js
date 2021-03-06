var express = require("express");

var path = require('path');

var bodyParser = require('body-parser');
var connection = require('./config');
var app = express();

var authenticateController = require('./controllers/authenticate-controller');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('assets'));

//Redirect homepage to login

app.get('/', function (req, res) {
    res.redirect('/login');
});

//Redirect login to login.html

app.get('/login', function (req, res) {
    res.sendFile(__dirname + "/" + "login.html");
});

app.get('/events', function (req, res) {
    res.sendFile(__dirname + "/" + "events.html");
});

app.get('/test', function(req, res){
    res.sendFile(__dirname + "/" + "test.html");
});

app.post('/events', function (req, res) {
    event_date = req.body['event_date'];
    event_description = req.body['event_description'];
    connection.query(`INSERT INTO sadna.Events VALUES(STR_TO_DATE('${event_date}', '%b %d, %Y'), '${event_description}')`);
    res.sendFile(__dirname + "/" + "events.html");
});

app.get('/get_events_list', function (req, res) {
    connection.query('SELECT DATE_FORMAT(eventDate, \'%b %d, %Y\') AS eventDate, eventDescription FROM sadna.Events WHERE eventDate > CURDATE()', function(error, results, fields){
        if (error){
            res.send(error);
        }
        else{
            res.send(results);
        }
    });
});

/* route to handle login */
app.post('/api/authenticate', authenticateController.authenticate);

console.log(authenticateController);
app.post('/controllers/authenticate-controller', authenticateController.authenticate);
app.listen(5000);
