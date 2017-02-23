#!/usr/bin/env node
var writeJsonFile = require('write-json-file');
var loadJsonFile = require('load-json-file');
var colors = require('colors');
var Table = require('cli-table');

loadJsonFile('contacts.json').then(contacts => {
  console.log('\n');

  if (process.argv.indexOf('-sort') !== -1) {
    var contactNames = [];

    for (var name in contacts) {
      contactNames.push(name);
    }

    var contactList = contactNames.sort();

    var serialNumber = 0;

    var table = new Table({
        head: ['S/N', 'Name', 'Phone Number', 'Email'],
        colWidths: [7, 30, 30, 40]
    });

    for (var contact of contactList) {
      serialNumber += 1;
      var sN = String(serialNumber) + '.';
      table.push( [`${sN.red}`, `${contact.cyan}`, `${contacts[contact][0] ? contacts[contact][0].cyan : ''}`, `${contacts[contact][1] ? contacts[contact][1].cyan : ''}`] );
    }

    console.log(table.toString());
    console.log('\n');
  }

  else {
    var serialNumber = 0;

    var table = new Table({
        head: ['S/N', 'Name', 'Phone Number', 'Email'],
        colWidths: [7, 30, 30, 40]
    });

    for (var contact in contacts) {
      serialNumber += 1;
      var sN = String(serialNumber) + '.';

      table.push( [`${sN.red}`, `${contact.cyan}`, `${contacts[contact][0] ? contacts[contact][0].cyan : ''}`, `${contacts[contact][1] ? contacts[contact][1].cyan : ''}`] );
    }

    console.log(table.toString());
    console.log('\n');
  }

});
