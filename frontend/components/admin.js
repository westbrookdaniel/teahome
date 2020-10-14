import { App } from "./app.js";
import { User } from "./user.js";
import { Modal } from "./modal.js";
import { Notify } from "./notify.js";

const Admin = {
  barStatus: null,
  currentId: null,
  workingId: null,
  controller: (loc) => {
    // stops as many proccess running by checking if admin first
    if (User.admin == true) {
      // if a location is not specified (routing handles it)
      if (loc == null) {
        // if collection
        if (location.hash == '#collection') {
          // update status
          Admin.barStatus = "collection";
          // updates id from currentcat
          Admin.updateId(App.currentCategory);
        }
        // if location specified (e.g. modals because no hash change)
      } else {
        // update status
        Admin.barStatus = loc;
        // updates admin bar here instead of after loading it because it must be already loaded
        Admin.updateBar();
      }
    }
  },


  updateId: (id) => {
    Admin.currentId = id;
  },


  updateBar: () => {

    // unhides bar
    document.querySelector(".admin-bar").classList.remove("hideAdmin");

    // gets nav for inserting controls
    const adminControlsNav = document.querySelector("#admin-controls");
    // clears nav
    adminControlsNav.innerHTML = '';

    // if Product ====================================================================================
    if (Admin.barStatus == "product") {
      // sets the id
      Admin.workingId = Admin.currentId;

      // =============== edit product ===============
      let editProductEl = document.createElement("li");
      editProductEl.className = "nav-item";
      editProductEl.innerHTML = `<a class="nav-link" href="#">Edit Product</a>`;

      // adds event listenr to link
      let editProductC = editProductEl.children;
      editProductC[0].addEventListener('click', (e) => {
        // prevents link change
        e.preventDefault();
        Admin.showModal("editProduct", true, "editProduct", "update");
      });
      // appends child
      adminControlsNav.appendChild(editProductEl);

      // =============== delete product ===============
      let deleteProductEl = document.createElement("li");
      deleteProductEl.className = "nav-item";
      deleteProductEl.innerHTML = `<a class="nav-link" href="#">Delete Product</a>`;

      // adds event listenr to link
      let deleteProductC = deleteProductEl.children;
      deleteProductC[0].addEventListener('click', (e) => {
        // prevents link change
        e.preventDefault();
        Admin.showModal("deleteProduct", false, "deleteProduct", "update");
      });
      // appends child
      adminControlsNav.appendChild(deleteProductEl);


      doneUpdate();

      // if Collection ==============================================================================
    } else if (Admin.barStatus == "collection") {
      // sets the id
      Admin.workingId = Admin.currentId;

      // =============== new product ===============
      let newProductEl = document.createElement("li");
      newProductEl.className = "nav-item";
      newProductEl.innerHTML = `<a class="nav-link" href="#">New Product</a>`;

      // adds event listenr to link
      let newProductC = newProductEl.children;
      newProductC[0].addEventListener('click', (e) => {
        // prevents link change
        e.preventDefault();
        Admin.showModal("newProduct", false, "newProduct", "show");
      });
      // appends child
      adminControlsNav.appendChild(newProductEl);

      // =============== edit category ===============
      let editCategoryEl = document.createElement("li");
      editCategoryEl.className = "nav-item";
      editCategoryEl.innerHTML = `<a class="nav-link" href="#">Edit Category</a>`;

      // adds event listenr to link
      let editCategoryC = editCategoryEl.children;
      editCategoryC[0].addEventListener('click', (e) => {
        // prevents link change
        e.preventDefault();
        Admin.showModal("editCategory", true, "editCategory", "show");
      });
      // appends child
      adminControlsNav.appendChild(editCategoryEl);

      // =============== delete category ===============
      let deleteCategoryEl = document.createElement("li");
      deleteCategoryEl.className = "nav-item";
      deleteCategoryEl.innerHTML = `<a class="nav-link" href="#">Delete Category</a>`;

      // adds event listenr to link
      let deleteCategoryC = deleteCategoryEl.children;
      deleteCategoryC[0].addEventListener('click', (e) => {
        // prevents link change
        e.preventDefault();
        Admin.showModal("deleteCategory", false, "deleteCategory", "show");
      });
      // appends child
      adminControlsNav.appendChild(deleteCategoryEl);


      // =============== new category ===============
      let newCategoryEl = document.createElement("li");
      newCategoryEl.className = "nav-item";
      newCategoryEl.innerHTML = `<a class="nav-link" href="#">New Category</a>`;

      // adds event listenr to link
      let newCategoryC = newCategoryEl.children;
      newCategoryC[0].addEventListener('click', (e) => {
        // prevents link change
        e.preventDefault();
        Admin.showModal("newCategory", false, "newCategory", "show");
      });
      // appends child
      adminControlsNav.appendChild(newCategoryEl);


      doneUpdate();

      // no match
    } else {
      // =============== no match ===============

      // =============== new category ===============
      let newCategoryEl = document.createElement("li");
      newCategoryEl.className = "nav-item";
      newCategoryEl.innerHTML = `<a class="nav-link" href="#">New Category</a>`;

      // adds event listenr to link
      let newCategoryC = newCategoryEl.children;
      newCategoryC[0].addEventListener('click', (e) => {
        // prevents link change
        e.preventDefault();
        Admin.showModal("newCategory", false, "newCategory", "show");
      });
      // appends child
      adminControlsNav.appendChild(newCategoryEl);



      doneUpdate();
    }

    function doneUpdate() {
      // resets variables
      Admin.barStatus = null;
      Admin.currentId = null;
    }


  },



  showModal: (type, parse, sendData, modalType) => {
    // get relevant Template
    const modalTemplate = document.querySelector(`#template-admin-${type}-modal`).innerHTML;
    // set data
    const mustData = {
      id: Admin.workingId
    }
    // redner modal content with mustache
    const modalContent = Mustache.render(modalTemplate, mustData);

    // change modal
    if (modalType == "update") {
      Modal.update(modalContent);
    } else if (modalType == "show") {
      Modal.show(modalContent);
    } else {
      Notify.show("Problem Opening Modal")
    }

    // hides bar
    document.querySelector(".admin-bar").classList.add("hideAdmin");

    // handling the form
    // get the signup form
    let adminForm = document.querySelector("#form-admin");
    // submit event
    adminForm.addEventListener('submit', (e) => {
      // prevent form from loading new page
      e.preventDefault();
      // create formData object
      let formData = new FormData(adminForm);
      // create empty object
      let formDataObj = {};
      // loop through fromData entries
      for(let field of formData.entries()){
        // get form data store as object
        formDataObj[field[0]] = field[1]
      }

      // if setting for parsing form data is on
      if (parse == true) {
        // input parse
        // cycles through object properties and removes empty fields
        for (var propName in formDataObj) {
          if (formDataObj[propName] === null || formDataObj[propName] === undefined || formDataObj[propName] === "") {
            delete formDataObj[propName];
          }
        }
      }

      // gets the id
      let itemId = document.querySelector(".modal-objectId").innerHTML

      // sends data based on sendData value
      Admin[sendData](itemId, formDataObj)
      .then( res => {
        // deal with result
        Notify.show("Successful");
        // removes modal
        Modal.remove();
        // refresh
        App.router();
      })
      .catch(err => {
        // catch errors
        console.log(err);
        Notify.show("Error. Action not Performed");
      })


    });
  },

  editProduct: (id, dataObj) => {
      // puts id into objectId
      dataObj._id = id;

      // converts Ingredients into an array
      let splitIng = dataObj.ingredients.split(', ');
      dataObj.ingredients = splitIng;

      // return new promise
      return new Promise((resolve, reject) => {
        // fetch
        fetch(window.location.hostname + `/api/products/${id}`, {
          method: 'PUT',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataObj)
        })
        .then(res => res.json())
        .then(product => {
          resolve(product);
        })
        .catch(err => {
          console.log(err);
          Notify.show("Problem updating product");
        })
      });
  },

  newProduct: (id, dataObj) => {

      // puts id and image path into objectId
      dataObj._collectionId = id;
      dataObj.images = []
      dataObj.images[0] = `media/products/${id}/0.png`

      // converts Ingredients into an array
      let splitIng = dataObj.ingredients.split(', ');
      dataObj.ingredients = splitIng;

      // check data is filled
      if (dataObj._collectionId === null || dataObj.images[0] === null || dataObj.name === null || dataObj.soldOut === null || dataObj.available === null || dataObj.price === null || dataObj.description === null || dataObj._collectionId === "" || dataObj.images[0] === "" || dataObj.name === "" || dataObj.soldOut === "" || dataObj.available === "" || dataObj.price === "" || dataObj.description === "" || dataObj.ingredients === "" || dataObj.ingredients === null) {
        Notify.show("All fields are required")
      } else {

        // return new promise
        return new Promise((resolve, reject) => {
          // fetch
          fetch(window.location.hostname + `/api/products/`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataObj)
          })
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            console.log(err);
            Notify.show("Problem updating product");
          })
        });
      }
  },

  deleteProduct: (id, dataObj) => {
      // checks confirmation
      if (dataObj.confirm == "delete" || dataObj.confirm == "Delete") {
        // return new promise
        return new Promise((resolve, reject) => {
          // fetch
          fetch(window.location.hostname + `/api/products/${id}`, {
            method: 'DELETE'
          })
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            console.log(err);
            Notify.show("Problem deleting product");
          })
        });
      } else {
        Notify.show("Confirmation field incorrect")
      }

  },

  editCategory: (id, dataObj) => {
      // puts id into objectId
      dataObj._id = id;

      // return new promise
      return new Promise((resolve, reject) => {
        // fetch
        fetch(window.location.hostname + `/api/categories/${id}`, {
          method: 'PUT',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataObj)
        })
        .then(res => res.json())
        .then(category => {
          resolve(category);
        })
        .catch(err => {
          console.log(err);
          Notify.show("Problem updating category");
        })
      });
  },

  deleteCategory: (id, dataObj) => {
      // checks confirmation
      if (dataObj.confirm == "delete" || dataObj.confirm == "Delete") {
        // return new promise
        return new Promise((resolve, reject) => {
          // fetch
          fetch(window.location.hostname + `/api/categories/${id}`, {
            method: 'DELETE'
          })
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            console.log(err);
            Notify.show("Problem deleting category");
          })
        });
      } else {
        Notify.show("Confirmation field incorrect")
      }

  },

  newCategory: (id, dataObj) => {

      // puts image path into objectId
      dataObj.featured_image = `media/categories/${id}.png`
      // check data is filled
      if (dataObj.name === null || dataObj.color === null || dataObj.is_collection === null || dataObj.available === null || dataObj.ending === null || dataObj.description === null || dataObj.name === "" || dataObj.color === "" || dataObj.is_collection === "" || dataObj.available === "" || dataObj.ending === "" || dataObj.description === "" ) {
        Notify.show("All fields are required")
      } else {

        // return new promise
        return new Promise((resolve, reject) => {
          // fetch
          fetch(window.location.hostname + `/api/categories/`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataObj)
          })
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            console.log(err);
            Notify.show("Problem updating category");
          })
        });
      }
  },


}

export { Admin };
