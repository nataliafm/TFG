<template>
  <div class="serie">
    <div v-if="!obtenido1">
      {{ buscaSerie() }}
    </div>
    <div v-if="!obtenido2 && terminaCargar1">
      {{ obtenerCreadores() }}
    </div>

    <b-container
      :v-if="obtenido1 && obtenido2 && terminaCargar1 && terminaCargar2"
    >
      <b-row>
        <b-col cols="3">
          <div v-if="terminaCargar1">
            <b-img
              :src="getPoster()"
              :alt="getTitulo()"
              width="200px"
              class="poster"
            />
            <div class="proveedores">
              <b-button :href="providers['link']" class="enlaceStream"
                >Comprar / stream</b-button
              >
            </div>
          </div>
        </b-col>

        <b-col cols="7">
          <div class="descripcion">
            <h1 align="left">{{ resultado["name"] }}</h1>
            <p align="left">{{ resultado["overview"] }}</p>
          </div>
          <div
            class="creadoPor"
            v-if="terminaCargar1 && obtenido2 && terminaCargar2"
          >
            <h3 align="left">Creadores</h3>

            <b-carousel controls :interval="9999999" class="actores">
              <b-carousel-slide v-for="i in paginas" :key="i" >
                <template slot="img" v-for="j in numElementos">
                  <b-container :key="j" class="cards">
                    <b-col cols="1" class="columna">
                      <b-img :src="getCreador(i, j)" class="imgs"></b-img>
                      <div class="nombre">{{ getNombreCreador(i, j) }}</div>
                    </b-col>
                  </b-container>
                </template>
                <div v-if="seguir1">
                  {{getNumElementos()}}
                </div>
              </b-carousel-slide>
            </b-carousel>
          </div>
        </b-col>

        <b-col cols="2">
          <b-button-group vertical class="botones">
            <b-button class="boton">Añadir a series empezadas</b-button>
            <b-button class="boton">Añadir a series pendientes</b-button>
          </b-button-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="temporadas">
          <div
            class="creadoPor"
            v-if="terminaCargar1 && obtenido2 && terminaCargar2 && obtenido1"
          >
            <h3 align="left">Temporadas</h3>
            <b-carousel controls :interval="9999999" class="actores">
              <b-carousel-slide v-for="i in paginasTemporadas" :key="i" v-once>
                <template slot="img" v-for="j in numTemporada">
                  <b-container :key="j">
                    <b-col cols="1" class="columna2">
                      <b-img rounded width="150px" class="posterTemporada" :src="getPosterTemporada(i, j)"></b-img>
                      <div>{{ getNombreTemporada(i, j) }}</div>
                    </b-col>
                  </b-container>
                </template>
                <div v-if="seguir">
                  {{getNumTemporada()}}
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
import getUserLocales from "get-user-locale";

