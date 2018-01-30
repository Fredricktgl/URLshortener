const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create a schema
const urlSchema = new Schema({
  longUrl: String,
  shortUrl: String,
})

//Create model with the above Schema
const url = mongoose.model('url', urlSchema)

// make this available to our other files
module.exports = url;
