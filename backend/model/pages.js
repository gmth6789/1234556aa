let mongoose = require('mongoose')
let myschema = mongoose.Schema({
    categoryId :[{type:'ObjectId', ref:'cat' }],
    pageUrl : String,
    pageMetaDescription:String,
    pageMetaKeyword:String,
    pageH1 :String,
    pagePhoto:String,
    pageVideo:String,
    pageDetails:String
})
let catModel = mongoose.model('pages', myschema)

module.exports =catModel

     // Country :[{type:'ObjectId', ref:'country_table' }]