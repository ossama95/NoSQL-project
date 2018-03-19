const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const client = require('./connection.js');



app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {result:null,title:null ,error: null});
})

app.post('/', function (req, res) {

    let value = req.body.value;

    client.search({
      index: 'reuters',
      type: 'reuter',
      body: {
        "size": 15,
         "min_score": 0.5,
         "query":
         {
           "bool":
         {
             "should": [
               {"match":{"fields.text.body": value }}
               ]
         }

         }
      }
    },function (error, response,status) {
      if(error){
        res.render('index', {error: 'Error, please try again'});
      } else {
        if(response.hits.total == 0){
          res.render('index', {result:null,title:null,error: 'Error, please try again'});
        }
          res.render('index', {result:response,error: null});

        }
    });


})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
