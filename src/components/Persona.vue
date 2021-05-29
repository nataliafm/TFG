<template>
  <div class="persona">
    <div v-if="!datosObtenidos && !creditosObtenidos">
      {{ obtenerDatos() }}
    </div>
    <b-container v-if="datosObtenidos && creditosObtenidos">
      <b-row>
        <b-col cols="3">
          <b-img
            class="mt-4 mb-4"
            fluid
            :src="getFotoPersona()"
            :alt="getNombrePersona()"
          ></b-img>
          <span class="biografia">{{ getBiografiaPersona() }}</span>
        </b-col>
        <b-col cols="8">
          <h3>Actuación</h3>
          <b-card-group deck v-for="i in getNumFilasA()" :key="i">
            <b-card v-for="j in 6" :key="j" class="border-0">
              <router-link
                :to="{ path: '/serie', query: { id: getIdSerieA(i, j) } }"
              >
                <b-card-img :src="getFotoSerieA(i, j)"></b-card-img>
              </router-link>
              <div class="nombre">{{ getTituloSerieA(i, j) }}</div>
              <div class="rol">{{ getRolA(i, j) }}</div>
            </b-card>
          </b-card-group>
          <hr />
          <h3>Equipo de producción</h3>
          <b-card-group deck v-for="i in getNumFilasE()" :key="i">
            <b-card v-for="j in 6" :key="j" class="border-0">
              <router-link
                :to="{ path: '/serie', query: { id: getIdSerieE(i, j) } }"
              >
                <b-card-img :src="getFotoSerieE(i, j)"></b-card-img>
              </router-link>
              <div class="nombre">{{ getTituloSerieE(i, j) }}</div>
              <div class="rol">{{ getRolE(i, j) }}</div>
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
  name: "Persona",
  props: {},
  data() {
    return {
      datosObtenidos: false,
      creditosObtenidos: false,
      datosPersona: [],
      creditosTV: [],
    };
  },
  methods: {
    getIdPersona() {
      var _this = this;
      return _this.$route.query.id;
    },
    obtenerDatos() {
      themoviedb.people.getById(
        { id: this.getIdPersona() },
        this.exito1,
        this.error
      );
      themoviedb.people.getTvCredits(
        { id: this.getIdPersona() },
        this.exito2,
        this.error
      );
    },
    exito1(data) {
      console.log("Exito: ", data);

      var datos = JSON.parse(data);
      this.datosPersona = datos;
      this.datosObtenidos = true;
    },
    error(data) {
      console.log("Error: ", data);
    },
    exito2(data) {
      console.log("Exito: ", data);

      var datos = JSON.parse(data);
      this.creditosTV = datos;
      this.creditosObtenidos = true;
    },
    getFotoPersona() {
      return (
        "https://image.tmdb.org/t/p/original" +
        this.datosPersona["profile_path"]
      );
    },
    getNombrePersona() {
      return this.datosPersona["name"];
    },
    getBiografiaPersona() {
      return this.datosPersona["biography"];
    },
    getNumFilasA() {
      return Math.ceil(this.creditosTV["cast"].length / 6);
    },
    getFotoSerieA(i, j) {
      if (this.creditosTV["cast"][(i - 1) * 6 + j - 1] != undefined)
        return (
          "https://image.tmdb.org/t/p/original" +
          this.creditosTV["cast"][(i - 1) * 6 + j - 1]["poster_path"]
        );
      else return "";
    },
    getTituloSerieA(i, j) {
      if (this.creditosTV["cast"][(i - 1) * 6 + j - 1] != undefined)
        return this.creditosTV["cast"][(i - 1) * 6 + j - 1]["name"];
      else return "";
    },
    getIdSerieA(i, j) {
      if (this.creditosTV["cast"][(i - 1) * 6 + j - 1] != undefined)
        return this.creditosTV["cast"][(i - 1) * 6 + j - 1]["id"];
      else return "";
    },
    getRolA(i, j) {
      if (this.creditosTV["cast"][(i - 1) * 6 + j - 1] != undefined)
        return this.creditosTV["cast"][(i - 1) * 6 + j - 1]["character"];
      else return "";
    },
    getNumFilasE() {
      return Math.ceil(this.creditosTV["crew"].length / 6);
    },
    getFotoSerieE(i, j) {
      if (this.creditosTV["crew"][(i - 1) * 6 + j - 1] != undefined)
        return (
          "https://image.tmdb.org/t/p/original" +
          this.creditosTV["crew"][(i - 1) * 6 + j - 1]["poster_path"]
        );
      else return "";
    },
    getTituloSerieE(i, j) {
      if (this.creditosTV["crew"][(i - 1) * 6 + j - 1] != undefined)
        return this.creditosTV["crew"][(i - 1) * 6 + j - 1]["name"];
      else return "";
    },
    getIdSerieE(i, j) {
      if (this.creditosTV["crew"][(i - 1) * 6 + j - 1] != undefined)
        return this.creditosTV["crew"][(i - 1) * 6 + j - 1]["id"];
      else return "";
    },
    getRolE(i, j) {
      if (this.creditosTV["crew"][(i - 1) * 6 + j - 1] != undefined)
        return this.creditosTV["crew"][(i - 1) * 6 + j - 1]["job"];
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
.biografia {
  font-size: smaller;
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
  font-size: smaller;
}
</style>