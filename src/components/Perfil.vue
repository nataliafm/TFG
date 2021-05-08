<template>
  <div class="perfil">
    <div v-if="!datosObtenidos && !datosObtenidosFav">
      {{ obtenerDatosUsuario() }}
    </div>
    <b-container v-if="datosObtenidos && datosObtenidosFav">
      <b-row cols="3" align-v="stretch">
        <b-col cols="2" class="mt-4">
          <b-img rounded="circle" fluid :src="getURLperfil()"></b-img>
        </b-col>
        <b-col cols="8" class="mt-4">
          <h1 class="username">{{ getUsername() }}</h1>
          <h3 class="username">{{ getNombre() }}, {{ getPais() }}</h3>
          <p class="username">{{ getDescripcion() }}</p>
        </b-col>
        <b-col cols="2" class="mt-4">
          <b-button href="/editarPerfil">Editar perfil</b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2"></b-col>
        <b-col cols="8">
          <h3 align="left" v-if="renderEmp">Series empezadas</h3>

          <b-pagination
            v-model="currentPageEmpezadas"
            :total-rows="getNumEmpezadas()"
            :per-page="perPage"
            aria-controls="empezadas"
            class="mt-2"
          ></b-pagination>
          <b-card-group id="empezadas">
            <b-card
              v-for="j in numElementosEmpezadas"
              :key="j"
              class="border-0"
            >
              <router-link
                :to="{
                  name: 'episodio',
                  query: {
                    id: getIdSerie(currentPageEmpezadas, j),
                    nombre: getNombreSerie(currentPageEmpezadas, j),
                    temp: getNumeroTemporada(currentPageEmpezadas, j),
                    num: getNumCapitulo(currentPageEmpezadas, j),
                  },
                  params: { pathPoster: getSerie(currentPageEmpezadas, j) },
                }"
              >
                <b-card-img
                  :src="getSerie(currentPageEmpezadas, j)"
                  :alt="getNombreSerie(currentPageEmpezadas, j)"
                ></b-card-img>
              </router-link>
              <b-container>
                <b-row cols="1" align-v="stretch">
                  <b-col class="align-items-center h-100">
                    <div class="nombre h-100 d-inline-block">
                      {{ getNombreSerie(currentPageEmpezadas, j) }}
                    </div>
                    <div class="rol h-100 d-inline-block">
                      {{ getTemporada(currentPageEmpezadas, j) }}
                    </div>
                  </b-col>
                </b-row>
              </b-container>
            </b-card>
            <div v-if="seguir1">
              {{ getNumElementosEmpezadas() }}
            </div>
          </b-card-group>
          
          <h3 align="left" class="mt-4">Series favoritas</h3>

          <b-pagination
            v-model="currentPageFavoritas"
            :total-rows="getNumFavoritas()"
            :per-page="perPage"
            aria-controls="favoritas"
            class="mt-2"
          ></b-pagination>
          <b-card-group id="favoritas">
            <b-card
              v-for="j in numElementosFavoritas"
              :key="j"
              class="border-0"
            >
              <router-link
                :to="{
                  path: '/serie',
                  query: { id: getIdFavoritas(currentPageFavoritas, j) },
                }"
              >
                <b-card-img
                  :src="getSerieFav(currentPageFavoritas, j)"
                  :alt="getNombreSerieFav(currentPageFavoritas, j)"
                ></b-card-img>
              </router-link>
              <b-container>
                <b-row cols="1" align-v="stretch">
                  <b-col>
                    <div class="nombre">
                      {{ getNombreSerieFav(currentPageFavoritas, j) }}
                    </div>
                  </b-col>
                </b-row>
              </b-container>
            </b-card>
            <div v-if="seguir2">
              {{ getNumElementosFavoritas() }}
            </div>
          </b-card-group>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import firebase from "firebase";
import themoviedb from "themoviedb-javascript-library";

