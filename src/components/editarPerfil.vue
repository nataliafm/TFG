<template>
  <div class="editarPerfil">
    <div v-if="!datosObtenidos">
      {{ obtenerDatosUsuario() }}
    </div>
    <b-container>
      <b-row>
        <b-col>
          <h1 align="left" class="mt-4 mb-4">Edición de perfil</h1>
        </b-col>
      </b-row>
    </b-container>
    <b-container>
      <b-row>
        <b-col cols="6">
          <h3 class="mt-4 mb-4">Actualizar la foto de perfil</h3>
          <b-row align-h="center">
            <b-col cols="3">
              <div class="mb-2">Imagen actual:</div>
              <b-img
                rounded="circle"
                fluid
                :src="fotoPerfil"
                alt="Imagen de perfil actual"
                class="mb-4"
              ></b-img>
            </b-col>
          </b-row>
          <b-form @submit.prevent="enviarArchivo" class="mt-4">
            <b-container>
              <b-row align-v="center">
                <b-col>
                  <b-form-group
                    id="foto"
                    label-for="input-foto"
                    label="Nueva imagen: "
                    description=""
                  >
                    <b-form-file
                      v-model="file1"
                      placeholder="Choose a file or drop it here..."
                      drop-placeholder="Drop file here..."
                      accept="image/jpeg, image/png"
                    ></b-form-file>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <div class="mb-4">
                    Para evitar que se recorte, asegúrate de que la foto es
                    cuadrada
                  </div>
                  <b-button type="submit" variant="primary">Enviar</b-button>
                </b-col>
              </b-row>
            </b-container>
          </b-form>
        </b-col>
        <b-col cols="6">
          <h3 class="mt-4 mb-4">Actualizar la contraseña</h3>
          <b-form @submit.prevent="cambiarContrasenia">
            <b-container>
              <b-row>
                <b-col>
                  <b-form-group
                    id="passActual"
                    label="Introduce la contraseña actual: "
                    label-for="input-passActual"
                    description=""
                  >
                    <b-form-input
                      id="input-passActual"
                      type="password"
                      v-model="form.passActual"
                      :state="validateState('passActual')"
                    ></b-form-input>
                  </b-form-group>
                  <b-form-group
                    id="passNueva"
                    label="Introduce la nueva contraseña: "
                    label-for="input-passNueva"
                    description=""
                  >
                    <b-form-input
                      id="input-passNueva"
                      type="password"
                      v-model="form.passNueva"
                      :state="validateState('passNueva')"
                      aria-describedby="error-password"
                    ></b-form-input>
                    <b-form-invalid-feedback id="error-password">
                      Debes introducir una contraseña válida, con una longitud
                      de mínimo 9 caracteres, números y tanto mayúsculas como
                      minúsculas
                    </b-form-invalid-feedback>
                  </b-form-group>
                  <b-form-group
                    id="passNuevaIgual"
                    label="Vuelve a introducir la nueva contraseña: "
                    label-for="input-passNuevaIgual"
                    description=""
                  >
                    <b-form-input
                      id="input-passNuevaIgual"
                      type="password"
                      v-model="form.passNuevaIgual"
                      :state="validateState('passNuevaIgual')"
                      aria-describedby="error-password-igual"
                    ></b-form-input>
                    <b-form-invalid-feedback id="error-password-igual">
                      Debes introducir la misma contraseña
                    </b-form-invalid-feedback>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-col>
                <b-button type="submit" variant="primary" class="mt-2"
                  >Enviar</b-button
                >
              </b-col>
            </b-container>
          </b-form>
        </b-col>
      </b-row>
    </b-container>
    <b-container>
      <b-row>
        <b-col>
          <h3 class="mt-4 mb-4">Actualizar los datos del perfil</h3>
        </b-col>
      </b-row>
    </b-container>
    <b-form @submit.prevent="enviarDatos" v-if="show" class="mt-4">
      <b-container>
        <b-row>
          <b-col cols="6">
            <b-form-group
              id="texto"
              label="Texto alternativo de la foto de perfil: "
              label-for="input-texto"
              description=""
            >
              <b-form-input
                id="input-texto"
                name="textoalt"
                type="text"
                placeholder="Introduce una descripción de la foto de perfil"
                v-model="form.alternativo"
              ></b-form-input>
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
            <!--
            <b-form-group
              id="password"
              label="Contraseña: "
              label-for="input-password"
              description=""
            >
              <b-form-input
                id="input-password"
                type="password"
                v-model="form.password"
                :v-model="$v.form.password.$model"
                :state="validateState('password')"
                aria-describedby="error-password"
              ></b-form-input>
              <b-form-invalid-feedback id="error-password">
                Debes introducir una contraseña válida, con una longitud de
                mínimo 9 caracteres, números y tanto mayúsculas como minúsculas
              </b-form-invalid-feedback>
            </b-form-group>
