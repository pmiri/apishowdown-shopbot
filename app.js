const express = require('express')
const http = require('http')
const https = require('https')

var bodyParser = require('body-parser')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var sessionStore = require('sessionstore')

var request = require('request-promise-native')

require('dotenv').config()

const app = express()

var fs = require('fs');

app.use(express.static('static'))

app.use(express.static(__dirname + '/public'))

app.enable('trust proxy');
app.use(bodyParser());
app.use(cookieParser());
app.use(session({
   secret: 'Super Secret Password',
   proxy: true,
   key: 'session.sid',
   cookie: {secure: true},
   store: sessionStore.createSessionStore()
}));

app.get('/', function (req, res) {
  res.send('Hello World!')
})       

app.post('/', function (req, res) {

var response = JSON.parse(req.body)

console.log(response)

if(response.action === 'menu.show'){
    var send_object = {'speech': 'What would you like to eat?',
                'displayText': 'Place your order',
                'messages':
                [
                {'title': 'Place your order',
                    'replies': ['Hot Dog',
                                'Chili Dog',
                                'Deep Dish'],
                    'type': 2}],
                'source': 'Chi Pizza'
                    }
}
 res.setHeader('Content-Type', 'application/json');
 res.send(JSON.stringify(send_object))
})

request({
    url: 'https://apis.discover.com/auth/oauth/v2/token',
    method: 'POST',
    auth: {
      user: 'l7xx53cc5c914bd44f659e06ca2fe34fb037',
      pass: 'cfd853d383174b739bf014074c19dc96'
    },
    form: {
      'grant_type': 'client_credentials'
    },
    resolveWithFullResponse: true    
  }).then( function(res) {
    var json = JSON.parse(res.body);
    console.log("Access Token:\n", json);
  /**
    return request({
        url: 'https://apis.discover.com/nws/nwp/cof/v0/account/provision',
        method: 'POST',
        auth: {
            'bearer': json.access_token
          },
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        'x-dfs-api-plan': 'NWS-COF-Sandbox',
        'x-dfs-c-app-cert': 'dfsexxebQRNO8I-YpUtHQ3nLrzhMFzcvs38jMJrC2ISPAtFz0'
        },
        body: {
            'userContext': {
                'walletId': '6011000010048738'
            },
            'programId': '8020'
        },
        resolveWithFullResponse: true   
      })
  }).then(res => {
    console.log('hello')
    var json = JSON.parse(res.body);
    console.log("Response:", json);
    */
  }).catch(err => {
      console.log(err)
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
