const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var employeeSchema = new Schema({
    _id:String,
    shopId:String,
    employeeId:String,
    skill:String
});

module.exports = mongoose.model('Employee', employeeSchema);