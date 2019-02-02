const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var goodSchema = new Schema({
    name:String,
    desc:String,
    barNo:Number,
    category:String,
    price:Number
});

module.exports = mongoose.model('Good', goodSchema);