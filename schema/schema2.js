const graphql = require('graphql');
const models = require('../models/model');
const fs = require('fs');
const crypto = require('crypto');

const User = models.User;
const Person = models.Person;
const Shop = models.Shop;
const Employee = models.Employee;
const Customer = models.Customer;
const Supplier = models.Supplier;
const Good = models.Good;


const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const EmployeeType = new GraphQLObjectType({
    name:'Employee',
    fields:()=>({
        _id:{type:GraphQLID},
        shopId:{type:GraphQLID},
        employeeId:{type:GraphQLString},
        skill:{type:GraphQLString},
        details:{
            type:UserType,
            resolve(parent, args){
                return User.findById(parent._id)
            }
        }
    })  
})

const PersonType = new GraphQLObjectType({
    name:'Person',
    fields: ()=>({
        id:{type:GraphQLID},
        user:{
            type:UserType,
            resolve(parent, args){
                return User.findById(parent.user)
            }
        },
        good:{
            type:GraphQLList(GoodType),
            resolve(parent, args){
                return Good.find({_id:parent.good})
            }
        },
        shop:{
            type:GraphQLList(ShopType),
            resolve(parent, args){
                return Shop.find({_id:parent.shop})
            }
        },
    })
});

const ShopType = new GraphQLObjectType({
    name:'Shop',
    fields:()=>({
        id:{type:GraphQLID},
        user:{
            type:UserType,
            resolve(parent, args){
                return User.findById(parent.user)
            }
        },
        sales:{
            type:GraphQLList(GoodType),
            resolve(parent, args){
                return Good.find({_id:parent.sales})
            }
        }
    })
})

