<template>
  <div class="home">
    <GsapAnimation v-if="welcome" />
    <span v-if="gsapSign">
      <transition
        appear
        name="fade"
        @after-Enter="afterEnter"
        @before-enter="beforeEnter"
        @enter="enter"
      >
        <Auth />
      </transition>
    </span>
    <Modal v-if="sign" />
    <Login v-if="login" />
    <App v-if="done" />
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import GsapAnimation from "../components/Gsap/GsapAnimation.vue";
import Auth from "../components/auth/Auth.vue";
import Login from "../components/form/Login.vue";
import Modal from "../components/form/Register.vue";
import App from "../components/Todo/TodoAPP.vue";
import { mapActions, mapState } from "vuex";
import gsap from "gsap";

export default {
  name: "HomeView",
  setup() {
    const beforeEnter = (el) => {
      gsap.from(el, {
        duration: 1,
        y: -120,
      });
    };
    const enter = (el, done) => {
      gsap.to(el, {
        duration: 1,
        y: 0,
        opacity: 1,
        ease: "fadeIn.out",
        onComplete: done,
      });
    };
    const afterEnter = () => {
      gsap.to(".login-text", {
        duration: 1.2,
        color: "white",
        padding: 25,
        boxShadow: "inset 0 0 1px 0px #ccc",
      });
    };
    const loading = ref(true);
    return { loading, beforeEnter, enter, afterEnter };
  },
  computed: mapState({
    ...mapState(["welcome", "gsapSign", "sign", "done", "login"]),
  }),
  methods: {
    ...mapActions(["welcomeDone", "openToDoApp"]),
  },
  components: {
    GsapAnimation,
    Auth,
    Modal,
    App,
    Login,
  },
  mounted() {
    const user = localStorage.getItem("user-info");
    if (!user) {
      this.welcomeDone(false);
    } else {
      this.openToDoApp(false);
    }
  },
};
</script>
<style scoped>
.fadeIn-leave-active {
  animation: fadeIn 0.5s reverse;
}
@keyframes fadeIn {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0%);
  }
}
</style>
