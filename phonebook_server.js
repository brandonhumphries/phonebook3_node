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

let getEntries = (req, res, id) => {
    // GET /contacts
    fs.readFile('phonebook.json', 'utf8', (error, contents) => {
        let stringifiedEntries = JSON.stringify(contents);
        if (error) {
            console.log(error);
        }
        else {
            res.end(stringifiedEntries);
        }
    });
};

let getContact = (req, res, id) => {
    fs.readFile('phonebook.json', 'utf8', (error, contents) => {
        let parsedPhonebook = JSON.parse(contents);
        // if (parsedPhonebook[id] === undefined) {
        //     res.end('404 Not Found');
        // }
        // else{
        let stringifiedEntry = JSON.stringify(parsedPhonebook[id]);
        if (error) {
            console.log(error);
        }
        else {
            res.end(stringifiedEntry);
        }
        // }
    });
};

let postContact = (req, res, id) => {
    fs.readFile('phonebook.json', 'utf8', (error, contents) => {
        if (error) {
            console.log(error);
        }
        else {
            readBody(req, (body) => {
                let contact = JSON.parse(body);
                let parsedPhonebook = JSON.parse(contents);
                newID = generateID();
                contact.id = newID;
                parsedPhonebook[newID] = contact;
                let stringifiedPhonebook = JSON.stringify(parsedPhonebook);
                fs.writeFile('phonebook.json', stringifiedPhonebook, (error) => {
                    if (error) {
                        console.log(error);
                    }
                });
                console.log(parsedPhonebook[newID]);
                res.end('Created contact! Entry id: ' + newID);
            });
        }
    });
};

let putContact = (req, res, id) => {
    fs.readFile('phonebook.json', 'utf8', (error, contents) => {
        if (error) {
            console.log(error);
        }
        else {
            let parsedPhonebook = JSON.parse(contents);
            // if (parsedPhonebook[id] === undefined) {
            //     res.end('404 Not Found');
            // }
            // else {
            readBody(req, (body) => {
                let contact = JSON.parse(body);
                parsedPhonebook[id].firstname = contact.firstname;
                parsedPhonebook[id].phone = contact.phone;
                let stringifiedPhonebook = JSON.stringify(parsedPhonebook);
                fs.writeFile('phonebook.json', stringifiedPhonebook, (error) => {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log(parsedPhonebook[id]);
                        res.end('Updated contact entry for ' + parsedPhonebook[id].firstname);
                    }
                });
            });
            // }
        }
    });
};

let deleteContact = (req, res, id) => {
    fs.readFile('phonebook.json', 'utf8', (error, contents) => {
        if (error) {
            console.log(error)
        }
        let parsedPhonebook = JSON.parse(contents);
        // if (parsedPhonebook[id] === undefined) {
        //     res.end('404 Not Found');
        // }
        // else {
        let entryName = parsedPhonebook[id].firstname;
        delete parsedPhonebook[id];
        let stringifiedPhonebook = JSON.stringify(parsedPhonebook);
        fs.writeFile('phonebook.json', stringifiedPhonebook, (error) => {
            if (error) {
                console.log(error);
            }
            else {
                res.end('Contact entry deleted for ' + entryName);
            }
        });
        // }
    });
};

let notFound = (req, res, id) => {
    res.end('404 Not Found');
}

let routes = [
    {
        method: 'GET',
        url: '/contacts/',
        run: getContact
    },
    {
        method: 'PUT',
        url: '/contacts/',
        run: putContact
    },
    {
        method: 'DELETE',
        url: '/contacts/',
        run: deleteContact
    },
    {
        method: 'POST',
        url: '/contacts',
        run: postContact
    },
    {
        method: 'GET',
        url: '/contacts',
        run: getEntries
    },
    {
        method: 'GET',
        url: '',
        run: notFound
    },
    {
        method: 'POST',
        url: '',
        run: notFound
    },
    {
        method: 'PUT',
        url: '',
        run: notFound
    },
    {
        method: 'DELETE',
        url: '',
        run: notFound
    }
];


let server = http.createServer( (req, res) => {
    const id = req.url.slice(contactPrefix.length);
    routes.find((route) => {
        if (req.url.startsWith(route.url) && req.method === route.method) {
            route.run(req, res, id);
            return true;
        }
    });
});

server.listen(3000);