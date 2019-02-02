const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    shopId:String,
    model:String
});
 module.exports = mongoose.model('File', fileSchema);