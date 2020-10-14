import { App } from './app.js';
import { Modal } from './modal.js';
import { User } from './user.js';
import { Notify } from './notify.js';
import { Admin } from './admin.js';


const Product = {
  get: () => {
    // return new promise
    return new Promise((resolve, reject) => {
      // fetch categories
      fetch(window.location.protocol + '//' + window.location.host + '/api/products')
      .then(res => res.json())
      .then(products => {
        resolve(products);
      })
      .catch(err => {
        reject(err);
      })
    });
  },

  getCategories: () => {
      // return new promise
      return new Promise((resolve, reject) => {
        // fetch categories
        fetch(window.location.protocol + '//' + window.location.host + '/api/categories')
        .then(res => res.json())
        .then(categories => {
          resolve(categories);
        })
        .catch(err => {
          reject(err);
        })
      });
    },

  getCategoryById: (id) => {
      // return new promise
      return new Promise((resolve, reject) => {
        // fetch categories
        fetch(window.location.protocol + '//' + window.location.host + `/api/categories/${id}`)
        .then(res => res.json())
        .then(categories => {
          resolve(categories);
        })
        .catch(err => {
          reject(err);
        })
      });
    },


  getByIds: (ids) => {
    // return new promise
    return new Promise((resolve, reject) => {
      // fetch categories
      let url = new URL(window.location.protocol + '//' + window.location.host + "/api/products");
      let params = { ids: ids };
      url.search = new URLSearchParams(params).toString();

      fetch(url)
      .then(res => res.json())
      .then(products => {
        resolve(products);
      })
      .catch(err => {
        reject(err);
      })
    });
  },

  getInCategory: (categoryId) => {
    // return new promise
    return new Promise((resolve, reject) => {
      // fetch categories
      let url = new URL(window.location.protocol + '//' + window.location.host + "/api/products");
      let params = { category: categoryId };
      url.search = new URLSearchParams(params).toString();

      fetch(url)
      .then(res => res.json())
      .then(categories => {
        resolve(categories);
      })
      .catch(err => {
        reject(err);
      })
    });
  },

  createProductObj: (data) => {
    // create empty object
    const productObj = {};
    // set data for paremeter
    productObj.data = data;
    // get template HTML
    productObj.template = document.querySelector('#template-product-entry').innerHTML;
    // create element
    productObj.el = document.createElement('div');

    // render()
    productObj.render = () => {
      // set div class name
      productObj.el.className = "product-entry";
      // set category id to data.id
      productObj.el.setAttribute('id', `${productObj.data._id}`);

      // if category is in favourites add class
      if(User.cartProducts.includes(productObj.data._id)){
        productObj.el.classList.add('is-favourite');
      }


      // render HTML using mustache template
      productObj.el.innerHTML = Mustache.render(productObj.template, productObj.data);
      // run events()
      productObj.events();
    }

    // events()
    productObj.events = () => {
      // get view-category-btn
      const viewProductBtn = productObj.el.querySelector('.view-product-btn');
      viewProductBtn.addEventListener('click', () => {
        Product.showModal(productObj);
        Admin.updateId(productObj.data._id);
        Admin.controller("product");
      });

      // get add-category-btn
      const addProductBtn = productObj.el.querySelector('.add-product-btn');
      addProductBtn.addEventListener('click', () => {
        // check if the category is already in User.cartProducts
        if(User.cartProducts.includes(productObj.data._id)){
          // remove from User.facProducts using User.removeProductFromFavs()
          User.removeProductFromFavs(productObj.data._id);
          Notify.show("Removed from Cart")
        }else{
          User.addProductsToFavs(productObj.data._id);
          Notify.show("Added to Cart")
        }
        // re-render our productObj.else
        productObj.render();
      });
    }
    // run render = ()
    productObj.render();

    return productObj;


  },

  showModal: (productObj) => {
    // get category Modal Template
    const modalTemplate = document.querySelector('#template-product-modal').innerHTML;
    // redner modal content with mustache
    const modalContent = Mustache.render(modalTemplate, productObj.data);
    // show modal
    Modal.show(modalContent);

    // get favBtn
    const favBtn = document.querySelector('.modal-style .fav-btn');

    // check if category is in favourites
    if(User.cartProducts.includes(productObj.data._id)){
      // change button text to "remove from favourites"
      favBtn.innerText = 'Remove from Cart';
    }

    // click
    favBtn.addEventListener('click', () => {
      // check if the category is already in User.cartProducts
      if(User.cartProducts.includes(productObj.data._id)){
        // remove from User.facProducts using User.removeProductFromFavs()
        User.removeProductFromFavs(productObj.data._id);
        Notify.show("Removed from Cart")
      }else{
        User.addProductsToFavs(productObj.data._id);
        Notify.show("Added to Cart")
      }
      // re-render our productObj.else
      productObj.render();
      // close modal
      Modal.remove();
    });
  }
}



export { Product }
