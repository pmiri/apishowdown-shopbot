const express = require('express')
const http = require('http')
const https = require('https')

var bodyParser = require('body-parser')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var sessionStore = require('sessionstore')

var crypto = require('crypto')

var shortid = require('shortid')

var request = require('request-promise-native')

var jose = require('node-jose')

require('dotenv').config()

const app = express()

var fs = require('fs');

var discover = require('./discover')

app.use(express.static('static'))

app.use(express.static(__dirname + '/public'))

app.enable('trust proxy');
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
   secret: process.env.SECRET,
   proxy: true,
   key: 'session.sid',
   cookie: {secure: true},
   store: sessionStore.createSessionStore()
}));


/**
 * Our example client
 */
var fake_cc = {
    pan: process.env.PAN,
    expDate: '0419',
    cardHolderName: 'Francis M',
    billingAddr: '123 Fake Street',
    billingZip: '12345',
    cid: '1234',
    source: "on-file"
}

app.get('/', function (req, res) {
  res.send('Hello World!')
})       

/**
 * POST location for our chatbot console to get answers
 */
app.post('/chatbot', function (req, res) {

var send_object = {}
switch(req.body.result.action){
    case 'menu.show':
    send_object = {'speech': ' Here is our menu. Choose one of the following options',
                'displayText': ' Here is our menu. Choose one of the following options',
                'messages':
                [
                {'title': ' Here is our menu. Choose one of the following options',
                    'replies': ['Hot Dog $2',
                                'Chili Dog $3',
                                'Deep Dish $10'],
                    'type': 2}],
                'source': 'Chi Pizza'
                    }
                    break;    
case 'list.pay':

    var discover_token = discover.getOrCreateCreditCard()
    send_object = {

        "speech": "Payment Complete",
      "messages": [
        {
          "type": 0,
          "id": shortid.generate(),
          "speech": "Your payment has been processed. Shipping to " + fake_cc.billingAddr
        },
        {
            "type": 0,
            "id": shortid.generate(),
            "speech": "You used your Discover Card for this transaction!"
          },
          {
            "type": 3,
            "id": "beddaed6-91d8-4262-8f0a-cdc46e0c887b",
            "imageUrl": "http://www.hissingkitty.com/sites/default/files/company_logo/discover-card-customer-service-number.jpeg"
          }
      ]
    }
    break;
    default: send_object = {"speech": "I don't know what to do!"}; break;
}
 res.setHeader('Content-Type', 'application/json');
 res.send(JSON.stringify(send_object))
})

/**
 * Create a one-time login token for the Discover API
 */
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
    json = JSON.parse(res.body);
    console.log("Access Token:\n", json);
  })
    .catch(err => {
      console.log(err)
  })

/**
 * Start Server
 * HTTP and HTTPS compliant
 */
http.createServer(app).listen(3000, function(){
    console.info('http listening on port: ' + 3000)
})

if(process.env.NODE_ENV === 'production'){

    var options = {
        key: fs.readFileSync(process.env.SSL_PRIVKEY),
        cert: fs.readFileSync(process.env.SSL_CERT),
        ca: fs.readFileSync(process.env.SSL_CHAIN)
      };

    https.createServer(options, function (req, res) {
    res.writeHead(200);
    res.end("https port listening on" + 8000);
    }).listen(8000, function(){
        console.info('https listening on port: ' + 8000)
    });
}
