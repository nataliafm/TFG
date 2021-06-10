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
            <div class="proveedores" v-if="renderProviders">
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
              :per-page="getPerPage()"
              aria-controls="creadores"
              class="mt-2"
              :key="getKey()"
            ></b-pagination>
            <b-card-group id="creadores" :key="getKey()">
              <b-card v-for="j in Array(getPerPage()).keys()" :key="j" class="border-0">
                <router-link :to="{path: '/persona', query: {id: getIdPersona(currentPage, j)}}">
                  <b-card-img
                    :src="getCreador(currentPage, j)"
                    :alt="getNombreCreador(currentPage, j)"
                    class="fotoCreador"
                  ></b-card-img>
                </router-link>
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
          <b-button-group
            vertical
            class="botones"
            v-if="serieComprobada"
          >
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
            <b-button v-if="!serieEstaPendiente" class="button" @click="seriePendiente()">Añadir a series pendientes</b-button>
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
            <b-pagination
              v-model="currentPageT"
              :total-rows="getNumTemporadas()"
              :per-page="getPerPage()"
              aria-controls="temporadas"
              class="mt-2"
              :key="getKey()"
            ></b-pagination>
            <b-card-group id="temporadas" :key="getKey()">
              <b-card v-for="j in Array(getPerPage()).keys()" :key="j" class="border-0">
                <router-link
                  :to="{
                    path: '/temporada',
                    query: {
                      id: getIdTemporada(),
                      numero: getNumeroTemporada(currentPageT, j),
                      nombre: getTitulo(),
                    },
                  }"
                >
                  <b-card-img
                    :src="getPosterTemporada(currentPageT, j)"
                    :alt="'Temporada ' + getNumeroTemporada(currentPageT, j)"
                    class="posterTemporada"
                    v-if="getExisteTemporada(currentPageT, j)"
                  ></b-card-img>
                  <b-card-img class="posterTemporada" v-else blank></b-card-img>
                </router-link>
                <b-card-text class="nombreTemporada">{{
                  getNombreTemporada(currentPageT, j)
                }}</b-card-text>
              </b-card>
              <div v-if="seguir">
                {{ getNumTemporada() }}
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
      currentPageT: 1,
      serieEstaPendiente: false,
      renderProviders: true,
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
    getNumTemporadas() {
      return this.temporadas.length;
    },
    getIdTemporada() {
      var _this = this;
      return _this.$route.query.id;
    },
    getNumeroTemporada(i, j) {
      var path = this.temporadas[(i - 1) * this.getPerPage() + j];

      if (path != undefined)
        return this.temporadas[(i - 1) * this.getPerPage() + j]["season_number"];
      else return "";
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
        this.numTemporada = Array.from(Array(6).keys());
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

      if (proveedores["results"][userLocale.toUpperCase()] != undefined)
        this.providers = proveedores["results"][userLocale.toUpperCase()];
      else this.renderProviders = false;
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

      for (var o = 0; o < aux; o++) {
        var res = this.resultado["created_by"][o];
        c.push(res);
      }

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

      if (aux > 0 && aux < 6) this.numTemporada = Array.from(Array(6).keys());
      else if (aux <= 0) {
        this.seguir = false;
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
      var path = String(this.pathFotos[(i - 1) * this.getPerPage() + j]);
      console.log(path);

      if (path != "NODISPONIBLE" && path != undefined) {
        return (
          "https://image.tmdb.org/t/p/original" +
          String(this.pathFotos[(i - 1) * this.getPerPage() + j])
        );
      } else {
        return "https://firebasestorage.googleapis.com/v0/b/mitfg-12618.appspot.com/o/notfoundimage.png?alt=media&token=18058605-604d-4330-9fe2-b5706d9d1835";
      }
    },
    acabarLoop() {},
    getNombreCreador(i, j) {
      if (this.creadores[(i - 1) * this.getPerPage() + j] != undefined) {
        return this.creadores[(i - 1) * this.getPerPage() + j]["name"];
      } else {
        return "";
      }
    },
    getExisteCreador(i, j) {
      return this.pathFotos[(i - 1) * this.getPerPage() + j] != undefined;
    },
    getExisteTemporada(i, j) {
      return this.temporadas[(i - 1) * this.getPerPage() + j] != undefined;
    },
    getPosterTemporada(i, j) {
      var path = this.temporadas[(i - 1) * this.getPerPage() + j];

      if (path["poster_path"] != null && path != undefined) {
        console.log(this.temporadas[(i - 1) * this.getPerPage() + j]["poster_path"]);
        return (
          "https://image.tmdb.org/t/p/original" +
          String(this.temporadas[(i - 1) * this.getPerPage() + j]["poster_path"])
        );
      } else return "https://firebasestorage.googleapis.com/v0/b/mitfg-12618.appspot.com/o/notfoundimage.png?alt=media&token=18058605-604d-4330-9fe2-b5706d9d1835";
    },
    getNombreTemporada(i, j) {
      var path = this.temporadas[(i - 1) * this.getPerPage() + j];

      console.log(i - 1, j, (i - 1) * this.getPerPage() + j, "fea");

      if (path != undefined) return this.temporadas[(i - 1) * this.getPerPage() + j]["name"];
      else return "";
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
            var pendientes = datosUsuario.seriesPendientes;

            for (var i = 0; i < empezadas.length; i++) {
              if (Object.keys(empezadas[i])[0] == _this.getIdTemporada()) {
                _this.serieEstaEmpezada = true;
              }
            }

            for (var j = 0; j < pendientes.length; j++) {
              if (pendientes[j] == _this.getIdTemporada()) {
                _this.serieEstaPendiente = true;
              }
            }

            _this.serieComprobada = true;
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    },
    seriePendiente() {
      var id = this.getIdTemporada();
      console.log(id);

      var ident = firebase.auth().currentUser.uid;
      var db = firebase.firestore();
      var ref = db.collection("Usuario").doc(ident);

      ref
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log("Document data:", doc.data());
            var data = JSON.parse(JSON.stringify(doc.data()));
            var seriesPendientes = data.seriesPendientes;

            if (!seriesPendientes.includes(id))
              seriesPendientes.push(id);

            ref
              .set({
                seriesPendientes: seriesPendientes
              }, { merge: true })
              .then(function () {
                console.log("Document successfully written!");
              })
              .catch(function (error) {
                console.log("Error writing document: ", error);
              });
          }
          else {
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    },
    getIdPersona(i, j) {
      if (this.creadores[(i - 1) * this.getPerPage() + j] != undefined) {
        return this.creadores[(i - 1) * this.getPerPage() + j]["id"];
      } else {
        return "";
      }
    },
    myEventHandler(e) {
      console.log(e.target.innerWidth);
      if (e.target.innerWidth < 580) {
        this.perPage = 1;
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
.card {
  color: rgb(0, 0, 0);
  border: none;
}
</style>