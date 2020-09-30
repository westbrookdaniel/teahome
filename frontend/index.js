// Import Components--------------------------------------
import { App } from './components/app.js';
import { Auth } from './components/auth.js';

// Import Page Controllers -------------------------------
import { homePageController } from './page-controllers/home.js';
import { productsPageController } from './page-controllers/products.js';
import { userProfilePageController } from './page-controllers/userProfile.js';
import { cartPageController } from './page-controllers/cart.js';
import { signUpPageController } from './page-controllers/signUp.js';
import { signInPageController } from './page-controllers/signIn.js';
import { collectionPageController } from './page-controllers/collection.js';

// Routes --------------------------------------
// Homepage
App.addRoute('#', homePageController);
// Products
App.addRoute('products', productsPageController);
// Collections
App.addRoute('collection', collectionPageController);
// User
App.addRoute('userProfile', userProfilePageController);
// Favourites
App.addRoute('cart', cartPageController);
// Sign Up
App.addRoute('signUp', signUpPageController);
// Sign In
App.addRoute('signIn', signInPageController);
// Sign Out
App.addRoute('signOut', () => {
  Auth.signOut();
});

// Load App ------------------------------------
document.addEventListener('DOMContentLoaded', App.init);
