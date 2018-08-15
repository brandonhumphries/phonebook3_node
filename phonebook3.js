var fs = require('fs');
var readline = require('readline');


var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

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

    var phonebookEntries = [];

    var importPhonebook = function () {
        fs.readFile('phonebook.txt', 'utf8', function(error, contents) {
            var parsedPhonebook = JSON.parse(contents);
            phonebookEntries = parsedPhonebook;
            return phonebookEntries;
        });
    }
    importPhonebook();
    
    var displayMenu = function () {
        menuItems.forEach(function (item) {
            console.log(item);
        });
    };

    displayMenu();

    rl.question('What do you want to do (1-5)? ', function(option) {
        if (option === '1') {
            rl.question('Name: ', function(name) {
                rl.close();
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
            });
        }
        else if (option === '2') {
            rl.question('Name: ', function(name) {
                rl.question('Phone Number: ', function(phoneNumber) {
                    rl.close();
                    var phonebookEntry = {};
                    phonebookEntry.firstname = name;
                    phonebookEntry.phone = phoneNumber;
                    // console.log(phonebookEntry);
                    // console.log(phonebookEntries);
                    // phonebookEntries[name] = phonebookEntry;
                    phonebookEntries.push(phonebookEntry);
                    console.log('Entry stored for ' + name);
                    // console.log(phonebookEntries);
                    // console.log(phonebookEntry);
                    writePhonebookToFile(stringifyPhonebook(phonebookEntries));
                });
            });
        }
        else if (option === '3') {
            console.log('3');
            rl.question('Name: ', function(name) {
                rl.close();
                var phonebookEntriesCopy = [];
                phonebookEntries.forEach(function(entry) {
                    if (entry.firstname !== name) {
                        phonebookEntriesCopy.push(entry);
                    }
                    else if (entry.firstname === name) {
                        console.log('Deleted entry for ' + entry.firstname);
                    }
                    else {
                        console.log('Entry not found');
                    }
                })
                phonebookEntries = phonebookEntriesCopy;
                writePhonebookToFile(stringifyPhonebook(phonebookEntries));
            });
        }
        else if (option === '4') {
            fs.readFile('phonebook.txt', 'utf8', function(error, contents) {
                rl.close();
                var parsedPhonebook = JSON.parse(contents);
                // console.log(parsedPhonebook);
                parsedPhonebook.forEach(function(entry) {
                    console.log('\n' + 'Name: ' + entry.firstname + '\n' + 'Phone Number: ' + entry.phone + '\n');
                });
            });
            
        }
        else if (option === '5') {

        }
    });
};

mainMenu();


var lookUpEntry = function () {
    rl.question('Name: ', function(name) {
        rl.close();
        importPhonebook();
        phonebookEntries.forEach(function(entry) {
            if (entry.firstname === name) {
                console.log('Found entry for ' + name + ': ' + entry.phone);
            }
        });
    });
};

var setAnEntry = function () {
    rl.question('Name: ', function(name) {
        rl.question('Phone Number: ', function(phoneNumber) {
            var phonebookEntry = {
                name: '',
                phone: '',
            }
            phonebookEntry.name = name;
            phonebookEntry.phone = phoneNumber;
            writePhonebookToFile(stringifyPhonebook(phonebookEntries));
        })
    })
};

var stringifyPhonebook = function(phonebook) {
    var stringifiedPhonebook = JSON.stringify(phonebook);
    return stringifiedPhonebook;
};

var writePhonebookToFile = function(stringifiedPhonebook) {
    fs.writeFile('phonebook.txt', stringifiedPhonebook, function(error) {
        console.log('Phonebook saved to file!');
    });
};

var readPhonebookFromFile = function(phonebookFile) {
    fs.readFile(phonebookFile, 'utf8', function(error, contents) {
        var parsedPhonebook = JSON.parse(contents);
        console.log(parsedPhonebook);
        return parsedPhonebook;
    });
};

// var parsePhonebook = function(phonebook) {
//     var parsedPhonebook = JSON.parse(phonebook);
//     console.log(parsedPhonebook);
//     return parsedPhonebook;
// };

// console.log(setAnEntry());


// readPhonebookFromFile('phonebook.txt');