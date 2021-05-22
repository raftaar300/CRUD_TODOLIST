const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    email: String,
    password: String , 
    classs : String, 
    subject : String, 
    chaptername : String, 
    topic : {type : [{Body : String , hour : Number}]  , default : [{}]}
})

const Userdb = mongoose.model('userdb', schema);

module.exports = Userdb;