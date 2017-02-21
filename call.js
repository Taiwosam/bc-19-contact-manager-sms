var accountSid = 'ACf6818969ab2044a3c1ab811b7febee91';
var authToken = "your_auth_token";
var client = require('twilio')(accountSid, authToken);

client.calls.create({
    url: "http://demo.twilio.com/docs/voice.xml",
    to: "+14155551212",
    from: "+15017250604"
}, function(err, call) {
    process.stdout.write(call.sid);
});

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
