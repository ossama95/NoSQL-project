const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const apiKey = '*****************';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {weather: null,title:null ,error: null});
})

app.post('/', function (req, res) {
  let city = req.body.city;
  let url = `http://localhost:9200/reuters/reuter/_search`

  request(url, function (err, response, body) {
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again'});
    } else {
      let result = JSON.parse(body)
      if(result.hits.total == 0){
        res.render('index', {weather: null, error: 'Error, please try again'});
      } else {
        let weatherText = `It's ${result.hits.hits[0]._source.fields.places} degrees in!`;
        let title = result.hits.hits[0]._source.fields.text.title;
        let dateline = result.hits.hits[0]._source.fields.text.dateline;
        let body = result.hits.hits[0]._source.fields.text.body;

        let place = result.hits.hits[0]._source.fields.places;

        res.render('index', {title:title, dateline:dateline, body:body ,error: null});
      }
    }
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
