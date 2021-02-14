<template>
  <div class="inicioSinRegistrar">
    <div class="registrate">
      Regístrate para acceder a todos nuestros contenidos
      <b-container class="beneficios">
        <b-row class="fila"> 
          <b-col class="card-ventaja" md="6">Guarda tus series favoritas</b-col>
          <b-col class="card-ventaja" md="6">Puntúa series y escribe reseñas</b-col>
        </b-row>
        <div></div>
        <b-row class="fila">
          <b-col class="card-ventaja" md="6">Crea listas</b-col>
          <b-col class="card-ventaja" md="6">Encuentra tu próxima serie favorita</b-col>
        </b-row>
        <b-row class="fila">
          <b-col class="card-ventaja" md="6">Interactúa con otros amantes de las series</b-col>
          <b-col class="card-ventaja" md="6">Accede a subtítulos y pistas de audiodescripción reunidos por la comunidad</b-col>
        </b-row>
      </b-container>
    </div>
    <div class="seriesPopulares">
      <div v-if="!obtenido">
        {{ obtenerSeries() }}
      </div>
      <b-card-group deck>
        <b-card class="card" title-tag="h6">
          <router-link :to="{path:'/serie', query: { id: getId(0) }}">
            <b-card-img :src="getPoster(0)" :alt="getTitulo(0)"/>
          </router-link>
          <b-card-title :title="getTitulo(0)" title-tag="h6"/>
        </b-card>
        <b-card class="card" title-tag="h6" v-bind:img-alt=getTitulo(1)>
          <router-link :to="{path:'/serie', query: { id: getId(1) }}">
            <b-card-img :src="getPoster(1)" :alt="getTitulo(1)"/>
          </router-link>
          <b-card-title :title="getTitulo(1)" title-tag="h6"/>
        </b-card>
        <b-card class="card" title-tag="h6" v-bind:img-alt=getTitulo(2)>
          <router-link :to="{path:'/serie', query: { id: getId(2) }}">
            <b-card-img :src="getPoster(2)" :alt="getTitulo(2)"/>
          </router-link>
          <b-card-title :title="getTitulo(2)" title-tag="h6"/>
        </b-card>
        <b-card class="card" title-tag="h6" v-bind:img-alt=getTitulo(3)>
          <router-link :to="{path:'/serie', query: { id: getId(3) }}">
            <b-card-img :src="getPoster(3)" :alt="getTitulo(3)"/>
          </router-link>
          <b-card-title :title="getTitulo(3)" title-tag="h6"/>
        </b-card>
        <b-card class="card" title-tag="h6" v-bind:img-alt=getTitulo(4)>
          <router-link :to="{path:'/serie', query: { id: getId(4) }}">
            <b-card-img :src="getPoster(4)" :alt="getTitulo(4)"/>
          </router-link>
          <b-card-title :title="getTitulo(4)" title-tag="h6"/>
        </b-card>
      </b-card-group>
    </div>
  </div>
</template>

<script>
import themoviedb from "themoviedb-javascript-library";

export default {
  name: "InicioSinRegistrar",
  props: {},
  data() {
    return {
      obtenido: false,
      resultado: [],
    };
  },
  methods: {
    successCB(data) {
      console.log("Success callback: " + data);
      var aux = JSON.parse(data);
      this.resultado.push(aux);
    },
    errorCB(data) {
      console.log("Error callback: " + data);
    },
    async obtenerSeries() {
      var queries = ["Breaking%20Bad", "Game%20of%20Thrones", "The%20Crown", "How%20to%20get%20away", "The%20Office%20US"];
      for (var i = 0 ; i < queries.length ; i++){
        await this.ejecutarQuery(i, queries);
      }
      this.obtenido = true;
    },
    getTitulo(i){
      return this.resultado[i]['results'][0]['name'];
    },
    getPoster(i){
      return "https://image.tmdb.org/t/p/original/" + this.resultado[i]['results'][0]['poster_path'];
    },
    getId(i){
      return this.resultado[i]['results'][0]['id'];
    },
    async ejecutarQuery(j, queries){
      var _this = this;
      themoviedb.search.getTv(
          { query: queries[j] },
          _this.successCB,
          _this.errorCB
          );

      return "hola";
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
.registrate {
  width: 80%;
  margin: auto;
  margin-top: 7%;
  background-color: #585a599e;
  color: rgb(255, 255, 255);
  font-size: 150%;
}
.beneficios {
  width: 80%;
  margin: auto;
}
.card-ventaja {
  width: 20%;
  margin-top: 2%;
  margin-bottom: 2%;
  color: rgb(255, 255, 255);
}
.seriesPopulares {
  width: 80%;
  margin: auto;
  margin-top: 7%;
  background-color: #585a5900;
  color: rgb(255, 255, 255);
}
.card{
  color: rgb(0, 0, 0);
  border: none;
}
.card-card_title {
    font-size: 1.2em;
}
</style>
