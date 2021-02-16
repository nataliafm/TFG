<template>
  <div class="temporada">
    <div v-if="!datosObtenidos">
      {{ buscarTemporada() }}
    </div>

    <b-container v-if="datosObtenidos">
      <b-row>
        <b-col cols="3">
          <div>
            <b-img
              :src="getPoster()"
              :alt="getTituloSerie()"
              width="200px"
              class="poster"
            />
          </div>
        </b-col>
        <b-col cols="9">
          <div class="descripcion">
            <h1 align="left">Temporada {{ resultado["season_number"] }}</h1>
            <p align="left">{{ resultado["overview"] }}</p>
          </div>
          <h3 align="left">Capítulos</h3>
          <b-card-group
            class="capitulos"
            v-for="i in numCapitulos"
            :key="i"
          >
            <b-card class="carta" :img-src="getPath(i)" img-left>
              <!--<b-card-img :src-img="getPath(i)" :alt="getTituloSerie()" :left="true" class="foto"></b-card-img>-->
              <b-card-body>
                <b-card-title>{{
                    resultado["episodes"][i]["name"]
                }}</b-card-title>
                <b-card-sub-title>{{
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
    };
  },
  methods: {
    buscarTemporada() {
      var _this = this;
      var id = _this.$route.query.id;
      var numero = _this.$route.query.numero;
      this.tituloSerie = _this.$route.query.nombre;

      this.getIdTemporada(id, numero)
        .then((res) => {
          console.log("1 " + res);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async getIdTemporada(id, num) {
      console.log("hola");
      themoviedb.tvSeasons.getById(
        { id: id, season_number: num },
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

      var _this = this;
      var id = _this.$route.query.id;
      var numero = _this.$route.query.numero;

      this.getPathsFotos(id, numero)
        .then((res) => {
          console.log("2 " + res);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    errorCB(data) {
      console.log("Error callback: " + data);
    },
    async getPathsFotos(id, numero) {
      for (var j = 1; j <= this.resultado["episodes"].length; j++) {
        themoviedb.tvEpisodes.getImages(
          { id: id, season_number: numero, episode_number: j },
          this.successCB1,
          this.errorCB1
        );
      }
      return " hola";
    },
    successCB1(data) {
      console.log("Success callback: " + data);
      var r = JSON.parse(data);

      this.pathsFotos.push(r['stills'][0]['file_path']);

      this.datosObtenidos = true;
    },
    errorCB1(data) {
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
        return "https://image.tmdb.org/t/p/original" + this.pathsFotos[i];
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
.poster {
  margin-top: 2em;
}
.descripcion {
  margin-top: 2em;
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
.carta{
  color: rgb(0, 0, 0);
  border: none;
  width: 100%!important;
   height: 200px!important;
   object-fit: cover;
   margin-top: 1em;
}
</style>