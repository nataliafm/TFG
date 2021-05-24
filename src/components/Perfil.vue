<template>
  <div class="perfil">
    <div v-if="!datosObtenidos && !datosObtenidosFav">
      {{ obtenerDatosUsuario() }}
    </div>
    <b-container v-if="datosObtenidos && datosObtenidosFav && datosObtenidosListas">
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
        <b-col cols="8">
          <h3 align="left" v-if="renderEmp" class="mt-4">Series empezadas</h3>

          <b-pagination
            v-model="currentPageEmpezadas"
            :total-rows="getNumEmpezadas()"
            :per-page="perPage"
            aria-controls="empezadas"
            class="mt-2"
            v-if="renderEmp"
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
        </b-col>
        <b-col cols="4">
          <h3 align="left" class="mt-4">Listas</h3>

          <b-card-group deck>
            <b-card v-for="j in 3" :key="j" class="border-0">
              <b-card-img :src="getFotoLista(j)"></b-card-img>
              <div class="nombre">{{ getTituloLista(j) }}</div>
            </b-card>
          </b-card-group>

          <div align="left">
            <b-button href="/crearLista">Crear una nueva lista</b-button>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="8">
          <h3 align="left" class="mt-4" v-if="renderFav">Series favoritas</h3>
          <b-pagination
            v-model="currentPageFavoritas"
            :total-rows="getNumFavoritas()"
            :per-page="perPage"
            aria-controls="favoritas"
            class="mt-2"
            v-if="renderFav"
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
                  query: { id: getIdFavoritas(currentPagePendientes, j) },
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
      <b-row>
        <b-col cols="8">
          <h3 align="left" class="mt-4">Series pendientes</h3>

          <b-pagination
            v-model="currentPagePendientes"
            :total-rows="getNumPendientes()"
            :per-page="perPage"
            aria-controls="pendientes"
            class="mt-2"
            v-if="renderPend"
          ></b-pagination>
          <b-card-group id="pendientes">
            <b-card
              v-for="j in numElementosPendientes"
              :key="j"
              class="border-0"
            >
              <router-link
                :to="{
                  path: '/serie',
                  query: { id: getIdPendientes(currentPageFavoritas, j) },
                }"
              >
                <b-card-img
                  :src="getSeriePend(currentPagePendientes, j)"
                  :alt="getNombreSeriePend(currentPagePendientes, j)"
                ></b-card-img>
              </router-link>
              <b-container>
                <b-row cols="1" align-v="stretch">
                  <b-col>
                    <div class="nombre">
                      {{ getNombreSeriePend(currentPagePendientes, j) }}
                    </div>
                  </b-col>
                </b-row>
              </b-container>
            </b-card>
            <div v-if="seguir3">
              {{ getNumElementosPendientes() }}
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
      currentPagePendientes: 1,
      perPage: 6,
      numElementosPendientes: "",
      seriesP: [],
      renderPend: true,
      datosObtenidosPend: false,
      ultimas3Listas: [],
      datosObtenidosListas: false,
    };
  },
  methods: {
    getNumEmpezadas() {
      return this.datosUsuario.seriesEmpezadas.length;
    },
    getNumFavoritas() {
      return this.datosUsuario.seriesFavoritas.length;
    },
    getNumPendientes() {
      return this.datosUsuario.seriesPendientes.length;
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
      var idSeries = this.datosUsuario.seriesFavoritas;
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
    obtenerSeriePorIDPend(num) {
      themoviedb.tv.getById(
        { id: this.datosUsuario.seriesPendientes[num] },
        this.exito3,
        this.error1
      );
    },
    exito3(data) {
      console.log("Exito: ", data);
      var datos = JSON.parse(data);
      var series = JSON.parse(
        JSON.stringify(this.datosUsuario.seriesPendientes)
      );
      console.log(series);

      var llaves = series.keys();

      for (const i of llaves) {
        if (series[i] == datos["id"]) {
          this.seriesP[i] = {
            id: datos["id"],
            foto: datos["poster_path"],
            nombre: datos["name"],
          };
        }
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

            var listas = JSON.parse(
              JSON.stringify(_this.datosUsuario.listasSeries)
            );

            var ids3 = listas.slice(0, 3);

            for (var i = 0; i < ids3.length; i++) {
              const _i = i;
              
              db.collection("Listas").doc(ids3[_i])
                .get()
                .then((doc) => {
                  if (doc.exists) {
                    console.log("RESULTADO: ", doc.data());
                    _this.ultimas3Listas[_i] = JSON.parse(
                      JSON.stringify(doc.data())
                    );

                    if (_this.ultimas3Listas.length == ids3.length){
                      _this.datosObtenidosListas = true;
                    }
                  } else {
                    console.log("Document doesn't exist");
                  }
                })
                .catch((error) => {
                  console.log("Error getting document:", error);
                });
            }

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

            var seriesPend = JSON.parse(
              JSON.stringify(_this.datosUsuario.seriesPendientes)
            );
            if (seriesPend.length > 0) {
              /*
              for (
                var n = 0, j = 1;
                n < _this.datosUsuario.seriesPendientes.length;
                n += 6, j++
              ) {
                _this.paginasFavoritas.push(j);
              }
              */
              _this.contadorPendientes =
                _this.datosUsuario.seriesPendientes.length;
              _this.numElementosPendientes = Array.from(Array(6).keys());

              console.log(_this.datosUsuario.seriesPendientes);
              console.log(_this.datosUsuario.seriesPendientes[0]);

              var idSeriesP = _this.datosUsuario.seriesPendientes.keys();

              for (const key of idSeriesP) {
                _this.obtenerSeriePorIDPend(key);
              }
            } else {
              _this.renderPend = false;
              _this.datosObtenidosPend = true;
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
    getIdPendientes(i, j) {
      if (this.seriesP[(i - 1) * 6 + j] != undefined) {
        return this.seriesP[(i - 1) * 6 + j].id;
      } else return "";
    },
    getSeriePend(i, j) {
      if (this.seriesP[(i - 1) * 6 + j] != undefined) {
        var path = String(this.seriesP[(i - 1) * 6 + j].foto);
        return "https://image.tmdb.org/t/p/original" + path;
      } else {
        return "";
        //return "https://upload.wikimedia.org/wikipedia/commons/3/3b/Picture_Not_Yet_Available.png";
      }
    },
    getNombreSeriePend(i, j) {
      if (this.seriesP[(i - 1) * 6 + j] != undefined) {
        return this.seriesP[(i - 1) * 6 + j].nombre;
      } else return "";
    },
    getNumElementosPendientes() {
      this.contadorPendientes -= 6;

      if (this.contadorPendientes > 0 && this.contadorPendientes < 6)
        this.numElementosPendientes = Array.from(Array(6).keys());
      else if (this.contadorPendientes <= 0) {
        this.seguir2 = false;
      } else this.numElementosPendientes = Array.from(Array(6).keys());
    },
    getFotoLista(j) {
      if (this.ultimas3Listas[j-1] != undefined)
        return "https://image.tmdb.org/t/p/original" + this.ultimas3Listas[j-1].series[0].foto;
      else return "";
    },
    getTituloLista(j) {
      if (this.ultimas3Listas[j-1] != undefined)
        return this.ultimas3Listas[j-1].nombre;
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