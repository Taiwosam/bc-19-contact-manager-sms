#!/usr/bin/env node
var writeJsonFile = require('write-json-file');
var loadJsonFile = require('load-json-file');
var colors = require('colors');

loadJsonFile('contacts.json').then(contacts => {
  console.log('\n');
  if (process.argv.indexOf('-c') !== -1) {
    console.log(`\n ${'S/N'.underline.red.bold}${" ".repeat(2)} ${'Name'.underline.red.bold}${" ".repeat(21)} ${'Phone Number'.underline.red.bold}   ${" ".repeat(10)} ${'Email'.underline.red.bold} \n`);
  }

  else {
    console.log(`\n ${'S/N'}${" ".repeat(2)} ${'Name'}${" ".repeat(21)} ${'Phone Number'}   ${" ".repeat(10)} ${'Email'} \n`);
  }

  if (process.argv.indexOf('-sort') !== -1) {
    var contactNames = [];

    for (var name in contacts) {
      contactNames.push(name);
    }

    var contactList = contactNames.sort();

    var serialNumber = 0;

    for (var contact of contactList) {
      var justifyContact = 25 - contact.length;
      var justifyNumber = 14;
      serialNumber += 1;
      var sN = String(serialNumber) + '.';

      if (process.argv.indexOf('-c') !== -1) {
        console.log(`\n ${sN.underline.red.bold}${" ".repeat(5 - sN.length)} ${contact.cyan.bold}${" ".repeat(justifyContact)} ${contacts[contact][0] ? contacts[contact][0].cyan.bold : ' '.repeat(justifyNumber)} ${" ".repeat(10)} ${contacts[contact][1] ? contacts[contact][1].cyan.bold : ''} \n`);
      }

      else {
        console.log(`\n ${sN.underline}${" ".repeat(5 - sN.length)} ${contact}${" ".repeat(justifyContact)} ${contacts[contact][0] ? contacts[contact][0] : ' '.repeat(justifyNumber)} ${" ".repeat(10)} ${contacts[contact][1] ? contacts[contact][1] : ''} \n`);
      }
    }

    console.log('\n');
  }

  else {
    var serialNumber = 0;

    for (var contact in contacts) {
      var justifyContact = 25 - contact.length;
      var justifyNumber = 14;
      serialNumber += 1;
      var sN = String(serialNumber) + '.';

      if (process.argv.indexOf('-c') !== -1) {
        console.log(`\n ${sN.underline.red.bold}${" ".repeat(5 - sN.length)} ${contact.cyan.bold}${" ".repeat(justifyContact)} ${contacts[contact][0] ? contacts[contact][0].cyan.bold : ' '.repeat(justifyNumber)} ${" ".repeat(10)} ${contacts[contact][1] ? contacts[contact][1].cyan.bold : ''} \n`);
      }

      else {
        console.log(`\n ${sN.underline}${" ".repeat(5 - sN.length)} ${contact}${" ".repeat(justifyContact)} ${contacts[contact][0] ? contacts[contact][0] : ' '.repeat(justifyNumber)} ${" ".repeat(10)} ${contacts[contact][1] ? contacts[contact][1] : ''} \n`);
      }
    }

    console.log('\n');
  }

});
