<template>
  <div class="Login">
    <div class="cajaRegistro">
      <div class="formRegistro">
        <b-form @submit.prevent="entrar" v-if="show">
          <b-form-group
            id="email"
            label="Correo electrónico:"
            label-for="input-email"
            description=""
          >
            <b-form-input
              id="input-email"
              v-model="form.email"
              type="correo"
              placeholder="Introduce tu e-mail"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="password"
            label="Contraseña:"
            label-for="input-contrasenia"
            description=""
          >
            <b-form-input
              id="input-password"
              v-model="form.password"
              type="password"
              placeholder="Introduce tu contraseña"
              required
            ></b-form-input>
          </b-form-group>
          <b-button type="submit" variant="primary">Submit</b-button>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Login",
  props: {},
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      show: true,
    };
  },
  methods: {
    entrar() {
      var d = this.form;
      var _this = this;
      
      firebase
        .auth()
        .signInWithEmailAndPassword(d.email, d.password)
        .then(function () {
          console.log("Success");
          _this.$router.push({ path: "/" });
        })
        .catch(function (error) {
          console.error("Error: ", error);
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
.cajaRegistro {
  width: 50%;
  margin: auto;
  margin-top: 7%;
  background-color: rgb(155, 155, 155);
  color: white;
  padding-top: 1%;
  padding-bottom: 1%;
}
.formRegistro {
  width: 80%;
  margin: auto;
}
</style>