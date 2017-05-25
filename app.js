/**
 * Created by joe on 5/24/17.
 */
'use strict';

const express = require('express');
const app = express();
const pg = require('pg');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
const connectionString = process.env.DATABASE_URL || "postgres://localhost:5432/testsalesforce";
console.log(connectionString);
const client = new pg.Client(connectionString);
console.log("created PostgreSQL client");
var port = process.env.PORT || 8888;

app.get('/',function(req,res) {
    console.log("hit root with GET");
    res.send('Hello, world!');
});

app.get('/account',function(req,res) {
    var responseBody = req.body;
    client.connect();
    const query = client.query(
        "SELECT createddate, phone, website, name, description, accountnumber from salesforce.account");
    query.on('row', function(row,err) {
        res.write(JSON.stringify(row));
    });
    query.on('end', function() {
        res.end();
        client.end();
    });
});

app.post('/account',function(req,res) {
   client.connect();
   console.log("Output:", req.body.phone);
   const query = client.query(
       "INSERT INTO salesforce.account (phone, website, name, description, accountnumber) VALUES (",req.body.phone,",",req.body.website,",",req.body.name,",",req.body.description,req.body.accountnumber,")"
   );
   query.on('end', function(result) {
       res.write(result);
       res.end();
       client.end();
   });

   query.on('error', function(err) {
       console.log(err);
   });
});

app.listen(port, function() {
    console.log('Started Express.js app on port:',port);
});