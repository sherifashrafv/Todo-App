<template>
  <transition
    appear
    @before-Enter="beforEnter"
    @enter-from="enter"
    @after-enter="afterEnter"
    @text-start="start"
  >
    <div v-if="sign">
      <div
        class="Signup_Card h-100vh w-100 d-flex align-items-center justify-content-center"
      >
        <div class="modal-sign">
          <h4 class="text-center text-uppercase text-white"></h4>
          <form class="row gap-3">
            <div class="position-relative col-12 shadow-lg">
              <Transition name="slide-fade">
                <span v-if="v$.name.$error" class="error-display">
                  {{ (v$.name.required.$message = "please email is required") }}
                </span>
              </Transition>
              <input
                v-model="state.name"
                type="text"
                placeholder="Name ? "
                class="form-control"
              />
              <span class="h-100 w-100">
                <i class="fa-solid fa-user-astronaut user"></i>
              </span>
            </div>
            <div class="col-12 position-relative">
              <Transition name="slide-fade">
                <span v-if="v$.email.$error" class="error-display">
                  {{ v$.email.required.$message }}
                </span>
              </Transition>

              <input
                v-model="state.email"
                type="text"
                placeholder="email"
                class="form-control"
              />
              <span class="h-100 w-100">
                <i class="fa-solid fa-signature name"></i>
              </span>
            </div>
            <div class="col-12 position-relative">
              <Transition name="slide-fade">
                <span v-if="v$.password.$error" class="error-display">
                  min (
                  {{ v$.password.minLength.$params.min }}
                  ) to max(
                  {{ v$.password.maxLength.$params.max }}
                  )
                </span>
              </Transition>

              <input
                v-model="state.password"
                placeholder="password"
                type="password"
                class="col-12 form-control"
              />
              <span class="h-100 w-100">
                <i class="fa-solid fa-key password"></i>
              </span>
            </div>

            <button @click.prevent="signuP()" class="submit-form m-auto">
              <span class="submit-text">Submit</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from "vuex";
import useValidate from "@vuelidate/core";
import { required, email, minLength, maxLength } from "@vuelidate/validators";
import { reactive, computed } from "vue";
import axios from "axios";
import gsap from "gsap";
export default {
  name: "Form-Vue",
  setup() {
    const beforEnter = (el) => {
      gsap.from(el, {
        duration: 1,
        opacity: 0,
        scaleX: 0,
      });
    };
    const enter = (el, done) => {
      gsap.to(el, {
        y: 0,
        scaleX: 1,
        opacity: 1,
        onComplete: done,
      });
    };
    const end = () => {
      gsap.from(".submit-form", {
        duration: 4,
        x: 0,
        scaleX: 0,
      });
    };
    const afterEnter = () => {
      gsap.to(".submit-form", {
        scaleX: 1,
      });
    };

    const state = reactive({
      name: "",
      email: "",
      password: "",
    });
    const rules = computed(() => {
      return {
        name: {
          required,
          minLength: minLength(4),
        },
        email: {
          required,
          email,
        },
        password: {
          required,
          minLength: minLength(4),
          maxLength: maxLength(15),
        },
      };
    });
    const v$ = useValidate(rules, state);
    return {
      state,
      v$,
      enter,
      beforEnter,
      afterEnter,
      end,
    };
  },
  methods: {
    ...mapState(["sign"]),
    async signuP() {
      this.v$.$validate();
      if (!this.v$.$error) {
        console.log("validate");
        const result = await axios.post("/users", {
          name: this.state.name,
          password: this.state.password,
          email: this.state.email,
        });
        if (result.status === 201) {
          localStorage.setItem("user-info", JSON.stringify(result.data));
          this.$store.dispatch("openModalToDoList", false);
          console.log("yes");
        } else {
          console.log("status-not-200");
        }
      } else {
        console.log("no");
      }
    },
  },
};
</script>

<style>
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
  opacity: 0;
}
</style>
