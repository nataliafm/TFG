<template>
  <div class="Registro">
    <div class="cajaRegistro">
      <div class="formRegistro">
        <b-form @submit.prevent="submit" v-if="show">
          <b-form-group
            id="email"
            label="Correo electrónico:"
            label-for="input-email"
            description=""
          >
            <b-form-input
              id="input-email"
              name="email"
              v-model="form.email"
              type="email"
              placeholder="Introduce tu e-mail"
              required
              :v-model="$v.form.email.$model"
              :state="validateState('email')"
              aria-describedby="error-email"
            ></b-form-input>
            <b-form-invalid-feedback id="error-email">
              Debes introducir un correo válido
            </b-form-invalid-feedback>
            <div v-if="emailEnUso" style="color: red;"> Este e-mail ya está asociado a una cuenta.</div>
          </b-form-group>

          <b-form-group
            id="username"
            label="Nombre de usuario:"
            label-for="input-username"
            description="Podrás cambiar el nombre de usuario más adelante"
          >
            <b-form-input
              id="input-username"
              v-model="form.username"
              type="nombre"
              placeholder="Introduce tu nombre de usuario"
              required
              :v-model="$v.form.username.$model"
              :state="validateState('username')"
              aria-describedby="error-username"
            ></b-form-input>
            <b-form-invalid-feedback id="error-username">
              Debes introducir un nombre de usuario, y debe tener una longitud mínima de 9 caracteres
            </b-form-invalid-feedback>
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
              :v-model="$v.form.username.$model"
              :state="validateState('password')"
              aria-describedby="error-password"
            ></b-form-input>
            <b-form-invalid-feedback id="error-password">
              Debes introducir una contraseña, y debe tener una longitud mínima de 9 caracteres
          </b-form-invalid-feedback>
          </b-form-group>
          <b-button type="submit" variant="primary">Enviar</b-button>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import { validationMixin } from "vuelidate";
import { required, email, minLength} from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  name: "Registro",
  props: {},
  data() {
    return {
      form: {
        email: "",
        username: "",
        password: ""
      },
      error: null,
      show: true,
      emailEnUso: false,
    };
  },
  validations: {
    form: {
      email: {
        required, email
      },
      username: {
        required, minLength: minLength(9)
      },
      password: {
        required, minLength: minLength(9)
      }
    }
  },
  methods: {
    submit() {
      var d = this.form;
      var _this = this;
      
      firebase.auth()
        .createUserWithEmailAndPassword(d.email, d.password)
        .then(function() {
          _this.emailEnUso = false;

          var ident = firebase.auth().currentUser.uid;
          var db = firebase.firestore();

          db
            .collection('Usuario')
            .doc(ident)
            .set({
              idUsuario: ident,
              username: d.username,
              pais: "",
              fotoPerfil: "",
              descripcion: "",
              nombre: "",
              seriesFavoritas: [],
              seriesEmpezadas: [],
              seriesPendientes: [],
              listasSeries: []
            })
            .then(function () {
              console.log("Document successfully written!");
              _this.$router.push({path: '/'});
            })
            .catch(function (error) {
              console.log("Error writing document: ", error);
            });
        })
        .catch((err) => {
          this.error = err.code;
          switch (this.error) {
            case "auth/email-already-in-use": this.emailEnUso = true; break;
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
.cajaRegistro {
  width: 50%;
  margin: auto;
  margin-top: 7%;
  background-color: #4B4453;
  color: #B0A8B9;
  padding-top: 1%;
  padding-bottom: 1%;
}
.formRegistro {
  width: 80%;
  margin: auto;
}
</style>