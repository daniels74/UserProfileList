//import { Api } from "./mvc/api";
const Api = (() => {
  const baseUrl = "https://randomuser.me/api";
  const getUsers = () =>
  fetchJsonp([baseUrl])
      .then((res) => res.json())
      .then((json) => console.log(json));
  return { getUsers };
})();
// View ----------------------------------
const View = (() => {
  const domstr = {
    usersList: "#users-list",
  };
  const render = (ele, tmp) => {
    ele.innerHTML = tmp;
  };
  const createTmp = (arr) => {
    let tmp = "";
    const counter = 0;
    arr.forEach((ele) => {
        console.log("Name: ", ele.name.first);
      if (counter === 0) {
        // Start a new row
        tmp += `<div class="row">`;
      }
      tmp += `
      <div class="column">
        <div class="user-box">
          <div class="box-content">
            <img src="${ele.picture.thumbnail}" height=70" alt="" />
            <div class="box-info">
              <span>Name:${ele.name.first}</span>
              <span>Email:${ele.email}</span>
              <span>Phone:${ele.phone}</span>
              <button>Show Name</button>
            </div>
          </div>
        </div>
      </div>
          `;
      counter++;
      if (counter === 2) {
        // close row and reset counter
        tmp += `</div>`;
        counter = 0;
      }
    });
    if (counter === 1) {
      // make sure to close the row
      tmp += `</div>`;
    }
    return tmp;
  };

  return { render, createTmp, domstr };
})();

// Model -------------------------------------

const Model = ((api, view) => {
  const { getUsers } = api;

  class State {
    #userslist = [];

    get Userlist() {
      return this.#userslist;
    }
    set Userlist(newuserlist) {
      this.#userslist = newuserlist;

      const userslistContainer = document.querySelector(view.domstr.usersList);
      const tmp = view.createTmp(this.#userslist);
      view.render(userslistContainer, tmp);
    }
  }

  return { getUsers, State };
})(Api, View);

// Controller -------------------------------------
const Controller = ((model) => {
  const state = new model.State();
  const init = () => {
    let theUsers = [];  // collect 20 users
    for (let i = 0; i < 20; i++) {
        let obj = model.getUsers();
        console.log("obj: ", obj);
      theUsers.push(obj.results);
    }
    theUsers.forEach((user) => {
      state.userslist.push(user);
    });
    console.log("state.userslist", state.userslist)
  };

  const bootstrap = () => {
    init();
  };

  return { bootstrap };
})(Model);

Controller.bootstrap();
