var http = require('http');
var fs = require('fs');

var contactPrefix = '/contacts/';

var readBody = function(req, callback) {
    var body = '';
    req.on('data', function(chunk) {
        body += chunk.toString();
    });
    req.on('end', function() {
        callback(body);
    });
};

var generateID = function() {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString();
};

var server = http.createServer(function(req, res) {
    var phonebookEntries = [];
    if (req.url === '/contacts' && req.method === 'GET') {
        fs.readFile('phonebook.json', 'utf8', function(error, contents) {
            if (error) {
                console.log(error);
            }
            else {
                // var parsedPhonebook = JSON.parse(contents);
                // var entryList = [];
                // parsedPhonebook.forEach(function(entry) {
                //     entryList += ('\n' + 'Name: ' + entry.firstname + '\n' + 'Phone Number: ' + entry.phone + '\n')
                // });
                var stringifiedEntries = JSON.stringify(contents);
                res.end(stringifiedEntries);
            }
        });
    }
    else if (req.url.startsWith('/contacts/') && req.method === 'GET') {
        var id = req.url.slice(contactPrefix.length);
        fs.readFile('phonebook.json', 'utf8', function(error, contents) {
            if (error) {
                console.log(error);
            }
            else {
                var parsedPhonebook = JSON.parse(contents);
                var stringifiedEntry = JSON.stringify(parsedPhonebook[id]);
                res.end(stringifiedEntry);
                // parsedPhonebook.forEach(function(entry) {
                //     if (entry.firstName === name) {
                //         var stringifiedEntry = JSON.stringify(entry)
                //         res.end(stringifiedEntry);
                //     }
                    // else {
                    //     res.end('404 File Not Found');
                    // }
                // });
            }
        });
    }
    else if (req.url === '/contacts' && req.method === 'POST') {
        readBody(req, function(body) {
            var contact = JSON.parse(body);
            fs.readFile('phonebook.json', 'utf8', function(error, contents) {
                var parsedPhonebook = JSON.parse(contents);
                newID = generateID();
                contact.id = newID;
                parsedPhonebook[newID]= contact;
                var stringifiedPhonebook = JSON.stringify(parsedPhonebook);
                fs.writeFile('phonebook.json', stringifiedPhonebook, function(error) {
                    if (error) {
                        console.log(error);
                    }
                })
                console.log(parsedPhonebook[newID]);
                res.end('Created contact! Entry id: ' + newID);
            })
        })
    }
    else if (req.url.startsWith('/contacts/') && req.method === 'DELETE') {
        var id = req.url.slice(contactPrefix.length);
        fs.readFile('phonebook.json', 'utf8', function(error, contents) {
            if (error) {
                console.log(error);
            }
            else {
                var parsedPhonebook = JSON.parse(contents);
                delete parsedPhonebook[id];
                var stringifiedPhonebook = JSON.stringify(parsedPhonebook);
                fs.writeFile('phonebook.json', stringifiedPhonebook, function(error) {
                    if (error) {
                        console.log(error);
                    }
                })
                res.end('Entry deleted');
            }
        });
    }
    // else if (req.url === '/contacts' && req.method === 'POST') {

    // }
    else {
        res.end('404 File Not Found');
    }
});

server.listen(3000);

var currentID = 0;
var generateID = function() {
    currentID++;
    return currentID;
}

var generateID = function() {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString();
};