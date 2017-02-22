var writeJsonFile = require('write-json-file');
var loadJsonFile = require('load-json-file');

function sendMessage(to, messageBody) {
  var accountSid = 'ACf6818969ab2044a3c1ab811b7febee91';
  var authToken = '48df1f449a3f06f4b2594934036fa478';

  //require the Twilio module and create a REST client
  var client = require('twilio')(accountSid, authToken);

  client.messages.create({
      to: to,
      from: "+15719897801",
      body: messageBody
  },

  function(err, message) {
    if (message) {
      console.log(`\n\n Your message to ${message.to} has been sent. \n`);
    }

    if (err) {
      console.log(err.message);
    }
  });
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
