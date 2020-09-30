import { App } from "./app.js";
import { Product } from "./product.js";
import { Notify } from "./notify.js";

const User = {
  firstName: null,
  lastName: null,
  email: null,
  id: null,
  admin: null,
  lastLogin: null,
  cartProducts: [],

  create: (userData) => {
    // sets up function to be called after authenticating admin password
    function createUser() {
      // send userData to backend API using fetch = POST
      fetch('https://tea-home.herokuapp.com/api/users', {
        method: 'post',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      })
      .then(res => {
        if(res.status != 201) {
          // problem creating user
          Notify.show("Problem creating user");
        }else{
          // user created
          Notify.show("User Account Created");
          location.hash = '#signIn';
        }
      })
      .catch(err => {
        console.log(err);
        Notify.show("Problem creating user");
      });
    }

    // checks if admin password was entered
    if (userData.adminAuth != null || userData.adminAuth != ''){
      // pulls out admin password on its own
      let adminAuthObj = {
        adminAuth: userData.adminAuth
      }
      // fetch to authenticate adminAuth password
      fetch('https://tea-home.herokuapp.com/api/auth/admin', {
        method: 'post',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminAuthObj)
      })
      .then(res => res.json())
      .then(res => {
        if(res.result != true) {
          // adds admin: false
          userData.admin = false;
          createUser();
        }else{
          // admin authenticated
          Notify.show("Admin Permissions Enabled");
          // adds admin: true
          userData.admin = true;
          createUser();
        }
      })
      .catch(err => {
        console.log(err);
        Notify.show("Admin Not Authenticated");
        // adds admin: false
        userData.admin = false;
        createUser();
      });

      // removes the admin password from the userdata
      delete userData[adminAuth]
    } else {
      // if no admin password sets to false
      // adds admin: false
      userData.admin = false;
      createUser();
    }


  },

  update: (id, dataObj) => {
      // return new promise
      return new Promise((resolve, reject) => {
        // fetch
        fetch(`https://tea-home.herokuapp.com/api/users/${id}`, {
          method: 'PUT',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataObj)
        })
        .then(res => res.json())
        .then(user => {
          resolve(user);
        })
        .catch(err => {
          reject(err);
          Notify.show("Problem updating user");
        })
      });
  },

  delete: (id) => {
    // return new promise
    return new Promise((resolve, reject) => {
      // fetch
      fetch(`https://tea-home.herokuapp.com/api/users/${id}`, {
        method: 'DELETE',
      })
      .then(res => res.json())
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
        Notify.show("Problem deleting user");
      })
    });
  },

  checkPass: (id, pass) => {
    // create dataObj
    let dataObj = {
      _id: id,
      pass: pass
    }

    // return new promise
    return new Promise((resolve, reject) => {
      // fetch
      fetch(`https://tea-home.herokuapp.com/api/auth/pass`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataObj)
      })
      .then(res => res.json())
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
        Notify.show("Problem authenticating");
      })
    });
  },

  addProductsToFavs: (id) => {
    // add the id into User.cartProducts
    User.cartProducts.push(id)
    User.updateFavsCount();
  },

  removeProductFromFavs: (id) => {
    // get the index of the id in the User.cartProducts
    const index = User.cartProducts.indexOf(id)
    if (index > -1) {
      User.cartProducts.splice(index, 1);
    }
    User.updateFavsCount();

  },

  updateFavsCount: () => {
    // get number of fav items
    let favsCount = User.cartProducts.length;
    // get favs conunt
    let favsCountSpan = document.querySelector('#favs-count');
    // check it exists
    if (favsCountSpan != null) {
      // check if fav count is greater than 0 before showing
      if (favsCount > 0) {
        favsCountSpan.style.display = 'inline-block';
        favsCountSpan.innerText = favsCount;
      } else {
        favsCountSpan.style.display = 'none';
      }
    }

    // refreshs cart if on cart page
    if (location.hash == "#cart") {
      User.refreshFavs();
    }
  },

  refreshFavs: () => {

    // get div#products-list
    const productsListDiv = document.querySelector('#products-list');

    // get subtotal value el
    const cartSubtotalValue = document.querySelector(".cart-subtotal-value");
    // define variable
    var cartValue = 0.00;


    // check if user has any favourite products
    if (User.cartProducts.length == 0) {
      // no favourites - show text message
      productsListDiv.innerHTML = '<p>No items in cart</p>'

      // set as total price value
      cartSubtotalValue.innerHTML = `0`;

    } else {
      // resets div with nothing
      productsListDiv.innerHTML = ''

      // is favourites - get favourite products
      Product.getByIds(User.cartProducts)
      .then(products => {
        products.forEach((product) => {
          // create product
          const ProductsObj = Product.createProductObj(product);
          productsListDiv.appendChild(ProductsObj.el);

          // increase cartValue
          cartValue = cartValue + product.price;
          // set as total price value
          cartSubtotalValue.innerHTML = `${cartValue}`;

        });
      })
      .catch(err => {
        console.log(err);
        Notify.show('Problem loading products')
      });

    }

  }

}


export { User }
