<template>
  <div
    class="h-100vh position-relative d-flex justify-content-center align-items-center"
  >
    <h1 @click="openModal" class="login-text me-3">Sign-Up</h1>
    <h1 @click="openModalLogin" class="login-text">Login</h1>
  </div>
</template>

<script>
import gsap from "gsap";
import { mapActions } from "vuex";
export default {
  name: "Login-Vue",
  setup() {
    const beforeEnter = (el) => {
      console.log("initialize - start-point-here");
      el.style.opacity = 0;
      el.style.transform = "translateY(-60px)";
    };
    const enter = (el) => {
      gsap.to(el, {
        duration: 1,
        y: 0,
        opacity: 1,
        ease: "bounce.out",
      });
    };
    return { beforeEnter, enter };
  },
  methods: {
    ...mapActions(["openModal", "openModalLogin"]),
    openModal() {
      const audio = new Audio(require("../../assets/Audio/SignUp.mp3")); //1
      audio.play(); //2
      this.$store.commit("OPEN_MODAL_FORM", false); // 3
    },
    openModalLogin() {
      this.$store.commit("OPEN_MODAL_LOGIN", false);
    },
  },
};
</script>
