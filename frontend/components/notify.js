import { App } from "./app.js";
import anime from '../node_modules/animejs/lib/anime.es.js';

const Notify = {
  showDuration: 2000,
  container: null,

  init: () => {
    // create notifications container div and apend to body
    Notify.container = document.createElement('div');
    Notify.container.setAttribute('id', 'notifications');
    document.body.appendChild(Notify.container);
  },

  show: (message) => {
    // Create notificationEntryDiv and set class
    const notificaitonEntryDiv = document.createElement('div');
    notificaitonEntryDiv.className = 'notificaiton-entry alert alert-light shadow';
    // set innerHTML to content message
    notificaitonEntryDiv.innerHTML = message;
    // Append notificaitonEntryDiv to container div
    Notify.container.appendChild(notificaitonEntryDiv);
    //animate notificationEntryDiv using the power of anime
    anime({
      targets: notificaitonEntryDiv,
      keyframes: [
        {opacity: 0, duration: 0, right: '-50px', easing: 'easeInOutExpo'},
        {opacity: 1, duration: 500, right: '0', easing: 'easeInOutExpo', endDelay: Notify.showDuration},
        {opacity: 0, duration: 500, right: '-50px', easing: 'easeInOutExpo'}
      ],
      complete: () => {
        // remove notificationEntryDiv
        notificaitonEntryDiv.remove();
      }
    });
  }
}

export { Notify };
