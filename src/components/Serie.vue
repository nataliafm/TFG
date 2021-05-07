<template>
  <div class="serie">
    <div v-if="!obtenido1">
      {{ buscaSerie() }}
    </div>
    <div v-if="!obtenido2 && terminaCargar1">
      {{ obtenerCreadores() }}
    </div>
    <div v-if="!capitulosObtenidos || tempGuardada != aniadirTemporada">
      {{ getCapitulos() }}
    </div>
    <div v-if="!serieComprobada">
      {{ comprobarSerie() }}
    </div>

    <b-container
      :v-if="obtenido1 && obtenido2 && terminaCargar1 && terminaCargar2"
    >
      <b-row>
        <b-col cols="3" class="mt-4">
          <div v-if="terminaCargar1">
            <b-img
              :src="getPoster()"
              :alt="getTitulo()"
              fluid-grow
              class="poster"
            />
            <div class="proveedores">
              <b-button :href="providers['link']" class="enlaceStream"
                >Comprar / stream</b-button
              >
            </div>
          </div>
        </b-col>

        <b-col cols="7" class="mt-4">
          <div class="descripcion">
            <h1 align="left">{{ resultado["name"] }}</h1>
            <p align="left">{{ resultado["overview"] }}</p>
          </div>
          <div
            class="creadoPor"
            v-if="terminaCargar1 && obtenido2 && terminaCargar2"
          >
            <h3 align="left">Creadores</h3>
            <b-pagination
              v-model="currentPage"
              :total-rows="getNumCreadores()"
              :per-page="perPage"
              aria-controls="creadores"
              class="mt-2"
            ></b-pagination>
            <b-card-group id="creadores">
              <b-card v-for="j in numElementos" :key="j" class="border-0">
                <b-card-img
                  :src="getCreador(currentPage, j)"
                  :alt="getNombreCreador(currentPage, j)"
                  class="fotoCreador"
                  v-if="getCreador(currentPage, j)"
                ></b-card-img>
                <!--
                <b-card-img
                  :src="getCreador(currentPage, j)"
                  :alt="getNombreCreador(currentPage, j)"
                  class="fotoCreador"
                  v-if="!getCreador(currentPage, j)"
                  blank
                ></b-card-img>
                -->
                <b-card-text class="nombre">{{
                  getNombreCreador(currentPage, j)
                }}</b-card-text>
              </b-card>
              <div v-if="seguir1">
                {{ getNumElementos() }}
              </div>
            </b-card-group>
          </div>
        </b-col>

        <b-col cols="2" class="mt-4">
          <b-button-group vertical class="botones" v-if="serieComprobada">
            <b-dropdown
              class="boton"
              text="Añadir a series empezadas"
              v-if="!serieEstaEmpezada"
            >
              <b-dropdown-form @submit.prevent="enviarSerie">
                <b-form-group
                  id="temporada"
                  label="Temporada: "
                  label-for="input-temporada"
                  description=""
                >
                  <b-form-input
                    v-model="aniadirTemporada"
                    list="temporadas"
                  ></b-form-input>
                  <datalist id="temporadas">
                    <option v-for="t in temporadas" :key="t">
                      {{ t.season_number }}
                    </option>
                  </datalist>
                </b-form-group>

                <b-form-group
                  id="capitulo"
                  label="Capítulo: "
                  label-for="input-capitulo"
                  description=""
                  v-if="aniadirTemporada != ''"
                >
                  <b-form-input
                    v-model="aniadirCapitulo"
                    list="capitulos"
                  ></b-form-input>
                  <datalist id="capitulos">
                    <option v-for="ca in capitulos" :key="ca">
                      {{ ca.episode_number }}
                    </option>
                  </datalist>
                </b-form-group>
                <b-button type="enviarSerie" variant="primary">Enviar</b-button>
              </b-dropdown-form>
            </b-dropdown>
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
              <b-container>
                <b-row class="fila">
                  <b-carousel-slide
                    v-for="i in paginasTemporadas"
                    :key="i"
                    v-once
                  >
                    <template slot="img" v-for="j in numTemporada">
                      <b-col cols="2" class="columna" :key="j">
                        <router-link
                          :to="{
                            path: '/temporada',
                            query: {
                              id: getIdTemporada(),
                              numero: getNumeroTemporada(i, j),
                              nombre: getTitulo(),
                            },
                          }"
                        >
                          <b-img
                            rounded
                            class="posterTemporada"
                            :src="getPosterTemporada(i, j)"
                            :alt="'Temporada ' + getNumeroTemporada(i, j)"
                            fluid-grow
                          ></b-img>
                        </router-link>
                        <div class="nombreTemporada">
                          {{ getNombreTemporada(i, j) }}
                        </div>
                      </b-col>
                    </template>
                    <div v-if="seguir">
                      {{ getNumTemporada() }}
                    </div>
                  </b-carousel-slide>
                </b-row>
              </b-container>
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
import firebase from "firebase";

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
      aniadirTemporada: "",
      aniadirCapitulo: "",
      capitulos: [],
      capitulosObtenidos: false,
      tempGuardada: "",
      serieEstaEmpezada: false,
      serieComprobada: false,
      perPage: 6,
      currentPage: 1,
    };
  },
  methods: {
    getIdTemporada() {
      var _this = this;
      return _this.$route.query.id;
    },
    getNumeroTemporada(i, j) {
      return this.temporadas[(i - 1) * 6 + j]["season_number"];
    },
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

      for (var m = 0, k = 1; m < this.temporadas.length; m += 6, k++) {
        this.paginasTemporadas.push(k);
      }

      console.log(this.paginasTemporadas[0]);

      if (this.contadorTemporadas >= 6) {
        this.numTemporada = Array.from(Array(6).keys());
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
      console.log("ekjrngkejrg " + (Math.floor(this.creadores.length / 6) + 1));
      if (this.finLoop) return String(0);
      else return String(Math.floor(this.creadores.length / 6) + 1);
    },
    getNumCreadores() {
      return this.creadores.length;
    },
    async setCreadores() {
      var aux = this.resultado["created_by"].length;
      var c = [];

      //var aaaa = this.resultado["created_by"][0];

      for (var o = 0; o < aux; o++) {
        var res = this.resultado["created_by"][o];
        c.push(res);
      }
/*
      c.push(aaaa);
      c.push(aaaa);
      c.push(aaaa);
      c.push(aaaa);
      c.push(aaaa);
      c.push(aaaa);
      c.push(aaaa);
*/
      this.creadores = c;

      for (var m = 0, k = 1; m < this.creadores.length; m += 6, k++) {
        this.paginas.push(k);
      }

      for (var n = 0; n < this.creadores.length; n++) {
        this.getImagenes(this.creadores[n]["id"]).then((res) => {
          console.log("jdhfbdf" + res);
        });
      }

      this.contador = this.creadores.length;

      if (this.contador < 6) this.numElementos = Array.from(Array(6).keys());
      else this.numElementos = Array.from(Array(6).keys());

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
      this.contador -= 6;

      console.log("wgekjgekjr   " + aux);

      if (aux > 0 && aux < 6) this.numElementos = Array.from(Array(6).keys());
      else if (aux <= 0) {
        this.finLoop = true;
        this.seguir1 = false;
      } else this.numElementos = Array.from(Array(6).keys());
    },
    getNumTemporada() {
      var aux = this.contadorTemporadas;
      this.contadorTemporadas -= 6;

      console.log("ekrjngekjrg    " + aux);
      if (aux > 0 && aux < 6) this.numTemporada = Array.from(Array(aux).keys());
      else if (aux <= 0) {
        this.seguir = false;
        if (this.resultado["seasons"].length >= 6) {
          this.numTemporada = Array.from(Array(6).keys());
        } else {
          this.numTemporada = Array.from(Array(this.contadorTemporadas).keys());
        }
      } else this.numTemporada = Array.from(Array(6).keys());

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
      var path = String(this.pathFotos[(i - 1) * 6 + j]);
      console.log(path);

      if (path != "NODISPONIBLE" && path != undefined) {
        return (
          "https://image.tmdb.org/t/p/original" +
          String(this.pathFotos[(i - 1) * 6 + j])
        );
      } else {
        return false;
        //return "https://upload.wikimedia.org/wikipedia/commons/3/3b/Picture_Not_Yet_Available.png";
      }
    },
    acabarLoop() {},
    getNombreCreador(i, j) {
      console.log("holiiiiiiiiiiii " + this.creadores[(i - 1) * 6 + j]);
      if (this.creadores[(i - 1) * 6 + j] != undefined) {
        return this.creadores[(i - 1) * 6 + j]["name"];
      } else {
        console.log("HIIIIII");
        return "";
      }
    },
    getPosterTemporada(i, j) {
      console.log(i - 1, j, (i - 1) * 6 + j);
      console.log(this.temporadas[(i - 1) * 6 + j]["poster_path"]);
      return (
        "https://image.tmdb.org/t/p/original" +
        String(this.temporadas[(i - 1) * 6 + j]["poster_path"])
      );
    },
    getNombreTemporada(i, j) {
      console.log(i - 1, j, (i - 1) * 6 + j, "fea");
      return this.temporadas[(i - 1) * 6 + j]["name"];
    },
    getCapitulos() {
      if (this.aniadirTemporada != "")
        themoviedb.tvSeasons.getById(
          { id: this.getIdTemporada(), season_number: this.aniadirTemporada },
          this.success4,
          this.error4
        );
    },
    success4(data) {
      console.log("Success callback: " + data);
      console.log("llega");

      var aux = JSON.parse(data);
      this.capitulos = aux["episodes"];
      this.capitulosObtenidos = true;
      this.tempGuardada = this.aniadirTemporada;
    },
    error4(data) {
      console.log("Error callback: " + data);
    },
    enviarSerie() {
      var db = firebase.firestore();
      var ident = firebase.auth().currentUser.uid;
      console.log(this.aniadirTemporada, this.aniadirCapitulo);
      var id = this.getIdTemporada();

      var serie = {};
      serie[id] = { temp: this.aniadirTemporada, cap: this.aniadirCapitulo };

      db.collection("Usuario")
        .doc(ident)
        .set(
          {
            seriesEmpezadas: firebase.firestore.FieldValue.arrayUnion(serie),
          },
          { merge: true }
        )
        .then(function () {
          console.log("Operación realizada correctamente");
        })
        .catch(function (error) {
          console.log("Error writing document: ", error);
        });
    },
    comprobarSerie() {
      var _this = this;
      var ident = firebase.auth().currentUser.uid;
      var db = firebase.firestore();
      var ref = db.collection("Usuario").doc(ident);

      ref
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log("Document data:", doc.data());
            var datosUsuario = JSON.parse(JSON.stringify(doc.data()));

            var empezadas = datosUsuario.seriesEmpezadas;
            console.log(empezadas);

            for (var i = 0; i < empezadas.length; i++) {
              if (Object.keys(empezadas[i])[0] == _this.getIdTemporada()) {
                _this.serieEstaEmpezada = true;
              }
            }

            _this.serieComprobada = true;
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
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
.boton {
  margin-bottom: 1em;
}

.proveedores {
  margin-top: 2em;
  width: 100%;
  display: inline-block;
}
.enlaceStream {
  width: 100%;
  color: white;
}
.columna {
  float: left;
}
h1 {
  font-weight: bolder;
}
h3 {
  font-weight: bold;
}
.fila {
  margin: auto;
}
.nombreTemporada {
  margin-top: 1em;
  color: #4b4453;
  font-weight: bold;
  font-size: small;
}
.nombre {
  margin-top: 1em;
  color: #4b4453;
  font-size: small;
}
.posterTemporada {
  max-height: 200px;
}
.card {
  color: rgb(0, 0, 0);
  border: none;
}
</style>