var writeJsonFile = require('write-json-file');
var loadJsonFile = require('load-json-file');
var colors = require('colors');

var querystring = require('querystring');
var https       = require('https');

var username = 'Taiwosam';
var apikey   = 'a701c6bdbb3d152a6544c7dd29981bc43123bcc10a48ddec804ac8627b2e3b5d';

function sendMessage(to, messageBody) {
  var post_data = querystring.stringify({
        'username' : username,
        'to'       : to,
        'message'  : messageBody
    });

    var post_options = {
        host   : 'api.africastalking.com',
        path   : '/version1/messaging',
        method : 'POST',

        rejectUnauthorized : false,
        requestCert        : true,
        agent              : false,

        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded',
            'Content-Length': post_data.length,
            'Accept': 'application/json',
            'apikey': apikey
        }
    };

    var post_req = https.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            var jsObject   = JSON.parse(chunk);
            var recipients = jsObject.SMSMessageData.Recipients;
            if ( recipients.length > 0 ) {
                for (var i = 0; i < recipients.length; ++i ) {
                    var logStr  = `Your message to ${recipients[i].number} has been sent.`;
                    console.log(`\n\n${logStr}\n\n`.green.bold);
                    }
                } else {
                    console.log(`Error while sending: ${jsObject.SMSMessageData.Message}`.bold.red);
            }
        });
    });

    post_req.write(post_data);

    post_req.end();
}

if (process.argv.indexOf('-m') !== -1) {
  var contactToText = process.argv[2];
  contactToText = contactToText[0].toUpperCase() + contactToText.slice(1).toLowerCase();

  var body = process.argv[process.argv.indexOf('-m') + 1];

  if (process.argv[process.argv.indexOf('-m') - 1].indexOf('text') !== -1) {
    console.log('\n\n Please enter a name in your contact list \n'.red.bold);
  }

  loadJsonFile('contacts.json').then(contacts => {
    if (contacts[contactToText]) {
      var to = contacts[contactToText][0];
      if (body) {
        sendMessage(to, body);
      }

      else {
        console.log('\n\nYou must enter a message body. Please do so and try again \n'.red.bold);
      }
    }
  });
}

else {
  console.log ('\n\nPlease use the -m flag \n'.red.bold);
}
