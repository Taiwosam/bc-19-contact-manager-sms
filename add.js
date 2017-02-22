#!/usr/bin/env node
var writeJsonFile = require('write-json-file');
var loadJsonFile = require('load-json-file');
var colors = require('colors');
var prompt = require('prompt');

function addContact(contactName, phoneNumber, email) {
  if (!phoneNumber && !email) {
    console.log ('\n\n Contact must have phone number and/or email address \n\n'.red.bold);
  }

  loadJsonFile('contacts.json').then(contacts => {
    if (contacts[contactName]) {
      var promptStr = `\n\n${contactName} already exists. Do you want to override contact? (Y/N)\n`;

      prompt.start();
      prompt.get(promptStr, function(err, result) {
        result[promptStr] = result[promptStr].toLowerCase();

        if (result[promptStr] === 'y') {
          contacts[contactName] = [null, null];

          if (isDuplicateNumber(phoneNumber, contacts)) {
            var promptMessage = isDuplicateNumber(phoneNumber, contacts);
            prompt.start();

            prompt.get(promptMessage, function(err, result) {
              if (result[promptMessage].toLowerCase() === 'y') {
                contacts[contactName][0] = phoneNumber;
                contacts[contactName][1] = email;
                if (contacts[contactName][0] === null && contacts[contactName][1] === null) {
                  delete contacts[contactName];
                  writeJsonFile('contacts.json', contacts);
                }

                else {
                  writeJsonFile('contacts.json', contacts);
                }
              }
            });
          }

          else {
            contacts[contactName] = [phoneNumber, email];
            writeJsonFile('contacts.json', contacts);
          }
        }

        else {
          process.exit();
        }
      });
    }

    else {
      contacts[contactName] = [null, null];

      if (isDuplicateNumber(phoneNumber, contacts)) {
        var promptMessage = isDuplicateNumber(phoneNumber, contacts);
        prompt.start();

        prompt.get(promptMessage, function(err, result) {
          if (result[promptMessage].toLowerCase() === 'y') {
            contacts[contactName][0] = phoneNumber;
            contacts[contactName][1] = email;
            if (contacts[contactName][0] === null && contacts[contactName][1] === null) {
              delete contacts[contactName];
              writeJsonFile('contacts.json', contacts);
            }

            else {
              writeJsonFile('contacts.json', contacts);
            }
          }
        });
      }

      else {
        contacts[contactName] = [phoneNumber, email];
        writeJsonFile('contacts.json', contacts);
      }
    }
  });
}

function isDuplicateNumber (phoneNumber, contacts) {
	var numberConflicts = [];

	for (var i in contacts) {
		if (contacts[i][0] === phoneNumber) {
			numberConflicts.push(i);
		}
	}

	var numberPrompt = `${phoneNumber} already exists for:\n`;

	if (numberConflicts.length > 0) {
		for (var j of numberConflicts) {
			numberPrompt += `${j}\n`;
		}

		numberPrompt += '\nContinue? (Y/N)';
	}

	return numberConflicts.length > 0 ? numberPrompt : null;
}

if (/^[a-zA-Z]+$/.exec(process.argv[3])) {
  var contactName;
  var phoneNumber;
  var email;

  if (process.argv.indexOf('-n') !== -1) {
    var validName = /^[a-zA-Z]+$/;
    var firstAndLast = [];
    var firstName = process.argv[process.argv.indexOf('-n') + 1];
    var lastName = process.argv[process.argv.indexOf('-n') + 2];
    var firstNameMatch = validName.exec(firstName);
    var lastNameMatch = validName.exec(lastName);

    if (firstNameMatch) {
      firstAndLast.push(firstNameMatch[0]);
    }

    if (lastNameMatch) {
      firstAndLast.push(lastNameMatch[0]);
    }

    contactName = firstAndLast.join(' ');
  }

  else {
    console.log ('\n\n Contact must have a name \n\n'.red.bold);
  }

  if (process.argv.indexOf('-p') !== -1) {
    var rawNumber = process.argv[process.argv.indexOf('-p') + 1];
    if (rawNumber.length === 11) {
      rawNumber = rawNumber.slice(1);
    }

    else {
      console.log ('\n\nPlease input a valid phone number\n'.red.bold);
    }
    phoneNumber = '+234' + rawNumber;
  }

  if (process.argv.indexOf('-e') !== -1) {
    var validEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z.-]+.[a-zA-Z]{2,}$/;
    rawEmail = process.argv[process.argv.indexOf('-e') + 1];

    if (validEmail.exec(rawEmail)) {
      email = rawEmail;
    }

    else {
      console.log('\n\nPlease input a valid email\n'.bold.red);
    }
  }

  addContact(contactName, phoneNumber, email);
}

else if (process.argv[2] === 'init') {
  writeJsonFile('contacts.json', {});
}

else {
  console.log('\n\nPlease enter a name \n'.red.bold);
}
