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
    fs.writeFile('phonebook3.json', stringifiedPhonebook, function(error) {
        if (error) {
            console.log(error);
        }
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

    var displayMenuOptions = function () {
        menuItems.forEach(function (item) {
            console.log(item);
        });
    };

    var importPhonebook = function () {
        fs.readFile('phonebook3.json', 'utf8', function(error, contents) {
            if (error) {
                console.log(error);
            }
            else {
                var parsedPhonebook = JSON.parse(contents);
                phonebookEntries = parsedPhonebook;
                return phonebookEntries;
            }
        });
    };

    var lookUpEntry = function (displayMenu) {
        console.log(menuItems[2] + '\n' + menuItems[3] + '\n' + menuItems[2]);
        rl.question('Name: ', function(name) {
            var entryCounter = 0;
            Object.keys(phonebookEntries).forEach((entry) => {
                if (phonebookEntries[entry].firstname === name) {
                    console.log('Found entry for ' + phonebookEntries[entry].firstname + ': ' + phonebookEntries[entry].phone);
                    entryCounter++;
                }
            });
            if (entryCounter === 0) {
                console.log('Entry not found for ' + name);
            }
            displayMenu();
        });
    };

    var generateID = function() {
        return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString();
    };

    var setAnEntry = function (displayMenu) {
        console.log(menuItems[2] + '\n' + menuItems[4] + '\n' + menuItems[2]);
        rl.question('Name: ', function(name) {
            rl.question('Phone Number: ', function(phoneNumber) {
                var phonebookEntry = {};
                var id = generateID();
                phonebookEntry.firstname = name;
                phonebookEntry.phone = phoneNumber;
                phonebookEntry.id = id
                phonebookEntries[id] = phonebookEntry;
                console.log('Entry stored for ' + name);
                writePhonebookToFile(stringifyPhonebook(phonebookEntries));
                console.log('Phonebook saved!');
                displayMenu();
            });
        });
    };

    var deleteAnEntry = function (displayMenu) {
        console.log(menuItems[2] + '\n' + menuItems[5] + '\n' + menuItems[2]);
        rl.question('Name: ', function(name) {
            var phonebookEntriesCopy = {};
            Object.keys(phonebookEntries).forEach((entry) => {
                if (phonebookEntries[entry].firstname !== name) {
                    phonebookEntriesCopy[entry] = phonebookEntries[entry];
                }
                else if (phonebookEntries[entry].firstname === name) {
                    console.log('Deleted entry for ' + phonebookEntries[entry].firstname);
                }
            });
            if (Object.keys(phonebookEntries).length === Object.keys(phonebookEntriesCopy).length) {
                console.log('Entry not found, unable to delete.');
            }
            else {
                phonebookEntries = phonebookEntriesCopy;
                writePhonebookToFile(stringifyPhonebook(phonebookEntries));
                console.log('Phonebook saved!');
            }
            displayMenu();
        });
    };

    var listAllEntries = function(displayMenu) {
        console.log(menuItems[2] + '\n' + menuItems[6] + '\n' + menuItems[2]);
        fs.readFile('phonebook3.json', 'utf8', function(error, contents) {
            if (error) {
                console.log(error);
            }
            else {
                var parsedPhonebook = JSON.parse(contents);
                Object.keys(parsedPhonebook).forEach((entry) => {
                    console.log('\n' + 'Name: ' + parsedPhonebook[entry].firstname + '\n' + 'Phone Number: ' + parsedPhonebook[entry].phone + '\n');
                });
                displayMenu();
            }
        });
    };

    var goodbye = function() {
        console.log('Goodbye!');
        rl.close();
    };

    var displayMenu = function() {
        displayMenuOptions();
        phonebookOptionProcessing();
    };

    var phonebookEntries = {};

    importPhonebook();
    
    var phonebookOptionProcessing = function () {
        rl.question('What do you want to do (1-5)? ', function(option) {
            if (option === '1') {
                lookUpEntry(displayMenu);
            }
            else if (option === '2') {
                setAnEntry(displayMenu);
            }
            else if (option === '3') {
                deleteAnEntry(displayMenu);
            }
            else if (option === '4') {
                listAllEntries(displayMenu);
            }
            else if (option === '5') {
                goodbye();
            }
        });
    };

    displayMenu();
};

mainMenu();


// var parsePhonebook = function(phonebook) {
//     var parsedPhonebook = JSON.parse(phonebook);
//     console.log(parsedPhonebook);
//     return parsedPhonebook;
// };

// var readPhonebookFromFile = function(phonebookFile) {
//     fs.readFile(phonebookFile, 'utf8', function(error, contents) {
//         var parsedPhonebook = parsePhonebook(contents);
//         console.log(parsedPhonebook);
//         return parsedPhonebook;
//     });
// };