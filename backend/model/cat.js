let mongoose = require('mongoose')
let myschema = mongoose.Schema({
    url : String,
    metaDescription:String,
    metaKeyword:String,
    h1 :String,
    photo:String,
    categoryDetails:String
})
let catModel = mongoose.model('cat', myschema)

module.exports =catModel