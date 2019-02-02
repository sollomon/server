const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var employeeSchema = new Schema({
    UserId:String,
    employeeId:String,
    skill:String
});


var shopSchema = new Schema({
    user:String,
    supplier:[String],
    customer:[String],
    owner:[String],
    employee:[employeeSchema],
    rating:Number
});

module.exports = mongoose.model('Shop', shopSchema);
