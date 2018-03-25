const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const client = require('./connection.js');



app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {result:null ,error: null});
})

app.post('/', function (req, res) {

    var should = filter(req);
    var aggs =  agg(req);
    var combinaison = false;
    if(aggs != null && should.length != 0 )
    {
      combinaison = true;
    }


    client.search(search(should,aggs,res),function (error, response,status) {
     if(error){
        res.render('index', {result:null,error: 'Error, please try again !'});
      } else {
        if(response.hits.total == 0){
          res.render('index', {result:null,error:"Nothing has been found ..."});
        }
          res.render('index', {result:response, error: null,combinaison : combinaison});

        }
    });


})

app.listen(3000, function () {
  console.log('App listening on port 3000!')
})

function search(filter,aggs, res)
{


    if(aggs == null)
      {
             return {
               index: 'reuters',
               type: 'reuter',
               body: {
                 "size": 15,
                  "query":
                  {
                    "bool":
                  {
                      "should": [
                        filter
                        ]
                  }

                  }
               }
          };
        }
else if(agg != null && filter.length == 0 )

{
  return {
    index: 'reuters',
    type: 'reuter',
    body: {
      "size": 15,
      "aggs":aggs
    }
};

}
    else {
      return {
        index: 'reuters',
        type: 'reuter',
        body: {
          "size": 15,
          "aggs":aggs,
           "query":
           {
             "bool":
           {
               "should": [
                 filter
                 ]
           }

           }
        }
   };

        }

}

function filter(req)
{
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

  return should;

}


function agg(req)
{

   if(req.body.agg1 == "None" )
   {
     return null;
   }

   else {

    if (req.body.agg1 != "None" ) {
      var key = "fields." + req.body.agg1;
      var sort = {};
      sort[key] = {"order": "desc"};


       var fieldkeyword = "fields." + req.body.agg1 +".keyword";
       var aggs =  {
        "group_by": {
          "terms": {
            "field": fieldkeyword ,
            "size": 21495
          },
         "aggs": {
            "theMax": {
               "top_hits": {
                  "size": "5",
                  sort
               }
            }
          }
        }
      };
      return aggs;
        }



   }


}
