<template>
  <div class="Login">
    <b-container>
      <b-row>
        <b-col md="3"></b-col>
        <b-col md="6">
          <b-form @submit.prevent="entrar" v-if="show">
            <b-form-group
              id="email"
              label="Correo electrónico:"
              label-for="input-email"
              description=""
              style="color: #4b4453"
            >
              <b-form-input
                id="input-email"
                v-model="form.email"
                type="correo"
                placeholder="Introduce tu e-mail"
                required
                :v-model="$v.form.email.$model"
                :state="validateState('email')"
                aria-describedby="error-email"
              ></b-form-input>
              <b-form-invalid-feedback id="error-email">
                Debes introducir un correo válido
              </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group
              id="password"
              label="Contraseña:"
              label-for="input-contrasenia"
              description=""
              style="color: #4b4453"
            >
              <b-form-input
                id="input-password"
                v-model="form.password"
                type="password"
                placeholder="Introduce tu contraseña"
                required
                :v-model="$v.form.password.$model"
                :state="validateState('password')"
                aria-describedby="error-password"
              ></b-form-input>
              <b-form-invalid-feedback id="error-password">
                Debes introducir una contraseña
              </b-form-invalid-feedback>
            </b-form-group>
            <div v-if="emailIncorrecto" style="color: red">
              El e-mail que ha introducido no se corresponde con una cuenta
            </div>
            <div v-if="passIncorrecta" style="color: red">
              La contraseña que ha introducido es incorrecta
            </div>
            <b-button type="submit" variant="primary">Enviar</b-button>
          </b-form>
        </b-col>
        <b-col md="3"></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import firebase from "firebase";
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],
  name: "Login",
  props: {},
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      show: true,
      emailIncorrecto: false,
      passIncorrecta: false,
    };
  },
  validations: {
    form: {
      email: {
        required,
        email,
      },
      password: {
        required,
      },
    },
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
        .catch(function (err) {
          _this.emailIncorrecto = false;
          _this.passIncorrecta = false;

          console.error("Error: ", err);
          var error = err.code;
          switch (error) {
            case "auth/user-not-found":
              _this.emailIncorrecto = true;
              break;
            case "auth/wrong-password":
              _this.passIncorrecta = true;
              break;
          }
        });
    },
    validateState(name) {
      const { $invalid } = this.$v.form[name];
      return !$invalid;
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