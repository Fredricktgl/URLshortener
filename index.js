const express = require('express');
const app = express();

const path = require('path');
app.use(express.static(path.join(__dirname, '/public'))) //load all static assets in a folder called /public

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

const exphbs  = require('express-handlebars')

app.engine('handlebars', exphbs({defaultLayout: 'main'})) // this line below, sets a layout look to your express project
app.set('view engine', 'handlebars') // this line sets handlebars to be the default view engine

// running this will let express to run home.handlebars file in your views folder
app.get('/', (req, res) => {

  url.find({}, (err, urlList) => {
    res.render('home', {urlList: urlList})
  })

})

const url = require('./models/urlShortener.js')

const mongoose = require('mongoose')
mongoose.connect('mongodb://testAdmin:123@ds115768.mlab.com:15768/my-mongodb-app');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  app.listen(3000, () => {
    console.log("Listening on port 3000...")
  })
});

//-----------------------------------------------------------------------

function genShortUrl(){

  //Randomize string generator here
  let shortUrl = '';
  let possibility = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for(let i=0; i<6; i++){

    shortUrl += possibility.charAt(Math.floor(Math.random() * possibility.length));
  
  }

  return shortUrl;

}

//ROUTES
app.post('/URLshortener', (req, res) => {

  shortUrl = genShortUrl();

  //check if long URL has already been used, if so return the value
  url.findOne({longUrl: req.body.longUrl}, (err, checkLongUrl) => {

    if(checkLongUrl){

      url.find({}, (err, urlList) => {

      res.render('home', {result: checkLongUrl, urlList: urlList});

      })

    }else{

      //Check if short URL has been used
      url.findOne({shortUrl: shortUrl}, (err, checkShortUrl) => {

        let v = 0;
        if(checkShortUrl){
          
          for(let i=0; i<1+v; i++){
            
            shortUrl = genShortUrl();
            v++;

          }

          }else{

            //If it is a new Long and Short URL, create a new record
            url.create({
              
              longUrl: req.body.longUrl,
              shortUrl: shortUrl,

            }, (err, document) => {

              if(err){return(err)}
              
            url.find({}, (err, urlList) => {

              res.render('home', {result: document, urlList: urlList});

            })

          })

        }

      })

    }

  })

})


app.get('/:inputUrl', (req,res) => {

  let inputUrl = req.params.inputUrl
  url.findOne({shortUrl: inputUrl}, (err, doc) => {

    if(doc){
      res.redirect(doc.longUrl);
    }else{

      url.find({}, (err, urlList) => {

      res.render('home', {invalidUrl: inputUrl, urlList: urlList});
    
       })

    }

  })

})