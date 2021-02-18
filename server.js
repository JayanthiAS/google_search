//import the required file 
const axios = require('axios');
const AWS = require("aws-sdk");

const AppError = require('./appError');

var api_key = process.env.API_KEY;
var url = 'http://api.serpstack.com/search?access_key='+api_key +'&query=covid&location=canada&output=json';
//console.log(url);

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

var table = "Covid";

axios.get(url)
.then( res => {
//  console.log(res.data);
     
     var val = JSON.parse(res.data);
     

      var params = {
          TableName:table,
          Item:{
              "title": val.organic_results[0].title,
              "url": val.organic_results[0].url,
              "publication_name": val.organic_results[0].domain
          }
      };

    //  console.log("insert data");
      docClient.put(params, function(err, data) {
          if (err) {
            return new AppError(err, 400);
          } else {
            console.log(data);
          }
      });

})
.catch(err =>{
  return new AppError(err, 400);
});