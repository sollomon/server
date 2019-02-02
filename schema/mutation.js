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
const Employee = models.Employee;
const Good = models.Good;

const Mutation  = new GraphQLInputObjectType({
    name:'Mutation',
    
})