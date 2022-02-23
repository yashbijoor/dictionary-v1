const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
  res.render("home");
});

app.post("/", function(req, res){
  let word = req.body.word;
  const globalWord = word;
  const baseURL = "https://api.dictionaryapi.dev/api/v2/entries/en/";
  const finalURL = baseURL + word;
  request(finalURL, function(error, response, body){
    if(error){
      let code = response.statusCode;
      res.render("failure", {code: code});
    }else{
      let code = response.statusCode;
      if(code!=200){
        res.render("failure", {code: code});
      }else{
        const data = JSON.parse(body);
        const definition = [];
        const posList = [];
        const no1 = [];
        const no2 = [];
        const totalNumberOfMeanings = data.length;

        for(let i=0; i< totalNumberOfMeanings; i++){
          var n1=0;
          for(let j=0; j< data[i].meanings.length; j++){
            var pos = data[i].meanings[j].partOfSpeech;
            posList.push(pos);
            n1++;
            var n2=0;
            for(let k=0; k< data[i].meanings[j].definitions.length; k++){
              var def = data[i].meanings[j].definitions[k].definition
              definition.push(def);
              n2++;
            }
            no2.push(n2);
          }
          no1.push(n1);
        }
        res.render("success", {definition: definition, posList: posList, no1: no1, no2: no2, totalNumberOfMeanings: totalNumberOfMeanings});
      }
    }
  });
});

app.post("/success", function(req, res){
  res.redirect("/");
})

app.post("/failure", function(req, res){
  res.redirect("/");
})

app.listen(3000, function(){
  console.log("Server is running on port 3000");
});
