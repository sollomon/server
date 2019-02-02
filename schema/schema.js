const graphql = require('graphql');
const models = require ('../models/model');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const User = models.User;
const Person = models.Person;
const Shop = models.Shop;
const Good = models.Good;
const Category = models.Category;
const Account = models.Account;
const Transaction = models.Transaction;
const Order = models.Order;

const UserType = new GraphQLObjectType({
    name:'User',
    fields:()=>({
        id:{type:GraphQLID},
        userName:{type:GraphQLString},
        email:{type:GraphQLString},
        photo:{type:GraphQLString},
        address:{type:GraphQLString},
        bio:{type:GraphQLString}
    })
});

const MyUserType = new GraphQLObjectType({
    name:'MyUser',
    fields:()=>({
        id:{type:GraphQLID},
        userName:{type:GraphQLString},
        email:{type:GraphQLString},
        photo:{type:GraphQLString},
        address:{type:GraphQLString},
        bio:{type:GraphQLString},
        myShops:{
            type:GraphQLList(MyShopType),
            resolve(parent,args){
                return Shop.find({owners:parent.id})
            }
        }
    })
});

const OrderType = new GraphQLObjectType({
    name:'Order',
    fields:()=>({
        id:{type:GraphQLID},
        seller:{
            type:ShopType,
            resolve(parent,args){
                return Shop.findById(parent.seller)
            }
        },
        goods:{
            type:GraphQLList(GoodType),
            resolve(parent, args){
                return Good.find({_id:parent.goods})
            }
        },
        buyer:{
            type:UserType,
            resolve(parent,args){
                return User.findById(parent.buyer)
            }
        },
        state:{type:GraphQLString},
    })
});

const GoodType = new GraphQLObjectType({
    name:'Good',
    fields: ()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        desc:{type:GraphQLString},
        category:{
            type:GraphQLList(CategoryType),
            resolve(parent, args){
                return Category.find({goods:parent._id})
            }
        },
        commonPrice:{type:GraphQLInt},
        createdBy:{type:GraphQLID},
        icon:{type:GraphQLString},
        shops:{
          type:GraphQLList(ShopType),
          resolve(parent, args){
            return Shop.find({sales:parent._id})
          }
        }
    })
});

const AccountType = new GraphQLObjectType({
    name:'Account',
    fields:()=>({
        id:{type:GraphQLID},
        holder:{type:GraphQLID},
        currency:{type:GraphQLString},
        pendingTransactions:{
            type:GraphQLList(TransactionType),
            resolve(parent, args){
                return Transaction.find({_id:parent.pendingTransactions})
            }
        }
    })
});

const TransactionType = new GraphQLObjectType({
    name:'Transaction',
    fields:()=>({
        id:{type:GraphQLID},
        from:{type:GraphQLID},
        to:{type:GraphQLID},
        amount:{type:GraphQLInt},
        currency:{type:GraphQLString},
        state:{type:GraphQLString},
        application:{type:GraphQLID}
    })
})

const CategoryType = new GraphQLObjectType({
    name:'Category',
    fields: ()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        desc:{type:GraphQLString},
        goods:{
          type:GraphQLList(GoodType),
          resolve(parent, args){
            return Good.find({_id:parent.goods})
          }
        },
        subCategories:{
            type:GraphQLList(CategoryType),
            resolve(parent, args){
                return Category.find({_id:parent.subCategories})
            }
        },
        parentCategories:{
            type:GraphQLList(CategoryType),
            resolve(parent, args){
                return Category.find({subCategories:parent._id})
            }
        }
    })
})

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
        },
        rating:{type:GraphQLInt}
    })
});
const MyShopType = new GraphQLObjectType({
    name:'MyShop',
    fields:()=>({
        id:{type:GraphQLID},
        user:{
            type:MyUserType,
            resolve(parent, args){
                return User.findById(parent.user)
            }
        },
        suppliers:{
            type:GraphQLList(UserType),
            resolve(parent, args){
                return User.find({_id:parent.suppliers})
            }
        },
        customers:{
            type:GraphQLList(UserType),
            resolve(parent, args){
                return User.find({_id:parent.customers})
            }
        },
        sales:{
            type:GraphQLList(GoodType),
            resolve(parent, args){
                return Good.find({_id:parent.sales})
            }
        },
        purchases:{
            type:GraphQLList(GoodType),
            resolve(parent, args){
                return Good.find({_id:parent.purchases})
            }
        },
        owners:{
            type:GraphQLList(UserType),
            resolve(parent, args){
                return User.find({_id:parent.owners})
            }
        },
        employees:{
            type:GraphQLList(UserType),
            resolve(parent, args){
                return User.find({_id:parent.employees})
            }
        },
        myGoods:{
            type:GraphQLList(GoodType),
            resolve(parent, args){
                return Good.find({createdBy:parent._id})
            }
        },
        rating:{type:GraphQLInt},
        orders:{
            type:GraphQLList(OrderType),
            resolve(parent, args){
                return Order.find({seller:parent._id,state:"initial"})
            }
        }
    })
});

