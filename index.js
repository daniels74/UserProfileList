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
    boxInfo: "#box-info",
  };
  const render = (ele, tmp) => {
    ele.innerHTML = tmp;
  };
  const createTmp = (arr) => {
    let tmp = "";
    let counter = 0;
    arr.forEach((ele) => {
      //console.log(ele[0].id.value);
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
              <button id="${ele[0].id.name}" class="more-button" onclick="Controller.showMore(${ele[0].id.name})">More ${ele[0].name.first}</button>
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
    console.log("state.userslist", state.Userlist);
  };

  const bootstrap = () => {
    init();
  };

  function showMore(ele){
    console.log(ele.id)
    state.Userlist.forEach((User)=>{
      if(User[0].id.name === ele.id){
        ele.outerHTML = `<div>DOB: ${User[0].dob.date}</div>`;
      }
    })
  }

  return { bootstrap, showMore };
})(Model);

Controller.bootstrap();