-->
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
              <b-container>
                <b-row>
                  <b-col cols="10">
                    <b-form-input
                      v-model="form.serie"
                      placeholder="Busca una serie"
                      list="listaBusqueda"
                      type="search"
                      v-on:keyup="actualizarLista()"
                    ></b-form-input>
                    <datalist id="listaBusqueda">
                      <option v-for="serie in series" :key="serie">
                        {{ serie.name }}
                      </option>
                    </datalist>
                  </b-col>
                  <b-col cols="2">
                    <b-input-group-append>
                      <b-button v-on:click="elegirItem()">Añadir</b-button>
                    </b-input-group-append>
                  </b-col>
                  <div v-if="serieYaEsta" style="color: red">
                    Esta serie ya está en tu lista de favoritos
                  </div>
                  <b-list-group>
                    <b-list-group
                      horizontal="md"
                      v-for="i in seriesFavoritas.length"
                      :key="i"
                    >
                      <b-list-group-item
                        class="border-0 align-items-center w-100"
                      >
                        <div class="nombreSerie mt-1">
                          {{
                            Object.values(
                              JSON.parse(JSON.stringify(seriesFavoritas))[i - 1]
                            )[0]["nombre"]
                          }}
                        </div>
                        <b-button
                          class="botonQuitar ml-4"
                          v-on:click="eliminarItem(i - 1)"
                          >Eliminar</b-button
                        >
                      </b-list-group-item>
                    </b-list-group>
                  </b-list-group>
                </b-row>
              </b-container>
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
import { minLength, email, required } from "vuelidate/lib/validators";
import themoviedb from "themoviedb-javascript-library";

