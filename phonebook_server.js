const http = require('http');
const fs = require('fs');
const pg =  require('pg-promise')();
const express = require('express');

const dbConfig = 'postgress://brandonhumphries@localhost:5432/phonebook';
const db = pg(dbConfig);

let server = express();

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

let getEntries = (req, res) => {
    // GET /contacts
    db.query(`SELECT * FROM public.contacts`)
        .then((contents) => {
            let stringifiedEntries = JSON.stringify(contents);
                res.end(stringifiedEntries);
        });
};

let getContact = (req, res) => {
    let id = req.params.id;
    db.query(`SELECT * FROM public.contacts WHERE id = '` + id + `'`)
        .then((contents) => {
            let stringifiedEntry = JSON.stringify(contents);
                res.end(stringifiedEntry);
        });
};

let postContact = (req, res) => {
    readBody(req, (body) => {
        let contact = JSON.parse(body);
        newID = generateID();
        contact.id = newID;
        db.query(`INSERT INTO 
                    contacts (name, email, phone, address, id) 
                    VALUES ('` + contact.name + `', '` + contact.email + `', '` + contact.phone + `', '` + contact.address + `', '` + contact.id + `');`)
        res.end('Created contact! Entry id: ' + newID);
    });
};

let putContact = (req, res) => {
    let id = req.params.id;
    readBody(req, (body) => {
        let contact = JSON.parse(body);
        db.query(`UPDATE contacts 
                    SET (name, email, phone, address) = ('` + contact.name + `', '` + contact.email + `', '` + contact.phone + `', '` + contact.address + `') WHERE id = '` + id +`'`)
            .then((contents) => {
                res.end('Updated contact entry for ' + contact.name);
            });
    });
};

let deleteContact = (req, res) => {
    let id = req.params.id;
    db.query(`DELETE FROM contacts WHERE id = '` + id + `';`)
        .then((contents) => {
            res.end('Contact entry deleted');
        });
};

let renderHomepage = (req, res) => {
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

let sendJavascript = (req, res) => {
    fs.readFile('phonebook_frontend/index.js', 'utf8', (error, contents) => {
        if (error) {
            console.log(error);
        }
        else {
            res.end(contents);
        }
    });
};

let notFound = (req, res) => {
    res.end('404 Not Found');
}

server.get('/contacts', getEntries);
server.get('/contacts/:id', getContact);
server.delete('/contacts/:id', deleteContact);
server.put('/contacts/:id', putContact);
server.post('/contacts', postContact);
server.get('/', renderHomepage);

server.listen(3000);