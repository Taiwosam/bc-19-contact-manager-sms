#!/usr/bin/env node
var writeJsonFile = require('write-json-file');
var loadJsonFile = require('load-json-file');
var prompt = require('prompt');

function search(contactName) {
  loadJsonFile('contacts.json').then(contacts => {
    if (contacts[contactName]) {
      console.log ('\n\n');
      console.log(`Phone Number: ${contacts[contactName][0]} Email: ${contacts[contactName][1]}`);
      console.log('\n\n');
    }

    else {
      var likelyContacts = []
      var namesInContacts = Object.keys(contacts);
      for (var name of namesInContacts) {
        if (name.indexOf(contactName) !== -1) {
          likelyContacts.push(name);
        }
      }

      if (likelyContacts.length === 0) {
        console.log('\n\n You do not have a contact with such name \n\n');
      }

      else {
        var promptQuestion = `\n\nWhich ${contactName}?\n`;
        likelyContacts.forEach((contact, index) => {
          promptQuestion += `[${index + 1}]: ${contact}\n`;
        });

        var properties = {};
        properties[promptQuestion] = {
          pattern: /^[1-9]+$/,
          message: 'Choice must be a number',
          required: true
        }
        var schema = {
            properties
          };

        prompt.start()

        prompt.get(schema, function (err, result) {
          search(likelyContacts[ result[promptQuestion] - 1 ]);
        });
      }
    }
  });
}

if (process.argv[2]) {
  contactName = []
  for (var i of process.argv.slice(2)) {
    contactName.push(i);
  }

  contactName = contactName.join(' ');
  search(contactName);
}

else {
  console.log('\n\n Please enter a search parameter \n');
}
