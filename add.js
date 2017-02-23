#!/usr/bin/env node

var writeJsonFile = require('write-json-file');
var loadJsonFile = require('load-json-file');
var colors = require('colors');
var prompt = require('prompt');

function addContact(contactName, phoneNumber, email) {
  loadJsonFile('contacts.json').then(contacts => {
    if (contacts[contactName]) {
      if (!!email && !contacts[contactName][1]) {
        contacts[contactName][1] = email;
        writeJsonFile('contacts.json', contacts);
      }

      else if (!!phoneNumber && !contacts[contactName][0]) {
        contacts[contactName][0] = phoneNumber;
        writeJsonFile('contacts.json', contacts);
      }

      else {
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
    console.log ('\n\n Please input the -n flag. \n\n'.red.bold);
    process.exit();
  }

  if (process.argv.indexOf('-p') !== -1) {
    var rawNumber = /^\d{10,11}$/.exec(process.argv[process.argv.indexOf('-p') + 1]);
    if (rawNumber) {
      rawNumber = rawNumber[0];
    }

    if (!!rawNumber) {
      if (rawNumber.length === 11) {
        rawNumber = rawNumber.slice(1);
      }

      else if (rawNumber.length === 10) {
        rawNumber = rawNumber;
      }

      phoneNumber = '+234' + rawNumber;
    }

    else {
      console.log('\n\nPlease input a valid phone number after the -p flag.\n'.red.bold);
      process.exit();
    }
  }

  if (process.argv.indexOf('-e') !== -1) {
    var validEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z.-]+.[a-zA-Z]{2,}$/;
    rawEmail = process.argv[process.argv.indexOf('-e') + 1];

    if (validEmail.exec(rawEmail)) {
      email = rawEmail;
    }

    else {
      console.log('\n\nPlease input a valid email\n'.bold.red);
      process.exit();
    }
  }

  addContact(contactName, phoneNumber, email);
}

else if (process.argv[2] === 'init') {
  writeJsonFile('contacts.json', {});
}

else {
  console.log('\n\nPlease enter a name \n'.red.bold);
  process.exit();
}
