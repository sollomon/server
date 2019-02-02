const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    userName:String,
    email:String,
    photo:String,
    address:String,
    password:String,
    bio:String
});

module.exports = mongoose.model('User', userSchema);

