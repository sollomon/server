var createError = require('http-errors');
const jwt = require('jsonwebtoken');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = express.Router();
const models = require('./models/model');
const checkAuth = require('./middleware/chech-auth');
const User = models.User;


const app = express();
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.json());

app.use(cors());

mongoose.connect('mongodb://localhost/graph');
mongoose.connection.once('open', () =>{
  console.log('database connected');
})

var indexRouter = require('./routers/index');

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql:true
  }

))


app.use('/', indexRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.listen(3001, ()=> console.log(' Graphql server'))

