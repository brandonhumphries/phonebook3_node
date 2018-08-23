const http = require('http');
const fs = require('fs');
const pg =  require('pg-promise')();

const dbConfig = 'postgress://brandonhumphries@localhost:5432/phonebook';
const db = pg(dbConfig);

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
    db.query(`SELECT * FROM public.contacts`)
        .then((contents) => {
            let stringifiedEntries = JSON.stringify(contents);
                res.end(stringifiedEntries);
        });
};

let getContact = (req, res, matches) => {
    let contactID = matches[0];
    
    console.log(matches);
    console.log(contactID);
    db.query(`SELECT * FROM public.contacts WHERE id = ` + matches[0])
        .then((contents) => {
            console.log(contents);
            // let parsedPhonebook = JSON.parse(contents);
            let stringifiedEntry = JSON.stringify(contents[matches]);
                res.end(stringifiedEntry);
        });
};

let postContact = (req, res, matches) => {
    readBody(req, (body) => {
        let contact = JSON.parse(body);
        newID = generateID();
        contact.id = newID;
        db.query(`INSERT INTO contacts (name, email, phone, address, id) VALUES ('` + contact.name + `', '` + contact.email + `', '` + contact.phone + `', '` + contact.address + `', '` + contact.id + `');`)
        res.end('Created contact! Entry id: ' + newID);
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

let renderHomepage = (req, res, matches) => {
    fs.readFile('phonebook_frontend/index.html', 'utf8', (error, contents) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log(contents);
            res.end(contents);
        }
    });
};

let sendJavascript = (req, res, matches) => {
    fs.readFile('phonebook_frontend/index.js', 'utf8', (error, contents) => {
        if (error) {
            console.log(error);
        }
        else {
            res.end(contents);
        }
    });
};

let notFound = (req, res, matches) => {
    res.end('404 Not Found');
}

let routes = [
    {
        method: 'GET',
        url: /^\/contacts\/([0-9]+$)/,
        run: getContact
    },
    {
        method: 'PUT',
        url: /^\/contacts\/([0-9]+$)/,
        run: putContact
    },
    {
        method: 'DELETE',
        url: /^\/contacts\/([0-9]+$)/,
        run: deleteContact
    },
    {
        method: 'POST',
        url: /^\/contacts$/,
        run: postContact
    },
    {
        method: 'GET',
        url: /^\/contacts$/,
        run: getEntries
    },
    {
        method: 'GET',
        url: /^\/$/,
        run: renderHomepage
    },
    {
        method: 'GET',
        url: /^\/index.js$/,
        run: sendJavascript
    },
    {
        method: 'GET',
        url: /^.*$/,
        run: notFound
    }
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