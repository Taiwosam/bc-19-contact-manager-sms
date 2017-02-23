var writeJsonFile = require('write-json-file');
var loadJsonFile = require('load-json-file');
var colors = require('colors');
var prompt = require('prompt');

if (process.argv[2] === 'deleteall') {
  loadJsonFile('contacts.json').then(contacts => {
    contacts = {};
    writeJsonFile('contacts.json', contacts);
  });
}

else {
  if (process.argv[2] !== 'deleteall' && !!process.argv[2]) {

    loadJsonFile('contacts.json').then(contacts => {
      var contactToDelete = process.argv.slice(2);
      var contactName = contactToDelete.join(' ')

      var contactNames = Object.keys(contacts);
      var searchResults = [];

      for (var i of contactNames) {
        j = i.toLowerCase();
        if (j.indexOf(contactName) !== -1) {
          searchResults.push(i);
        }
      }

      if (searchResults.length === 1 && contacts[searchResults[0]]) {
        delete contacts[searchResults[0]];
        writeJsonFile('contacts.json', contacts);
        console.log ('\n\n');
        console.log(`Successfully deleted ${searchResults[0]}`.cyan.bold);
        console.log('\n');
      }

      else {
        if (searchResults.length === 0) {
          console.log('\n\n You do not have a contact with such name \n'.red.bold);
          process.exit();
        }

        else {
          var promptQuestion = `\n\nWhich ${contactName}?\n`.grey.bold;
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
              console.log('\n\n The number you chose is out of range. Please try again. \n'.red.bold);
            }

            else {
              chosenContact = searchResults[ result[promptQuestion] - 1 ];
              delete contacts[chosenContact];
              writeJsonFile('contacts.json', contacts);
              console.log ('\n\n');
              console.log(`Successfully deleted ${chosenContact}\n`.cyan.bold);
            }
          });
        }
      }
    });
  }
}

if (!process.argv[2]) {
  console.log('\n\n Please enter either deleteall (to delete all contacts) or a contact name to delete.'.red.bold)
}