export default {
  name: "Perfil",
  props: {},
  data() {
    return {
      datosObtenidos: false,
      datosUsuario: "",
      paginasEmpezadas: [],
      numElementosEmpezadas: "",
      seguir1: true,
      seriesE: [],
      contadorEmpezadas: "",
      seguir2: true,
      paginasFavoritas: [],
      numElementosFavoritas: "",
      seriesF: [],
      contadorFavoritas: "",
      datosObtenidosFav: false,
      renderFav: true,
      renderEmp: true,
      currentPageEmpezadas: 1,
      currentPageFavoritas: 1,
      perPage: 6,
    };
  },
  methods: {
    getNumEmpezadas() {
      return this.datosUsuario.seriesEmpezadas.length;
    },
    getNumFavoritas() {
      return this.datosUsuario.seriesFavoritas.length;
    },
    obtenerSeriePorID(num) {
      console.log(num);
      var idSeries = this.datosUsuario.seriesEmpezadas;
      var parsedobj = JSON.parse(JSON.stringify(idSeries));

      themoviedb.tv.getById(
        { id: Object.keys(parsedobj[num])[0] },
        this.exito1,
        this.error1
      );
    },
    exito1(data) {
      console.log("Exito: ", data);
      var datos = JSON.parse(data);
      var series = JSON.parse(
        JSON.stringify(this.datosUsuario.seriesEmpezadas)
      );

      var llaves = series.keys();

      for (const i of llaves) {
        if (Object.keys(series[i])[0] == datos["id"]) {
          this.seriesE[i] = {
            id: datos["id"],
            foto: datos["poster_path"],
            nombre: datos["name"],
            temp: series[i][datos["id"]]["temp"],
            cap: series[i][datos["id"]]["cap"],
          };
        }
      }

      if (this.seriesE.length == this.datosUsuario.seriesEmpezadas.length) {
        this.datosObtenidos = true;
      }
    },
    error1(data) {
      console.log("Error: ", data);
    },
    obtenerSeriePorIDFav(num) {
      console.log(num);
      var idSeries = this.datosUsuario.seriesFavoritas;
      console.log(this.datosUsuario.seriesFavoritas);
      var parsedobj = JSON.parse(JSON.stringify(idSeries));

      themoviedb.tv.getById(
        { id: Object.keys(parsedobj[num])[0] },
        this.exito2,
        this.error1
      );
    },
    exito2(data) {
      console.log("Exito: ", data);
      var datos = JSON.parse(data);
      var series = JSON.parse(
        JSON.stringify(this.datosUsuario.seriesFavoritas)
      );

      var llaves = series.keys();

      for (const i of llaves) {
        if (Object.keys(series[i])[0] == datos["id"]) {
          this.seriesF[i] = {
            id: datos["id"],
            foto: datos["poster_path"],
            nombre: datos["name"],
          };
        }
      }

      if (this.seriesF.length == this.datosUsuario.seriesFavoritas.length) {
        this.datosObtenidosFav = true;
      }
    },
    obtenerDatosUsuario() {
      var _this = this;
      var ident = firebase.auth().currentUser.uid;
      var db = firebase.firestore();
      var ref = db.collection("Usuario").doc(ident);

      ref
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log("Document data:", doc.data());
            _this.datosUsuario = doc.data();

            var seriesEmp = JSON.parse(
              JSON.stringify(_this.datosUsuario.seriesEmpezadas)
            );
            if (seriesEmp.length > 0) {
              for (
                var m = 0, k = 1;
                m < _this.datosUsuario.seriesEmpezadas.length;
                m += 6, k++
              ) {
                _this.paginasEmpezadas.push(k);
              }

              _this.contadorEmpezadas =
                _this.datosUsuario.seriesEmpezadas.length;

              if (_this.contadorEmpezadas < 6)
                _this.numElementosEmpezadas = Array.from(Array(6).keys());
              else _this.numElementosEmpezadas = Array.from(Array(6).keys());

              var idSeries = _this.datosUsuario.seriesEmpezadas.keys();

              for (const key of idSeries) {
                _this.obtenerSeriePorID(key);
              }
            } else {
              _this.renderEmp = false;
              _this.datosObtenidos = true;
            }

            var seriesFav = JSON.parse(
              JSON.stringify(_this.datosUsuario.seriesFavoritas)
            );
            if (seriesFav.length > 0) {
              for (
                var n = 0, j = 1;
                n < _this.datosUsuario.seriesFavoritas.length;
                n += 6, j++
              ) {
                _this.paginasFavoritas.push(j);
              }

              _this.contadorFavoritas =
                _this.datosUsuario.seriesFavoritas.length;

              if (_this.contadorFavoritas < 6)
                _this.numElementosFavoritas = Array.from(Array(6).keys());
              else _this.numElementosFavoritas = Array.from(Array(6).keys());

              var idSeriesF = _this.datosUsuario.seriesFavoritas.keys();

              for (const key of idSeriesF) {
                _this.obtenerSeriePorIDFav(key);
              }
            } else {
              _this.renderFav = false;
              _this.datosObtenidosFav = true;
            }
          } else {
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    },
    getURLperfil() {
      return this.datosUsuario.fotoPerfil;
    },
    getUsername() {
      return this.datosUsuario.username;
    },
    getNombre() {
      return this.datosUsuario.nombre;
    },
    getPais() {
      return this.datosUsuario.pais;
    },
    getDescripcion() {
      return this.datosUsuario.descripcion;
    },
    getSerie(i, j) {
      if (this.seriesE[(i - 1) * 6 + j] != undefined) {
        var path = String(this.seriesE[(i - 1) * 6 + j].foto);
        return "https://image.tmdb.org/t/p/original" + path;
      } else {
        return "";
        //return "https://upload.wikimedia.org/wikipedia/commons/3/3b/Picture_Not_Yet_Available.png";
      }
    },
    getNombreSerie(i, j) {
      if (this.seriesE[(i - 1) * 6 + j] != undefined)
        return this.seriesE[(i - 1) * 6 + j].nombre;
      else return "";
    },
    getTemporada(i, j) {
      if (this.seriesE[(i - 1) * 6 + j] != undefined)
        return (
          "Temporada " +
          this.seriesE[(i - 1) * 6 + j].temp +
          ", Capítulo " +
          this.seriesE[(i - 1) * 6 + j].cap
        );
      else return "";
    },
    getNumElementosEmpezadas() {
      this.contadorEmpezadas -= 6;

      if (this.contadorEmpezadas > 0 && this.contadorEmpezadas < 6)
        this.numElementosEmpezadas = Array.from(Array(6).keys());
      else if (this.contadorEmpezadas <= 0) {
        this.seguir1 = false;
      } else this.numElementosEmpezadas = Array.from(Array(6).keys());
    },
    getIdSerie(i, j) {
      if (this.seriesE[(i - 1) * 6 + j] != undefined)
        return this.seriesE[(i - 1) * 6 + j].id;
      else return "";
    },
    getNumeroTemporada(i, j) {
      if (this.seriesE[(i - 1) * 6 + j] != undefined)
        return this.seriesE[(i - 1) * 6 + j].temp;
      else return "";
    },
    getNumCapitulo(i, j) {
      if (this.seriesE[(i - 1) * 6 + j] != undefined)
        return this.seriesE[(i - 1) * 6 + j].cap;
      else return "";
    },

    getSerieFav(i, j) {
      if (this.seriesF[(i - 1) * 6 + j] != undefined) {
        var path = String(this.seriesF[(i - 1) * 6 + j].foto);
        return "https://image.tmdb.org/t/p/original" + path;
      } else {
        return "";
        //return "https://upload.wikimedia.org/wikipedia/commons/3/3b/Picture_Not_Yet_Available.png";
      }
    },
    getNombreSerieFav(i, j) {
      if (this.seriesF[(i - 1) * 6 + j] != undefined) {
        return this.seriesF[(i - 1) * 6 + j].nombre;
      } else return "";
    },
    getNumElementosFavoritas() {
      this.contadorFavoritas -= 6;

      if (this.contadorFavoritas > 0 && this.contadorFavoritas < 6)
        this.numElementosFavoritas = Array.from(Array(6).keys());
      else if (this.contadorFavoritas <= 0) {
        this.seguir2 = false;
      } else this.numElementosFavoritas = Array.from(Array(6).keys());
    },
    getIdFavoritas(i, j) {
      if (this.seriesF[(i - 1) * 6 + j] != undefined) {
        return this.seriesF[(i - 1) * 6 + j].id;
      } else return "";
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
.username {
  text-align: left;
}
h3 {
  margin: 0;
  font-weight: bold;
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
.actores {
  margin-top: 1em;
}
</style>