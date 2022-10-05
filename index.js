//import { Api } from "./mvc/api";
const Api = (() => {
  const baseUrl = "https://randomuser.me/api";
  const getUsers = () => fetchJsonp([baseUrl]).then((res) => res.json());
  // .then((json) => console.log(json));
  return { getUsers };
})();
// View ----------------------------------
const View = (() => {
  const domstr = {
    usersList: "#users-list",
    buttonOption: "#box-info",
  };
  const render = (ele, tmp) => {
    ele.innerHTML = tmp;
  };
  const createTmp = (arr) => {
    let tmp = "";
    let counter = 0;
    arr.forEach((ele) => {
       console.log(ele[0].id.value)
      if (counter === 0) {
        // Start a new row
        tmp += `<div class="row">`;
      }
      tmp += `
      <div class="column">
        <div class="user-box">
          <div class="box-content">
            <img src="${ele[0].picture.thumbnail}" height=70" alt="" />
            <div id="box-info" class="box-info">
              <span>Name:${ele[0].name.first}</span>
              <span>Email:${ele[0].email}</span>
              <span>Phone:${ele[0].phone}</span>
              <button id="${ele[0].id.value}" onclick="moreInfo()">More ${ele[0].name.first}</button>
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

  // const updateBox = () => {

  //   const buttonHtml = document.querySelector(view.domstr.usersList);
    
    
  //   const tmp = view.createTmp(this.#userslist);
  //   view.render(userslistContainer, tmp);
  // }
  class State {
    #userslist = [];

    get Userlist() {
      return this.#userslist;
    }
    set Userlist(newuserlist) {
      this.#userslist = newuserlist;

      const userslistContainer = document.querySelector(view.domstr.usersList);
      console.log(userslistContainer);
      const tmp = view.createTmp(this.#userslist);
      view.render(userslistContainer, tmp);
    }
  }

  return { getUsers, State };
})(Api, View);

// Controller -------------------------------------
const Controller = ((model) => {
  const state = new model.State();
  const init = async () => {
    let theUsers = []; // collect 20 users
    for (let i = 0; i < 20; i++) {
      await model.getUsers().then((User) => theUsers.push(User.results));
    }

    state.Userlist = theUsers;
    // theUsers.forEach((user) => {
    //   state.Userlist.push(user);
    // });
    console.log("state.userslist", state.Userlist);
  };

  const bootstrap = () => {
    init();
  };

  return { bootstrap };
})(Model);

Controller.bootstrap();

function moreInfo() {
  model.updateBox();
}
