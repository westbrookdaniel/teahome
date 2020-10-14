import { App } from "./app.js";
import { Notify } from "./notify.js";
import { User } from "./user.js";

const Auth = {
  authenticated: false,

  signIn: (userData) => {
    // send userData to backend API
    fetch(window.location.protocol + '//' + window.location.host + '/api/auth/signin', {
      method: 'post',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    })
    .then(res => {
      if (res.status != 200) {
        // problem sigining in
        res.json().then(res => {
          Notify.show(res.message);
        });
      }else {
        // sign in success
        res.json().then(res => {
          // save token to local storage
          localStorage.setItem('token', res.token);
          // set auth.authenticated to true
          Auth.authenticated = true;
          // set user info in user
          User.id = res.user._id;
          User.firstName = res.user.first_name;
          User.lastName = res.user.last_name;
          User.email = res.user.email;
          User.admin = res.user.admin;
          // redirect to home page
          location.hash = '#';
          // show welcome notification
          Notify.show(`Welcome ${User.firstName}`)
        });
      }
    })
    .catch(err => {
      console.log(err);
      Notify.show('Problem Signing In');
    });

  },

  check: (callback) => {
    // check if jwt token exists in local localStorage
    if( localStorage.getItem('token') ){
      // validate token
      fetch(window.location.protocol + '//' + window.location.host + '/api/auth/validate', {
        headers: { "Authorization": `Bearer ${localStorage.token}` }
      })
      .then(res => {
        if (res.status != 200) {
          // token validation failed
          // set Auth.authenticated to false
          Auth.authenticated = false;
          // remove local token
          localStorage.removeItem('token');
          // redirect to sign in
          if (location.hash != '#signIn') {
            location.hash = "#signIn";
          }
          // notify user
          Notify.show("Invalid Token. Please Sign In");
          if( typeof callback == 'function' ){
            callback();
          }
        }else {
          // token valid
          res.json().then(res => {
            // set auth.authenticated to true
            Auth.authenticated = true;
            // set user info in user
            User.id = res.user._id;
            User.firstName = res.user.first_name;
            User.lastName = res.user.last_name;
            User.email = res.user.email;
            User.admin = res.user.admin;
            // callback
            if( typeof callback == 'function' ){
              callback();
            }
          })
        }
      })
      .catch(err => {
        console.log(err);
        Notify.show("Problem Authorising")
        if( typeof callback == 'function' ){
          callback();
        }
      })
    }else {
      //no local token
      Notify.show("Please Sign In");
      // redirect to sign inspect
      location.hash = "#signIn";

      if( typeof callback == 'function' ){
        callback();
      }
    }
  },

  signOut: () => {
    // redirect to sign in page
    location.hash = "#signIn";
    // remove local Token
    localStorage.removeItem('token');
    // set authenticated to false
    Auth.authenticated = false;
    // sets admin to false
    User.admin = false;
    Notify.show("You Have Been Signed Out")
  },

}

export { Auth }
