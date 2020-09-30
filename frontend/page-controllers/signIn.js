// Import Components--------------------------------------
import { App } from '../components/app.js';
import { Notify } from '../components/notify.js';
import { User } from '../components/user.js';
import { Auth } from '../components/auth.js';

// Page Controller -------------------------------
function signInPageController(){

  App.loadPage('Sign In', 'template-page-sign-in', {}, () => {
    // get the signup form
    let signInForm = document.querySelector("#form-sign-in");
    // submit event
    signInForm.addEventListener('submit', (e) => {
      // prevent form from loading new page
      e.preventDefault();
      // create formData object
      let formData = new FormData(signInForm);
      // create empty object
      let formDataObj = {};
      // loop through fromData entries
      for(let field of formData.entries()){
        // get form data store as object
        formDataObj[field[0]] = field[1]
      }

      // send form data object to Auth.signIn()
      Auth.signIn(formDataObj);

    });
  });
}

export { signInPageController };
