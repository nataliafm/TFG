<template>
  <div class="crearLista">
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
          <b-col>
            <b-card-group deck v-for="i in numFilas" :key="i">
              <b-card v-for="j in 6 /*form.series*/" :key="j" class="border-0">
                <b-card-img :src="getFotoSerie(i, j)"></b-card-img>
                <div class="nombre">{{ getTituloSerie(i, j) }}</div>
                <b-button class="botonQuitar" v-on:click="eliminarItem(i, j)" v-if="getTituloSerie(i, j) != ''">Eliminar</b-button>
              </b-card>
            </b-card-group>
          </b-col>
        </b-row>
      </b-container>
      <b-button type="submit" variant="primary">Enviar</b-button>
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
        series: [],
      },
      series: [],
      serieYaEsta: false,
      numFilas: 0,
    };
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
        this.numFilas = Math.ceil(this.form.series.length / 6);
      } else {
        this.serieYaEsta = true;
      }
    },
    getFotoSerie(i, j) {
      if (this.form.series[(i - 1) * 6 + j - 1] != undefined)
        return (
          "https://image.tmdb.org/t/p/original" +
          this.form.series[(i - 1) * 6 + j - 1].foto
        );
      else return "";
    },
    getTituloSerie(i, j) {
      if (this.form.series[(i - 1) * 6 + j - 1] != undefined)
        return this.form.series[(i - 1) * 6 + j - 1].nombre;
      else return "";
    },
    getNumFilas() {
      return Math.ceil(this.form.series.length / 6);
    },
    eliminarItem(i, j){
      this.form.series.splice((i - 1) * 6 + j - 1, 1);
    },
    enviarDatos() {
      var _this = this;
      var db = firebase.firestore();
      var ref = db.collection("Listas");

      ref
        .add({
          nombre: _this.form.nombre,
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