import { createStore } from "vuex";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:30000/";
export default createStore({
  state: {
    welcome: true,
    gsapSign: false,
    sign: false,
    done: false,
    login: false,
    tasks: [],
    overLay: false,
    allTasks: [],
  },
  getters: {},
  mutations: {
    WELCOME_DONE(state, payload) {
      setTimeout(() => {
        state.gsapSign = true;
        state.welcome = payload;
      }, 4000);
    },
    OPEN_MODAL_FORM(state, payload) {
      state.gsapSign = payload;
      state.sign = true;
    },
    OPEN_MODAL_TODLIST(state, payload) {
      setTimeout(() => {
        state.done = true;
      }, 2000);
      state.login = payload;
    },
    OPEN_MODAL_LOGIN(state, payload) {
      state.gsapSign = payload;
      state.login = true;
    },
    TODO_APP(state, payload) {
      state.welcome = payload;
      state.gsapSign = payload;
      state.sign = payload;
      state.done = true;
    },
    DELETE_TASK(state, id) {
      const index = state.tasks.findIndex((item) => item.id == id);
      state.tasks.splice(index, 1);
      state.overLay = true;
      setTimeout(() => {
        window.location.reload();
      }, 500);
    },
    UPDATE_TASK(state, task) {
      const index = state.tasks.findIndex((item) => item.id == task.id);
      state.tasks.splice(index, 1, {
        title: task.title,
        userid: task.userid,
        id: task.id,
        completed: task.completed,
      });
    },
    TASKS(state, task) {
      state.tasks = task;
    },
    EDIT_TASK(state, task) {
      const index = state.tasks.findIndex((item) => item.id == task.id);
      state.tasks.splice(index, 1, {
        title: task.title,
        userid: task.userid,
        id: task.id,
        completed: task.completed,
      });
    },
    async DELETE_ALL_TASKS(state, id) {
      let res = await axios.get(`/tasks?userid=${id}`);
      let reslenght = res.data.length;
      for (let i = 0; i < reslenght; i++) {
        state.allTasks.push(res.data[i].id);
      }
    },
    LODING(state, payload) {
      state.overLay = payload;
    },
  },
  actions: {
    welcomeDone({ commit }, payload) {
      commit("WELCOME_DONE", payload);
    },
    openModal({ commit }, payload) {
      commit("OPEN_MODAL_FORM", payload);
    },
    openModalLogin({ commit }, payload) {
      commit("OPEN_MODAL_FORM", payload);
    },
    openModalToDoList({ commit }, payload) {
      commit("OPEN_MODAL_TODLIST", payload);
    },
    openToDoApp({ commit }, payload) {
      commit("TODO_APP", payload);
    },
    //
    async addTodo(context, todo) {
      await axios
        .post("/tasks", {
          userid: todo.id,
          title: todo.title,
          completed: true,
        })
        .then((response) => {
          context.commit("ADD_TODO", response.data);
        })
        .finally(() => {
          context.state.overLay = true;
          setTimeout(() => {
            window.location.reload();
          }, 500);
        });
    },
    async getItems({ commit }, id) {
      await axios
        .get("/tasks?userid" + id, (res) => {
          console.log(res.data);
          commit("TASKS", res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async deleteTask({ commit }, id) {
      await axios.delete(`/tasks/${id}`).then((response) => {
        console.log(response);
        commit("DELETE_TASK", id);
      });
    },
    async CompleteTasks({ commit }, task) {
      await axios
        .patch("/tasks/" + task.id, {
          completed: task.completed,
        })
        .then((response) => {
          commit("UPDATE_TASK", response.data);
        });
    },
    async EditTitle({ commit }, task) {
      await axios
        .patch("/tasks/" + task.id, {
          title: task.title,
        })
        .then((response) => {
          commit("EDIT_TASK", response.data);
        });
    },
    async deleteAllTasks({ state }) {
      let allRes = [];
      for (var i = 0; i < state.allTasks.length; i++) {
        let res = await axios.delete(`/tasks/${state.allTasks[i]}`);
        if (res.status == 200) {
          allRes.push(true);
          setTimeout(() => {
            state.overLay = true;
          }, 200);
          window.location.reload();
        } else {
          allRes.push(false);
        }
      }
    },
    lodaing({ commit }, payload) {
      console.log(payload);
      commit("LODING", payload);
    },
  },
  modules: {},
});
