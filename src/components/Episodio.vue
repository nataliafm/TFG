<template>
  <div class="episodio">
    <div v-if="!datosObtenidos">
      {{ buscarEpisodio() }}
    </div>
    <div v-if="!datosSerieObtenidos">
      {{ buscarSerie() }}
    </div>

    <b-container v-if="datosObtenidos && datosSerieObtenidos">
      <b-row>
        <b-col cols="3" class="mt-4">
          <div>
            <b-img
              :src="getPoster()"
              :alt="getTitulo()"
              width="200px"
              class="poster"
              fluid-grow
            />
          </div>
        </b-col>
        <b-col cols="9">
          <div class="descripcion">
            <h3 align="left">
              <router-link
                style="color: #9A7ACD"
                :to="{ path: '/serie', query: { id: getIdSerie() } }"
                >{{ getTitulo() }}</router-link
              >,
              <router-link
                style="color: #9A7ACD"
                :to="{
                  path: '/temporada',
                  query: {
                    id: getIdSerie(),
                    numero: getNumTemporada(),
                    nombre: getTitulo(),
                  },
                }"
                >Temporada {{ getNumTemporada() }}</router-link
              >
            </h3>
            <h1 align="left">Episodio {{ getNumEpisodio() }}: {{ getTituloEpisodio() }}
            </h1>
            <p align="left">{{ infoEpisodio["overview"] }}</p>
          </div>
          <div class="creadoPor" v-if="datosObtenidos">
            <h3 align="left">Actores</h3>

            <b-pagination
              v-model="currentPageA"
              :total-rows="getNumActores()"
              :per-page="getPerPage()"
              aria-controls="actores"
              class="mt-2"
              :key="getKey()"
            ></b-pagination>
            <b-card-group id="actores" deck>
              <b-card
                v-for="j in Array(getPerPage()).keys()"
                :key="j"
                class="border-0"
              >
                <router-link
                  :to="{
                    path: '/persona',
                    query: { id: getIdActor(currentPageA, j) },
                  }"
                >
                  <b-card-img
                    :src="getActor(currentPageA, j)"
                    :alt="getNombreActor(currentPageA, j)"
                  ></b-card-img>
                </router-link>

                <b-card-text class="nombre">{{
                  getNombreActor(currentPageA, j)
                }}</b-card-text>
                <b-card-text class="rol">{{
                  getRolActor(currentPageA, j)
                }}</b-card-text>
              </b-card>
              <div v-if="seguir1">
                {{ getNumElementosActores() }}
              </div>
            </b-card-group>

            <h3 align="left">Equipo</h3>

            <b-pagination
              v-model="currentPageE"
              :total-rows="getNumEquipo()"
              :per-page="getPerPage()"
              aria-controls="equipo"
              class="mt-2"
              :key="getKey()"
            ></b-pagination>
            <b-card-group id="equipo" :key="getKey()">
              <b-card v-for="j in Array(getPerPage()).keys()" :key="j" class="border-0">
                <router-link
                  :to="{
                    path: '/persona',
                    query: { id: getIdEquipo(currentPageE, j) },
                  }"
                >
                  <b-card-img
                    :src="getEquipo(currentPageE, j)"
                    :alt="getNombreEquipo(currentPageE, j)"
                  ></b-card-img>
                </router-link>
                <b-card-text class="nombre">{{
                  getNombreEquipo(currentPageE, j)
                }}</b-card-text>
                <b-card-text class="rol">{{
                  getRolEquipo(currentPageE, j)
                }}</b-card-text>
              </b-card>
              <div v-if="seguir2">
                {{ getNumElementosEquipo() }}
              </div>
            </b-card-group>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import themoviedb from "themoviedb-javascript-library";

