const http = require('http');
const fs = require('fs');

const contactPrefix = '/contacts/';

let readBody = (req, callback) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        callback(body);
    });
};

let generateID = () => {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString();
};

let server = http.createServer( (req, res) => {
    if (req.url === '/contacts' && req.method === 'GET') {
        fs.readFile('phonebook.json', 'utf8', (error, contents) => {
            let stringifiedEntries = JSON.stringify(contents);
            if (error) {
                console.log(error);
            }
            else {
                res.end(stringifiedEntries);
            }
        });
    }
    else if (req.url.startsWith('/contacts/') && req.method === 'GET') {
        let id = req.url.slice(contactPrefix.length);
        fs.readFile('phonebook.json', 'utf8', (error, contents) => {
            let parsedPhonebook = JSON.parse(contents);
            let stringifiedEntry = JSON.stringify(parsedPhonebook[id]);
            if (error) {
                console.log(error);
            }
            else {
                res.end(stringifiedEntry);
            }
        });
    }
    else if (req.url === '/contacts' && req.method === 'POST') {
        fs.readFile('phonebook.json', 'utf8', (error, contents) => {
            readBody(req, (body) => {
                let contact = JSON.parse(body);
                let parsedPhonebook = JSON.parse(contents);
                newID = generateID();
                contact.id = newID;
                parsedPhonebook[newID]= contact;
                let stringifiedPhonebook = JSON.stringify(parsedPhonebook);
                fs.writeFile('phonebook.json', stringifiedPhonebook, (error) => {
                    if (error) {
                        console.log(error);
                    }
                });
                console.log(parsedPhonebook[newID]);
                res.end('Created contact! Entry id: ' + newID);
            });
        });
    }
    else if (req.url.startsWith('/contacts/') && req.method === 'PUT') {
        let id = req.url.slice(contactPrefix.length);
        fs.readFile('phonebook.json', 'utf8', (error, contents) => {
            let parsedPhonebook = JSON.parse(contents);
            if (error) {
                console.log(error);
            }
            else {
                readBody(req, (body) => {
                    let contact = JSON.parse(body);
                    parsedPhonebook[id].firstname = contact.firstname;
                    parsedPhonebook[id].phone = contact.phone;
                    let stringifiedPhonebook = JSON.stringify(parsedPhonebook);
                    fs.writeFile('phonebook.json', stringifiedPhonebook, (error) => {
                        if (error) {
                            console.log(error);
                        }
                    })
                    console.log(parsedPhonebook[id]);
                    res.end('Updated contact for ' + parsedPhonebook[id].firstname);
                })
            }
        });
    }
    else if (req.url.startsWith('/contacts/') && req.method === 'DELETE') {
        let id = req.url.slice(contactPrefix.length);
        fs.readFile('phonebook.json', 'utf8', (error, contents) => {
            if (error) {
                console.log(error);
            }
            else {
                let parsedPhonebook = JSON.parse(contents);
                delete parsedPhonebook[id];
                let stringifiedPhonebook = JSON.stringify(parsedPhonebook);
                fs.writeFile('phonebook.json', stringifiedPhonebook, (error) => {
                    if (error) {
                        console.log(error);
                    }
                })
                res.end('Entry deleted');
            }
        });
    }
    else {
        res.end('404 File Not Found');
    }
});

server.listen(3000);