var fs = require('fs');
var readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

var stringifyPhonebook = function(phonebook) {
    var stringifiedPhonebook = JSON.stringify(phonebook);
    return stringifiedPhonebook;
};

var writePhonebookToFile = function(stringifiedPhonebook) {
    fs.writeFile('phonebook.txt', stringifiedPhonebook, function(error) {
    });
};

var mainMenu = function() {

    var menuItems = [
        '\n',
        'Electronic Phone Book',
        '=====================',
        '1. Look up an entry',
        '2. Set an entry',
        '3. Delete an entry',
        '4. List all entries',
        '5. Quit'
    ];

    var displayMenu = function () {
        menuItems.forEach(function (item) {
            console.log(item);
        });
    };

    var lookUpEntry = function () {
        console.log(menuItems[2] + '\n' + menuItems[3] + '\n' + menuItems[2])
        rl.question('Name: ', function(name) {
            importPhonebook();
            var entryCounter = 0;
            phonebookEntries.forEach(function(entry) {
                if (entry.firstname === name) {
                    console.log('Found entry for ' + name + ': ' + entry.phone);
                    entryCounter++;
                }
            });
            if (entryCounter === 0) {
                console.log('Entry not found for ' + name);
            }
            displayMenu();
            phonebookOptionProcessing();
        });
    };

    var setAnEntry = function () {
        console.log(menuItems[2] + '\n' + menuItems[4] + '\n' + menuItems[2])
        rl.question('Name: ', function(name) {
            rl.question('Phone Number: ', function(phoneNumber) {
                var phonebookEntry = {};
                phonebookEntry.firstname = name;
                phonebookEntry.phone = phoneNumber;
                phonebookEntries.push(phonebookEntry);
                console.log('Entry stored for ' + name);
                writePhonebookToFile(stringifyPhonebook(phonebookEntries));
                console.log('Phonebook saved!');
                displayMenu();
                phonebookOptionProcessing();
            });
        });
    };

    var deleteAnEntry = function () {
        console.log(menuItems[2] + '\n' + menuItems[5] + '\n' + menuItems[2])
        rl.question('Name: ', function(name) {
            var phonebookEntriesCopy = [];
            phonebookEntries.forEach(function(entry) {
                if (entry.firstname !== name) {
                    phonebookEntriesCopy.push(entry);
                }
                else if (entry.firstname === name) {
                    console.log('Deleted entry for ' + entry.firstname);
                }
            });
            if (phonebookEntries.length === phonebookEntriesCopy.length) {
                console.log('Entry not found, unable to delete.');
            }
            else {
                phonebookEntries = phonebookEntriesCopy;
                writePhonebookToFile(stringifyPhonebook(phonebookEntries));
                console.log('Phonebook saved!');
            }
            displayMenu();
            phonebookOptionProcessing();
        });
    };

    var listAllEntries = function() {
        console.log(menuItems[2] + '\n' + menuItems[6] + '\n' + menuItems[2])
        fs.readFile('phonebook.txt', 'utf8', function(error, contents) {
            var parsedPhonebook = JSON.parse(contents);
            parsedPhonebook.forEach(function(entry) {
                console.log('\n' + 'Name: ' + entry.firstname + '\n' + 'Phone Number: ' + entry.phone + '\n');
            });
            displayMenu();
            phonebookOptionProcessing();
        });
    };

    var phonebookEntries = [];

    var importPhonebook = function () {
        fs.readFile('phonebook.txt', 'utf8', function(error, contents) {
            var parsedPhonebook = JSON.parse(contents);
            phonebookEntries = parsedPhonebook;
            return phonebookEntries;
        });
    }
    importPhonebook();
    
    var phonebookOptionProcessing = function () {
        rl.question('What do you want to do (1-5)? ', function(option) {
            if (option === '1') {
                lookUpEntry();
            }
            else if (option === '2') {
                setAnEntry();
            }
            else if (option === '3') {
                deleteAnEntry();
            }
            else if (option === '4') {
                listAllEntries();
            }
            else if (option === '5') {
                console.log('Goodbye!');
                rl.close();
            }
        });
    };

    displayMenu();
    phonebookOptionProcessing();
};

mainMenu();

// var stringifyPhonebook = function(phonebook) {
//     var stringifiedPhonebook = JSON.stringify(phonebook);
//     return stringifiedPhonebook;
// };

// var parsePhonebook = function(phonebook) {
//     var parsedPhonebook = JSON.parse(phonebook);
//     console.log(parsedPhonebook);
//     return parsedPhonebook;
// };

// var writePhonebookToFile = function(stringifiedPhonebook) {
//     fs.writeFile('phonebook.txt', stringifiedPhonebook, function(error) {
//         // console.log('Phonebook saved to file!');
//     });
// };

// var readPhonebookFromFile = function(phonebookFile) {
//     fs.readFile(phonebookFile, 'utf8', function(error, contents) {
//         var parsedPhonebook = parsePhonebook(contents);
//         console.log(parsedPhonebook);
//         return parsedPhonebook;
//     });
// };

// readPhonebookFromFile('phonebook.txt');


// console.log(setAnEntry());


// readPhonebookFromFile('phonebook.txt');