/**
 * myapi.js
 * 
 * @version 1.1 - updated for Express 4.x : April 2015
 *
 * 
 * DESCRIPTION:
 * a "HELLO WORLD" server-side application to demonstrate running a node 
 * API Appserver on a Raspberry Pi to access IOs
 * Uses the Express node packages. 
 * 
 * 
 * @throws none
 * @see nodejs.org
 * @see express.org
 * 
 * @author Robert Drummond
 * (C) 2013 PINK PELICAN NZ LTD
 */

var http      = require('http');
var express   = require('express');
const { arrayBuffer } = require('stream/consumers');

var app       = express();

// master storage for device inputs
var storage = [];
// same thing but for fetch
var fetch_array = [];
// storage format
// { "id:, mame:, phone:, gender:, strength:, interests:[]" }

// ------------------------------------------------------------------------
// configure Express to serve index.html and any other static pages stored 
// in the home directory
app.use(express.static(__dirname));

//displays the master storage array
app.get('/storage/', function (req, res) {
    // send an object as a JSON string
    console.log('master cucumber displayed');
    //res.send(storage[req.params.id]);
    res.send(storage);
    //res.send("Cucumber sauce complete");
});

// Express route for incoming requests adding to storage
app.get('/create/:id/:name/:phone/:gender/:strength/:interests/', 
            function (req, res) {
    // stores the id after /create/
    var cucumber = {id: req.params.id, name: req.params.name, 
                    phone: req.params.phone, gender: req.params.gender, 
                        strength: req.params.strength, interests: 
                            [req.params.interests]};
    
    for ( let i = 0; i < storage.length; i++ ){

        if (storage[i]["id"] == req.params.id){
            storage.splice(i, 1);
            console.log('updating cucumber');
            cucumber = {id: req.params.id, name: req.params.name, 
                        phone: req.params.phone, 
                            gender: req.params.gender, 
                                strength: req.params.strength, 
                                    interests: [req.params.interests]};
        } else {
            // send an object as a JSON string
            console.log('created cucumber ' + req.params.id);
        }
    } 
    storage.push(cucumber);
    //res.send(storage[req.params.id]);
    res.send(storage);
    //res.send("Cucumber sauce complete");
});

// Express route for incoming requests removing id 
app.get('/remove/:id', function (req, res) {
    // send an object as a JSON string
    
    for ( let i = 0; i < storage.length; i++ ){
        
        if (storage[i]["id"] == req.params.id){
            console.log('removing cucumber '+ req.params.id);
            storage.splice(i, 1);
            //break;
        }
    }
    res.send(storage);
    //res.send("Cucumber sauce removed");
});
  
// User fetch
app.get('/fetch/:id', function (req, res){

    //makes a deep copy of storage
    fetch_array = storage.slice();
    var cuc = [];

    for ( let i = 0; i < storage.length; i++ ){
        
        //fetch_array.sort(req.params.interests)
        
        if (storage[i]["id"] == req.params.id){
            console.log("cucumber " + req.params.id + 
                            ' is fetching other cucumbers');
            cuc = fetch_array.splice(i, 1);
            //break;
        }
            
        //if (cuc["interests"] in storage[i]["interests"]){
        //    res.send(fetch_array);
        //}

    }

    //console.log(cuc);
    res.send(fetch_array);
    //res.send("Cucumber sauce fetched");
});

// Express route for any other unrecognised cucumber sauces
app.get('*', function (req, res) {
  res.status(404).send('Unrecognised Cucumber Sauce call');
});

// Express route to handle errors
app.use(function (err, req, res, next) {
  if (req.xhr) {
    res.status(500).send('Oops, no more Cucumber Sauce!');
  } else {
    next(err);
  }
});

// ------------------------------------------------------------------------
// Start Express App Server
//
app.listen(3000);
console.log('Cucumber Sauce is saucin\' on port 3000');