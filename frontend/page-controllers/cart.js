// Import Components--------------------------------------
import { App } from '../components/app.js';
import { Product } from '../components/product.js';
import { Notify } from '../components/notify.js';
import { User } from '../components/user.js';
import { Modal } from '../components/modal.js';


// Page Controller -------------------------------
function cartPageController(){
  let data = {
    intro: "View Cart"
  }
  App.loadPage('Your Cart', 'template-page-cart', data, () => {

    // get checkout button
    const checkoutBtn = document.querySelector(".cart-checkout");

    checkoutBtn.addEventListener('click', () => {
      // get subtotal value el
      const cartSubtotalValue = document.querySelector(".cart-subtotal-value").innerHTML;
      // conver to data object
      const modalData = {
        total: cartSubtotalValue
      }
      // get template
      const modalTemplate = document.querySelector("#template-cart-modal").innerHTML
      // render with mustache
      const modalContent = Mustache.render(modalTemplate, modalData);

      // show modal
      Modal.show(modalContent)
      .then(() => {
        // then get cart button on click
        document.querySelector(".cart-modal-btn").addEventListener('click', (e) => {
          // prevent default
          e.preventDefault();
          // close modal
          Modal.remove();
          // go home
          location.hash = '#';
        });
      });

    });

  });
}

export { cartPageController };