export default {
  name: "Serie",
  props: {},
  data() {
    return {
      obtenido1: false,
      resultado: "",
      providers: "",
      creadores: "",
      contador: 0,
      pathFotos: [],
      finLoop: false,
      terminaCargar1: false,
      obtenido2: false,
      terminaCargar2: false,
      paginas: [],
      paginasTemporadas: [],
      temporadas: [],
      contadorTemporadas: "",
      numTemporada: [],
      numElementos: [],
      seguir: true,
      seguir1: true,
    };
  },
  methods: {
    success1(data) {
      console.log("Success callback: " + data);
      this.resultado = JSON.parse(data);

      var aux = this.resultado["seasons"].length;
      var c = [];

      console.log(aux);

      for (var o = 0; o < aux; o++) {
        var res = this.resultado["seasons"][o];
        c.push(res);
      }

      this.temporadas = c;
      this.contadorTemporadas = aux;

      console.log(this.temporadas[1]["name"]);

      for (var m = 0, k = 1; m < this.temporadas.length; m += 5, k++) {
        this.paginasTemporadas.push(k);
      }

      console.log(this.paginasTemporadas[0]);

      if (this.contadorTemporadas >= 5) {
        this.numTemporada = Array.from(Array(5).keys());
      } else {
        this.numTemporada = Array.from(Array(this.contadorTemporadas).keys());
      }

      this.terminaCargar1 = true;
    },
    error1(data) {
      console.log("Error callback: " + data);
    },
    success2(data) {
      console.log("Success callback: " + data);
      var proveedores = JSON.parse(data);
      var userLocale = getUserLocales();

      this.providers = proveedores["results"][userLocale.toUpperCase()];
    },
    error2(data) {
      console.log("Error callback: " + data);
    },
    buscaSerie() {
      var _this = this;
      var id = _this.$route.query.id;

      this.getId(id).then((res) => {
        console.log("1" + res);
      });

      this.getProviders(id).then((res) => {
        console.log("2" + res);
      });

      this.obtenido1 = true;
    },
    obtenerCreadores() {
      this.setCreadores().then((res) => {
        console.log("3" + res);
      });
    },
    async getId(id) {
      themoviedb.tv.getById({ id: id }, this.success1, this.error1);
      return " hola";
    },
    async getProviders(id) {
      themoviedb.tv.getWatchProviders({ id: id }, this.success2, this.error2);
      return " hola";
    },
    getTitulo() {
      return this.resultado["name"];
    },
    getPoster() {
      return (
        "https://image.tmdb.org/t/p/original/" + this.resultado["poster_path"]
      );
    },
    getNumPaginas() {
      console.log("ekjrngkejrg " + (Math.floor(this.creadores.length / 7) + 1));
      if (this.finLoop) return String(0);
      else return String(Math.floor(this.creadores.length / 7) + 1);
    },
    getNumCreadores() {
      return this.creadores.length;
    },
    async setCreadores() {
      var aux = this.resultado["created_by"].length;
      var c = [];

      for (var o = 0; o < aux; o++) {
        var res = this.resultado["created_by"][o];
        c.push(res);
      }

      this.creadores = c;

      for (var m = 0, k = 1; m < this.creadores.length; m += 7, k++) {
        this.paginas.push(k);
      }

      for (var n = 0; n < this.creadores.length; n++) {
        this.getImagenes(this.creadores[n]["id"]).then((res) => {
          console.log("jdhfbdf" + res);
        });
      }

      this.contador = this.creadores.length;

      if (this.contador < 7) this.numElementos = Array.from(Array(aux).keys());
      else this.numElementos = Array.from(Array(7).keys());

      this.obtenido2 = true;
      return " hola";
    },
    async getImagenes(id) {
      console.log("dkjrgnhekrjg" + id);
      themoviedb.people.getImages({ id: id }, this.success3, this.error3);
      return " hola";
    },
    getNumElementos() {
      var aux = this.contador;
      this.contador -= 7;

      console.log("wgekjgekjr   " + aux);

      if (aux > 0 && aux < 7) this.numElementos = Array.from(Array(aux).keys());
      else if (aux <= 0) {
        this.finLoop = true;
        this.seguir1 = false;
      } else this.numElementos = Array.from(Array(7).keys());
    },
    getNumTemporada() {
      var aux = this.contadorTemporadas;
      this.contadorTemporadas -= 5;

      console.log("ekrjngekjrg    " + aux);
      if (aux > 0 && aux < 5)
      this.numTemporada = Array.from(Array(aux).keys());
      else if (aux <= 0) {
        this.seguir = false;
      } else this.numTemporada = Array.from(Array(5).keys());

      console.log("numTemporada " + this.numTemporada);
    },
    success3(data) {
      console.log("Success callback: " + data);
      var imagenes = JSON.parse(data);

      if (imagenes["profiles"].length > 0) {
        this.pathFotos.push(imagenes["profiles"][0]["file_path"]);
      } else {
        this.pathFotos.push("NODISPONIBLE");
      }

      if (this.pathFotos.length == this.creadores.length) {
        this.terminaCargar2 = true;
      }
    },
    error3(data) {
      console.log("Error callback: " + data);
    },
    getCreador(i, j) {
      var path = String(this.pathFotos[(i - 1) * 7 + j]);

      if (path != "NODISPONIBLE") {
        return (
          "https://image.tmdb.org/t/p/original" +
          String(this.pathFotos[(i - 1) * 7 + j])
        );
      } else {
        return "https://upload.wikimedia.org/wikipedia/commons/3/3b/Picture_Not_Yet_Available.png";
      }
    },
    acabarLoop() {},
    getNombreCreador(i, j) {
      return this.creadores[(i - 1) * 7 + j]["name"];
    },
    getPosterTemporada(i, j) {
      console.log(i - 1, j, (i - 1) * 5 + j);
      console.log(this.temporadas[(i - 1) * 5 + j]["poster_path"]);
      return (
        "https://image.tmdb.org/t/p/original" +
        String(this.temporadas[(i - 1) * 5 + j]["poster_path"])
      );
    },
    getNombreTemporada(i, j) {
      console.log(i - 1, j, (i - 1) * 5 + j, "fea");
      return this.temporadas[(i - 1) * 5 + j]["name"];
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
.descripcion {
  margin-top: 2em;
}
.botones {
  margin-left: 2em;
  margin-top: 2em;
}
.boton {
  margin-bottom: 1em;
}
.proveedores {
  margin-top: 2em;
  width: 200px;
  display: inline-block;
}
.enlaceStream {
  width: 200px;
  color: white;
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
.temporadas {
  margin-left: 2em;
}
.posterTemporada {
  float: left;
}
.columna2 {
  float: left;
  margin-left: 6em;
}
</style>