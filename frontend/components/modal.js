import { App } from "./app.js";
import { Admin } from "./admin.js";
import anime from '../node_modules/animejs/lib/anime.es.js';

const Modal = {
  showCloseBtn: true,

  show:  (content) => {
    // create overlayDiv
    let overlayDiv = document.createElement('div');
    overlayDiv.className = 'modal-overlay';
    // append to rootEl
    App.rootEl.appendChild(overlayDiv);

    // create modalDiv
    let modalDiv = document.createElement('div');
    modalDiv.className = 'modal-style';
    // create modalContent
    let modalContent = document.createElement('div');
    modalContent.className = 'modal-content-inner';

    // insert content
    modalContent.innerHTML = content;

    // create modalCloseBtn
    let modalCloseBtn = document.createElement('button');
    modalCloseBtn.className = 'modal-close-btn';
    modalCloseBtn.innerHTML = '<i class="fas fa-times"></i>';

    // append modalContent to modalDiv
    modalDiv.appendChild(modalContent)
    // if showCloseBtn = true, append modalCloseBtn too
    if(Modal.showCloseBtn === true){
      modalDiv.appendChild(modalCloseBtn);
    }

    // append modalDiv to rootEl
    App.rootEl.appendChild(modalDiv);

    // animate modalDiv entrance using anime.js
    anime({
      targets: modalDiv,
      keyframes: [
        { opacity: 0, top: '60%', duration: 0, easing: 'easeInOutExpo'},
        { opacity: 1, top: '50%', duration: 500, easing: 'easeInOutExpo' }
      ]
    });
    // animate overlayDiv entrance using anime.js
    anime({
      targets: overlayDiv,
      keyframes: [
        { opacity: 0, duration: 0, easing: 'easeInOutExpo'},
        { opacity: 1, duration: 100, easing: 'easeInOutExpo' }
      ]
    });

    // add event listenr to modalCloseBtn
    modalCloseBtn.addEventListener('click', (e) => {
      Modal.remove();
    });

    // add esc key press function to trigger Modal.remove()
    Modal.modalEscKey = (e) => {
      if(e.keyCode == 27){
        Modal.remove();
      }
    }

    // listen for esc key press
    document.addEventListener('keydown', Modal.modalEscKey)

  },

  update: (content) => {
    // update content
    document.querySelector(".modal-content-inner").innerHTML = content;
  },

  remove: () => {
    // get overlayDiv
    let overlayDiv = document.querySelector('.modal-overlay');
    // get modalDiv
    let modalDiv = document.querySelector('.modal-style');

    // overlayDiv exit animation
    anime({
      targets: overlayDiv,
      opacity: 0,
      duration: 500,
      easing: 'easeInOutExpo',
      complete: () => {
        // remove overlayDiv
        overlayDiv.remove();
      }
    });

    // modalDiv exit animation
    anime({
      targets: modalDiv,
      opacity: 0,
      duration: 300,
      top: '60%',
      easing: 'easeInOutExpo',
      complete: () => {
        // remove overlayDiv
        modalDiv.remove();
      }
    });

    // stop listening for esc key
    document.removeEventListener('keydown', Modal.modalEscKey);


    // runs the controller for the admin bar
    Admin.controller();
    Admin.updateBar();


  }
}

export { Modal }
