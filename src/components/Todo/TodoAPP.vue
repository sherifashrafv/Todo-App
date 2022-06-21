<template>
  <div class="app h-100vh position-relative">
    <OverLay v-if="overLay" />
    <sapn
      @click="settingsOn"
      :class="
        settings ? 'info settings position-relative' : 'info position-relative'
      "
    >
      <h4 class="text-black">
        <i
          :class="
            settings ? 'fa-solid fa-gear fs-5 gear-animate' : 'fa-solid fa-bars'
          "
        ></i>
      </h4>
      <span class="clear-fix"></span>
      <transition name="fadeInOut">
        <div v-if="settings" class="settings d-flex flex-column">
          <span role="button" class="mb-2" @click="logOut"> Log Out </span>
          <span role="button">
            <a href="" class="text-decoration-none text-black"
              >Contact Me ?</a
            ></span
          >
        </div>
      </transition>
    </sapn>
    <transition
      appear
      @before-enter="beforeEnter"
      @after-Enter="afterEnter"
      @enter="enter"
    >
      <div class="modal-custome shadow-lg">
        <h1 class="todo-list">Todo-List</h1>
        <h1 class="text-center todo_text">
          {{ new Intl.DateTimeFormat("en-US", options).format(Xmas95) }}
        </h1>
        <h3 class="text-center dates p-0">
          {{ new Intl.DateTimeFormat("en-US", optionsMounth).format(Xmas95) }} ,
          {{ new Intl.DateTimeFormat("en-US", optionDay).format(Xmas95) }} ,
          {{ new Intl.DateTimeFormat("en-US", optionYear).format(Xmas95) }}
        </h3>
        <div class="w-100 m-auto text-center position-relative">
          <!-- <Transition name="slide-fade">
            <span class="empty-input" v-if="error"> Empty-input </span>
          </Transition> -->
          <Transition>
            <input
              ref="inputTodo"
              v-model="ToDoInput"
              type="text"
              :class="error ? 'todo-input my-3 bounce' : 'todo-input my-3'"
            />
          </Transition>
          <input
            @click="edit ? editSubmit() : addToDo()"
            type="button"
            :class="edit ? 'todo-update' : 'todo-submit'"
            :value="edit ? 'Update' : 'Add'"
          />
        </div>
        <div class="tasks-yet" v-if="tasks.length === 0">
          <span class="no-tasks">NO Tasks Yet</span>
        </div>
        <div class="actions-tasks d-flex flex-row justify-content-center">
          <span v-if="tasks.length > 1" @click="deleteAll()" class="delete-all">
            Delete All
          </span>
          <span
            v-if="tasks.length > 0"
            @click="editItem()"
            :class="edit ? 'edit-specific' : 'edit-specific-danger '"
          >
            Edit
          </span>
        </div>
        <transition-group
          appear
          tag="ul"
          @before-enter="beforeEnter2"
          @enter="enter2"
          class="items-todoList d-flex flex-column align-items-center p-0"
        >
          <li
            :class="
              item.completed
                ? 'position-relative'
                : 'item-done position-relative'
            "
            v-for="(item, index) in tasks"
            :key="index"
            :data-index="index"
            :title="`Task ${index + 1}`"
          >
            <span class="todo-list-text">
              {{ item.title }}
            </span>
            <input
              v-if="tasks.length > 0 && edit == true"
              class="item-check-delete"
              type="radio"
              name="edit"
              :value="item.title"
              @change="onChange($event, item.id)"
            />
            <span
              :title="item.completed ? 'Done' : 'Not-Done'"
              @click="done_task(item)"
              :class="item.completed ? 'done-item' : 'done-item done-icon'"
            >
              <i
                :class="
                  item.completed ? 'fa-solid fa-check' : 'fa-solid fa-xmark'
                "
              ></i>
            </span>
            <span
              title="Delete"
              @click="delete_Task(item.id)"
              class="delete-item"
            >
              <i class="fa-solid fa-trash"></i>
            </span>
          </li>
        </transition-group>
      </div>
    </transition>
  </div>
</template>