const MyShopType = new GraphQLObjectType({
    name:'MyShop',
    fields: ()=>({
        id:{type:GraphQLID},
        user:{
            type:UserType,
            resolve(parent, args){
                return User.findById(parent.user)
            }
        },
        supplier:{
            type:GraphQLList(UserType),
            resolve(parent, args){
                return User.find({_id:parent.supplier})
            }
        },
        purchases:{
            type:GraphQLList(GoodType),
            resolve(parent, args){
                return Good.find({_id:parent.purchases})
            }
        },
        sales:{
            type:GraphQLList(GoodType),
            resolve(parent, args){
                return Good.find({_id:parent.sales})
            }
        },
        customer:{
            type:GraphQLList(UserType),
            resolve(parent, args){
                return User.find({_id:parent.customer})
            }
        },
        owner:{
            type:GraphQLList(UserType),
            resolve(parent, args){
                return User.find({_id:parent.owner})
            }
        },
        employee:{
            type:GraphQLList(UserType),
        resolve(parent, args){
            return Employee.find({shopId:parent.id})
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name:'User',
    fields: ()=>({
        id:{type:GraphQLID},
        userName:{type:GraphQLString},
        email:{type:GraphQLString},
        photo:{type:GraphQLString},
        address:{type:GraphQLString},
        bio:{type:GraphQLString},
        myShops:{
            type:GraphQLList(ShopType),
            resolve(parent,args){
                return Shop.find({owner:parent.id})
            }
        }
    })
});

const GoodType = new GraphQLObjectType({
    name:'Good',
    fields: ()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        desc:{type:GraphQLString}
    })
});

const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        shop:{
            type:ShopType,
            args:{id:{type:GraphQLID}},
            resolve(parent, args){
                return Shop.findById(args.id)
            }
        },
        myShops:{
            type:GraphQLList(ShopType),
            args:{id:{type:GraphQLID}},
            resolve(parent, args){
                return Shop.find({owner:args.id})
            }
        },
        myShop:{
            type:MyShopType,
            args:{id:{type:GraphQLID}},
            resolve(parent, args){
                return Shop.findById(args.id)
            }
        },
        person:{
            type:PersonType,
            args:{id:{type:GraphQLID}},
            resolve(parent, args){
                return Person.findById(args.id)
            }
        },
        shops:{
            type:GraphQLList(ShopType),
            resolve(parent, args){
                return Shop.find({})
            }
        },
        persons:{
            type:GraphQLList(PersonType),
            resolve(parent, args){
                return Person.find({})
            }
        },
        users:{
            type:GraphQLList(UserType),
            resolve(parent, args){
                return User.find({})
            }
        },
        user:{
            type:UserType,
            args:{id:{type:GraphQLID}},
            resolve(parent, args){
                return User.findById(args.id)
            }
        },
        good:{
            type:GoodType,
            args:{id:{type:GraphQLID}},
            resolve(parent, args){
                return Good.findById(args.id)
            }
        },
        goods:{
            type:GraphQLList(GoodType),
            resolve(parent, args){
                return Good.find({})
            }
        },
        employee:{
            type:EmployeeType,
            args:{id:{type:GraphQLID}},
            resolve(parent, args){
                return Employee.findById(args.id)
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addUser:{
            type:UserType,
            args:{
                userName:{type:new GraphQLNonNull(GraphQLString)},
                email:{type:new GraphQLNonNull(GraphQLString)},
                photo:{type:new GraphQLNonNull(GraphQLString)},
                password:{type: new GraphQLNonNull(GraphQLString)},
                address:{type:new GraphQLNonNull(GraphQLString)},
                bio:{type:GraphQLString}
            },
            resolve(parent, args){
                let user = new User({
                    userName:args.userName,
                    email:args.email,
                    photo:args.photo,
                    password:hashPassword(args.password),
                    address:args.address,
                    bio:args.bio
                });
                return user.save();
            }
        },
        addPerson:{
            type:PersonType,
            args:{
                user:{type:new GraphQLNonNull(GraphQLID)},
                good:{type:GraphQLID},
                shop:{type:GraphQLID}
            },
            resolve(parent, args){
                let person = new Person({
                    user:args.user,
                    good:args.good,
                    shop:args.shop
                });
                return person.save();
            }
        },
        addShop:{
            type:ShopType,
            args:{
                user:{type:new GraphQLNonNull(GraphQLString)},
                owner:{type:new GraphQLNonNull(GraphQLID)},
            },
            resolve(parent, args){
                User.findOne({userName:args.user}).exec().then(user=>{
                    let shop = new Shop({
                        user:user._id,
                        owner:args.owner,
                    });
                    return shop.save();
                }).catch(err=>{
                    res.status(500).json({
                      error:err
                    });
                  }
                )

            }
        },
        addSales:{
            type:GoodType,
            args:{
                shopId:{type:new GraphQLNonNull(GraphQLID)},
                goodId:{type:new GraphQLNonNull(GraphQLID)},
            },
            resolve(parent, args){
                let shop = Shop.findById(args.shopId);
                let goodId = args.goodId;
                return shop.update({$push:{sales:goodId}});
            }
        },
        addEmployee:{
            type:EmployeeType,
            args:{
                shopId:{type:new GraphQLNonNull(GraphQLID)},
                _id:{type:new GraphQLNonNull(GraphQLID)},
                employeeId:{type:GraphQLString},
                skill:{type:GraphQLString}
            },
            resolve(parent, args){
                let employee = new Employee({
                    _id:args._id,
                    shopId:args.shopId,
                    employeeId:args.employeeId,
                    skill:args.skill
                });
                return employee.save();
            }
        },
        deleteEmployee:{
            type:EmployeeType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLID)},
                _id:{type:new GraphQLNonNull(GraphQLID)},
            },
            resolve(parent, args){
                let shop = Shop.findById(args.id);
                return shop.update({})
            }
        },
        addGood:{
            type:GoodType,
            args:{
                name:{type: new GraphQLNonNull(GraphQLString)},
                desc:{type:GraphQLString}
            },
            resolve(parent, args){
                let good = new Good({
                    name:args.name,
                    desc:args.desc
                });
                return good.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query:RootQuery,
    mutation:Mutation
})