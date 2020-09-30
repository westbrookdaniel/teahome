// Import Components--------------------------------------
import { App } from '../components/app.js';
import { User } from '../components/user.js';
import { Notify } from '../components/notify.js';
import { Auth } from '../components/auth.js';

// Page Controller -------------------------------
function userProfilePageController(){

  let data = {
    firstName: User.firstName,
    lastName: User.lastName,
    email: User.email,
    admin: User.admin
  }
  App.loadPage('User Profile', 'template-page-user-profile', data, () => {

    // Remove
    // get removing form
    let removeForm = document.querySelector("#form-remove-profile");
    // submit event
    removeForm.addEventListener('submit', (e) => {
      // prevent form from loading new page
      e.preventDefault();
      // create formData object
      let formData = new FormData(removeForm);
      // create empty object
      let formDataObj = {};
      // loop through fromData entries
      for(let field of formData.entries()){
        // get form data store as object
        formDataObj[field[0]] = field[1]
      }

      User.checkPass(User.id, formDataObj.pass)
      .then(res => {

        // if authenticated
        if (res.result == true) {

          // deletes user
          User.delete(User.id)
          .then(res => {
            Notify.show(res.msg);
            // signout
            Auth.signOut();
          })
          .catch(err => {
            Notify.show("Problem deleting user")
            console.log(err);
          })

        } else {
          Notify.show(res.message)
        }

      })
      .catch(err => {
        console.log(err);
        Notify.show("Problem removing user")
      });


    });


    // Edit
    // get the signup form
    let editForm = document.querySelector("#form-edit-profile");
    // submit event
    editForm.addEventListener('submit', (e) => {
      // prevent form from loading new page
      e.preventDefault();
      // create formData object
      let formData = new FormData(editForm);
      // create empty object
      let formDataObj = {};
      // loop through fromData entries
      for(let field of formData.entries()){
        // get form data store as object
        formDataObj[field[0]] = field[1]
      }

      // input parse
      // cycles through object properties and removes empty fields
      for (var propName in formDataObj) {
        if (formDataObj[propName] === null || formDataObj[propName] === undefined || formDataObj[propName] === "") {
          delete formDataObj[propName];
        }
      }

      User.update(User.id, formDataObj)
      .then(res => {

        // set user info in user
        User.firstName = res.first_name;
        User.lastName = res.last_name;
        User.email = res.email;
        User.admin = res.admin;

        Notify.show("User Updated")

        // works like a refresh
        App.router();

      })
      .catch(err => {
        console.log(err);
        Notify.show("Problem editing user")
      });


    });









  });
}

export { userProfilePageController };
