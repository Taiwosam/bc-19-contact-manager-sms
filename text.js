var writeJsonFile = require('write-json-file');
var loadJsonFile = require('load-json-file');
var colors = require('colors');
var prompt = require('prompt');

var querystring = require('querystring');
var https       = require('https');

var username = 'Taiwosam';
var apikey   = 'a701c6bdbb3d152a6544c7dd29981bc43123bcc10a48ddec804ac8627b2e3b5d';

function sendMessage(to, messageBody) {
  if (!(/\+\d+/.exec(to))) {
    console.log ("\n\n Please enter a valid phone number. \n".red.bold);
    process.exit();
  }

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
                    var logStr  = `${recipients[i].status}: Your message to ${recipients[i].number} has been sent.`;
                    console.log(`\n\n${logStr}\n\n`.green.bold);
                    }
                }

            else {
              console.log(`Error while sending: ${jsObject.SMSMessageData.Message}`.bold.red);
            }
        });
    });

    post_req.write(post_data);

    post_req.end();
}

if (process.argv.indexOf('-m') !== -1) {
  if (process.argv[2] !== '-m' && process.argv[2].indexOf('text') === -1) {

    contactToText = [];
    for (var i of process.argv.slice(2)) {
      contactToText.push(i);
    }

    contactToText = contactToText.join(' ');

    var contactRegex = /[a-zA-Z ]+[a-zA-Z]+/;
    var contactToText = contactRegex.exec(contactToText);
    contactToText = contactToText[0].toLowerCase();
  }

  else {
    console.log('\n\n Please enter a name in your contact list you want to text. \n'.red.bold);
    process.exit();
  }

  var body = process.argv[process.argv.indexOf('-m') + 1];

  loadJsonFile('contacts.json').then(contacts => {
    var contactNames = Object.keys(contacts);
    var searchResults = [];

    for (var i of contactNames) {
      j = i.toLowerCase();
      if (j.indexOf(contactToText) !== -1) {
        searchResults.push(i);
      }
    }

    if (searchResults.length === 1 && contacts[searchResults[0]]) {
      var to = contacts[searchResults[0]][0];
      if (body) {
        sendMessage(to, body);
      }

      else {
        console.log('\n\nYou must enter a message body. Please do so and try again. \n'.red.bold);
      }
    }

    else {
      if (!body) {
        console.log('\n\nYou must enter a message body. Please do so and try again \n'.red.bold);
        process.exit();
      }

      if (searchResults.length === 0 && process.argv[process.argv.indexOf('-m') - 1].indexOf('text') === -1) {
        console.log('\n\n You do not have a contact with such name. Please check and try again. \n\n'.red.bold);
        process.exit();
      }

      else {
        var promptQuestion = `\n\nWhich ${contactToText} do you want to text?\n`.grey.bold;
        searchResults.forEach((contact, index) => {
          promptQuestion += `[${index + 1}]: ${contact}\n`.grey.bold;
        });

        var properties = {};
        properties[promptQuestion] = {
          pattern: /^[1-9]+$/,
          message: '\n\nChoice must be a number \n'.red.bold,
          required: true
        }

        var schema = {
            properties
          };

        prompt.start()

        prompt.get(schema, function (err, result) {
          if (result[promptQuestion] > searchResults.length) {
            console.log('\n\n The number you chose is out of range. Please try again. \n\n'.red.bold);
          }

          else {
            chosenContact = searchResults[ result[promptQuestion] - 1 ];
            var to = contacts[chosenContact][0];

            sendMessage(to, body);
          }
        });
      }
    }
  });
}

else {
  console.log ('\n\nPlease use the -m flag \n'.red.bold);
}
