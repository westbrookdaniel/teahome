import { Notify } from "./notify.js";
import { User } from "./user.js";
import { Auth } from "./auth.js";
import { Product } from "./product.js";
import { Admin } from "./admin.js";

const App = {
  // props
    name: "TeaHome App",
    version: "1.0.0",
    author: "Daniel Westbrook",
    rootEl: document.querySelector('#app'),
    currentCategory: null,
    routes: {},
  // methods
    init: () => {
      Notify.init();
      Auth.check(() => {
        App.router();
        window.addEventListener('hashchange', App.router);
      });
    },

    router: () => {
      // Get current hash location
      const path = location.hash.slice(1) || '#';
      // Finds route for this location
      const route = App.routes[path];
      if(route){
        // Runs controller for this route
        route.controller();
      }else{
        // load 404 page
        App.loadPage('404 Page/File Not Found', 'template-page-404', {})
      }

      Admin.controller();

    },

    addRoute: (path, controller) => {
      // Adding an entry to App.routes
      App.routes[path] = {
        controller: controller
      }
    },

    refreshNav: () => {
      // get current path
      let currentPath = location.hash || '#';
      let navItems = document.querySelectorAll('#main-nav > a');
      navItems.forEach((navLink) => {
        if( navLink.getAttribute('href') == currentPath ) {
          navLink.classList.add('active');
        }
      });
    },

    loadNav: () => {

      // admin bar
      // removes admin bar on reloading the nav
      if (document.querySelector(".admin-bar") != null) {
        document.querySelector(".admin-bar").remove();
      }
      // checks if admin rights
      if (User.admin == true) {
        // gets admin template
        fetch(`../templates/template-section-admin.html`, {
          headers: { 
            "Content-Security-Policy": "script-src 'self'",
          }
        })
        // turns into text
        .then((response) => response.text())
        .then((template) => {
          // create element
          let adminBar = document.createElement("div")
          // add class
          adminBar.className = "admin-bar"
          // creates renderer using templateFileData
          adminBar.innerHTML = Mustache.render(template, {});
          // append adminbar
          App.rootEl.appendChild(adminBar);

          // updates admin bar
          Admin.updateBar();

        })
        .catch(err => {
          console.log(err);
          Notify.show("Problem Loading Admin Bar");
        });

      }

      // footer
      // creates data
      let footerData = {}
      // gets header template
      fetch(`../templates/template-section-footer.html`, {
        headers: { 
          "Content-Security-Policy": "script-src 'self'",
        }
      })
      // turns into text
      .then((response) => response.text())
      .then((template) => {

        // create el used for expanding page if footer isn't at bottom of screen
        const footerGrower = document.createElement('div')
        footerGrower.className = 'flex-grow-1';

        // create footer el
        const footerEl = document.createElement('footer');
        footerEl.className = 'p-3';
        // creates renderer using templateFileData
        footerEl.innerHTML = Mustache.render(template, footerData);

        // fix for the direct to sign in page glitch which makes two footers
        if (location.hash == '#signIn') {
          
          // insert into footer container
          document.querySelector("#footer-container").innerHTML = footerEl.innerHTML;

        } else {
          // insert footerGrower
          App.rootEl.appendChild(footerGrower);
          // insert output HTML at the end of rootEl
          App.rootEl.appendChild(footerEl);

        }

      })
      // catch errors
      .catch(err => {
        console.log(err);
        Notify.show("Problem Loading Footer");
      });

      // header
      // creates data
      let headerData = {}
      // gets header template
      fetch(`../templates/template-section-header.html`, {
        headers: { 
          "Content-Security-Policy": "script-src 'self'",
        }
      })
      // turns into text
      .then((response) => response.text())
      .then((template) => {
        /// creates renderer using templateFileData
        let output = Mustache.render(template, headerData);
        // insert output HTML into the header-container
        document.querySelector('#header-container').innerHTML = output;


        // get main nav
        let mainNav = document.querySelector('#main-nav');
        // render HTML
        if(Auth.authenticated) {
          // signed in
          mainNav.innerHTML = `

            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" id="dropdown04" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Account</a>
              <div class="dropdown-menu shadow" aria-labelledby="dropdown04">
                <a class="dropdown-item" href="#userProfile">Profile</a>
                <a class="dropdown-item" href="#signOut">Sign Out</a>
              </div>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" id="dropdown05" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Collections</a>
              <div class="dropdown-menu shadow" aria-labelledby="dropdown05" id="collections-list">
              </div>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#products">All Products</a>
            </li>

          `;
        }else {
          // not signed in
          mainNav.innerHTML = `

            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" id="dropdown04" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Account</a>
              <div class="dropdown-menu shadow" aria-labelledby="dropdown04">
                <a class="dropdown-item" href="#signUp">Sign Up</a>
                <a class="dropdown-item" href="#signIn">Sign In</a>
              </div>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" id="dropdown05" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Collections</a>
              <div class="dropdown-menu shadow" aria-labelledby="dropdown05" id="collections-list">
              </div>
            </li>

            <li class="nav-item">
              <a class="nav-link" href="#products">All Products</a>
            </li>

          `;
        }


        // gets categories for dropdown
        let collectionList = document.querySelector("#collections-list")

        Product.getCategories()
        .then(categories => {
          // loop through each category and create list elements
          categories.forEach(category => {
            // check avaliblity of category and is a collection
            if (category.available == true && category.is_collection == true) {
              // create anchor
              let colItem = document.createElement('a');
              colItem.className = 'dropdown-item';
              colItem.innerText = category.name;
              // has a href for user friendly consistency (not used)
              colItem.href = '#collection'
              // click listener to parse information
              colItem.addEventListener('click', (event) => {
                // stops hash change
                event.preventDefault();
                // stores what current category is
                App.currentCategory = category._id;

                // works different depending on where you are
                if (location.hash == "#collection") {
                  // works like a refresh incase already on this page
                  App.router();
                } else {
                  // changes hash
                  location.hash = "#collection";
                }

            });


              // append button to dropdown div



              collectionList.appendChild(colItem);
            }
          });

        })
        .catch(err => {
          console.log(err);
          Notify.show("Problem getting collections")
        })


        App.refreshNav();
        User.updateFavsCount();


      })
      .catch(err => {
        console.log(err);
        Notify.show("Problem Loading Header");
      });

    },


    loadPage: (title, templateId, data, callback) => {
      // set document title
      document.title = title;

      // grab the template and store in a variable
      // let template = document.querySelector(`#${templateId}`).innerHTML;
      // // uses mustache to put data inside template
      // let output = Mustache.render(template, data);


      // fetches template file
      fetch(`../templates/${templateId}.html`, {
        headers: { 
          "Content-Security-Policy": "script-src 'self'",
        }
      })
      // turns into text
      .then((response) => response.text())
      .then((template) => {
        /// creates renderer using templateFileData
        let output = Mustache.render(template, data);
        // sets innerHTML to template
        // hide rootEl for transition
        App.rootEl.className = 'hidden';
        // waits
        setTimeout(function(){
          // insert output HTML into the rootEl
          App.rootEl.innerHTML = output;
          // load nav
          App.loadNav();

          // unhide rootEl for transition
          App.rootEl.className = '';
          // run the callback (if it exists)
          if( typeof callback == 'function' ){
            callback();
          }

        }, 200);

      })
      .catch(err => {
        console.log(err);
        Notify.show("Problem Loading Page");
      });

    },
}




export { App }
