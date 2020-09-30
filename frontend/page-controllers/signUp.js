// Import Components--------------------------------------
import { App } from '../components/app.js';
import { Notify } from '../components/notify.js';
import { User } from '../components/user.js';

// Page Controller -------------------------------
function signUpPageController(){

  App.loadPage('Sign Up', 'template-page-sign-up', {}, () => {
    // get the signup form
    let signUpForm = document.querySelector("#form-sign-up");
    // submit event
    signUpForm.addEventListener('submit', (e) => {
      // prevent form from loading new page
      e.preventDefault();
      // create formData object
      let formData = new FormData(signUpForm);
      // create empty object
      let formDataObj = {};
      // loop through fromData entries
      for(let field of formData.entries()){
        // get form data store as object
        formDataObj[field[0]] = field[1]
      }
      // send data object to User.create()
      User.create(formDataObj);
    });
  });
}

export { signUpPageController };
