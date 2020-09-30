// Import Components--------------------------------------
import { App } from '../components/app.js';
import { Product } from '../components/product.js';
import { Notify } from '../components/notify.js';

// Page Controller -------------------------------
function productsPageController(){
  let data = {
    intro: "View all products."
  }
  App.loadPage('Products', 'template-page-products', data, () => {

    // change hero wave color
    document.documentElement.style.setProperty('--color-wv', `rgb(59, 172, 88)`)

    // get div#products-list
    const productListDiv = document.querySelector('#products-list');

    // get div#products-list-fiters
    const productListFiltersDiv = document.querySelector('#products-list-filters');

    // render category buttons
    Product.getCategories()
    .then(categories => {
      // loop through each category and create a buttons
      categories.forEach(category => {
        // create button
        // check avaliblity of cateogry
        if (category.available == true) {
          let categoryBtn = document.createElement('button');
          categoryBtn.className = 'btn btn-light btn-sm filter-btn mb-2 mr-2';
          categoryBtn.innerText = category.name;
          // append button to filters div
          productListFiltersDiv.appendChild(categoryBtn);

          // click
          categoryBtn.addEventListener('click', () => {
            // remove active from all buttons
            let allCategoryBtns = document.querySelectorAll(".filter-btn");
            allCategoryBtns.forEach(btn => {
              btn.classList.remove('active');
            });
            // make button active
            categoryBtn.classList.add('active');

              // clear
              productListDiv.innerHTML = '';
              // backend API call - get products only from certain categories
              Product.getInCategory(category._id)
              .then(products => {

                  // adds products
                  products.forEach((product) => {
                    const productObj = Product.createProductObj(product);
                    productListDiv.appendChild(productObj.el);
                  });


              })
              .catch(err => {
                console.log(err);
                Notify.show('Problem filtering products')
              });

          });
        }
      });

    })
    .catch(err => {
      console.log(err);
    })

  // create a clear filters button
  let clearFiltersBtn = document.createElement('button');
  clearFiltersBtn.className = 'btn btn-light btn-sm filter-btn mb-2 mr-2';
  clearFiltersBtn.innerText = 'All Categories';
  productListFiltersDiv.appendChild(clearFiltersBtn);
  // click
  clearFiltersBtn.addEventListener('click', () => {
    // remove active from all buttons
    let allCategoryBtns = document.querySelectorAll(".filter-btn");
    allCategoryBtns.forEach(btn => {
      btn.classList.remove('active');
    });
    // clear
    productListDiv.innerHTML = '';
    getAllProducts();
  });

  function getAllProducts(){
    // get all
    Product.get()
    .then(products => {
      products.forEach((product) => {
        // checks if avalible
        if (product.available == true) {
          const productObj = Product.createProductObj(product);
          productListDiv.appendChild(productObj.el);
        }

      });
    })
    .catch(err => {
      console.log(err);
      Notify.show('Problem loading products')
    });
  }
  getAllProducts();
  });

}


export { productsPageController };
