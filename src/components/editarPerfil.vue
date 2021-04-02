<template>
  <div class="editarPerfil">
    <div v-if="!datosObtenidos">
      {{ obtenerDatosUsuario() }}
    </div>
    <b-form @submit.prevent="enviarDatos" v-if="show">
      <b-container>
        <b-row>
          <b-col cols="6">
            <b-form-group
              id="foto"
              label="Foto de usuario: "
              label-for="input-foto"
              description=""
            >
              <b-form-file
                v-model="file1"
                placeholder="Choose a file or drop it here..."
                drop-placeholder="Drop file here..."
                accept="image/jpeg, image/png"
              ></b-form-file>
            </b-form-group>

            <b-form-group
              id="username"
              label="Nombre de usuario: "
              label-for="input-username"
              description=""
            >
              <b-form-input
                id="input-username"
                name="username"
                type="username"
                :placeholder="getUsername()"
                v-model="$v.form.username.$model"
                :state="validateState('username')"
                aria-describedby="error-username"
              ></b-form-input>
              <b-form-invalid-feedback id="error-username">
                Debes introducir un nombre de usuario válido
              </b-form-invalid-feedback>
              <div v-if="usernameEnUso" style="color: red">
                Este nombre de usuario ya está asociado a una cuenta.
              </div>
            </b-form-group>

            <b-form-group
              id="nombre"
              label="Nombre: "
              label-for="input-nombre"
              description=""
            >
              <b-form-input
                id="input-nombre"
                name="nombre"
                type="nombre"
                :placeholder="getNombre()"
                v-model="$v.form.nombre.$model"
                :state="validateState('nombre')"
                aria-describedby="error-nombre"
              ></b-form-input>
              <b-form-invalid-feedback id="error-nombre">
                Debes introducir un nombre de usuario válido
              </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group
              id="pais"
              label="País: "
              label-for="input-pais"
              description=""
            >
              <b-form-input
                v-model="form.pais"
                :placeholder="getPais()"
                list="listaPaises"
              ></b-form-input>
              <datalist id="listaPaises">
                <option v-for="pais in paises" :key="pais">{{ pais }}</option>
              </datalist>
            </b-form-group>

            <b-form-group
              id="email"
              label="Correo electrónico: "
              label-for="input-email"
              description=""
            >
              <b-form-input
                id="input-email"
                name="email"
                type="email"
                :placeholder="getEmail()"
                v-model="$v.form.email.$model"
                :state="validateState('email')"
                aria-describedby="error-email"
              ></b-form-input>
              <b-form-invalid-feedback id="error-email">
                Debes introducir un correo electrónico válido
              </b-form-invalid-feedback>
              <div v-if="emailEnUso" style="color: red">
                Este correo electrónico ya está asociado a una cuenta.
              </div>
            </b-form-group>

            <b-form-group
              id="password"
              label="Contraseña: "
              label-for="input-password"
              description=""
            >
              <b-form-input
                id="input-password"
                name="password"
                type="password"
                v-model="$v.form.password.$model"
                :state="validateState('password')"
                aria-describedby="error-password"
              ></b-form-input>
              <b-form-invalid-feedback id="error-password">
                Debes introducir una contraseña válida
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col cols="6">
            <b-form-group
              id="descripcion"
              label="Descripción: "
              label-for="input-descripcion"
              description=""
            >
              <b-form-textarea
                id="input-descripcion"
                name="descripcion"
                type="descripcion"
                :placeholder="getDescripcion()"
                v-model="$v.form.descripcion.$model"
                :state="validateState('descripcion')"
                aria-describedby="error-descripcion"
                rows="8"
              ></b-form-textarea>
            </b-form-group>

            <b-form-group
              id="fav"
              label="Series favoritas:"
              label-for="input-fav"
              description=""
            >
              <b-form-input
                v-model="form.serie"
                placeholder="Busca una serie"
                list="listaBusqueda"
                @input="actualizarLista()"
              ></b-form-input>
              <datalist id="listaBusqueda">
                <option v-for="serie in series" :key="serie">{{ serie }}</option>
              </datalist>
            </b-form-group>
          </b-col>
        </b-row>
      </b-container>
      <b-button type="submit" variant="primary">Enviar</b-button>
    </b-form>
  </div>
</template>

<script>
import firebase from "firebase";
import { validationMixin } from "vuelidate";
import { minLength, email } from "vuelidate/lib/validators";
import themoviedb from "themoviedb-javascript-library";

