<template>
  <div class="temporada">
    <div v-if="!datosObtenidos">
      {{ buscarTemporada() }}
    </div>

    <b-container v-if="datosObtenidos">
      <b-row>
        <b-col cols="3" class="mt-4">
          <div>
            <b-img
              :src="getPoster()"
              :alt="getTituloSerie()"
              width="200px"
              class="poster"
              fluid-grow
            />
          </div>
        </b-col>
        <b-col cols="9" class="mt-4">
          <div class="descripcion">
            <h1 align="left">{{getTituloSerie()}}: Temporada {{ resultado["season_number"] }}</h1>
            <p align="left">{{ resultado["overview"] }}</p>
          </div>
          <h3 align="left">Capítulos</h3>
          <b-card-group class="capitulos" v-for="i in numCapitulos" :key="i">
            <b-card class="carta">
              <b-card-body>
                <b-img :src="getPath(i)" :alt="'Imagen episodio ' + getNumCapitulo(i)" fluid-grow class="imagen"></b-img>
                <router-link :to="{name:'episodio', query: { id: getIdSerie(), nombre: getTitulo(), temp: getNumeroTemporada(), num: getNumCapitulo(i)}, params: {pathPoster: getPoster()}}">
                  <b-card-title id="titulo">{{
                    resultado["episodes"][i]["name"]
                  }}</b-card-title>
                </router-link>
                <b-card-sub-title>Fecha de estreno: {{
                  resultado["episodes"][i]["air_date"]
                }}</b-card-sub-title>
                <b-card-text>{{
                  resultado["episodes"][i]["overview"]
                }}</b-card-text>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import themoviedb from "themoviedb-javascript-library";

export default {
  name: "Temporada",
  props: {},
  data() {
    return {
      resultado: "",
      datosObtenidos: false,
      tituloSerie: "",
      numCapitulos: "",
      pathsFotos: [],
      idSerie: "",
      numeroTemporada: "",
    };
  },
  methods: {
    getIdSerie(){
      return this.idSerie;
    },
    getTitulo(){
      return this.tituloSerie;
    },
    getNumeroTemporada(){
      return this.numeroTemporada;
    },
    getNumCapitulo(i){
      return i + 1;
    },
    buscarTemporada() {
      var _this = this;
      this.idSerie = _this.$route.query.id;
      this.numeroTemporada = _this.$route.query.numero;
      this.tituloSerie = _this.$route.query.nombre;

      this.getIdTemporada()
        .then((res) => {
          console.log("1 " + res);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async getIdTemporada() {
      themoviedb.tvSeasons.getById(
        { id: this.idSerie, season_number: this.numeroTemporada },
        this.successCB,
        this.errorCB
      );
      return " hola";
    },
    successCB(data) {
      console.log("Success callback: " + data);
      this.resultado = JSON.parse(data);

      this.numCapitulos = Array.from(
        Array(this.resultado["episodes"].length).keys()
      );

      this.datosObtenidos = true;
    },
    errorCB(data) {
      console.log("Error callback: " + data);
    },
    getPoster() {
      return (
        "https://image.tmdb.org/t/p/original/" + this.resultado["poster_path"]
      );
    },
    getTituloSerie() {
      return this.tituloSerie;
    },
    getPath(i) {
      return (
        "https://image.tmdb.org/t/p/original" +
        this.resultado["episodes"][i]["still_path"]
      );
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
  color: #4B4453;
}
.capitulos {
  width: 100%;
}
.carta {
  width: 100%;
}
.foto {
  width: 200px;
}
.carta {
  color: rgb(0, 0, 0);
  border: none;
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
  margin-top: 1em;
  font-size: small;
}
h1 {
  font-weight: bolder;
}
h3 {
  font-weight: bold;
}
.imagen {
  max-width: 400px;
}
#titulo {
  margin-top: 1em;
}
</style>