<template>
  <div class="inicio" v-bind:userstate="estaLogueado()" >
    <div v-if="userstate">
        <InicioRegistrado />
    </div>
    <div v-if="!userstate">
      <InicioSinRegistrar />
    </div>
  </div>
</template>

<script>
import InicioRegistrado from "./InicioRegistrado.vue";
import InicioSinRegistrar from "./InicioSinRegistrar.vue";
import firebase from "firebase";

export default {
  name: "Inicio",
  props: {},
  components: {
    InicioRegistrado,
    InicioSinRegistrar,
  },
  data() {
    return {
      userstate: false,
    };
  },
  methods: {
    estaLogueado() {
      let user = firebase.auth().currentUser;

      if (user) {
        this.userstate = true; 
      } else {
        this.userstate = false;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>