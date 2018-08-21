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

let getEntries = (req, res, matches) => {
    // GET /contacts
    fs.readFile('phonebook_server.json', 'utf8', (error, contents) => {
        let stringifiedEntries = JSON.stringify(contents);
        if (error) {
            console.log(error);
        }
        else {
            res.end(stringifiedEntries);
        }
    });
};

let getContact = (req, res, matches) => {
    fs.readFile('phonebook_server.json', 'utf8', (error, contents) => {
        let parsedPhonebook = JSON.parse(contents);
        // if (parsedPhonebook[id] === undefined) {
        //     res.end('404 Not Found');
        // }
        // else{
        let stringifiedEntry = JSON.stringify(parsedPhonebook[matches]);
        if (error) {
            console.log(error);
        }
        else {
            res.end(stringifiedEntry);
        }
        // }
    });
};

let postContact = (req, res, matches) => {
    fs.readFile('phonebook_server.json', 'utf8', (error, contents) => {
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
                fs.writeFile('phonebook_server.json', stringifiedPhonebook, (error) => {
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

let putContact = (req, res, matches) => {
    fs.readFile('phonebook_server.json', 'utf8', (error, contents) => {
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
                parsedPhonebook[matches].name = contact.name;
                parsedPhonebook[matches].email = contact.email;
                parsedPhonebook[matches].phone = contact.phone;
                parsedPhonebook[matches].address = contact.address;
                let stringifiedPhonebook = JSON.stringify(parsedPhonebook);
                fs.writeFile('phonebook_server.json', stringifiedPhonebook, (error) => {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log(parsedPhonebook[matches]);
                        res.end('Updated contact entry for ' + parsedPhonebook[matches].name);
                    }
                });
            });
            // }
        }
    });
};

let deleteContact = (req, res, matches) => {
    fs.readFile('phonebook_server.json', 'utf8', (error, contents) => {
        if (error) {
            console.log(error)
        }
        let parsedPhonebook = JSON.parse(contents);
        // if (parsedPhonebook[matches] === undefined) {
        //     res.end('404 Not Found');
        // }
        // else {
        let entryName = parsedPhonebook[matches].name;
        delete parsedPhonebook[matches];
        let stringifiedPhonebook = JSON.stringify(parsedPhonebook);
        fs.writeFile('phonebook_server.json', stringifiedPhonebook, (error) => {
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

let notFound = (req, res, matches) => {
    res.end('404 Not Found');
}

let routes = [
    {
        method: 'GET',
        // url: '/contacts/',
        url: /^\/contacts\/([0-9]+$)/,
        run: getContact
    },
    {
        method: 'PUT',
        // url: '/contacts/',
        url: /^\/contacts\/([0-9]+$)/,
        run: putContact
    },
    {
        method: 'DELETE',
        // url: '/contacts/',
        url: /^\/contacts\/([0-9]+$)/,
        run: deleteContact
    },
    {
        method: 'POST',
        // url: '/contacts',
        url: /^\/contacts$/,
        run: postContact
    },
    {
        method: 'GET',
        url: /^\/contacts$/,
        run: getEntries
    },
    // {
    //     method: 'GET',
    //     url: '',
    //     run: notFound
    // },
    // {
    //     method: 'POST',
    //     url: '',
    //     run: notFound
    // },
    // {
    //     method: 'PUT',
    //     url: '',
    //     run: notFound
    // },
    // {
    //     method: 'DELETE',
    //     url: '',
    //     run: notFound
    // }
];


let server = http.createServer( (req, res) => {
    // const matches = req.url.slice(contactPrefix.length);
    let route = routes.find((route) => 
        route.url.test(req.url) && req.method === route.method);
    let matches = route.url.exec(req.url).slice(1);
    route.run(req, res, matches);
    
    //     testURL = req.url;
    //     console.log(regexContact.test(req.url));
    //     console.log(testURL);
    //     // let matches = regexContact.exec(testURL).slice(1);
    //     console.log(matches);
    //     if (req.url.startsWith(route.url) && req.method === route.method) {
    //         route.run(req, res, matches);
    //         return true;
    //     }
    // });
});

server.listen(3000);