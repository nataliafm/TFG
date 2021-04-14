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
          <h3 align="left">Series empezadas</h3>
          <b-carousel controls :interval="9999999" class="actores" v-if="renderEmp" v-once>
            <b-container class="cards">
              <b-row class="row-eq-height">
                <b-carousel-slide v-for="i in paginasEmpezadas" :key="i">
                  <template slot="img" v-for="j in numElementosEmpezadas">
                    <b-col cols="2" :key="j" class="columna">
                      <router-link
                        :to="{
                          name: 'episodio',
                          query: {
                            id: getIdSerie(i, j),
                            nombre: getNombreSerie(i, j),
                            temp: getNumeroTemporada(i, j),
                            num: getNumCapitulo(i, j),
                          },
                          params: { pathPoster: getSerie(i, j) },
                        }"
                      >
                        <b-img
                          :src="getSerie(i, j)"
                          fluid-grow
                          class="imgs"
                          v-if="getSerie(i, j)"
                          :alt="getNombreSerie(i, j)"
                        ></b-img>
                        <b-img
                          :src="getSerie(i, j)"
                          fluid-grow
                          class="imgs"
                          v-if="!getSerie(i, j)"
                          :alt="'No hay imagen disponible'"
                          blank
                          blank-color="#B0A8B9"
                        ></b-img>
                      </router-link>
                      <b-container>
                        <b-row cols="1" align-v="stretch">
                          <b-col>
                            <div class="nombre">{{ getNombreSerie(i, j) }}</div>
                            <div class="rol">{{ getTemporada(i, j) }}</div>
                          </b-col>
                        </b-row>
                      </b-container>
                    </b-col>
                  </template>
                  <div v-if="seguir1">
                    {{ getNumElementosEmpezadas() }}
                  </div>
                </b-carousel-slide>
              </b-row>
            </b-container>
          </b-carousel>

          <h3 align="left">Series favoritas</h3>
          <b-carousel controls :interval="9999999" class="actores" v-if="renderFav" v-once>
            <b-container class="cards">
              <b-row class="row-eq-height">
                <b-carousel-slide v-for="i in paginasFavoritas" :key="i">
                  <template slot="img" v-for="j in numElementosFavoritas">
                    <b-col cols="2" :key="j" class="columna">
                      <router-link
                        :to="{path:'/serie', query: { id: getIdFavoritas(i, j) }}"
                      >
                        <b-img
                          :src="getSerieFav(i, j)"
                          fluid-grow
                          class="imgs"
                          v-if="getSerieFav(i, j)"
                          :alt="getNombreSerieFav(i, j)"
                        ></b-img>
                        <b-img
                          :src="getSerieFav(i, j)"
                          fluid-grow
                          class="imgs"
                          v-if="!getSerieFav(i, j)"
                          :alt="'No hay imagen disponible'"
                          blank
                          blank-color="#B0A8B9"
                        ></b-img>
                      </router-link>
                      <b-container>
                        <b-row cols="1" align-v="stretch">
                          <b-col>
                            <div class="nombre">{{ getNombreSerieFav(i, j) }}</div>
                          </b-col>
                        </b-row>
                      </b-container>
                    </b-col>
                  </template>
                  <div v-if="seguir2">
                    {{ getNumElementosFavoritas() }}
                  </div>
                </b-carousel-slide>
              </b-row>
            </b-container>
          </b-carousel>

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
    };
  },
  methods: {
    obtenerSeriePorID(num) {
      console.log(num);
      var idSeries = this.datosUsuario.seriesEmpezadas.reverse();
      var parsedobj = JSON.parse(JSON.stringify(idSeries));

      themoviedb.tv.getById(
        { id: Object.keys(parsedobj[1])[0] },
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

      console.log("yuppp", this.seriesF.length);
      console.log("holaaa", this.datosUsuario.seriesFavoritas.length);

      if (this.seriesF.length == this.datosUsuario.seriesFavoritas.length) {
        console.log("llegaaaaa");
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

            var seriesEmp = JSON.parse(JSON.stringify(_this.datosUsuario.seriesEmpezadas));
            if (seriesEmp.length > 0){
              for (
                var m = 0, k = 1;
                m < _this.datosUsuario.seriesEmpezadas.length;
                m += 6, k++
              ) {
                _this.paginasEmpezadas.push(k);
              }

              _this.contadorEmpezadas = _this.datosUsuario.seriesEmpezadas.length;

              if (_this.contadorEmpezadas < 6)
                _this.numElementosEmpezadas = Array.from(
                  Array(_this.contadorEmpezadas).keys()
                );
              else _this.numElementosEmpezadas = Array.from(Array(6).keys());

              var idSeries = _this.datosUsuario.seriesEmpezadas.reverse().keys();

              for (const key of idSeries) {
                _this.obtenerSeriePorID(key);
              }
            }
            else{
              _this.renderEmp = false;
              _this.datosObtenidos = true;
            }

            var seriesFav = JSON.parse(JSON.stringify(_this.datosUsuario.seriesFavoritas));
            if (seriesFav.length > 0){
              for (
                var n = 0, j = 1;
                n < _this.datosUsuario.seriesFavoritas.length;
                n += 6, j++
              ) {
                _this.paginasFavoritas.push(j);
              }

              _this.contadorFavoritas = _this.datosUsuario.seriesFavoritas.length;

              if (_this.contadorFavoritas < 6)
                _this.numElementosFavoritas = Array.from(
                  Array(_this.contadorFavoritas).keys()
                );
              else _this.numElementosFavoritas = Array.from(Array(6).keys());

              var idSeriesF = _this.datosUsuario.seriesFavoritas.keys();

              for (const key of idSeriesF) {
                _this.obtenerSeriePorIDFav(key);
              }
            }
            else{
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
      console.log(i - 1, j, (i - 1) * 6 + j);
      console.log(this.seriesE[0]);
      var path = String(this.seriesE[(i - 1) * 6 + j].foto);

      if (path.length > 0) {
        return "https://image.tmdb.org/t/p/original" + path;
      } else {
        //return "https://upload.wikimedia.org/wikipedia/commons/3/3b/Picture_Not_Yet_Available.png";
      }
    },
    getNombreSerie(i, j) {
      return this.seriesE[(i - 1) * 6 + j].nombre;
    },
    getTemporada(i, j) {
      return (
        "Temporada " +
        this.seriesE[(i - 1) * 6 + j].temp +
        ", Capítulo " +
        this.seriesE[(i - 1) * 6 + j].cap
      );
    },
    getNumElementosEmpezadas() {
      this.contadorEmpezadas -= 6;

      if (this.contadorEmpezadas > 0 && this.contadorEmpezadas < 6)
        this.numElementosEmpezadas = Array.from(
          Array(this.contadorEmpezadas).keys()
        );
      else if (this.contadorEmpezadas <= 0) {
        this.seguir1 = false;
        if (this.datosUsuario.seriesEmpezadas.length < 6)
          this.numElementosEmpezadas = Array.from(
            Array(this.datosUsuario.seriesEmpezadas.length).keys()
          );
        else this.numElementosEmpezadas = Array.from(Array(6).keys());
      } else this.numElementosEmpezadas = Array.from(Array(6).keys());
    },
    getIdSerie(i, j) {
      return this.seriesE[(i - 1) * 6 + j].id;
    },
    getNumeroTemporada(i, j) {
      return this.seriesE[(i - 1) * 6 + j].temp;
    },
    getNumCapitulo(i, j) {
      return this.seriesE[(i - 1) * 6 + j].cap;
    },


    getSerieFav(i, j) {
      console.log(i - 1, j, (i - 1) * 6 + j);
      console.log(this.seriesF[0]);
      var path = String(this.seriesF[(i - 1) * 6 + j].foto);

      if (path.length > 0) {
        return "https://image.tmdb.org/t/p/original" + path;
      } else {
        //return "https://upload.wikimedia.org/wikipedia/commons/3/3b/Picture_Not_Yet_Available.png";
      }
    },
    getNombreSerieFav(i, j) {
      return this.seriesF[(i - 1) * 6 + j].nombre;
    },
    getNumElementosFavoritas() {
      this.contadorFavoritas -= 6;

      if (this.contadorFavoritas > 0 && this.contadorFavoritas < 6)
        this.numElementosFavoritas = Array.from(
          Array(this.contadorFavoritas).keys()
        );
      else if (this.contadorFavoritas <= 0) {
        this.seguir1 = false;
        if (this.datosUsuario.seriesFavoritas.length < 6)
          this.contadorFavoritas = Array.from(
            Array(this.datosUsuario.seriesFavoritas.length).keys()
          );
        else this.numElementosFavoritas = Array.from(Array(6).keys());
      } else this.numElementosFavoritas = Array.from(Array(6).keys());
    },
    getIdFavoritas(i, j){
      return this.seriesF[(i - 1) * 6 + j].id;
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