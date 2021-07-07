<template>
  <div class="descubrirSeries">
    <div v-if="!datosObtenidos">
      {{ busquedaInicial() }}
    </div>
    <b-container class="mt-4" v-if="datosObtenidos">
      <h2 align="left" class="mb-4 mt-4">Descubre nuevas series</h2>
      <b-form @submit.prevent="nuevaBusqueda">
        <b-row>
          <b-col md="3">
            <b-form-group label="Idioma">
              <b-form-select
                v-model="idioma"
                :options="idiomas"
              ></b-form-select>
            </b-form-group>
          </b-col>

          <b-col md="3">
            <b-form-group label="Incluir géneros">
              <b-form-select
                v-model="conGenre"
                :options="generos"
                multiple
              ></b-form-select>
            </b-form-group>
          </b-col>

          <b-col md="3">
            <b-form-group label="Excluir géneros">
              <b-form-select
                v-model="sinGenre"
                :options="generos"
                multiple
              ></b-form-select>
            </b-form-group>
          </b-col>

          <!-- añadir un nuevo form-select cuando se ha elegido uno -->

          <b-col md="3">
            <b-form-group label="Año de estreno">
              <b-form-select v-model="fecha" :options="anios"></b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row align-v="center">
          <b-col cols="3">
            <b-form-group label="Ordenar los resultados según: ">
              <b-form-select
                v-model="ordenar"
                :options="opcionesOrdenar"
              ></b-form-select>
            </b-form-group>
          </b-col>
          <b-col cols="1">
            <b-button type="submit" class="mt-3">Enviar</b-button>
          </b-col>
        </b-row>
      </b-form>
    </b-container>
    <b-container>
      <b-pagination
        v-model.lazy="currentPage"
        :total-rows="getNumFilas()"
        :per-page="perPage"
        aria-controls="resultados"
      ></b-pagination>
      <b-card-group id="resultados">
        <b-card-group id="resultados">
          <b-row>
            <b-col cols="12">
              <b-card
                no-body
                class="overflow-hidden border-0 mb-3 text-left"
                v-for="i in Array(getNumRes()).keys()"
                :key="i"
              >
                <b-container>
                  <b-row no-gutters>
                    <b-col md="2">
                      <b-card-img
                        :src="getPoster(i)"
                        :alt="'Poster de la serie ' + getNombre(i)"
                      ></b-card-img>
                    </b-col>
                    <b-col md="10">
                      <b-card-body>
                        <router-link
                          :to="{ path: '/serie', query: { id: getId(i) } }"
                        >
                          <b-card-title style="color: #9a7acd">{{
                            getNombre(i)
                          }}</b-card-title>
                        </router-link>
                        <b-card-text>{{ getDescripcion(i) }}</b-card-text>
                      </b-card-body>
                    </b-col>
                  </b-row>
                </b-container>
              </b-card>
            </b-col>
          </b-row>
        </b-card-group>
      </b-card-group>
    </b-container>
  </div>
</template>

<script>
import themoviedb from "themoviedb-javascript-library";

export default {
  name: "descubrirSeries",
  props: {},
  data() {
    return {
      datosObtenidos: false,
      resultados: [],
      idioma: null,
      conGenre: [],
      sinGenre: [],
      fecha: null,
      ordenar: 0,
      generos: [],
      opcionesOrdenar: [
        { value: 0, text: "Popularidad" },
        { value: 1, text: "Fecha de estreno" },
        { value: 2, text: "Título" },
        { value: 3, text: "Media de votos" },
        { value: 4, text: "Número de votos" },
      ],
      anios: [],
      listaFecha: false,
      perPage: 20,
      currentPage: 1,
      query: {},
    };
  },
  watch: {
    currentPage: function (value) {
      this.datosObtenidos = false;
      console.log(value);
    },
  },
  methods: {
    busquedaInicial() {
      if (!this.listaFecha) {
        this.listaFecha = true;
        this.anios.push({ value: null, text: "Elige una opción" });

        var fecha = new Date().getFullYear();
        for (var i = 1950; i < fecha + 1; i++) {
          var a = { value: i, text: String(i) };
          this.anios.push(a);
        }
      }
      this.query["page"] = this.currentPage;
      themoviedb.discover.getTvShows(this.query, this.exito, this.error);
    },
    exito(data) {
      console.log("Success callback: ", data);
      var datos = JSON.parse(data);

      this.resultados = datos;

      this.getIdiomas();
    },
    error(data) {
      console.log("Error: ", data);
    },
    getIdiomas() {
      themoviedb.configurations.getLanguages(this.exitoIdiomas, this.error);
    },
    getGenres() {
      themoviedb.genres.getTvList({}, this.exitoGenres, this.error);
    },
    exitoIdiomas(data) {
      console.log("Success callback: ", data);
      var datos = JSON.parse(data);

      var idiomas = [];
      idiomas.push({ value: null, text: "Elige una opción" });

      for (var i of datos) {
        idiomas.push({ value: i["iso_639_1"], text: i["english_name"] });
      }

      this.idiomas = idiomas;

      this.getGenres();
    },
    exitoGenres(data) {
      console.log("Success callback: ", data);
      var datos = JSON.parse(data);

      var generos = [];

      for (var i of datos["genres"]) {
        generos.push({ value: i.id, text: i.name });
      }

      this.datosObtenidos = true;
      this.generos = generos;
    },
    nuevaBusqueda() {
      var query = {};
      this.query = {};

      if (this.idioma != null) {
        query["with_original_language"] = this.idioma;
      }

      if (this.conGenre != []) {
        query["with_genres"] = this.conGenre.toString();
      }

      if (this.sinGenre != []) {
        query["without_genres"] = this.sinGenre.toString();
      }

      if (this.fecha != null) {
        query["first_air_date_year"] = this.fecha;
      }

      query["sort_by"] = this.ordenar;

      this.query = query;

      themoviedb.discover.getTvShows(this.query, this.exitoNuevo, this.error);
    },
    exitoNuevo(data) {
      console.log("Success callback: ", data);
      var datos = JSON.parse(data);

      this.resultados = datos;
    },
    getNumFilas() {
      return this.resultados["total_results"];
    },
    getNumRes() {
      return this.resultados["results"].length;
    },
    getNombre(i) {
      if (this.resultados["results"][i] != undefined)
        return this.resultados["results"][i]["name"];
      else {
        return "";
      }
    },
    getPoster(i) {
      if (this.resultados["results"][i] != undefined) {
        if (this.resultados["results"][i]["poster_path"] != null) {
          return (
            "https://image.tmdb.org/t/p/original" +
            String(this.resultados["results"][i]["poster_path"])
          );
        } else
          return "https://firebasestorage.googleapis.com/v0/b/mitfg-12618.appspot.com/o/notfoundimage.png?alt=media&token=18058605-604d-4330-9fe2-b5706d9d1835";
      } else return "";
    },
    getDescripcion(i) {
      if (this.resultados["results"][i] != undefined)
        return this.resultados["results"][i]["overview"];
      else return "";
    },
    getId(i) {
      if (this.resultados["results"][i] != undefined)
        return this.resultados["results"][i]["id"];
      else return "";
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
</style>



