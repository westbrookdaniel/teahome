// Admin password is admin

// 1. Dependencies, settings and initialise app ----------
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');
const secretSalt = 'hfldjsvrehlktjh435sd0f89ds9032jkl2jlk3242jsalkds'
const Utils = require("./Utils.js")
const path = require('path')

const port = process.env.PORT || 8081;
const app = express();


// 2. Middleware -----------------------------------------
// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static Site Serving
app.use(express.static('./public'))

// Enable CORS for all HTTP methods
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
   next();
});

// json web token Middleware
const jwtMW = exjwt({ secret: secretSalt });

// 3. Database Connection --------------------------------
mongoose.connect(
   'mongodb+srv://dbUser:CwhAf7rmnjGBUaF@nodedb-rayj6.mongodb.net/TeaHome',
   {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
   }).then(() => {
    console.log("Connected to the mongodb");
}).catch(err => {
    console.log('Problem connectin to mongodb. Exiting now...', err);
    process.exit();
});


// 4. Models ---------------------------------------------
let Product = require('./models/Product.js');
let User = require('./models/User.js');
let Category = require('./models/Category.js');


// 5. API Routes ---------------------------------------------

// Home 
app.get('/', (req, res) => {
   res.sendFile(path.join( __dirname, 'assets', './index.html' ));
})

// Products -----------------------------------
// Products - GET - get all Products
app.get('/api/products', (req, res) => {

  // check if request url has a query parameter caled 'ids'
  if (req.query.ids) {
    // get only products with those ids
    let idsArray = req.query.ids.split(',');
    Product.find({_id: {
      $in: idsArray
    }})
      .then((product) => {
         if(!product){
            res.status(400).send({ msg: 'No Products found'});
         }else{
            res.json(product);
         }
      })
      .catch((err) => {
         console.log(err);
         res.status(500).send({
            msg: 'Problem finding products',
            error: err.message
         });
    });

  } else if (req.query.category) {
    // if category param is in query, get only products from that category id
    Product.find({_collectionId: mongoose.Types.ObjectId(req.query.category)})
      .then((products) => {
         if(!products){
            res.status(400).send({ msg: 'No products found'});
         }else{
            res.json(products);
         }
      })
      .catch((err) => {
         console.log(err);
         res.status(500).send({
            msg: 'Problem finding products',
            error: err.message
         });
    });
  } else {
    // get all products
      Product.find({})
      .then((products) => {
         if(!products){
            res.status(400).send({ msg: 'No products found'});
         }else{
            res.json(products);
         }
      })
      .catch((err) => {
         console.log(err);
         res.status(500).send({
            msg: 'Problem finding products',
            error: err.message
         });
      });
  }
});



// Products - GET - get single by id
app.get('/api/products/:id', (req, res) => {
   Product.findById(req.params.id)
   .then( (product) => {
      if(!product){
         res.status(404).send('Product not found');
      }else{
         res.json(product);
      }
   })
   .catch((err) => {
      console.log(err);
      res.send({
         msg: "Problem getting Product",
         error: err.message
      });
   });
});

// Products - POST - create new Product
app.post('/api/products', (req, res) => {
   // validate request
    if(!req.body) {
      res.status(400).send({msg: "Product content can not be empty"});
    }else{
       // create new Product
      let newProduct = new Product(req.body);
      newProduct.save()
      .then((product) => {
         res.status(201).json(product);
      }).catch(err => {
         console.log(err);
         res.status(500).send({msg: "Couldn't create product"});
      });
    }
});

// Products - PUT - update a Product
app.put('/api/products/:id', (req, res) => {
   // validate request
   if(!req.body) {
      return res.status(400).send("Product content can not be empty");
   }else{
      // update Product
      Product.findByIdAndUpdate(req.params.id, req.body, {new: true})
      .then((product) => {
         res.json(product);
      })
      .catch((err) => {
         console.log(err);
         res.status(500).send({
            msg: "Problem updating product",
            error: err.message
         });
      });
   }
});

