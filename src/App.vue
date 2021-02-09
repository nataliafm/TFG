<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="info" fixed="top">
      <b-navbar-brand>LOGO</b-navbar-brand>
      <b-navbar-toggle></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item href="#">Registrarse</b-nav-item>
          <b-nav-item href="#">Iniciar sesión</b-nav-item>
        </b-navbar-nav>
      </b-collapse>

    </b-navbar>
    <InicioSinRegistrar />
  </div>
</template>

<script>
import InicioSinRegistrar from "./components/InicioSinRegistrar.vue";

export default {
  name: "App",
  components: {
    InicioSinRegistrar,
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
</style>
