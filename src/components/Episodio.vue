<template>
  <div class="episodio">
    <div v-if="!datosObtenidos">
      {{ buscarEpisodio() }}
    </div>

    <b-container v-if="datosObtenidos">
      <b-row>
        <b-col cols="3">
          <div>
            <b-img
              :src="getPoster()"
              :alt="getTitulo()"
              width="200px"
              class="poster"
            />
          </div>
        </b-col>
        <b-col cols="9">
          <div class="descripcion">
            <h1 align="left">
              Temporada {{ getNumTemporada() }}, Episodio
              {{ getNumEpisodio() }}: {{ getTituloEpisodio() }}
            </h1>
            <p align="left">{{ infoEpisodio["overview"] }}</p>
          </div>
          <div class="creadoPor" v-if="datosObtenidos">
            <h3 align="left">Actores</h3>

            <b-carousel controls :interval="9999999" class="actores">
              <b-carousel-slide v-for="i in paginasActores" :key="i">
                <template slot="img" v-for="j in numElementosActores">
                  <b-container :key="j" class="cards">
                    <b-col cols="1" class="columna">
                      <b-img :src="getActor(i, j)" class="imgs"></b-img>
                      <div class="nombre">{{ getNombreActor(i, j) }}</div>
                      <div class="nombre">{{ getRolActor(i, j) }}</div>
                    </b-col>
                  </b-container>
                </template>
                <div v-if="seguir1">
                  {{ getNumElementosActores() }}
                </div>
              </b-carousel-slide>
            </b-carousel>

            <h3 align="left">Equipo</h3>

            <b-carousel controls :interval="9999999" class="actores">
              <b-carousel-slide v-for="i in paginasEquipo" :key="i">
                <template slot="img" v-for="j in numElementosEquipo">
                  <b-container :key="j" class="cards">
                    <b-col cols="1" class="columna">
                      <b-img :src="getEquipo(i, j)" class="imgs"></b-img>
                      <div class="nombre">{{ getNombreEquipo(i, j) }}</div>
                      <div class="nombre">{{ getRolEquipo(i, j) }}</div>
                    </b-col>
                  </b-container>
                </template>
                <div v-if="seguir2">
                  {{ getNumElementosEquipo() }}
                </div>
              </b-carousel-slide>
            </b-carousel>
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
    };
  },
  methods: {
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

      for (var m = 0, k = 1; m < this.crewEpisodio.length; m += 7, k++) {
        this.paginasEquipo.push(k);
      }

      this.contadorEquipo = this.crewEpisodio.length;

      if (this.contadorEquipo < 7)
        this.numElementosEquipo = Array.from(
          Array(this.contadorEquipo).keys()
        );
      else this.numElementosEquipo = Array.from(Array(7).keys());

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

      for (var m = 0, k = 1; m < this.castEpisodio.length; m += 7, k++) {
        this.paginasActores.push(k);
      }

      this.contadorActores = this.castEpisodio.length;

      if (this.contadorActores < 7)
        this.numElementosActores = Array.from(
          Array(this.contadorActores).keys()
        );
      else this.numElementosActores = Array.from(Array(7).keys());

      this.datosObtenidos = true;
    },
    error2(data) {
      console.log("Error callback: " + data);
    },
    error1(data) {
      console.log("Error callback: " + data);
    },
    getPoster() {
      return this.poster;
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
      var path = String(this.castEpisodio[(i - 1) * 7 + j]["profile_path"]);

      if (path.length > 0) {
        return "https://image.tmdb.org/t/p/original" + path;
      } else {
        return "https://upload.wikimedia.org/wikipedia/commons/3/3b/Picture_Not_Yet_Available.png";
      }
    },
    getNombreActor(i, j) {
      return this.castEpisodio[(i - 1) * 7 + j]["name"];
    },
    getRolActor(i, j) {
      return this.castEpisodio[(i - 1) * 7 + j]["character"];
    },
    getNumElementosActores() {
      this.contadorActores -= 7;

      if (this.contadorActores > 0 && this.contadorActores < 7) this.numElementosActores = Array.from(Array(this.contadorActores).keys());
      else if (this.contadorActores <= 0) {
        this.seguir1 = false;
        if (this.castEpisodio.length < 7)
            this.numElementosActores = Array.from(Array(this.castEpisodio.length).keys()
        );
        else this.numElementosActores = Array.from(Array(7).keys());
      } else this.numElementosActores = Array.from(Array(7).keys());
    },
    getEquipo(i, j) {
      var path = String(this.crewEpisodio[(i - 1) * 7 + j]["profile_path"]);

      if (path != "null") {
        return "https://image.tmdb.org/t/p/original" + path;
      } else {
        return "https://upload.wikimedia.org/wikipedia/commons/3/3b/Picture_Not_Yet_Available.png";
      }
    },
    getNombreEquipo(i, j) {
      return this.crewEpisodio[(i - 1) * 7 + j]["name"];
    },
    getRolEquipo(i, j) {
      return this.crewEpisodio[(i - 1) * 7 + j]["job"];
    },
    getNumElementosEquipo() {
      this.contadorEquipo -= 7;

      if (this.contadorEquipo > 0 && this.contadorEquipo < 7) this.numElementosEquipo = Array.from(Array(this.contadorEquipo).keys());
      else if (this.contadorEquipo <= 0) {
        this.seguir2 = false;
        if (this.crewEpisodio.length < 7)
            this.numElementosEquipo = Array.from(Array(this.crewEpisodio.length).keys()
        );
        else this.numElementosEquipo = Array.from(Array(7).keys());
      } else this.numElementosEquipo = Array.from(Array(7).keys());
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
.poster {
  margin-top: 2em;
}
.imgs {
  width: 4em;
}
.columna {
  float: left;
  margin-left: 1.5em;
}
.cards {
  width: 100%;
  margin-left: 1em;
}
</style>