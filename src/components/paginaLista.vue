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
          <b-col :key="getKey()">
            <b-card-group deck v-for="i in numFilas" :key="i">
              <b-card v-for="j in Array(getPerPage()).keys()" :key="j" class="border-0">
                
                <router-link :to="{path:'/serie', query: { id: getIdSerie(i, j) }}">
                  <b-card-img :src="getFotoSerie(i, j)" :alt="getTituloSerie(i, j)"></b-card-img>
                </router-link>
                <div class="nombre"> <b-avatar :text="getNumero(i, j)" class="numero" size="sm" v-if="getTituloSerie(i, j) != ''"></b-avatar> {{ getTituloSerie(i, j) }}</div>
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
      llave: true,
      perPage: 6,
    };
  },
  created() {
    window.addEventListener("resize", this.myEventHandler);
  },
  destroyed() {
    window.removeEventListener("resize", this.myEventHandler);
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
          _this.numFilas = Math.ceil(this.datosLista.series.length / this.getPerPage());
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
      if (this.datosLista.series[(i - 1) * this.getPerPage() + j] != undefined)
        return (
          "https://image.tmdb.org/t/p/original" +
          this.datosLista.series[(i - 1) * this.getPerPage() + j].foto
        );
      else return "";
    },
    getTituloSerie(i, j) {
      if (this.datosLista.series[(i - 1) * this.getPerPage() + j] != undefined)
        return this.datosLista.series[(i - 1) * this.getPerPage() + j].nombre;
      else return "";
    },
    getIdSerie(i, j) {
      if (this.datosLista.series[(i - 1) * this.getPerPage() + j] != undefined)
        return this.datosLista.series[(i - 1) * this.getPerPage() + j].id;
      else return "";
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

      this.numFilas = Math.ceil(this.datosLista.series.length / this.getPerPage());
      this.llave = !this.llave;
    },
    getKey(){
      return this.llave;
    },
    getPerPage(){
      return this.perPage;
    },
    getNumero(i, j){
      return (i - 1) * this.getPerPage() + j + 1;
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