#!/usr/bin/env node
var writeJsonFile = require('write-json-file');
var loadJsonFile = require('load-json-file');
var prompt = require('prompt');
var colors = require('colors');

function search(contactName) {
  contactName = contactName.toLowerCase();
  loadJsonFile('contacts.json').then(contacts => {

    var contactNames = Object.keys(contacts);
    var searchResults = [];

    for (var i of contactNames) {
      j = i.toLowerCase();
      if (j.indexOf(contactName) !== -1) {
        searchResults.push(i);
      }
    }

    if (searchResults.length === 1 && contacts[searchResults[0]]) {
      console.log ('\n\n');
      console.log(`Phone Number: ${contacts[searchResults[0]][0]} Email: ${contacts[searchResults[0]][1]}`.cyan.bold);
      console.log('\n\n');
    }

    else {
      if (searchResults.length === 0) {
        console.log('\n\n You do not have a contact with such name \n\n'.red.bold);
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
            console.log('\n\n The number you chose is out of range. Please try again. \n\n'.red.bold);
          }

          else {
            chosenContact = searchResults[ result[promptQuestion] - 1 ];
            console.log ('\n\n');
            console.log(`Phone Number: ${contacts[chosenContact][0]} Email: ${contacts[chosenContact][1]}`.cyan.bold);
            console.log('\n\n');
          }
        });
      }
    }
  });
}

if (process.argv[2]) {
  contactName = [];
  for (var i of process.argv.slice(2)) {
    contactName.push(i);
  }

  contactName = contactName.join(' ');
  search(contactName);
}

else {
  console.log('\n\n Please enter a search parameter \n'.red.bold);
}