// Products - DELETE - delete a Product
app.delete('/api/products/:id', (req, res) => {
   Product.findByIdAndRemove(req.params.id)
   .then((product) => {
      res.send({msg: "Product deleted"});
   })
   .catch((err) => {
      res.status(500).send({
         msg: "Problem deleting product",
         error: err.message
      });
   });
});


// Categories -------------------------------
// Categories - GET - get all categories
app.get('/api/categories', (req, res) => {
      Category.find({})
      .then((categories) => {
         if(!categories){
            res.status(400).send({ msg: 'No categories found'});
         }else{
            res.json(categories);
         }
      })
      .catch((err) => {
         console.log(err);
         res.status(500).send({
            msg: 'Problem finding categories',
            error: err.message
         });
      });
});

// Categories - GET - get single by id
app.get('/api/categories/:id', (req, res) => {
   Category.findById(req.params.id)
   .then( (category) => {
      if(!category){
         res.status(404).send('Category not found');
      }else{
         res.json(category);
      }
   })
   .catch((err) => {
      console.log(err);
      res.send({
         msg: "Problem getting category",
         error: err.message
      });
   });
});

// Categories - PUT - update a category
app.put('/api/categories/:id', (req, res) => {
   // validate request
   if(!req.body) {
      return res.status(400).send("Category content can not be empty");
   }else{
      // update category
      Category.findByIdAndUpdate(req.params.id, req.body, {new: true})
      .then((category) => {
         res.json(category);
      })
      .catch((err) => {
         console.log(err);
         res.status(500).send({
            msg: "Problem updating category",
            error: err.message
         });
      });
   }
});

// Categories - POST - create new category
app.post('/api/categories', (req, res) => {
   // validate request
    if(!req.body) {
      res.status(400).send({msg: "Category content can not be empty"});
    }else{
       // create new category
      let newCategory = new Category(req.body);
      newCategory.save()
      .then((category) => {
         res.status(201).json(category);
      }).catch(err => {
         console.log(err);
         res.status(500).send({msg: "Couldn't create category"});
      });
    }
});

// Categories - DELETE - delete a category
app.delete('/api/categories/:id', (req, res) => {
   Category.findByIdAndRemove(req.params.id)
   .then((category) => {
      res.send({msg: "Category deleted"});
   })
   .catch((err) => {
      res.status(500).send({
         msg: "Problem deleting category",
         error: err.message
      });
   });
});

// Users ------------------------------
// Users - GET - all
app.get('/api/users', (req, res) => {
   User.find({})
   .then((users) => {
      if(!users){
         res.status(400).send({ msg: 'No users found'});
      }else{
         res.json(users);
      }
   })
   .catch((err) => {
      console.log(err);
      res.status(500).send({
         msg: 'Problem finding users',
         error: err.message
      });
   });
});

// Users - GET - get single by id
app.get('/api/users/:id', (req, res) => {
   User.findById(req.params.id)
   .then( (user) => {
      if(!user){
         res.status(404).send('User not found');
      }else{
         res.json(user);
      }
   })
   .catch((err) => {
      console.log(err);
      res.send({
         msg: "Problem getting user",
         error: err.message
      });
   });
});

// Users - POST - create new user
app.post('/api/users', (req, res) => {
   // validate request
    if(!req.body) {
      res.status(400).send({msg: "User content can not be empty"});
    }else{
       // create new user
      let newUser = new User(req.body);
      newUser.save()
      .then((user) => {
         res.status(201).json(user);
      }).catch(err => {
         console.log(err);
         res.status(500).send({
            msg: "Couldn't create user",
            error: err.message
         });
      });
    }
});

