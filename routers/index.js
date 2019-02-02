var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();
var mongoose = require('mongoose');
const models = require('../models/model');
const crypto = require('crypto');
const User = models.User;
const Shop = models.Shop;
const Good = models.Good;
const Order = models.Order;
const Transaction = models.Transaction;
const Person = models.Person;
const jwt = require('jsonwebtoken');
const secret = require('../config').secret;
const checkAuth = require('../middleware/chech-auth');
const multer = require('multer');

const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, './uploads/');
    },
    filename:function(req, file, cb){
        cb(null, new Date().toISOString()+file.originalname);
    }
});

const fileFilter = (req, file, cb) =>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    } else {
        cb(null, false)
    }
}
const upload = multer({
    storage:storage,
    limits:{
        fileSize: 1024*1024*5
    },
    fileFilter:fileFilter
});


app.use(bodyParser.json());



router.post('/signup', upload.single('photo'), function(req, res, next){
    User.find({ email:req.body.email})
    .exec()
    .then(user=> {
        if(user.length >= 1){
            return res.status(409).json({
                message:'email already exists'
            });
        }else{
            const port = "http://localhost:3001/"
            const user = new User({
                userName:req.body.userName,
                email:req.body.email,
                address:req.body.address,
                photo:port.concat(req.file.path),
                bio:req.body.bio
              });
              return user.save()
              .then(result =>{
                console.log(result);
                res.status(201).json({
                  message:"user created",
                  email:req.body.email,
                  id:result._id
                });
              })
              .catch(err=>{
                res.status(500).json({
                  error:err
                });
              });
        }
    })
  });

  /*router.post('/createproduct', upload.single('photo'),(req, res, next)=>{
      Good.find({name:req.body.name}).exec()
      .then(good=>{
        if (good.length >= 1) {
            res.status(409).json({
                message:"good here"
            });
        } else {
            const port = "http://localhost:3001/";
            let good = new Good({
                name:req.body.name,
                desc:req.body.desc,
                barNo:req.body.barNo,
                category:req.body.category,
                commonPrice:req.body.commonPrice,
                createdBy:req.body.createdBy,
                icon:port.concat(req.file.path),
            });
            return good.save()
            .then(
                res=>{
                    console.log(res)
                    res.status(201).json({
                        message:"good created",
                        id:res._id
                    }).catch(error=>{
                        res.status(500).json({
                            error:error
                        })
                    })
                }
            ).catch(err=>{
                res.status(500).json({
                    error:err
                })
            })
        }
      })

})*/

  router.post('/createperson', (req, res, next)=>{
    User.find({email:req.body.email})
    .exec()
    .then(item =>{
        const person = new Person({
            user:req.body.user,
            password:hashPassword(req.body.password)
        });
        return person.save()
        .then(result=>{
            console.log(result._id);
            res.status(201).json({
                message:"person created",
                id:result._id
            });

        })
        .catch(err=>{
            res.status(500).json({
                error:err
            });
        });
    })
  });
  router.post('/createshop', (req,res, next)=>{
          const shop = new Shop({
              user:req.body.user,
              owners:req.body.owners
          });
          return shop.save()
          .then(results=>{
              console.log(results);
              res.status(201).json({
                  message:"shop created",
                  id:results._id
              });
              res.end();
          })
          .catch(err=>{
              res.status(500).json({
                  error:err
              });
          });

  });

  router.post('/createorder',(req, res, next)=>{
      let session = null;
      let order = new Order({
          goods:req.body.goods,
          seller:req.body.shop,
          buyer:req.body.user,
          state:"initial",
      });
      let shop = Shop.findById(req.body.shop);
      let cust = req.body.goods[0];
      let person = Person.findById("5bea1369061b6b460dc0b250");
      return mongoose.startSession().
      then(_session=>{
          session = _session;
          session.startTransaction();
          try{
              order.save()
              console.log("order made")

              res.end();
          }catch(error){
              console.log("Error happened");
              session.abortTransaction();
              res.status(500).json({
                  message:"error"
              });
              res.end();
              throw error;
          }
      })
  })
  //then(()=>shop.update({$push:{customers:cust}}).session)
  //person.update({$push:{goods:cust}}).session
  router.post('/createproduct',upload.single('photo'), (req,res, next)=>{
    const port = "http://localhost:3001/";
    let good = new Good({
        name:req.body.name,
        desc:req.body.desc,
        barNo:req.body.barNo,
        category:req.body.category,
        commonPrice:req.body.commonPrice,
        createdBy:req.body.createdBy,
        icon:port.concat(req.file.path),
    });
    return good.save()
    .then(results=>{
        console.log(results);
        res.status(201).json({
            message:"good created",
            id:results._id
        });
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        });
    });
});

  router.post('/login', (req, res, next)=> {
    User.find({ email:req.body.email}).exec()
    .then(item =>{
        Person.find({user:item[0]._id})
        .exec()
        .then(person =>{
            if (person.length < 1) {
                return res.status(401).json({
                    message:"Auth failed"
                });
            }
            valid = verifyHash(req.body.password, person[0].password);
            if (!valid) {
                return res.status(401).json({
                    message:"Auth Failed"
                });
            }else{
            const token = jwt.sign(
                {
                    email:req.body.email,
                    user:item[0].id
                },
                secret,
                {
                    expiresIn:"1h"
                })
            return res.status(200).json({
                token:token,
                user:{
                    name:item[0].userName,
                    id:item[0]._id
                }
            })
        }
        })
        .catch(err=>{
            res.status(500).json({
              error:err
            });
          });
    })


  });

  const data = [
      {
          name:"sollo",
          and:"programmer"
      },
      {
          name:"mercy",
          and:"accountant"
      }
  ]

  router.get('/user',(req, res, next)=>{
    console.log(req.headers);
    res.status(201).json({
        data:data
    });
  });


module.exports = router;
