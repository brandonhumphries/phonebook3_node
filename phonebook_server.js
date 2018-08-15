var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req, res) {
    if (req.url === '/contacts' && req.method === 'GET') {
        fs.readFile('phonebook.txt', 'utf8', function(error, contents) {
            if (error) {
                console.log(error);
            }
            else {
                var parsedPhonebook = JSON.parse(contents);
                var entryList = [];
                parsedPhonebook.forEach(function(entry) {
                    entryList += ('\n' + 'Name: ' + entry.firstname + '\n' + 'Phone Number: ' + entry.phone + '\n')
                });
                res.end(entryList);
            }
        });
    }
    else if (req.url === ('/contacts/' + name) && req.method === 'GET') {
        fs.readFile('phonebook.txt', 'utf8', function(error, contents) {
            if (error) {
                console.log(error);
            }
            else {
                var parsedPhonebook = JSON.parse(contents);
                var entryList = [];
                parsedPhonebook.forEach(function(entry) {
                    if (entry.firstname === name) {
                        res.end('Found entry for ' + name + ': ' + entry.phone);
                        entryCounter++;
                    }
                    entryList.push(entry);
                });
                if (entryCounter === 0) {
                    res.end('Entry not found for ' + name);
                }
            }
        })
    }
});

server.listen(3000);