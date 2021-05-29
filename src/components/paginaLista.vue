<template>
  <div class="paginaLista">
    <div v-if="!datosObtenidos">
      {{ obtenerDatosLista() }}
    </div>
    <b-container>
      <b-row>
        <b-col>
          <h1 class="texto mt-4">{{ getNombre() }}</h1>
          <p class="texto mt-4">{{ getDescripcion() }}</p>
        </b-col>
      </b-row>
      <b-row>
          <b-col>
            <b-card-group deck v-for="i in numFilas" :key="i">
              <b-card v-for="j in 6" :key="j" class="border-0">
                <router-link :to="{path:'/serie', query: { id: getIdSerie(i, j) }}">
                  <b-card-img :src="getFotoSerie(i, j)"></b-card-img>
                </router-link>
                <div class="nombre"> {{ getTituloSerie(i, j) }}</div>
              </b-card>
            </b-card-group>
          </b-col>
        </b-row>
    </b-container>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "PaginaLista",
  props: {},
  data() {
    return {
      datosObtenidos: false,
      datosLista: [],
      numFilas: 1,
    };
  },
  methods: {
    getIdLista() {
      var _this = this;
      return _this.$route.query.id;
    },
    obtenerDatosLista() {
      var _this = this;
      var id = this.getIdLista();
      var db = firebase.firestore();
      var ref = db.collection("Listas").doc(id);

      ref
        .get()
        .then((doc) => {
          console.log("Document data:", doc.data());
          _this.datosLista = doc.data();
          _this.datosObtenidos = true;
          _this.numFilas = Math.ceil(this.datosLista.series.length / 6);
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    },
    getNombre() {
      return this.datosLista.nombre;
    },
    getDescripcion() {
      return this.datosLista.descripcion;
    },
    getFotoSerie(i, j) {
      if (this.datosLista.series[(i - 1) * 6 + j - 1] != undefined)
        return (
          "https://image.tmdb.org/t/p/original" +
          this.datosLista.series[(i - 1) * 6 + j - 1].foto
        );
      else return "";
    },
    getTituloSerie(i, j) {
      if (this.datosLista.series[(i - 1) * 6 + j - 1] != undefined)
        return this.datosLista.series[(i - 1) * 6 + j - 1].nombre;
      else return "";
    },
    getIdSerie(i, j) {
      if (this.datosLista.series[(i - 1) * 6 + j - 1] != undefined)
        return this.datosLista.series[(i - 1) * 6 + j - 1].id;
      else return "";
    }
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
.texto {
  text-align: left;
}
.nombre {
  margin-top: 1em;
  color: #4b4453;
  font-size: small;
  font-weight: bold;
}
</style>