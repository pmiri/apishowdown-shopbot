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

function getOrCreateCreditCard(){
var kid64 = crypto.createHash('sha256').update(fs.readFileSync(process.env.PKEY_PATH)).digest('base64')
    var props = {
        kid: kid64,
        alg: 'RSA1_5',
        use: 'enc'
    }

 keystore.generate("oct", 256, props)
.then( key => {

    return jose.JWE.createEncrypt(JSON.stringify(key))
    .update(fake_cc)
    .final()
  })
    .then(function(result) {
      
    console.log(result)

    return request({
        url: 'https://apis.discover.com/nws/nwp/cof/v0/account/provision',
        method: 'POST',
        auth: {
            bearer: json.access_token
          },
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        'x-dfs-api-plan': 'NWS-COF-Sandbox',
        'x-dfs-c-app-cert': 'dfsexxebQRNO8I-YpUtHQ3nLrzhMFzcvs38jMJrC2ISPAtFz0'
        },
        body: {
            'requestId': shortid.generate(),
            'sessionId': sessionId,
            'userContext': {
                'walletId': '6011000010048738'
            },
            'accountProvisionRequest':{
                'secureContext':{
                    'encryptedContent':JSON.stringify(result)
                }
            },
            'programId': 8020
        },
        json: true,
        resolveWithFullResponse: true   
      })
  }).then(res => {
   return(res.body)
  })
}

module.exports.getOrCreateCreditCard = getOrCreateCreditCard