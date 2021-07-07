<template>
  <div class="busqueda">
    <div v-if="!datosObtenidos">
      {{ getResultados() }}
    </div>
    <b-container>
      <b-row>
        <b-col>
          <h1 align="left" class="mt-4 mb-4">Resultados de la búsqueda:</h1>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-pagination
            v-model.lazy="currentPage"
            :total-rows="getNumFilas()"
            :per-page="perPage"
            aria-controls="resultados"
          ></b-pagination>
          <b-card-group id="resultados" v-if="getTipoBusqueda() == 'serie'">
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

          <b-card-group id="resultados" v-if="getTipoBusqueda() == 'persona'">
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
                          :src="getFoto(i)"
                          :alt="'Imagen de ' + getNombre(i)"
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
                        </b-card-body>
                      </b-col>
                    </b-row>
                  </b-container>
                </b-card>
              </b-col>
            </b-row>
          </b-card-group>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import themoviedb from "themoviedb-javascript-library";

export default {
  name: "Busqueda",
  props: {},
  data() {
    return {
      esPrimera: true,
      datosObtenidos: false,
      datosBusqueda: "",
      currentPage: "",
      perPage: 20,
    };
  },
  watch: {
    currentPage: function (value) {
      this.datosObtenidos = false;
      console.log(value);
    },
    "$route.query.type": {
      handler: function (search) {
        console.log(search);
        this.datosObtenidos = false;
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    getTipoBusqueda() {
      return this.$route.query.type;
    },
    getQueryBusqueda() {
      return this.$route.query.query;
    },
    getResultados() {
      console.log("esto es una ", this.getTipoBusqueda());
      switch (this.getTipoBusqueda()) {
        case "serie":
          themoviedb.search.getTv(
            { query: this.getQueryBusqueda(), page: this.currentPage },
            this.successSerie,
            this.error
          );
          break;
        case "persona":
          themoviedb.search.getPerson(
            { query: this.getQueryBusqueda(), page: this.currentPage },
            this.successPersona,
            this.error
          );
          break;
        default:
          this.datosObtenidos = true;
          console.log("Error en la busqueda");
          break;
      }
    },
    successSerie(data) {
      console.log("Success callback: " + data);
      var datos = JSON.parse(data);
      this.datosBusqueda = datos;
      this.datosObtenidos = true;
    },
    successPersona(data) {
      console.log("Success callback: " + data);
      var datos = JSON.parse(data);
      this.datosBusqueda = datos;
      this.datosObtenidos = true;
    },
    error(data) {
      console.log("Error: " + data);
    },
    getNumFilas() {
      return this.datosBusqueda["total_results"];
    },
    getNombre(i) {
      if (this.datosBusqueda["results"][i] != undefined)
        return this.datosBusqueda["results"][i]["name"];
      else{
          return "";
    }
    },
    getPoster(i) {
      if (this.datosBusqueda["results"][i] != undefined){
      if (this.datosBusqueda["results"][i]["poster_path"] != null) {
        return (
          "https://image.tmdb.org/t/p/original" +
          String(this.datosBusqueda["results"][i]["poster_path"])
        );
      } else
        return "https://firebasestorage.googleapis.com/v0/b/mitfg-12618.appspot.com/o/notfoundimage.png?alt=media&token=18058605-604d-4330-9fe2-b5706d9d1835";
      }
      else return "";
    },
    getFoto(i) {
      if (this.datosBusqueda["results"][i] != undefined) {
        if (this.datosBusqueda["results"][i]["profile_path"] != null) {
          return (
            "https://image.tmdb.org/t/p/original" +
            String(this.datosBusqueda["results"][i]["profile_path"])
          );
        } else
          return "https://firebasestorage.googleapis.com/v0/b/mitfg-12618.appspot.com/o/notfoundimage.png?alt=media&token=18058605-604d-4330-9fe2-b5706d9d1835";
      }
      else return "";
    },
    getDescripcion(i) {
      if (this.datosBusqueda["results"][i] != undefined)
        return this.datosBusqueda["results"][i]["overview"];
      else return "";
    },
    getId(i) {
      if (this.datosBusqueda["results"][i] != undefined)
        return this.datosBusqueda["results"][i]["id"];
      else return "";
    },
    getNumRes() {
        return this.datosBusqueda["results"].length;
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
</style>