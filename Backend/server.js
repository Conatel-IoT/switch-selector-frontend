'use strict';
//Load express module with `require` directive
var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var bodyParser = require ('body-parser');

app.use(bodyParser.json({limit:'50mb'}));

MongoClient.connect('mongodb+srv://flkangel:REQUEST_PASSWORD_TO_ACCESS@cluster0-f17oz.mongodb.net/test', function (err, client) {
  assert.equal(null, err);
  var db = client.db('test');
  console.log("Successfully connected to MongoDB");

  app.get('/switches', function (req, res) {
    var cursor = db.collection('switches').find({});
    cursor.toArray().then(data => res.status(200).json(data));
  });

  app.get('/get/:id', function (req, res) {
    const id = req.params.id;
    var cursor = db.collection('switches').find({part_number:id});
    cursor.toArray().then(data => res.status(200).json(data));
  });

  app.put('/insert', function (req, res) {
    var d = new Date().toISOString();
    var param_date = {
      name: "switch insertado en: " + d
    };
    var newswitch = Object.assign({}, param_date, req.body);
    db.collection('switches').insert(newswitch);
    res.status(201).send("Nuevo Switch insertado");
  });

  app.post('/update', function(req,res){
    var body = req.body;
    db.collection('switches').update({part_number:body.part_number},body);
    res.status(202).send("Registro actualizado");
  });

  app.delete('/delete', function(req,res){
    var part_number = req.body.part_number; 
    if(part_number !== undefined){
      db.collection('switches').remove({part_number:part_number});
      res.status(202).send("Registro eliminado");
    }
    else
    {
      res.status(400).send("no es posible ejecutar la acción");
    }
  });

  app.use(function (req, res) {
    res.sendStatus(404);
  });
  var server = app.listen(8081, function () {
    var port = server.address().port;
    console.log('Express server listening on port %s', port);
  });
});
