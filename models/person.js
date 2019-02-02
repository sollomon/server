const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var personSchema = new Schema({
    user:String,
    good:[String],
    shop:[String]
});

module.exports = mongoose.model('Person', personSchema);