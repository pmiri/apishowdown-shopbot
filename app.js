const express = require('express')
const http = require('http')
const https = require('https')

require('dotenv').config()

const app = express()

var fs = require('fs');

app.use(express.static('static'))

app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/menu/show', function(req, res){
    res.send(JSON.stringify({
        "speech": "Barack Hussein Obama II was the 44th and current President of the United States.",
        "displayText": "Barack Hussein Obama II was the 44th and current President of the United States, and the first African American to hold the office. Born in Honolulu, Hawaii, Obama is a graduate of Columbia University   and Harvard Law School, where ",
        "data": {},
        "contextOut": [],
        "source": "DuckDuckGo"
        }))
})


http.createServer(app).listen(3000, function(){
    console.info('http listening on port: ' + 3000)
})

if(process.env.NODE_ENV === 'production'){

    var options = {
        key: fs.readFileSync('/etc/letsencrypt/live/shopbot.pmir.me/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/shopbot.pmir.me/cert.pem'),
        ca: fs.readFileSync('/etc/letsencrypt/live/shopbot.pmir.me/chain.pem')
      };

    https.createServer(options, function (req, res) {
    res.writeHead(200);
    res.end("https port listening on" + 8000);
    }).listen(8000, function(){
        console.info('https listening on port: ' + 8000)
    });
}