const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const  jwt = require('jsonwebtoken');
const secret = require('../config').secret;

const userSchema = new Schema({
    userName:{type:String, lowercase:true, required:[true,"can't be blank"], match:[/^[a-zA-Z0-9]+$/, 'is invalid'], index:true},
    email:{type:String, lowercase:true, required:[true, "can't be blank"], match:[/\S+@\S+\.\S+/, 'is invalid'],index:true},
    photo:String,
    address:String,
    bio:String,
    type:Boolean,
},{timestamps:true});

userSchema.plugin(uniqueValidator, {message: 'is already taken.'});

userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password){
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

userSchema.methods.generateJWT = function(){
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        id:this._id,
        userName:this.userName,
        exp:parseInt(exp.getTime()/1000),
    },secret);
};

userSchema.methods.toAuthJSON = function(){
    return{
        userName:this.userName,
        email:this.email,
        token:this.generateJWT(),
        photo:this.photo,
        bio:this.bio
    };
};

User = mongoose.model('User', userSchema);



const employeeSchema = new Schema({
    _id:String,
    shopId:[],
    employeeId:String,
    skill:String
});
Employee = mongoose.model('Employee', employeeSchema);

const customerSchema = new Schema({
    _id:String,
    customerId:String,
    loyalty:String,
    comment:String
});
Customer = mongoose.model('Customer', customerSchema);

const supplierSchema = new Schema({
    _id:String,
    supplierId:String,
    good:[String],
    description:String
});
Supplier = mongoose.model('Supplier', supplierSchema);

const ownerSchema = new Schema({
    _id:String,
    userName:String,
    email:String,
    photo:String,
    address:String,
    bio:String
});
Owner= mongoose.model('Owner', ownerSchema);

const shopSchema = new Schema({
    user:String,
    suppliers:[String],
    purchases:[String],
    sales:[String],
    customers:[String],
    owners:[String],
    employees:[String],
    rating:Number
},{timestamps:true});
Shop = mongoose.model('Shop', shopSchema);

const goodSchema = new Schema({
    name:String,
    desc:String,
    barNo:Number,
    category:String,
    commonPrice:Number,
    createdBy:String,
    icon:String,
});
Good = mongoose.model('Good', goodSchema);

const categorySchema = new Schema({
    name:String,
    desc:String,
    goods:[String],
    subCategories:[String]
});
Category = mongoose.model('Category', categorySchema);

const personSchema  = new Schema({
    user:String,
    password:String,
    goods:[String],
    shops:[String],
    accounts:[String]
},{timestamps:true});
Person = mongoose.model('Person', personSchema);

const accountSchema = new Schema({
    holder:String,
    balance:Number,
    currency:String,
    pendingTransaction:[String]
},{timestamps:true});
Account = mongoose.model('Account', accountSchema);

const transactionSchema = new Schema({
    from:String,
    to:String,
    amount:Number,
    currency:String,
    state:String,
    application:String
},{timestamps:true});
Transaction = mongoose.model('Transaction', transactionSchema);

const orderSchema = new Schema({
    seller:String,
    goods:[String],
    buyer:String,
    state:String,
},{timestamps:true});
const Order = mongoose.model('Order', orderSchema);

module.exports ={
    Employee:Employee,
    Shop:Shop,
    Customer:Customer,
    Supplier:Supplier,
    User:User,
    Owner:Owner,
    Good:Good,
    Person:Person,
    Category:Category,
    Account:Account,
    Transaction:Transaction,
    Order:Order
};
