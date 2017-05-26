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
//app.use(express.static('public'));
const connectionString = process.env.DATABASE_URL || "postgres://localhost:5432/testsalesforce";
console.log(connectionString);
const client = new pg.Client(connectionString);
console.log("created PostgreSQL client");
var port = process.env.PORT || 8888;

app.get('/',function(req,res) {
    console.log("hit root with GET");
    res.sendFile('/login_form.html',{root: './public'});
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

app.post('/login', function(req,res) {
    client.connect();
    var queryText = "SELECT name from salesforce.account where email__c = '" + req.body.email + "' and password__c = '" + req.body.password + "'";
    console.log(queryText);
    const query = client.query(queryText);
    query.on('row', function(result, error) {
        res.write("Welcome to the platform " + result.name);
    });
    query.on('end',function(){
        res.end();
        client.end();
    });
    query.on('error',function(error) {
        res.send(error);
        client.end();
    });
});

app.post('/account',function(req,res) {
   client.connect();
   var queryText = "INSERT INTO salesforce.account (phone, website, name, description, accountnumber) VALUES ('" + req.body.phone + "','" + req.body.website + "','" + req.body.name + "','" + req.body.description + "','" + req.body.accountnumber + "')";
   console.log(queryText);
   const query = client.query(queryText);
   query.on('end', function(result) {
       res.send(result.toString());
       client.end();
   });

   query.on('error', function(err) {
       console.log(err);
   });
});

app.listen(port, function() {
    console.log('Started Express.js app on port:',port);
});