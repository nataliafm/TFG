<template>
  <div class="perfil">
    <div
      v-if="
        !datosObtenidos ||
        !datosObtenidosFav ||
        !datosObtenidosListas ||
        !datosObtenidosPend ||
        !datosObtenidosAmigos
      "
    >
      {{ obtenerDatosUsuario() }}
    </div>
    <b-container
      v-if="
        datosObtenidos &&
        datosObtenidosFav &&
        datosObtenidosListas &&
        datosObtenidosPend &&
        datosObtenidosAmigos
      "
    >
      <b-row cols="3" align-v="stretch">
        <b-col cols="2" class="mt-4">
          <b-img
            rounded="circle"
            fluid
            :src="getURLperfil()"
            :alt="datosUsuario.alternativo"
          ></b-img>
        </b-col>
        <b-col cols="8" class="mt-4">
          <h1 class="username">{{ getUsername() }}</h1>
          <h3 class="username">{{ getNombre() }}, {{ getPais() }}</h3>
          <p class="username">{{ getDescripcion() }}</p>
        </b-col>
        <b-col cols="2" class="mt-4">
          <b-button v-if="perfilPropio" href="/editarPerfil"
            ><b-icon-pencil></b-icon-pencil> Editar perfil</b-button
          >
          <b-button v-else-if="!esAmigo" v-on:click="aniadirAmigo()">
            Añadir amigo</b-button
          >
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
            :key="getKey()"
          ></b-pagination>
          <b-card-group id="empezadas" :key="getKey()">
            <b-card
              v-for="j in Array(getPerPage()).keys()"
              :key="j"
              class="border-0"
              deck
            >
              <b-button
                v-if="
                  getNombreSerie(currentPageEmpezadas, j) != '' && perfilPropio
                "
                class="botonQuitar mb-2"
                size="sm"
                v-on:click="siguienteCapitulo(currentPageEmpezadas, j)"
                ><b-icon-check2></b-icon-check2> Visto</b-button
              >
              <b-button
                v-if="
                  getNombreSerie(currentPageEmpezadas, j) != '' && perfilPropio
                "
                class="botonQuitar mb-2"
                size="sm"
                v-on:click="eliminarEmpezadas(currentPageEmpezadas, j)"
                >Eliminar</b-button
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
              <b-card-text class="nombre">
                {{ getNombreSerie(currentPageEmpezadas, j) }}
              </b-card-text>
              <b-card-text class="rol">
                {{ getTemporada(currentPageEmpezadas, j) }}
              </b-card-text>
            </b-card>
            <div v-if="seguir1">
              {{ getNumElementosEmpezadas() }}
            </div>
          </b-card-group>
        </b-col>
        <b-col cols="4">
          <h3 align="left" class="mt-4">Listas</h3>

          <b-pagination
            v-model="currentPageListas"
            :total-rows="getNumListas()"
            :per-page="perPageLista"
            aria-controls="listas"
            class="mt-2"
            v-if="renderListas"
            :key="getKey()"
          ></b-pagination>
          <b-card-group deck v-if="renderListas" id="listas" :key="getKey()">
            <b-card
              v-for="j in Array(getPerPageLista()).keys()"
              :key="j"
              class="border-0"
            >
              <router-link
                :to="{
                  path: '/paginaLista',
                  query: { id: getIdLista(currentPageListas, j) },
                }"
              >
                <b-card-img
                  :src="getFotoLista(currentPageListas, j)"
                  :alt="getTituloLista(currentPageListas, j)"
                ></b-card-img>
              </router-link>
              <b-card-text class="nombre">
                {{ getTituloLista(currentPageListas, j) }}
              </b-card-text>
            </b-card>
          </b-card-group>

          <div align="left" class="mt-4">
            <b-button href="/crearLista" v-if="perfilPropio"
              ><b-icon-plus></b-icon-plus> Crear una nueva lista</b-button
            >
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
            :key="getKey()"
          ></b-pagination>
          <b-card-group id="favoritas" :key="getKey()">
            <b-card
              v-for="j in Array(getPerPage()).keys()"
              :key="j"
              class="border-0"
              deck
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
              <b-card-text class="nombre">
                {{ getNombreSerieFav(currentPageFavoritas, j) }}
              </b-card-text>
            </b-card>
            <div v-if="seguir2">
              {{ getNumElementosFavoritas() }}
            </div>
          </b-card-group>
        </b-col>
        <b-col cols="4" v-if="renderAmigos">
          <h3 align="left" class="mt-4">Amigos</h3>
          <span>
            <b-avatar-group
              overlap="0"
              v-for="i in Array(getNumFilasAmigos()).keys()"
              :key="i"
              size="44px"
            >
              <div v-for="j in Array(getPerPage()).keys()" :key="j">
                <b-avatar
                  :src="getAmigoFoto(i, j)"
                  :alt="getAmigoFotoTexto(i, j)"
                  :to="{
                    path: '/perfil',
                    query: { id: getIdAmigo(i, j) },
                  }"
                  v-if="getIdAmigo(i, j) != ''"
                  class="mr-2 mb-2"
                ></b-avatar>
              </div>
            </b-avatar-group>
          </span>

          <h3 class="mt-4" align="left" aria-describedby="static-text" tabindex="0">
            Estadísticas de puntuación
          </h3>
          <span id="static-text" style="display: none">{{ leerNotas() }}</span>
          <bar-chart :chartdata="datos" :options="options" :height="300" />
          <div>Nota media: {{ getNotaMedia() }}</div>
          <b-form-rating
            v-model="notaMedia"
            class="border-0"
            stars="10"
            readonly
          ></b-form-rating>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="8">
          <h3 align="left" class="mt-4">Series pendientes</h3>

          <b-pagination
            v-model="currentPagePendientes"
            :total-rows="getNumPendientes()"
            :per-page="getPerPage()"
            aria-controls="pendientes"
            class="mt-2"
            v-if="renderPend"
            :key="getKey()"
          ></b-pagination>
          <b-card-group id="pendientes" :key="getKey()">
            <b-card
              v-for="j in Array(getPerPage()).keys()"
              :key="j"
              class="border-0"
              deck
            >
              <router-link
                :to="{
                  path: '/serie',
                  query: { id: getIdPendientes(currentPagePendientes, j) },
                }"
              >
                <b-card-img
                  :src="getSeriePend(currentPagePendientes, j)"
                  :alt="getNombreSeriePend(currentPagePendientes, j)"
                ></b-card-img>
              </router-link>
              <b-card-text class="nombre">
                {{ getNombreSeriePend(currentPagePendientes, j) }}
              </b-card-text>
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
      currentPageListas: 1,
      perPage: 6,
      numElementosPendientes: "",
      seriesP: [],
      renderPend: true,
      datosObtenidosPend: false,
      ultimas3Listas: [],
      datosObtenidosListas: false,
      renderListas: true,
      idsListas: "",
      listas: [],
      seguir3: true,
      llave: true,
      perPageLista: 3,
      serieMarcadaVista: "",
      serieMarcadaVistaTemp: "",
      perfilPropio: false,
      esAmigo: false,
      idsAmigos: [],
      amigos: [],
      datosObtenidosAmigos: false,
      renderAmigos: true,
      notas: [],
      notaMedia: 0.0,
      datos: {
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        datasets: [
          {
            label: "Número de votos",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: [
              "rgba(75, 68, 83, 1)",
              "rgba(75, 68, 83, 1)",
              "rgba(75, 68, 83, 1)",
              "rgba(75, 68, 83, 1)",
              "rgba(75, 68, 83, 1)",
              "rgba(75, 68, 83, 1)",
              "rgba(75, 68, 83, 1)",
              "rgba(75, 68, 83, 1)",
              "rgba(75, 68, 83, 1)",
              "rgba(75, 68, 83, 1)",
            ],
            borderColor: [
              "rgba(75, 68, 83, 1)",
              "rgba(75, 68, 83, 1)",
              "rgba(75, 68, 83, 1)",
              "rgba(75, 68, 83, 1)",
              "rgba(75, 68, 83, 1)",
              "rgba(75, 68, 83, 1)",
              "rgba(75, 68, 83, 1)",
              "rgba(75, 68, 83, 1)",
              "rgba(75, 68, 83, 1)",
              "rgba(75, 68, 83, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                stepSize: 1,
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    };
  },
  created() {
    window.addEventListener("resize", this.myEventHandler);
  },
  destroyed() {
    window.removeEventListener("resize", this.myEventHandler);
  },
  watch: {
    "$route.query.id": {
      handler: function (id) {
        console.log(id);
        this.datosObtenidos = false;
        this.datosObtenidosFav = false;
        this.datosObtenidosListas = false;
        this.datosObtenidosPend = false;
        this.datosObtenidosAmigos = false;
        this.renderFav = true;
        this.renderEmp = true;
        this.renderListas = true;
        this.renderPend = true;
        this.renderAmigos = true;
        this.seriesE = [];
        this.seriesP = [];
        this.seriesF = [];
        this.perfilPropio = false;
        this.esAmigo = false;
        this.notas = [];
        this.datos.datasets[0].data = [];
      },
      deep: true,
      immediate: true,
    },
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
    getNumListas() {
      return this.datosUsuario.listasSeries.length;
    },
    obtenerSeriePorID(num) {
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

      if (this.seriesP.length == this.datosUsuario.seriesPendientes.length) {
        this.datosObtenidosPend = true;
      }
    },
    obtenerListaPorID(num) {
      var _this = this;
      var db = firebase.firestore();

      db.collection("Listas")
        .doc(_this.idsListas[num])
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log("RESULTADO: ", doc.data());
            _this.listas[num] = JSON.parse(JSON.stringify(doc.data()));

            if (_this.listas.length == _this.idsListas.length) {
              _this.datosObtenidosListas = true;
            }
          } else {
            console.log("Document doesn't exist");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    },
    obtenerAmigoPorID(num) {
      var _this = this;
      var db = firebase.firestore();

      db.collection("Usuario")
        .doc(_this.idsAmigos[num])
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log("RESULTADO: ", doc.data());
            _this.amigos[num] = [doc.data().fotoPerfil, doc.data().username];

            if (_this.amigos.length == _this.idsAmigos.length) {
              _this.datosObtenidosAmigos = true;
            }
          } else {
            console.log("Document doesn't exist");
          }
        });
    },
    obtenerDatosUsuario() {
      var _this = this;
      var ident = this.getIdUsuario();
      var db = firebase.firestore();
      var ref = db.collection("Usuario").doc(ident);

      if (ident == firebase.auth().currentUser.uid) {
        this.perfilPropio = true;
      } else {
        var idPropio = firebase.auth().currentUser.uid;
        var refPropio = db.collection("Usuario").doc(idPropio);

        refPropio
          .get()
          .then((doc) => {
            if (doc.exists) {
              console.log("Document data:", doc.data());
              var amigos = doc.data().amigos;

              if (amigos.includes(ident)) {
                this.esAmigo = true;
              }
            } else {
              console.log("El documento no existe");
            }
          })
          .catch((error) => {
            console.log("Error getting document:", error);
          });
      }

      ref
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log("Document data: ", doc.data());
            _this.datosUsuario = doc.data();
            _this.notas = _this.datosUsuario.notas;

            for (const l of Object.keys(_this.notas)) {
              _this.datos.datasets[0].data[l - 1] = _this.notas[l];
            }

            var amigos = JSON.parse(JSON.stringify(_this.datosUsuario.amigos));

            if (amigos.length > 0) {
              _this.idsAmigos = amigos;

              for (const key of _this.idsAmigos.keys()) {
                _this.obtenerAmigoPorID(key);
              }
            } else {
              _this.renderAmigos = false;
              _this.datosObtenidosAmigos = true;
            }

            var listas = JSON.parse(
              JSON.stringify(_this.datosUsuario.listasSeries)
            );

            if (listas.length > 0) {
              _this.idsListas = listas;

              for (const key of _this.idsListas.keys()) {
                _this.obtenerListaPorID(key);
              }
            } else {
              _this.renderListas = false;
              _this.datosObtenidosListas = true;
            }

            var seriesEmp = JSON.parse(
              JSON.stringify(_this.datosUsuario.seriesEmpezadas)
            );
            if (seriesEmp.length > 0) {
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
              _this.contadorPendientes =
                _this.datosUsuario.seriesPendientes.length;
              _this.numElementosPendientes = Array.from(Array(6).keys());

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
      if (this.seriesE[(i - 1) * this.perPage + j] != undefined) {
        var path = String(this.seriesE[(i - 1) * this.perPage + j].foto);
        return "https://image.tmdb.org/t/p/original" + path;
      } else {
        return "";
      }
    },
    getNombreSerie(i, j) {
      if (this.seriesE[(i - 1) * this.perPage + j] != undefined)
        return this.seriesE[(i - 1) * this.perPage + j].nombre;
      else return "";
    },
    getTemporada(i, j) {
      if (this.seriesE[(i - 1) * this.perPage + j] != undefined)
        return (
          "Temporada " +
          this.seriesE[(i - 1) * this.perPage + j].temp +
          ", Capítulo " +
          this.seriesE[(i - 1) * this.perPage + j].cap
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
      if (this.seriesE[(i - 1) * this.perPage + j] != undefined)
        return this.seriesE[(i - 1) * this.perPage + j].id;
      else return "";
    },
    getNumeroTemporada(i, j) {
      if (this.seriesE[(i - 1) * this.perPage + j] != undefined)
        return this.seriesE[(i - 1) * this.perPage + j].temp;
      else return "";
    },
    getNumCapitulo(i, j) {
      if (this.seriesE[(i - 1) * this.perPage + j] != undefined)
        return this.seriesE[(i - 1) * this.perPage + j].cap;
      else return "";
    },

    getSerieFav(i, j) {
      if (this.seriesF[(i - 1) * this.perPage + j] != undefined) {
        var path = String(this.seriesF[(i - 1) * this.perPage + j].foto);
        return "https://image.tmdb.org/t/p/original" + path;
      } else {
        return "";
      }
    },
    getNombreSerieFav(i, j) {
      if (this.seriesF[(i - 1) * this.perPage + j] != undefined) {
        return this.seriesF[(i - 1) * this.perPage + j].nombre;
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
      if (this.seriesF[(i - 1) * this.perPage + j] != undefined) {
        return this.seriesF[(i - 1) * this.perPage + j].id;
      } else return "";
    },
    getIdPendientes(i, j) {
      if (this.seriesP[(i - 1) * this.perPage + j] != undefined) {
        return this.seriesP[(i - 1) * this.perPage + j].id;
      } else return "";
    },
    getSeriePend(i, j) {
      if (this.seriesP[(i - 1) * this.perPage + j] != undefined) {
        var path = String(this.seriesP[(i - 1) * this.perPage + j].foto);
        return "https://image.tmdb.org/t/p/original" + path;
      } else {
        return "";
      }
    },
    getNombreSeriePend(i, j) {
      if (this.seriesP[(i - 1) * this.perPage + j] != undefined) {
        return this.seriesP[(i - 1) * this.perPage + j].nombre;
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
    getFotoLista(i, j) {
      if (this.listas[(i - 1) * this.perPageLista + j] != undefined)
        return (
          "https://image.tmdb.org/t/p/original" +
          this.listas[(i - 1) * this.perPageLista + j].series[0].foto
        );
      else return "";
    },
    getTituloLista(i, j) {
      if (this.listas[(i - 1) * this.perPageLista + j] != undefined)
        return this.listas[(i - 1) * this.perPageLista + j].nombre;
      else return "";
    },
    getIdLista(i, j) {
      if (this.idsListas[(i - 1) * this.perPageLista + j] != undefined)
        return this.idsListas[(i - 1) * this.perPageLista + j];
      else return "";
    },
    myEventHandler(e) {
      if (e.target.innerWidth < 580) {
        this.perPage = 2;
        this.perPageLista = 2;
      } else if (e.target.innerWidth > 580 && e.target.innerWidth < 1200) {
        this.perPage = 3;
        this.perPageLista = 2;
      } else {
        this.perPage = 6;
        this.perPageLista = 3;
      }

      this.llave = !this.llave;
    },
    getKey() {
      return this.llave;
    },
    getPerPage() {
      return this.perPage;
    },
    getPerPageLista() {
      return this.perPageLista;
    },
    siguienteCapitulo(i, j) {
      var idSerie = this.getIdSerie(i, j);
      var temp = this.getNumeroTemporada(i, j);
      var num = this.getNumCapitulo(i, j);
      this.serieMarcadaVista = idSerie;
      this.serieMarcadaVistaTemp = temp;

      var db = firebase.firestore();
      var ident = this.getIdUsuario();

      var ultimoCap = [idSerie, temp, num];

      db.collection("Usuario")
        .doc(ident)
        .update({
          ultimoCap: ultimoCap,
        })
        .then((data) => {
          console.log("Operación realizada con éxito: ", data);

          //comprobar si existe el siguiente capítulo en la misma temporada
          themoviedb.tvEpisodes.getById(
            {
              id: idSerie,
              season_number: temp,
              episode_number: Number(num) + 1,
            },
            this.exitoSig1,
            this.errorSig1
          );
        })
        .catch((error) => {
          console.log("Error: ", error);
        });
    },
    exitoSig1(data) {
      console.log("Existe capitulo en la misma temporada");
      //existe un siguiente capítulo en la misma temporada --> se modifica en la base de datos
      var datos = JSON.parse(data);
      var Ltemp = datos["season_number"];
      var Lnum = datos["episode_number"];
      var series = JSON.parse(
        JSON.stringify(this.datosUsuario.seriesEmpezadas)
      );

      var llaves = series.keys();

      for (const i of llaves) {
        if (Object.keys(series[i])[0] == this.serieMarcadaVista) {
          var empezadasUpdated = series;
          empezadasUpdated[i][this.serieMarcadaVista] = {
            cap: Lnum,
            temp: Ltemp,
          };

          var db = firebase.firestore();
          var ident = this.getIdUsuario();
          var _this = this;

          db.collection("Usuario")
            .doc(ident)
            .set(
              {
                seriesEmpezadas: empezadasUpdated,
              },
              { merge: true }
            )
            .then(function () {
              console.log("Operación realizada correctamente");
              _this.$router.go(0);
            })
            .catch(function (error) {
              console.log("Error writing document: ", error);
            });
        }
      }
    },
    errorSig1(data) {
      console.log("No existe capitulo en la misma temporada");
      //no existe un siguiente capítulo en la misma temporada --> se comprueba si existe la temporada siguiente
      console.log("Error: ", data);
      var temp = this.serieMarcadaVistaTemp;

      themoviedb.tvEpisodes.getById(
        {
          id: this.serieMarcadaVista,
          season_number: Number(temp) + 1,
          episode_number: 1,
        },
        this.exitoSig2,
        this.errorSig2
      );
    },
    exitoSig2(data) {
      console.log("Existe la siguiente temporada");
      //existe la siguiente temporada --> se modifica en la base de datos
      var datos = JSON.parse(data);
      var Ltemp = datos["season_number"];
      var Lnum = datos["episode_number"];
      var series = JSON.parse(
        JSON.stringify(this.datosUsuario.seriesEmpezadas)
      );

      var llaves = series.keys();

      for (const i of llaves) {
        if (Object.keys(series[i])[0] == this.serieMarcadaVista) {
          var empezadasUpdated = series;
          empezadasUpdated[i][this.serieMarcadaVista] = {
            cap: Lnum,
            temp: Ltemp,
          };

          var db = firebase.firestore();
          var ident = this.getIdUsuario();
          var _this = this;

          db.collection("Usuario")
            .doc(ident)
            .set(
              {
                seriesEmpezadas: empezadasUpdated,
              },
              { merge: true }
            )
            .then(function () {
              console.log("Operación realizada correctamente");
              _this.$router.go(0);
            })
            .catch(function (error) {
              console.log("Error writing document: ", error);
            });
        }
      }
    },
    errorSig2(data) {
      console.log("Error: ", data);
      console.log("No existe la siguiente temporada");
      //no existe una siguiente temporada --> la serie está terminada

      //se marca como terminada, comprobando antes si está terminada o sigue en produccion
      themoviedb.tv.getById(
        { id: this.serieMarcadaVista },
        this.exitoSig3,
        this.errorSig3
      );
    },
    exitoSig3(data) {
      var datos = JSON.parse(data);
      var enProduccion = datos["in_production"];
      var db = firebase.firestore();
      var ident = this.getIdUsuario();
      var _this = this;

      var serie = {};
      serie[this.serieMarcadaVista] = { comprobar: enProduccion };

      db.collection("Usuario")
        .doc(ident)
        .set(
          {
            seriesTerminadas: firebase.firestore.FieldValue.arrayUnion(serie),
          },
          { merge: true }
        )
        .then(function () {
          console.log("Operación realizada correctamente");

          var series = JSON.parse(
            JSON.stringify(_this.datosUsuario.seriesEmpezadas)
          );
          var id = _this.serieMarcadaVista;

          var llaves = series.keys();

          for (const i of llaves) {
            if (Object.keys(series[i])[0] == id) {
              var empezadasUpdated = series;

              empezadasUpdated.splice(i, 1);

              db.collection("Usuario")
                .doc(ident)
                .set(
                  {
                    seriesEmpezadas: empezadasUpdated,
                  },
                  { merge: true }
                )
                .then(function () {
                  console.log("Operación realizada correctamente");
                  _this.$router.go(0);
                })
                .catch(function (error) {
                  console.log("Error writing document: ", error);
                });
            }
          }
        })
        .catch(function (error) {
          console.log("Error writing document: ", error);
        });
    },
    errorSig3(data) {
      console.log("Error: ", data);
    },
    eliminarEmpezadas(i, j) {
      var series = JSON.parse(
        JSON.stringify(this.datosUsuario.seriesEmpezadas)
      );
      var id = this.getIdSerie(i, j);

      var llaves = series.keys();

      for (const i of llaves) {
        if (Object.keys(series[i])[0] == id) {
          var empezadasUpdated = series;

          empezadasUpdated.splice(i, 1);

          var db = firebase.firestore();
          var ident = this.getIdUsuario();
          var _this = this;

          db.collection("Usuario")
            .doc(ident)
            .set(
              {
                seriesEmpezadas: empezadasUpdated,
              },
              { merge: true }
            )
            .then(function () {
              console.log("Operación realizada correctamente");
              _this.$router.go(0);
            })
            .catch(function (error) {
              console.log("Error writing document: ", error);
            });
        }
      }
    },
    getIdUsuario() {
      return this.$route.query.id;
    },
    aniadirAmigo() {
      var _this = this;
      var ident = firebase.auth().currentUser.uid;
      var amigo = this.getIdUsuario();
      var db = firebase.firestore();
      var ref = db.collection("Usuario").doc(ident);

      ref
        .update({
          amigos: firebase.firestore.FieldValue.arrayUnion(amigo),
        })
        .then(function () {
          console.log("Operación realizada correctamente");
          _this.$router.go(0);
        })
        .catch(function (error) {
          console.log("Error writing document: ", error);
        });
    },
    getAmigoFoto(i, j) {
      if (this.amigos[i * this.getPerPage() + j] != undefined)
        return this.amigos[i * this.getPerPage() + j][0];
      else return "";
    },
    getAmigoFotoTexto(i, j) {
      if (this.amigos[i * this.getPerPage() + j] != undefined)
        return this.amigos[i * this.getPerPage() + j][1];
      else return "";
    },
    getLongAmigos() {
      return this.amigos.length;
    },
    getIdAmigo(i, j) {
      if (this.idsAmigos[i * this.getPerPage() + j] != undefined)
        return this.idsAmigos[i * this.getPerPage() + j];
      else return "";
    },
    getNotaMedia() {
      var sum = 0;
      var cont = 0;

      for (var i in this.notas) {
        cont += this.notas[i];
        sum += i * this.notas[i];
      }

      if (sum == 0) {
        this.notaMedia = 0;
        return 0;
      } else {
        this.notaMedia = (sum / cont).toFixed(2);
        return (sum / cont).toFixed(2);
      }
    },
    leerNotas() {
      var texto = "";

      for (var i in this.notas) {
        if (this.notas[i] > 1)
          texto +=
            this.notas[i] +
            " contenidos han obtenido una puntuación de " +
            i +
            ". ";
        else
          texto +=
            this.notas[i] + " contenido ha obtenido una puntuación de " + i + ". ";
      }

      return texto;
    },
    getNumFilasAmigos() {
      return Math.ceil(this.getLongAmigos() / this.perPage);
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