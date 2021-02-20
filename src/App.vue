<template>
  <div id="app">
      <b-navbar toggleable="lg" type="dark" variant="primary" fixed="top">
        <b-navbar-brand>LOGO</b-navbar-brand>
        <b-navbar-toggle></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item to="/registro" v-if="!userstate">Registrarse</b-nav-item>
            <b-nav-item href="/login" v-if="!userstate">Iniciar sesión</b-nav-item>
            <b-nav-item href="#" v-if="userstate">Listas</b-nav-item>
            <b-nav-item href="#" v-if="userstate">Series</b-nav-item>
            <b-nav-item href="#" v-if="userstate">Perfil</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    <router-view>{{estaLogueado()}}</router-view>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "App",
  data() {
    return {
      userstate: false,
    };
  },
  methods: {
    estaLogueado() {
      var _this = this;
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          _this.userstate = true;
        } else {
          console.log("no esta loggeado");
          _this.userstate = false;
        }
      });
    },
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
