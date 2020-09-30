// Import Components--------------------------------------
import { App } from '../components/app.js';
import { Product } from '../components/product.js';
import { Notify } from '../components/notify.js';

// Page Controller -------------------------------
function collectionPageController(){

  // gets category from stored
  Product.getCategoryById(App.currentCategory)
  .then(data => {
    // uses that object as data for mustache
    App.loadPage('Collections', 'template-page-collection', data, () => {

      // dynamic color change for hero
      document.documentElement.style.setProperty('--color-wv', `${data.color}`)

      // get div#products-list
      const productsListDiv = document.querySelector('#products-list');

      // gets products in category
      Product.getInCategory(App.currentCategory)
      .then(products => {
        products.forEach((product) => {
          const ProductsObj = Product.createProductObj(product);
          productsListDiv.appendChild(ProductsObj.el);
        });

      })
      .catch(err => {
        console.log(err);
        // clears half loaded page page
        App.rootEl.innerHTML = '';
        // changes the hash so you don't get left on a broken half loaded page
        window.location.href = "#";
        Notify.show('Problem loading collection');
      });
    });
  })
  .catch(err => {
    console.log(err);
    // changes the hash so you don't get left on a broken half loaded page
    window.location.href = "#";
    Notify.show('Problem loading collection')
  });
}

export { collectionPageController };
