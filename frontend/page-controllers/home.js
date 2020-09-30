// Import Components--------------------------------------
import { App } from '../components/app.js';
import { Notify } from '../components/notify.js';
import { Modal } from '../components/modal.js';
import { Product } from '../components/product.js';

// Page Controller -------------------------------
function homePageController(){


  Product.getCategoryById("5ed7483a9b38db408354c95e")
  .then(category => {
    // checks if it actaully got it by checking a value
    if (category.name != null) {
      App.loadPage('TeaHome', 'template-page-home', category, () => {
        // change hero wave color
        document.documentElement.style.setProperty('--color-wv', `rgb(126, 59, 172)`)
        // sets background color
        document.querySelector(".bg-sample-collection").style.backgroundColor = category.color;

        document.querySelector(".featured-collection-btn").addEventListener('click', (event) => {
          // stops hash change
          event.preventDefault();
          // stores what current category is
          App.currentCategory = category._id;
          // changes hash by going home to force hash change for router even when already on a collection
          window.location.href = "#collection";
        });

        homeHeroLoad();
      });
    } else {
      // loads page anyway hiding the featured collection
      Notify.show("Problem getting featured collection")
      // loads page anyway hiding the featured collection
      App.loadPage('TeaHome', 'template-page-home', {}, () => {
        // change hero wave color
        document.documentElement.style.setProperty('--color-wv', `rgb(126, 59, 172)`)
        // hides featured collection
        document.querySelector(".bg-sample-collection").style.display = "none";

        homeHeroLoad();
      });
    }

  })
  .catch(err => {
    console.log(err);
    Notify.show("Problem getting featured collection")
    // loads page anyway hiding the featured collection
    App.loadPage('TeaHome', 'template-page-home', {}, () => {
      // change hero wave color
      document.documentElement.style.setProperty('--color-wv', `rgb(126, 59, 172)`)
      // hides featured collection
      document.querySelector(".bg-sample-collection").style.display = "none";
    });
  });



  // loading products in hero
  function homeHeroLoad(){
    // get div in hero
    const heroProductsDiv = document.querySelector('.hero-products#products-list');

    // gets products in category
    Product.getInCategory("5ed7483a9b38db408354c95d")
    .then(products => {
      products.forEach((product) => {
        const ProductsObj = Product.createProductObj(product);
        heroProductsDiv.appendChild(ProductsObj.el);
      });
    })
    .catch(err => {
      console.log(err);
      // changes the hash so you don't get left on a broken half loaded page
      window.location.href = "#";
      Notify.show('Problem loading collection');
    });

    // gets button
    const heroProductsBtn = document.querySelector('#hero-products-btn');

    heroProductsBtn.addEventListener('click', (event) => {
      // stops hash change
      event.preventDefault();
      // stores what current category is
      App.currentCategory = "5ed7483a9b38db408354c95d";
      // changes hash
      location.hash = "#collection";
    });
  }


}

export { homePageController };
