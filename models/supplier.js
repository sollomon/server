const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var supplierSchema = new Schema({
    UserId:String,
    supplierId:String,
    good:[String],
    description:String
});

module.exports = mongoose.model('Supplier', supplierSchema);