export default {
  mixins: [validationMixin],
  name: "EditarPerfil",
  props: {},
  data() {
    return {
      form: {
        descripcion: "",
        email: "",
        fotoPerfil: "",
        idUsuario: "",
        nombre: "",
        pais: "",
        username: "",
        seriesFavoritas: "",
      },
      datosObtenidos: false,
      password: "",
      descripcion: "",
      email: "",
      fotoPerfil: "",
      idUsuario: "",
      nombre: "",
      pais: "",
      username: "",
      seriesFavoritas: "",
      usernameEnUso: false,
      show: true,
      file1: "",
      series: [],
      paises: [
        "Afghanistan",
        "Albania",
        "Algeria",
        "Andorra",
        "Angola",
        "Anguilla",
        "Antigua & Barbuda",
        "Argentina",
        "Armenia",
        "Aruba",
        "Australia",
        "Austria",
        "Azerbaijan",
        "Bahamas",
        "Bahrain",
        "Bangladesh",
        "Barbados",
        "Belarus",
        "Belgium",
        "Belize",
        "Benin",
        "Bermuda",
        "Bhutan",
        "Bolivia",
        "Bosnia & Herzegovina",
        "Botswana",
        "Brazil",
        "British Virgin Islands",
        "Brunei",
        "Bulgaria",
        "Burkina Faso",
        "Burundi",
        "Cambodia",
        "Cameroon",
        "Cape Verde",
        "Cayman Islands",
        "Chad",
        "Chile",
        "China",
        "Colombia",
        "Congo",
        "Cook Islands",
        "Costa Rica",
        "Cote D Ivoire",
        "Croatia",
        "Cruise Ship",
        "Cuba",
        "Cyprus",
        "Czech Republic",
        "Denmark",
        "Djibouti",
        "Dominica",
        "Dominican Republic",
        "Ecuador",
        "Egypt",
        "El Salvador",
        "Equatorial Guinea",
        "Estonia",
        "Ethiopia",
        "Falkland Islands",
        "Faroe Islands",
        "Fiji",
        "Finland",
        "France",
        "French Polynesia",
        "French West Indies",
        "Gabon",
        "Gambia",
        "Georgia",
        "Germany",
        "Ghana",
        "Gibraltar",
        "Greece",
        "Greenland",
        "Grenada",
        "Guam",
        "Guatemala",
        "Guernsey",
        "Guinea",
        "Guinea Bissau",
        "Guyana",
        "Haiti",
        "Honduras",
        "Hong Kong",
        "Hungary",
        "Iceland",
        "India",
        "Indonesia",
        "Iran",
        "Iraq",
        "Ireland",
        "Isle of Man",
        "Israel",
        "Italy",
        "Jamaica",
        "Japan",
        "Jersey",
        "Jordan",
        "Kazakhstan",
        "Kenya",
        "Kuwait",
        "Kyrgyz Republic",
        "Laos",
        "Latvia",
        "Lebanon",
        "Lesotho",
        "Liberia",
        "Libya",
        "Liechtenstein",
        "Lithuania",
        "Luxembourg",
        "Macau",
        "Macedonia",
        "Madagascar",
        "Malawi",
        "Malaysia",
        "Maldives",
        "Mali",
        "Malta",
        "Mauritania",
        "Mauritius",
        "Mexico",
        "Moldova",
        "Monaco",
        "Mongolia",
        "Montenegro",
        "Montserrat",
        "Morocco",
        "Mozambique",
        "Namibia",
        "Nepal",
        "Netherlands",
        "Netherlands Antilles",
        "New Caledonia",
        "New Zealand",
        "Nicaragua",
        "Niger",
        "Nigeria",
        "Norway",
        "Oman",
        "Pakistan",
        "Palestine",
        "Panama",
        "Papua New Guinea",
        "Paraguay",
        "Peru",
        "Philippines",
        "Poland",
        "Portugal",
        "Puerto Rico",
        "Qatar",
        "Reunion",
        "Romania",
        "Russia",
        "Rwanda",
        "Saint Pierre & Miquelon",
        "Samoa",
        "San Marino",
        "Satellite",
        "Saudi Arabia",
        "Senegal",
        "Serbia",
        "Seychelles",
        "Sierra Leone",
        "Singapore",
        "Slovakia",
        "Slovenia",
        "South Africa",
        "South Korea",
        "Spain",
        "Sri Lanka",
        "St Kitts &amp; Nevis",
        "St Lucia",
        "St Vincent",
        "St. Lucia",
        "Sudan",
        "Suriname",
        "Swaziland",
        "Sweden",
        "Switzerland",
        "Syria",
        "Taiwan",
        "Tajikistan",
        "Tanzania",
        "Thailand",
        "Timor L'Este",
        "Togo",
        "Tonga",
        "Trinidad & Tobago",
        "Tunisia",
        "Turkey",
        "Turkmenistan",
        "Turks & Caicos",
        "Uganda",
        "Ukraine",
        "United Arab Emirates",
        "United Kingdom",
        "Uruguay",
        "Uzbekistan",
        "Venezuela",
        "Vietnam",
        "Virgin Islands (US)",
        "Yemen",
        "Zambia",
        "Zimbabwe",
      ],
    };
  },
  validations: {
    form: {
      username: {
        minLength: minLength(9),
      },
      nombre: {},
      email: {
        email,
      },
      password: {
        minLength: minLength(9),
      },
      descripcion: {},
    },
  },
  methods: {
    obtenerDatosUsuario() {
      var _this = this;
      var ident = firebase.auth().currentUser.uid;
      var email = firebase.auth().currentUser.email;
      var db = firebase.firestore();
      var ref = db.collection("Usuario").doc(ident);

      ref
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log("Document data:", doc.data());
            _this.descripcion = doc.data().descripcion;
            _this.email = email;
            _this.fotoPerfil = doc.data().fotoPerfil;
            _this.idUsuario = ident;
            _this.nombre = doc.data().nombre;
            _this.pais = doc.data().pais;
            _this.username = doc.data().username;
            _this.seriesFavoritas = doc.data().seriesFavoritas;
            _this.datosObtenidos = true;
          } else {
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    },
    getUsername() {
      return this.username;
    },
    getNombre() {
      return this.nombre;
    },
    getEmail() {
      return this.email;
    },
    getDescripcion() {
      return this.descripcion;
    },
    getPais() {
      return this.pais;
    },
    enviarDatos() {
      var ident = this.idUsuario;
      var db = firebase.firestore();
      var _this = this;

      var nombre, username, descripcion, pais, correo;
      if (this.$v.form.nombre.$model == "") nombre = this.nombre;
      else nombre = this.$v.form.nombre.$model;

      if (this.$v.form.username.$model == "") username = this.username;
      else username = this.$v.form.username.$model;

      if (this.$v.form.descripcion.$model == "") descripcion = this.descripcion;
      else descripcion = this.$v.form.descripcion.$model;

      if (this.form.pais == "") pais = this.pais;
      else pais = this.form.pais;

      if (this.form.email == "") correo = this.email;
      else correo = this.form.email;

      console.log(this.file1);
      if (this.file1){
        var ref = firebase.storage().ref();
        var path = ref.child('images/' + this.file1.name);

        path.put(this.file1).then(function(snapshot){
          console.log("archivo subido");
          snapshot.ref.getDownloadURL().then(function(url){
            db.collection("Usuario")
            .doc(ident)
            .set(
              {
                fotoPerfil: url,
              },
              { merge: true }
            )
            .then(function () {
              console.log("documento escrito");
            });
          });
        });
      }

      if (
        this.nombre != nombre ||
        this.pais != pais ||
        this.username != username ||
        this.descripcion != descripcion
      ) {
        db.collection("Usuario")
          .doc(ident)
          .set(
            {
              nombre: nombre,
              username: username,
              descripcion: descripcion,
              pais: pais,
            },
            { merge: true }
          )
          .then(function () {
            console.log("Document successfully written!");

            if (_this.email != correo || _this.$v.form.password.$model != "") {
              var user = firebase.auth().currentUser;

              user
                .updateEmail(correo)
                .then(function () {
                  console.log("Document successfully written!");
                  /*
                  if (_this.$v.form.password.$model != "") {
                    user
                      .updatePassword(_this.$v.form.password.$model)
                      .then(function () {
                        console.log("Document successfully written!");
                        _this.$router.push({ path: "/perfil" });
                      })
                      .catch(function (error) {
                        console.log("Error writing document: ", error);
                      });
                  } else {
                    _this.$router.push({ path: "/perfil" });
                  }
                  */
                  _this.$router.push({ path: "/perfil" });
                })
                .catch(function (error) {
                  console.log("Error writing document: ", error);
                });
            } else {
              _this.$router.push({ path: "/perfil" });
            }
          })
          .catch(function (error) {
            console.log("Error writing document: ", error);
          });
      } else if (this.email != correo || this.$v.form.password.$model != "") {
        var user = firebase.auth().currentUser;

        user
          .updateEmail(correo)
          .then(function () {
            console.log("Document successfully written!");
            /*
            if (_this.$v.form.password.$model != "") {
              user
                .updatePassword(_this.$v.form.password.$model)
                .then(function () {
                  console.log("Document successfully written!");
                  _this.$router.push({ path: "/perfil" });
                })
                .catch(function (error) {
                  console.log("Error writing document: ", error);
                });
            } else {
              _this.$router.push({ path: "/perfil" });
            }
            */
           _this.$router.push({ path: "/perfil" });
          })
          .catch(function (error) {
            console.log("Error writing document: ", error);
          });
      }
    },
    validateState(name) {
      const { $invalid } = this.$v.form[name];
      return !$invalid;
    },
  },
  exito1(data){
    var d = JSON.parse(data);
    console.log("Exito: ", d);
  },
  error1(data){
    console.log("Error: ", data);
  },
  actualizarLista(){
    themoviedb.tv.getMulti({query: this.form.serie}, this.exito1, this.error1);
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