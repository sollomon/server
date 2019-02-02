const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var customerSchema = new Schema({
    UserId:String,
    customerId:String,
    loyalty:String,
    comment:String
});

module.exports = mongoose.model('Customer', customerSchema);