export default {
  name: "Episodio",
  props: {
    pathPoster: { type: String, default: "" },
  },
  data() {
    return {
      poster: "",
      idSerie: "",
      tituloSerie: "",
      numEpisodio: "",
      numTemporada: "",
      datosObtenidos: false,
      infoEpisodio: "",
      castEpisodio: "",
      contadorActores: "",
      paginasActores: [],
      numElementosActores: "",
      seguir1: true,
      crewEpisodio: "",
      contadorEquipo: "",
      paginasEquipo: [],
      numElementosEquipo: "",
      seguir2: true,
      currentPageA: 1,
      currentPageE: 1,
      perPage: 6,
      posterTemporada: "",
      nombreSerie: "",
      datosSerieObtenidos: false,
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
    getNumActores() {
      return this.castEpisodio.length;
    },
    getNumEquipo() {
      return this.crewEpisodio.length;
    },
    buscarEpisodio() {
      var _this = this;
      this.poster = _this.$route.params.pathPoster;
      this.idSerie = _this.$route.query.id;
      this.tituloSerie = _this.$route.query.nombre;
      this.numEpisodio = _this.$route.query.num;
      this.numTemporada = _this.$route.query.temp;

      this.getDatosEpisodio()
        .then((res) => {
          console.log("1 " + res);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async getDatosEpisodio() {
      themoviedb.tvEpisodes.getById(
        {
          id: this.idSerie,
          season_number: this.numTemporada,
          episode_number: this.numEpisodio,
        },
        this.success1,
        this.error1
      );

      return "hola";
    },
    success1(data) {
      console.log("Success callback: " + data);
      this.infoEpisodio = JSON.parse(data);
      this.crewEpisodio = this.infoEpisodio["crew"];

      for (var m = 0, k = 1; m < this.crewEpisodio.length; m += 6, k++) {
        this.paginasEquipo.push(k);
      }

      this.contadorEquipo = this.crewEpisodio.length;

      if (this.contadorEquipo < 6)
        this.numElementosEquipo = Array.from(Array(6).keys());
      else this.numElementosEquipo = Array.from(Array(6).keys());

      this.getCast()
        .then((res) => {
          console.log("2 " + res);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async getCast() {
      themoviedb.tvEpisodes.getCredits(
        {
          id: this.idSerie,
          season_number: this.numTemporada,
          episode_number: this.numEpisodio,
        },
        this.success2,
        this.error2
      );

      return "hola";
    },
    success2(data) {
      console.log("Success callback: " + data);
      var datos = JSON.parse(data);
      this.castEpisodio = datos["cast"];

      for (var m = 0, k = 1; m < this.castEpisodio.length; m += 6, k++) {
        this.paginasActores.push(k);
      }

      this.contadorActores = this.castEpisodio.length;

      if (this.contadorActores < 6)
        this.numElementosActores = Array.from(Array(6).keys());
      else this.numElementosActores = Array.from(Array(6).keys());

      this.datosObtenidos = true;
    },
    buscarSerie() {
      themoviedb.tvSeasons.getById(
        { id: this.idSerie, season_number: this.numTemporada },
        this.success3,
        this.error1
      );
    },
    success3(data) {
      console.log("Success callback: " + data);
      var datos = JSON.parse(data);

      this.posterTemporada = datos["poster_path"];
      this.datosSerieObtenidos = true;
    },
    error2(data) {
      console.log("Error callback: " + data);
    },
    error1(data) {
      console.log("Error callback: " + data);
    },
    getPoster() {
      return "https://image.tmdb.org/t/p/original" + this.posterTemporada;
    },
    getIdSerie() {
      return this.idSerie;
    },
    getTitulo() {
      return this.tituloSerie;
    },
    getNumEpisodio() {
      return this.numEpisodio;
    },
    getNumTemporada() {
      return this.numTemporada;
    },
    getTituloEpisodio() {
      return this.infoEpisodio["name"];
    },
    getActor(i, j) {
      if (this.castEpisodio[(i - 1) * this.getPerPage() + j] != undefined) {
        var path = String(this.castEpisodio[(i - 1) * this.getPerPage() + j]["profile_path"]);
        if (path != "null") {
          return "https://image.tmdb.org/t/p/original" + path;
        } else {
          return "https://firebasestorage.googleapis.com/v0/b/mitfg-12618.appspot.com/o/notfoundimage.png?alt=media&token=18058605-604d-4330-9fe2-b5706d9d1835";
        }
      } else {
        return "";
      }
    },
    getNombreActor(i, j) {
      if (this.castEpisodio[(i - 1) * this.getPerPage() + j] != undefined)
        return this.castEpisodio[(i - 1) * this.getPerPage() + j]["name"];
      else return "";
    },
    getRolActor(i, j) {
      if (this.castEpisodio[(i - 1) * this.getPerPage() + j] != undefined)
        return this.castEpisodio[(i - 1) * this.getPerPage() + j]["character"];
      else return "";
    },
    getNumElementosActores() {
      this.contadorActores -= 6;

      if (this.contadorActores > 0 && this.contadorActores < 6)
        this.numElementosActores = Array.from(Array(6).keys());
      else if (this.contadorActores <= 0) {
        this.seguir1 = false;
      } else this.numElementosActores = Array.from(Array(6).keys());
    },
    getEquipo(i, j) {
      if (this.crewEpisodio[(i - 1) * this.getPerPage() + j] != undefined) {
        var path = String(this.crewEpisodio[(i - 1) * this.getPerPage() + j]["profile_path"]);
        if (path != "null") {
          return "https://image.tmdb.org/t/p/original" + path;
        } else {
          return "https://firebasestorage.googleapis.com/v0/b/mitfg-12618.appspot.com/o/notfoundimage.png?alt=media&token=18058605-604d-4330-9fe2-b5706d9d1835";
        }
      } else {
        return "";
      }
    },
    getNombreEquipo(i, j) {
      if (this.crewEpisodio[(i - 1) * this.getPerPage() + j] != undefined)
        return this.crewEpisodio[(i - 1) * this.getPerPage() + j]["name"];
      else return "";
    },
    getRolEquipo(i, j) {
      if (this.crewEpisodio[(i - 1) * this.getPerPage() + j] != undefined)
        return this.crewEpisodio[(i - 1) * this.getPerPage() + j]["job"];
      else return "";
    },
    getNumElementosEquipo() {
      this.contadorEquipo -= 6;

      if (this.contadorEquipo > 0 && this.contadorEquipo < 6)
        this.numElementosEquipo = Array.from(Array(6).keys());
      else if (this.contadorEquipo <= 0) {
        this.seguir2 = false;
      } else this.numElementosEquipo = Array.from(Array(6).keys());
    },
    existeEquipo(i, j) {
      if (this.crewEpisodio[(i - 1) * this.getPerPage() + j] != undefined) {
        console.log(String(this.crewEpisodio[(i - 1) * this.getPerPage() + j]["profile_path"]));
        console.log(
          String(this.crewEpisodio[(i - 1) * this.getPerPage() + j]["profile_path"]) == "null"
        );
        return (
          String(this.crewEpisodio[(i - 1) * this.getPerPage() + j]["profile_path"]) != "null"
        );
      } else return false;
    },
    getIdActor(i, j) {
      if (this.castEpisodio[(i - 1) * this.getPerPage() + j] != undefined)
        return this.castEpisodio[(i - 1) * this.getPerPage() + j]["id"];
      else return "";
    },
    getIdEquipo(i, j) {
      if (this.crewEpisodio[(i - 1) * this.getPerPage() + j] != undefined)
        return this.crewEpisodio[(i - 1) * this.getPerPage() + j]["id"];
      else return "";
    },
    myEventHandler(e) {
      console.log(e.target.innerWidth);
      if (e.target.innerWidth < 580) {
        this.perPage = 2;
      } else if (e.target.innerWidth > 580 && e.target.innerWidth < 1200) {
        this.perPage = 3;
      } else {
        this.perPage = 6;
      }

      this.llave = !this.llave;
    },
    getKey() {
      return this.llave;
    },
    getPerPage() {
      return this.perPage;
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
.imgs {
  width: 4em;
}
.columna {
  float: left;
}
.cards {
  width: 100%;
}
h1 {
  font-weight: bolder;
}
h3 {
  font-weight: bold;
}
.nombre {
  margin-top: 1em;
  color: #4b4453;
  font-size: small;
  font-weight: bold;
}
.rol {
  margin-top: 1em;
  color: #4b4453;
  font-size: small;
}
.actores {
  margin-top: 1em;
}
</style>