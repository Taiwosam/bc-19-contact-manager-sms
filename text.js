var writeJsonFile = require('write-json-file');
var loadJsonFile = require('load-json-file');

var querystring = require('querystring');
var https       = require('https');

var username = 'Taiwosam';
var apikey   = 'a701c6bdbb3d152a6544c7dd29981bc43123bcc10a48ddec804ac8627b2e3b5d';

function sendMessage(to, messageBody) {
  var post_data = querystring.stringify({
        'username' : username,
        'to'       : to,
        'message'  : messageBody,
        'from'     : 'Adedotun Taiwo'
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
                    var logStr  = 'number=' + recipients[i].number;
                    logStr     += ';cost='   + recipients[i].cost;
                    logStr     += ';status=' + recipients[i].status; // status is either "Success" or "error message"
                    console.log(logStr);
                    }
                } else {
                    console.log('Error while sending: ' + jsObject.SMSMessageData.Message);
            }
        });
    });

    // Add post parameters to the http request
    post_req.write(post_data);

    post_req.end();
}

if (process.argv[2]) {
  var contactToText = process.argv[2];
  contactToText = contactToText[0].toUpperCase() + contactToText.slice(1).toLowerCase();

  loadJsonFile('contacts.json').then(contacts => {
    if (contacts[contactToText]) {
      var to = contacts[contactToText][0];
      if (process.argv.indexOf('-m') !== -1) {
        var body = process.argv[process.argv.indexOf('-m') + 1];
        sendMessage(to, body);
      }

      else {
        console.log ('\n\nPlease use the -m flag');
      }
    }
  });
}

else {
  console.log('\n\n Please enter a contact name and message body in this format: \n\n');
  console.log(' text <contact name> "message body"\n');
}
