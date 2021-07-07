<template>
  <div id="app" style="margin-top: 90px;">
    <b-navbar toggleable="lg" type="dark" variant="primary" fixed="top" class="navbar-custom">
      <b-navbar-brand to="/"><img height="50" src="https://firebasestorage.googleapis.com/v0/b/mitfg-12618.appspot.com/o/logo-banner.png?alt=media&token=03ea6402-411e-4531-9c47-c7151bb543dd"></b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item to="/registro" v-if="!userstate">Registrarse</b-nav-item>
          <b-nav-item to="/login" v-if="!userstate">Iniciar sesión</b-nav-item>

          <b-form-input
            class="mr-sm-2"
            placeholder="Búsqueda de una serie o persona"
            v-model="form.busqueda"
            v-if="userstate"
          ></b-form-input>
          <div class="my-sm-0 mr-4 bg-dark rounded" v-if="userstate">
            <b-nav-item-dropdown text="Buscar" right>
              <b-dropdown-item
                :to="{
                  path: '/busqueda',
                  query: { type: 'serie', query: form.busqueda },
                }"
                >Serie</b-dropdown-item
              >
              <b-dropdown-item
                :to="{
                  path: '/busqueda',
                  query: { type: 'persona', query: form.busqueda },
                }"
                >Persona</b-dropdown-item
              >
            </b-nav-item-dropdown>
          </div>

          <b-nav-item href="#" v-if="userstate">Listas</b-nav-item>
          <b-nav-item href="/descubrir" v-if="userstate">Series</b-nav-item>
          <b-nav-item-dropdown text="Perfil" v-if="userstate" right>
            <b-dropdown-item
              :to="{
                path: '/perfil',
                query: { id: getIdUsuario() },
              }"
              >Perfil</b-dropdown-item
            >
            <b-dropdown-item v-on:click="logout()"
              >Cerrar sesión</b-dropdown-item
            >
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view>{{ estaLogueado() }}</router-view>
    <div class="footer">
      <span class="texto-footer"
        >© Natalia Fernández Martínez. Todas las imágenes y datos usados son
        cortesía de <a style="color: white;" href="https://www.themoviedb.org/"><u>TMDB</u></a></span
      >
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "App",
  data() {
    return {
      form: {
        busqueda: "",
      },
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
    logout() {
      var _this = this;

      firebase
        .auth()
        .signOut()
        .then(() => {
          console.log("Logged out");
          _this.$router.go({ path: "/" });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    submit() {
      this.$router.go({
        path: "/busqueda",
        query: { type: "serie", query: this.form.busqueda },
      });
    },
    getIdUsuario() {
      return firebase.auth().currentUser.uid;
    },
  },
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
.footer {
  background-color: #845ec2;
  padding-top: 1em;
  padding-bottom: 1em;
}
.texto-footer {
  color: white;
}
</style>
