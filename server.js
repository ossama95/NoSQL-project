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
  let url = `http://localhost:9200/reuters/reuter/_search?q=${value}`

  request(url, function (err, response, body) {
    if(err){
      res.render('index', {error: 'Error, please try again'});
    } else {
      let result = JSON.parse(body)
      if(result.hits.total == 0){
        res.render('index', {result:null,title:null,error: 'Error, please try again'});
      } else {
        client.search({
          index: 'reuters',
          type: 'reuter',
          body: {
            "size": 2557,
             "min_score": 0.5,
             "query":
             {
               "bool":
             {
                 "should": [
                   {"match":{"fields.text.dateline": "NEW YORK" }}
                   ],
                  "must_not": [
                    {"match": {
                      "fields.places": "usa"
                    }}
                  ]
             }
             }
          }
        },function (error, response,status) {
            if (error){
              console.log("search error: "+error)
            }
            else {
              console.log("--- Response ---");
              console.log(response);
              console.log("--- Hits ---");
              res.render('index', {result:response,error: null});

            }
        });

    //    res.render('index', {result:result,error: null});
      }
    }
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
