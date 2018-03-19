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

    let text = req.body.text;
    var should = [];

    if(req.body.title != "")
    {
      var match = {};
      match["match"] = {"fields.text.title": req.body.title};
      should.push(match);
    }
    if(req.body.topics != "")
    {
      var match = {};
      match["match"] = {"fields.topics": req.body.topics};
      should.push(match);
    }
    if(req.body.text != "")
    {
      var match = {};
      match["match"] = {"fields.text.body": req.body.text};
      should.push(match);
    }
    if(req.body.places != "")
    {
      var match = {};
      match["match"] = {"fields.places":  req.body.places};
      should.push(match);
    }
console.log(should);
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
               should
               ]
         }

         }
      }
    },function (error, response,status) {
      if(error){
        res.render('index', {result:null,error: 'Error, please try again'});
      } else {
        if(response.hits.total == 0){
          res.render('index', {result:null,error:"Nothing has been found ..."});
        }
          res.render('index', {result:response, error: null});

        }
    });


})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
