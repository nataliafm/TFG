<template>
  <div class="inicio" v-bind:userstate="estaLogueado()">
    <div v-if="userstate">
      Bienvenido, {{ username }}
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
      username: "",
    };
  },
  methods: {
    estaLogueado() {
      var _this = this;
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          _this.userstate = true;

          var uid = user.uid;

          var docRef = firebase.firestore().collection("Usuario").doc(uid);
          docRef.get().then(function (doc) {
            if (doc.exists) {
              _this.username = doc.data().username;
            } else {
              console.log("Error al obtener los datos");
            }
          });
        } else {
          console.log("no esta loggeado");
          this.userstate = false;
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
          _this.$router.go();
        })
        .catch((error) => {
          console.log(error);
        });
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