const MyPersonType = new GraphQLObjectType({
    name:'MyPerson',
    fields: ()=>({
        id:{type:GraphQLID},
        user:{
            type:MyUserType,
            resolve(parent, args){
                return User.findById(parent.user)
            }
        },
        goods:{
            type:GraphQLList(GoodType),
            resolve(parent, args){
                return Good.find({_id:parent.good})
            }
        },
        shops:{
            type:GraphQLList(ShopType),
            resolve(parent, args){
                return Shop.find({_id:parent.shop})
            }
        },
    })
});

const PersonType = new GraphQLObjectType({
    name:'Person',
    fields:()=>({
        id:{type:GraphQLID},
        user:{
            type:UserType,
            resolve(parent, args){
                return User.findById(parent.user)
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name:'RootQuery',
    fields:{
        categories:{
            type:GraphQLList(CategoryType),
            resolve(parent, args){
                return Category.find({})
            }
        },
        shops:{
            type:GraphQLList(ShopType),
            resolve(parent, args){
                return Shop.find({})
            }
        },
        shop:{
            type:ShopType,
            args:{id:{type:GraphQLID}},
            resolve(parent, args){
                return Shop.findById(args.id)
            }
        },
        myShops:{
            type:GraphQLList(MyShopType),
            args:{id:{type:GraphQLID}},
            resolve(parent, args){
                return Shop.find({owners:args.id})
            }
        },
        myShop:{
            type:MyShopType,
            args:{id:{type:GraphQLID}},
            resolve(parent, args){
                return Shop.findById(args.id)
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
        myUser:{
            type:MyUserType,
            args:{id:{type:GraphQLID}},
            resolve(parent, args){
                return User.findById(args.id)
            }
        },
        people:{
            type:GraphQLList(PersonType),
            resolve(parent, args){
                return Person.find({})
            }
        },
        person:{
            type:PersonType,
            args:{id:{type:GraphQLID}},
            resolve(parent, args){
                return Person.findById(args.id)
            }
        },
        myPerson:{
            type:MyPersonType,
            args:{id:{type:GraphQLID}},
            resolve(parent, args){
                return Person.findOne({user:args.id})
            }
        },
        goods:{
            type:GraphQLList(GoodType),
            resolve(parent, args){
                return Good.find({})
            }
        },
        good:{
            type:GoodType,
            args:{id:{type:GraphQLID}},
            resolve(parent, args){
                return Good.findById(args.id)
            }
        },
        orders:{
            type:GraphQLList(OrderType),
            args:{id:{type:GraphQLID}},
            resolve(parent, args){
                return Order.find({seller:args.id})
            }
        },
        order:{
            type:OrderType,
            args:{id:{type:GraphQLID}},
            resolve(parent, args){
                return Order.findById(args.id)
            }
        },
        initialOrders:{
            type:GraphQLList(OrderType),
            args:{id:{type:GraphQLID}},
            resolve(parent, args){
                return Order.find({seller:args.id,state:"initial"})
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        acceptOrder:{
            type:OrderType,
            args:{
                order:{type:GraphQLID}
            },
            resolve(parent, args){
                let order = Order.findById(args.order)
                return order.update({$set:{state:"pending"}})
            }
        },
        //accounts & money transfer
        createAccount:{
            type:AccountType,
            args:{
                holder:{type:new GraphQLNonNull(GraphQLID)},
                currency:{type:new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                let account =  new Account({
                    holder:args.holder,
                    currency:args.currency
                });
                return account.save()
            }
        },

        addShop:{
            type:MyShopType,
            args:{
                user:{type: new GraphQLNonNull(GraphQLID)},
                owners:{type: new GraphQLNonNull(GraphQLID)},
                suppliers:{type:GraphQLID},
                customers:{type:GraphQLID},
                sales:{type:GraphQLID},
                purchases:{type:GraphQLID},
                employees:{type:GraphQLID}
            },
            resolve(parent, args){
                let shop = new Shop({
                    user:args.user,
                    owners:args.owners,
                    suppliers:args.suppliers,
                    customers:args.customers,
                    sales:args.sales,
                    purchases:args.purchases,
                    employees:args.employees
                });
                return shop.save();
            }
        },
        createGood:{
            type:GoodType,
            args:{
                name:{type:new GraphQLNonNull(GraphQLString)},
                desc:{type:new GraphQLNonNull(GraphQLString)},
                category:{type:GraphQLString},
                commonPrice:{type:GraphQLInt},
                createdBy:{type:GraphQLID}
            },
            resolve(parent, args){
                let good = new Good({
                    name:args.name,
                    desc:args.desc,
                    category:args.category,
                    commonPrice:args.commonPrice,
                    createdBy:args.createdBy
                });
                return good.save();
            }
        },
        //update Shops
        addSale:{
            type:MyShopType,
            args:{
                shopId:{type:new GraphQLNonNull(GraphQLID)},
                goodId:{type:new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let shop = Shop.findById(args.shopId);
                return shop.update({$push:{sales:args.goodId}});
            }
        },
        addSupplier:{
            type:MyShopType,
            args:{
                shopId:{type:new GraphQLNonNull(GraphQLID)},
                supplierId:{type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let shop = Shop.findById(args.shopId);
                return shop.update({$push:{suppliers:args.supplierId}});
            }
        },
        addCustomer:{
            type:MyShopType,
            args:{
                shopId:{type: new GraphQLNonNull(GraphQLID)},
                customerId:{type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let shop = Shop.findById(args.shopId);
                return shop.update({$push:{customers:args.customerId}});
            }
        },
        addPurchase:{
            type:MyShopType,
            args:{
                shopId:{type:new GraphQLNonNull(GraphQLID)},
                purchaseId:{type:new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let shop = Shop.findById(args.shopId);
                return shop.update({$push:{sales:args.purchaseId}});
            }
        },
        addEmployee:{
            type:MyShopType,
            args:{
                shopId:{type:new GraphQLNonNull(GraphQLID)},
                employeeId:{type:new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let shop = Shop.findById(args.shopId);
                return shop.update({$push:{sales:args.employeeId}});
            }
        },
        addPersonGood:{
            type:MyPersonType,
            args:{
                personId:{type:new GraphQLNonNull(GraphQLID)},
                goodId:{type:new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let person = Person.findById(args.personId);
                return person.update({$push:{goods:args.goodId}})
            }
        },
        addPersonShop:{
            type:MyPersonType,
            args:{
                personId:{type: new GraphQLNonNull(GraphQLID)},
                shopId:{type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let person = Person.findById(args.personId);
                return person.update({$push:{shops:args.personId}})
            }
        },
        deleteSale:{
            type:MyShopType,
            args:{
                goodId:{type: new GraphQLNonNull(GraphQLID)},
                shopId:{type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let shop = Shop.findById(args.shopId);
                return shop.update({$pull:{sales:args.goodId}})
            }
        },
        deleteSupplier:{
            type:MyShopType,
            args:{
                shopId:{type:new GraphQLNonNull(GraphQLID)},
                supplierId:{type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let shop = Shop.findById(args.shopId);
                return shop.update({$pull:{suppliers:args.supplierId}});
            }
        },
        deleteCustomer:{
            type:MyShopType,
            args:{
                shopId:{type: new GraphQLNonNull(GraphQLID)},
                customerId:{type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let shop = Shop.findById(args.shopId);
                return shop.update({$pull:{customers:args.customerId}});
            }
        },
        deletePurchase:{
            type:MyShopType,
            args:{
                shopId:{type:new GraphQLNonNull(GraphQLID)},
                purchaseId:{type:new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let shop = Shop.findById(args.shopId);
                return shop.update({$pull:{sales:args.purchaseId}});
            }
        },
        deleteEmployee:{
            type:MyShopType,
            args:{
                shopId:{type:new GraphQLNonNull(GraphQLID)},
                employeeId:{type:new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let shop = Shop.findById(args.shopId);
                return shop.update({$pull:{sales:args.employeeId}});
            }
        },
        deletePersonGood:{
            type:MyPersonType,
            args:{
                personId:{type:new GraphQLNonNull(GraphQLID)},
                goodId:{type:new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let person = Person.findById(args.personId);
                return person.update({$pull:{goods:args.goodId}})
            }
        },
        deletePersonShop:{
            type:MyPersonType,
            args:{
                personId:{type: new GraphQLNonNull(GraphQLID)},
                shopId:{type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let person = Person.findById(args.personId);
                return person.update({$pull:{shops:args.personId}})
            }
        },
        //categories remember to delete
        createCategory:{
            type:CategoryType,
            args:{
                name:{type:new GraphQLNonNull(GraphQLString)},
                desc:{type:new GraphQLNonNull(GraphQLString)},
                goods:{type:GraphQLID},
                subCategories:{type:GraphQLID}
            },
            resolve(parent, args){
                let category = new Category({
                    name:args.name,
                    desc:args.desc,
                    goods:args.goods,
                    subCategories:args.subCategories
                });
                return category.save();
            }
        },
        addGoodToCategory:{
            type:CategoryType,
            args:{
                categoryId:{type:new GraphQLNonNull(GraphQLID)},
                goodId:{type:new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let category = Category.findById(args.categoryId);
                return category.update({$push:{goods:args.goodId}})
            }
        }
    }
});



module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation:Mutation
  })
