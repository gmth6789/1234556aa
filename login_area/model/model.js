let mongoose = require('mongoose');//import mongoose for  create collection and his value
const passportLocalMongoose = require('passport-local-mongoose'); // import 'passport-local-mongoose' for  convert pasword into salt and has (as a bcrypt)

let userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password :{
        type : String,
        select: false
    },
    resetPasswordToken : String,
    resetPasswordExpires : Date

})
userSchema.plugin(passportLocalMongoose, {usernameField : 'email'}); // for email 
module.exports = mongoose.model('User', userSchema)