const contieneNumeros = (value) => /\d/.test(value);
const contieneMayusculas = (value) =>
  /[a-z]/.test(value) && /[A-Z]/.test(value);

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
        seriesFavoritas: {},
        alternativo: "",
        passActual: "",
        passNueva: "",
        passNuevaIgual: "",
      },
      datosObtenidos: false,
      descripcion: "",
      email: "",
      fotoPerfil: "",
      idUsuario: "",
      nombre: "",
      pais: "",
      username: "",
      alternativo: "",
      seriesFavoritas: {},
      longOriginal: "",
      usernameEnUso: false,
      show: true,
      file1: "",
      series: [],
      serieElegida: [],
      serieYaEsta: false,
      emailEnUso: false,
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
      passActual: {
        required,
      },
      passNueva: {
        required,
        minLength: minLength(9),
        contieneNumeros,
        contieneMayusculas,
      },
      passNuevaIgual: {
        required,
        esIgual() {
          console.log(this.form.passNueva);
          return this.form.passNueva == this.form.passNuevaIgual;
        },
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
            var data = JSON.parse(JSON.stringify(doc.data()));
            _this.descripcion = data.descripcion;
            _this.email = email;
            _this.fotoPerfil = data.fotoPerfil;
            _this.idUsuario = ident;
            _this.nombre = data.nombre;
            _this.pais = data.pais;
            _this.username = data.username;
            _this.seriesFavoritas = data.seriesFavoritas;
            _this.longOriginal = _this.seriesFavoritas.length;
            _this.datosObtenidos = true;
            _this.alternativo = data.alternativo;
          } else {
            console.log("No such document!");
          }
        })
        .then(() => {
          console.log(_this.seriesFavoritas);
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
    cambiarContrasenia() {
      var user = firebase.auth().currentUser;
      var _this = this;

      var credential = firebase.auth.EmailAuthProvider.credential(
        this.email,
        this.form.passActual
      );

      user.reauthenticateWithCredential(credential).then(function () {
        user
          .updatePassword(_this.form.passNueva)
          .then(function () {
            console.log("Document successfully written!");
            _this.$router.push({
              path: "/perfil",
              query: { id: firebase.auth().currentUser.uid },
            });
          })
          .catch(function (error) {
            console.log("Error writing document: ", error);
          });
      });
    },
    enviarArchivo() {
      var ident = this.idUsuario;
      var db = firebase.firestore();
      var _this = this;

      if (this.file1) {
        var ref = firebase.storage().ref();
        var path = ref.child("images/" + this.file1.name);

        path.put(this.file1).then(function (snapshot) {
          snapshot.ref.getDownloadURL().then(function (url) {
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
                _this.$router.push({
                  path: "/perfil",
                  query: { id: firebase.auth().currentUser.uid },
                });
              });
          });
        });
      }
    },
    enviarDatos() {
      var ident = this.idUsuario;
      var db = firebase.firestore();
      var _this = this;

      var nombre,
        username,
        descripcion,
        pais,
        correo,
        seriesFavoritas,
        alternativo;
      if (this.$v.form.nombre.$model == "") nombre = this.nombre;
      else nombre = this.$v.form.nombre.$model;

      if (this.$v.form.username.$model == "") username = this.username;
      else username = this.$v.form.username.$model;

      if (this.$v.form.descripcion.$model == "") descripcion = this.descripcion;
      else descripcion = this.$v.form.descripcion.$model;

      if (this.form.alternativo == "") alternativo = this.alternativo;
      else alternativo = this.form.alternativo;

      if (this.form.pais == "") pais = this.pais;
      else pais = this.form.pais;

      if (this.form.email == "") correo = this.email;
      else correo = this.form.email;

      seriesFavoritas = this.seriesFavoritas;

      if (
        this.nombre != nombre ||
        this.pais != pais ||
        this.username != username ||
        this.descripcion != descripcion ||
        this.seriesFavoritas.length != this.longOriginal ||
        this.alternativo != alternativo
      ) {
        db.collection("Usuario")
          .doc(ident)
          .set(
            {
              nombre: nombre,
              username: username,
              descripcion: descripcion,
              pais: pais,
              alternativo: alternativo,
              seriesFavoritas: JSON.parse(JSON.stringify(seriesFavoritas)),
            },
            { merge: true }
          )
          .then(function () {
            console.log("Document successfully written!");

            if (_this.email != correo) {
              var user = firebase.auth().currentUser;

              user
                .updateEmail(correo)
                .then(function () {
                  console.log("Document successfully written!");

                  _this.$router.push({
                    path: "/perfil",
                    query: { id: firebase.auth().currentUser.uid },
                  });
                })
                .catch(function (error) {
                  console.log("Error writing document: ", error);
                  var err = error.code;
                  switch (err) {
                    case "auth/email-already-in-use":
                      this.emailEnUso = true;
                      break;
                  }
                });
            } else {
              _this.$router.push({
                path: "/perfil",
                query: { id: firebase.auth().currentUser.uid },
              });
            }
          })
          .catch(function (error) {
            console.log("Error writing document: ", error);
          });
      } else if (this.email != correo) {
        var user = firebase.auth().currentUser;

        user
          .updateEmail(correo)
          .then(function () {
            console.log("Document successfully written!");
            _this.$router.push({
              path: "/perfil",
              query: { id: firebase.auth().currentUser.uid },
            });
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
    exito1(data) {
      var d = JSON.parse(data);
      console.log("Exito: ", d.results.slice(0, 5));
      this.series = d.results.slice(0, 5);
    },
    error1(data) {
      console.log("Error: ", data);
    },
    actualizarLista() {
      themoviedb.search.getTv(
        { query: this.form.serie },
        this.exito1,
        this.error1
      );
    },
    elegirItem() {
      this.serieElegida = this.series;

      var id = this.serieElegida[0].id;
      var yaEsta = false;

      var empezadas = this.seriesFavoritas;

      for (var i = 0; i < empezadas.length; i++) {
        if (Object.keys(empezadas[i])[0] == id) {
          yaEsta = true;
        }
      }

      if (!yaEsta) {
        var aux = {};
        aux[id] = { nombre: this.form.serie };

        this.seriesFavoritas.push(aux);
        this.serieYaEsta = false;
      } else {
        this.serieYaEsta = true;
      }
    },
    eliminarItem(i) {
      var id = Object.keys(
        JSON.parse(JSON.stringify(this.seriesFavoritas))[i]
      )[0];
      var series = JSON.parse(JSON.stringify(this.seriesFavoritas));
      var indice = -1;

      var llaves = this.seriesFavoritas.keys();
      for (const k of llaves) {
        if (Object.keys(series[k]) == id) indice = k;
      }

      this.seriesFavoritas.splice(indice, 1);
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
.list-item {
  color: rgb(0, 0, 0);
  border: none;
}
.textoLista {
  display: flex;
  justify-content: center;
  align-items: center;
}
.nombreSerie {
  float: left;
}
.botonQuitar {
  float: right;
}
</style>