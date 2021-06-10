<template>
  <div class="crearLista">
    <b-container>
      <b-row>
        <b-col>
          <h1 align="left" class="mt-4 mb-4">Creación de una lista</h1>
        </b-col>
      </b-row>
    </b-container>
    <b-form @submit.prevent="enviarDatos">
      <b-container>
        <b-row>
          <b-col cols="6">
            <b-form-group
              id="nombre"
              label="Nombre de la lista: "
              label-for="input-nombre"
              align="left"
              description=""
            >
              <b-form-input
                id="input-nombre"
                name="nombre"
                type="text"
                v-model="form.nombre"
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="6">
            <b-form-group
              id="nombre"
              label="Descripción de la lista: "
              label-for="input-descripcion"
              align="left"
              description=""
            >
              <b-form-textarea
                id="input-descripcion"
                name="descripcion"
                type="text"
                v-model="form.descripcion"
                rows="8"
              ></b-form-textarea>
            </b-form-group>
          </b-col>
        </b-row>
        <div class="mb-2" align="left">Elementos de la lista:</div>
        <b-row>
          <b-col cols="6">
            <b-form-group
              id="lista"
              label-for="input-lista"
              align="left"
              description=""
            >
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
              <div v-if="serieYaEsta" style="color: red">
                Esta serie ya está en tu lista
              </div>
            </b-form-group>
          </b-col>
          <b-col cols="2">
            <b-input-group-append>
              <b-button v-on:click="elegirItem()">Añadir</b-button>
            </b-input-group-append>
          </b-col>
        </b-row>
        <b-row>
          <b-col :key="getKey()">
            <b-card-group deck v-for="i in numFilas" :key="i">
              <b-card v-for="j in Array(getPerPage()).keys()" :key="j" class="border-0">
                <b-card-img :src="getFotoSerie(i, j)" :alt="getTituloSerie(i, j)"></b-card-img>
                <div class="nombre">{{ getTituloSerie(i, j) }}</div>
                <b-button class="botonQuitar mt-2" v-on:click="eliminarItem(i, j)" v-if="getTituloSerie(i, j) != ''">Eliminar</b-button>
              </b-card>
            </b-card-group>
          </b-col>
        </b-row>
      </b-container>
      <b-button class="mb-2" type="submit" variant="primary">Enviar</b-button>
    </b-form>
  </div>
</template>

<script>
import themoviedb from "themoviedb-javascript-library";
import firebase from "firebase";

export default {
  name: "CrearLista",
  props: {},
  data() {
    return {
      form: {
        nombre: "",
        descripcion: "",
        series: [],
      },
      series: [],
      serieYaEsta: false,
      numFilas: 0,
      perPage: 6,
      llave: true,
    };
  },
  created() {
    window.addEventListener("resize", this.myEventHandler);
  },
  destroyed() {
    window.removeEventListener("resize", this.myEventHandler);
  },
  methods: {
    actualizarLista() {
      themoviedb.search.getTv(
        { query: this.form.serie },
        this.exito1,
        this.error1
      );
    },
    exito1(data) {
      var d = JSON.parse(data);
      console.log("Exito: ", d.results.slice(0, 5));
      this.series = d.results.slice(0, 5);
    },
    error1(data) {
      console.log("Error: ", data);
    },
    elegirItem() {
      this.serieElegida = this.series;

      var id = this.serieElegida[0].id;
      var yaEsta = false;

      for (var i = 0; i < this.form.series.length; i++) {
        if (this.form.series[i]["id"] == id) {
          yaEsta = true;
        }
      }

      if (!yaEsta) {
        var aux = {
          id: this.serieElegida[0].id,
          nombre: this.serieElegida[0].name,
          foto: this.serieElegida[0].poster_path,
        };
        this.form.series.push(aux);
        this.serieYaEsta = false;
        this.numFilas = Math.ceil(this.form.series.length / this.getPerPage());
      } else {
        this.serieYaEsta = true;
      }
    },
    getFotoSerie(i, j) {
      if (this.form.series[(i - 1) * this.getPerPage() + j] != undefined)
        return (
          "https://image.tmdb.org/t/p/original" +
          this.form.series[(i - 1) * this.getPerPage() + j].foto
        );
      else return "";
    },
    getTituloSerie(i, j) {
      if (this.form.series[(i - 1) * this.getPerPage() + j] != undefined)
        return this.form.series[(i - 1) * this.getPerPage() + j].nombre;
      else return "";
    },
    getNumFilas() {
      return Math.ceil(this.form.series.length / this.getPerPage());
    },
    eliminarItem(i, j){
      this.form.series.splice((i - 1) * this.getPerPage() + j, 1);
    },
    myEventHandler(e){
      if (e.target.innerWidth < 580){
        this.perPage = 1;
      }
      else if (e.target.innerWidth > 580 && e.target.innerWidth < 1200){
        this.perPage = 3;
      }
      else{
        this.perPage = 6;
      }

      this.numFilas = Math.ceil(this.form.series.length / this.getPerPage());
      this.llave = !this.llave;
    },
    getKey(){
      return this.llave;
    },
    getPerPage(){
      return this.perPage;
    },
    enviarDatos() {
      var _this = this;
      var db = firebase.firestore();
      var ref = db.collection("Listas");

      ref
        .add({
          nombre: _this.form.nombre,
          descripcion: _this.form.descripcion,
          series: _this.form.series,
        })
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);

          var ident = firebase.auth().currentUser.uid;
          var ref2 = db.collection("Usuario").doc(ident);

          ref2
            .update({
              listasSeries: firebase.firestore.FieldValue.arrayUnion(docRef.id),
            })
            .then((data) => {
              console.log("Document written successfully: ", data);
              _this.$router.push({path: '/perfil'});
            })
            .catch((error) => {
              console.error("Error adding document: ", error);
            });
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
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
.nombre {
  margin-top: 1em;
  color: #4b4453;
  font-size: small;
  font-weight: bold;
}
</style>