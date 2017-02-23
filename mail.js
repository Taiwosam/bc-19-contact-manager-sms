var sg = require('sendgrid')('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');

var writeJsonFile = require('write-json-file');
var loadJsonFile = require('load-json-file');
var colors = require('colors');
var prompt = require('prompt');

function sendMail(to, body) {
  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: {
      personalizations: [
        {
          to: [
            {
              email: `${to}`,
            },
          ],
          subject: 'From Me To You',
        },
      ],
      from: {
        email: 'adedotun.taiwo.a@gmail.com',
      },
      content: [
        {
          type: 'text/plain',
          value: `${body}`,
        },
      ],
    },
  });

  //With promise
  sg.API(request)
    .then(response => {
      console.log('\n\nSuccess: Mail sent.\n'.bold.cyan);
    })
    .catch(error => {
      //error is an instance of SendGridError
      //The full response is attached to error.response
      console.log ('\n\n An error occurred.\n'.red.bold);
      console.log(error.response.statusCode);
    });

}

if (process.argv.indexOf('-m') !== -1) {

  if (process.argv[2] !== '-m' && process.argv[2].indexOf('text') === -1) {
    contactToMail = [];
    for (var i of process.argv.slice(2)) {
      contactToMail.push(i);
    }

    contactToMail = contactToMail.join(' ');

    var contactRegex = /[a-zA-Z ]+[a-zA-Z]+/;
    var contactToMail = contactRegex.exec(contactToMail);
    contactToMail = contactToMail[0].toLowerCase();
  }

  else {
    console.log('\n\n Please enter a contact name to mail. \n'.red.bold);
    process.exit();
  }

  var body = process.argv[process.argv.indexOf('-m') + 1];

  loadJsonFile('contacts.json').then(contacts => {
    var contactNames = Object.keys(contacts);
    var searchResults = [];

    for (var i of contactNames) {
      j = i.toLowerCase();
      if (j.indexOf(contactToMail) !== -1) {
        searchResults.push(i);
      }
    }

    if (searchResults.length === 1 && contacts[searchResults[0]]) {
      var to = contacts[searchResults[0]][1];
      if (body) {
        if (to) {
          sendMail(to, body);
        }

        else {
          console.log (`\n\n${searchResults[0]} does not have an email address.`.red.bold);
          process.exit()
        }
      }

      else {
        console.log('\n\nYou must enter a message body. Please do so and try again. \n'.red.bold);
        process.exit();
      }
    }

    else {
      if (!body) {
        console.log('\n\nYou must enter a message body. Please do so and try again. \n'.red.bold);
        process.exit();
      }

      if (searchResults.length === 0 && process.argv[process.argv.indexOf('-m') - 1].indexOf('text') === -1) {
        console.log('\n\n You do not have a contact with such name. Please check and try again. \n\n'.red.bold);
        process.exit();
      }

      else {
        var promptQuestion = `\n\nWhich ${contactToMail} do you want to text?\n`.grey.bold;
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
            var to = contacts[chosenContact][1];
            if (to) {
              sendMail(to, body);
            }

            else {
              console.log (`\n\n${searchResults[0]} does not have an email address.`.red.bold);
              process.exit()
            }
          }
        });
      }
    }
  });
}

else {
  console.log ('\n\nYou must use the -m flag to send a mail. Format: node mail <name> -m "message".\n'.red.bold);
}