<script>
import OverLay from "../overLay/overLay.vue";
import { ref } from "@vue/reactivity";
import gsap from "gsap";
import { mapActions, mapMutations, mapState } from "vuex";
import axios from "axios";
// import store from "@/store";
// import axios from "axios";
export default {
  name: "Todo-APP",
  components: {
    OverLay,
  },
  setup() {
    // animation-1
    const beforeEnter = (el) => {
      el.style.height = "0";
      el.style.transform = "scale(0 , 0)";
    };
    const enter = (el, done) => {
      gsap.to(el, {
        duration: 1.5,
        height: "600px",
        // scaleY: 1,
        scale: "1 , 1",
        x: "-50%",
        y: "-50%",
        opacity: 1,
        ease: "fadeIn.out",
        onComplete: done,
      });
    };
    const afterEnter = () => {
      gsap.to(".no-tasks", {
        duration: 2,
        opacity: 1,
      });
    };
    // animation-group-2
    const beforeEnter2 = (el) => {
      el.style.opacity = 0;
      el.style.transform = "translateX(-130px)";
    };
    const enter2 = (el, done) => {
      gsap.to(el, {
        x: 0,
        duration: 1.5,
        opacity: 1,
        onComplete: done,
        delay: el.dataset.index * 0.2,
      });
    };
    // animation-dropMenu
    // informations
    const items = ref([]);
    const ToDoInput = ref("");
    const error = ref(false);
    const edit = ref(false);
    const Xmas95 = new Date(Date.now);
    const daynum = Xmas95.getDate();
    const month = Xmas95.getMonth();
    const itemDone = ref(true);
    const radiosButton = ref(true);
    const settings = ref(false);
    const EditId = ref(null);

    // option-month-day-year
    const options = { weekday: "long" };
    const optionsMounth = { month: "long" };
    const optionYear = { year: "numeric" };
    const optionDay = { day: "numeric" };
    const user = ref("");
    const id = ref();
    return {
      // data
      user,
      options,
      month,
      optionsMounth,
      daynum,
      optionDay,
      optionYear,
      ToDoInput,
      error,
      itemDone,
      items,
      id,
      radiosButton,
      edit,
      settings,
      EditId,
      // animation
      beforeEnter,
      enter,
      afterEnter,
      beforeEnter2,
      enter2,
      // anmationEnd,
    };
  },
  computed: {
    ...mapState(["tasks", "overLay"]),
  },
  methods: {
    ...mapActions(["getItems"]),
    ...mapMutations(["deleteAllMount"]),
    addToDo() {
      if (this.ToDoInput === "") {
        this.error = true;
      }
      // clear
      else {
        if (this.ToDoInput.length > 0) {
          this.error = false;
          this.$store.dispatch("addTodo", {
            title: this.ToDoInput,
            id: this.id,
          });
          this.ToDoInput = "";
        }
      }
      // await axios.post("/Items", {});
    },
    editSubmit() {
      this.$store.dispatch("EditTitle", {
        title: this.ToDoInput,
        id: this.id,
      });
      this.ToDoInput = "";
      this.edit = false;
    },
    async getTasks() {
      await axios.get(`/tasks?userid=${this.id}`).then((res) => {
        console.log(res.data);
        this.$store.commit("TASKS", res.data);
      });
    },
    delete_Task(id) {
      this.$store.dispatch("deleteTask", id);
    },
    done_task(item) {
      this.itemDone = !this.itemDone;

      this.$store.dispatch("CompleteTasks", {
        title: item.title,
        completed: this.itemDone,
        id: item.id,
      });
    },
    editItem() {
      this.edit = !this.edit;
      // this.ToDoInput = this.$refs.edit_value;
    },
    onChange(event, id) {
      // var optionText = event.target.value;
      this.ToDoInput = event.target.value;
      this.id = id;
      // console.log(optionText);
    },
    deleteAll() {
      this.$store.dispatch("deleteAllTasks");
    },
    settingsOn() {
      this.settings = !this.settings;
    },
    logOut() {
      localStorage.removeItem("user-info");
      window.location.reload();
    },
  },
  watch: {
    error() {
      if (this.error.valueOf(true)) {
        setTimeout(() => (this.error = false), 2000);
      }
    },
  },
  async mounted() {
    this.$store.dispatch("getItems", this.id);
    this.$store.commit("DELETE_ALL_TASKS", this.id);
    // this.getItems();
  },
  beforeCreate() {
    // auth
    const userInfo = localStorage.getItem("user-info");
    this.user = JSON.parse(userInfo).name;
    this.id = JSON.parse(userInfo).id;
  },
  created() {
    this.getTasks();
  },
};
</script>
<style>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s;
}
@keyframes bounce-in {
  0% {
    transform: translateX(0px);
    timing-function: ease-in;
  }
  37% {
    transform: translateX(5px);
    timing-function: ease-out;
  }
  55% {
    transform: translateX(-5px);
    timing-function: ease-in;
  }
  73% {
    transform: translateX(4px);
    timing-function: ease-out;
  }
  82% {
    transform: translateX(-4px);
    timing-function: ease-in;
  }
  91% {
    transform: translateX(2px);
    timing-function: ease-out;
  }
  96% {
    transform: translateX(-2px);
    timing-function: ease-in;
  }
  100% {
    transform: translateX(0px);
    timing-function: ease-in;
  }
}
/*
  Enter and leave animations can use different
  durations and timing functions.
*/
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
/* animation-2 */
.fadeInOut-enter-active {
  transition: all 0.3s ease-out;
}
.fadeInOut-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.fadeInOut-enter-from,
.fadeInOut-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>