// Users - PUT - update a user
app.put('/api/users/:id', (req, res) => {
   // validate request
   if(!req.body) {
      return res.status(400).send("User content can not be empty");
   }else{
      // update user
      User.findByIdAndUpdate(req.params.id, req.body, {new: true})
      .then((user)=> {
         res.json(user);
      })
      .catch((err) => {
         console.log(err);
         res.status(500).send({
            msg: "Problem updating user",
            error: err.message
         });
      });
   }
});



// Users - DELETE - delete a user
app.delete('/api/users/:id', (req, res) => {
   User.findByIdAndRemove(req.params.id)
   .then((user)=>{
      res.send({msg: "User deleted"});
   })
   .catch((err) => {
      res.status(500).send({
         msg: "Problem deleting user",
         error: err.message
      });
   });
});

// Auth -------------------------------------------
// Auth - signIn
app.post('/api/auth/signin', (req, res) => {
  // check if email and pass are empty
  if (!req.body.email || !req.body.pass) {
    // send 400 satus response and message
    res.status(400).json({
      message: "No Email / Password Provided"
    });
    return;
  }
  // continue to check cridentials
  // find user in Database
  User.findOne({email: req.body.email})
  .then(user => {
    // check account doesn't exist
    if(user == null){
      res.status(400).json({
        message: "No Account Found"
      });
      return;
    }
    // user exists, now check password
    if( Utils.verifyHash(req.body.pass, user.pass) ){
      // success match
      // create jwt token
      let token = jwt.sign(
        {
          _id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          admin: user.admin
        },
        secretSalt,
        { expiresIn: 60 * 60 }
      );
      // strip password from our user object
      // should never send password back
      user.pass = undefined;

      // send back response
      res.json({
        token: token,
        user: user
      });

    }else {
      // password didn't match
      res.status(400).json({
        message: "Password / Email Incorrect"
      });
    }

  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      message: "Problem Finding User",
      err: err
    });
  });
});

// Auth - check pass
app.post('/api/auth/pass', (req, res) => {
  // check if email and pass are empty
  if (!req.body.pass) {
    // send 400 satus response and message
    res.status(400).json({
      message: "No Password Provided"
    });
    return;
  }
  // continue to check cridentials
  // find user in Database
  User.findOne({_id: req.body._id})
  .then(user => {
    // check account doesn't exist
    if(user == null){
      res.status(400).json({
        message: "Problem Finding Account"
      });
      return;
    }
    // user exists, now check password
    if( Utils.verifyHash(req.body.pass, user.pass) ){
      // success match

      // send back response
      res.json({
        result: true
      });

    }else {
      // password didn't match
      res.status(400).json({
        message: "Password Incorrect"
      });
    }

  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      message: "Problem Finding User",
      err: err
    });
  });
});

// Auth - check admin pass
app.post('/api/auth/admin', (req, res) => {
  // check if email and pass are empty
  if (!req.body.adminAuth) {
    // send 400 satus response and message
    res.status(400).json({
      message: "No Password Provided"
    });
    return;
  } else {
    // continue to check cridentials
    // now check password
    if( Utils.verifyHash(req.body.adminAuth, "9e438747c1c6bb51294b836e23e5cb63$9c25239453dfdea37524cdb6e361cb324db4328a8408b27309023c21f4d47eea") ){
        res.json({
          result: true
        });
    } else {
      // password didn't match
      res.status(400).json({
        message: "Password Incorrect"
      });
    }
  }
});


// Auth - validate
app.get('/api/auth/validate', (req, res) => {
  // get token
  let token = req.headers['authorization'].split(" ")[1];
  // validate token using jwt
  jwt.verify(token, secretSalt, (err, authData) => {
    if(err){
      console.log(err);
      res.sendStatus(403);
    }else {
      // token validate
      // send back to payloadAuthData as json
      res.json({
        user: authData,
      });
    }
  });
});


// 6. Run server on port -----------------------------
app.listen(port, () => {
   console.log(`running on port ${port}`);
});
