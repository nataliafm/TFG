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
        <b-col cols="9">
          <div class="descripcion">
            <h3 align="left"><router-link style="color: #9A7ACD" :to="{ path: '/serie', query: { id: getIdSerie() } }">{{ getTituloSerie() }}</router-link>:</h3>
            
            <h1 align="left">Temporada {{ resultado["season_number"] }}</h1>
            <p align="left">{{ resultado["overview"] }}</p>
          </div>
          <h3 align="left">Capítulos</h3>
          <b-pagination
            v-model="currentPage"
            :total-rows="getNumEpisodios()"
            :per-page="getPerPage()"
            aria-controls="episodios"
            class="mt-2"
            :key="getKey()"
          ></b-pagination>
          <b-card-group id="episodios" :key="getKey()">
            <b-card
              v-for="i in Array(getPerPage()).keys()"
              :key="i"
              class="border-0"
              deck
            >
              <b-card-body>
                <router-link
                  :to="{
                    name: 'episodio',
                    query: {
                      id: getIdSerie(),
                      nombre: getTitulo(),
                      temp: getNumeroTemporada(),
                      num: getNum(currentPage, i),
                    },
                    params: { pathPoster: getPoster() },
                  }"
                >
                  <b-img
                    :src="getPath(currentPage, i)"
                    :alt="getNumCapitulo(currentPage, i)"
                    fluid-grow
                    class="imagen"
                  ></b-img>
                </router-link>

                <b-card-title id="titulo">{{
                  getNombreEpisodio(currentPage, i)
                }}</b-card-title>
                <b-card-sub-title>{{
                  getFechaEstreno(currentPage, i)
                }}</b-card-sub-title>
                <b-card-text>{{ getDescripcion(currentPage, i) }}</b-card-text>
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
      perPage: 3,
      llave: true,
      currentPage: 1,
    };
  },
  created() {
    window.addEventListener("resize", this.myEventHandler);
  },
  destroyed() {
    window.removeEventListener("resize", this.myEventHandler);
  },
  methods: {
    myEventHandler(e) {
      console.log(e.target.innerWidth);
      if (e.target.innerWidth < 580) {
        this.perPage = 1;
      } else if (e.target.innerWidth > 580 && e.target.innerWidth < 1000) {
        this.perPage = 2;
      } else {
        this.perPage = 3;
      }

      this.llave = !this.llave;
    },
    getKey() {
      return this.llave;
    },
    getPerPage() {
      return this.perPage;
    },
    getNumEpisodios() {
      return this.resultado["episodes"].length;
    },
    getIdSerie() {
      return this.idSerie;
    },
    getTitulo() {
      return this.tituloSerie;
    },
    getNumeroTemporada() {
      return this.numeroTemporada;
    },
    getNumCapitulo(i, j) {
      if (
        this.resultado["episodes"][(i - 1) * this.getPerPage() + j] != undefined
      )
        return "Imagen episodio " + (i - 1) * this.getPerPage() + j + 1;
      else return "";
    },
    getNum(i, j) {
      if (
        this.resultado["episodes"][(i - 1) * this.getPerPage() + j] != undefined
      )
        return (i - 1) * this.getPerPage() + j + 1;
      else return "";
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
    getPath(i, j) {
      if (
        this.resultado["episodes"][(i - 1) * this.getPerPage() + j] != undefined
      ) {
        var path = String(
          this.resultado["episodes"][(i - 1) * this.getPerPage() + j][
            "still_path"
          ]
        );
        if (path != "null") {
          return "https://image.tmdb.org/t/p/original" + path;
        } else {
          return "https://firebasestorage.googleapis.com/v0/b/mitfg-12618.appspot.com/o/notfoundimage.png?alt=media&token=18058605-604d-4330-9fe2-b5706d9d1835";
        }
      } else {
        return "";
      }
    },
    getNombreEpisodio(i, j) {
      if (
        this.resultado["episodes"][(i - 1) * this.getPerPage() + j] != undefined
      )
        return this.resultado["episodes"][(i - 1) * this.getPerPage() + j][
          "name"
        ];
      else return "";
    },
    getFechaEstreno(i, j) {
      if (
        this.resultado["episodes"][(i - 1) * this.getPerPage() + j] != undefined
      )
        return (
          "Fecha de estreno: " +
          this.resultado["episodes"][(i - 1) * this.getPerPage() + j][
            "air_date"
          ]
        );
      else return "";
    },
    getDescripcion(i, j) {
      if (
        this.resultado["episodes"][(i - 1) * this.getPerPage() + j] != undefined
      )
        return this.resultado["episodes"][(i - 1) * this.getPerPage() + j][
          "overview"
        ];
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
  color: #4b4453;
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