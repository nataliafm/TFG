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
    <div v-if="!reviewsObtenidos && obtenido1">
      {{ getReviews() }}
    </div>
    <div v-if="!similaresObtenidas">
      {{ getSimilares() }}
    </div>

    <b-container
      v-if="
        obtenido1 &&
        obtenido2 &&
        terminaCargar1 &&
        terminaCargar2 &&
        reviewsObtenidos &&
        similaresObtenidas
      "
    >
      <b-row>
        <b-col md="2" class="mt-4">
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

        <b-col md="7" class="mt-4">
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
              <b-card
                v-for="j in Array(getPerPage()).keys()"
                :key="j"
                class="border-0"
              >
                <router-link
                  :to="{
                    path: '/persona',
                    query: { id: getIdPersona(currentPage, j) },
                  }"
                >
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

        <b-col md="3" class="mt-4">
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
            <b-button
              v-if="!serieEstaPendiente"
              class="button"
              @click="seriePendiente()"
              >Añadir a series pendientes</b-button
            >
          </b-button-group>
          <h5 class="mt-4" aria-describedby="static-text" tabindex="0">
            Estadísticas de puntuación
          </h5>
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
              <b-card
                v-for="j in Array(getPerPage()).keys()"
                :key="j"
                class="border-0"
              >
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
      <b-row>
        <b-col class="temporadas" v-if="reviewsObtenidos">
          <h3 align="left" class="mb-4">Últimas reseñas:</h3>
          <b-card-group>
            <b-row>
              <b-col cols="12">
                <b-card
                  no-body
                  class="overflow-hidden border-0 mb-3 text-left"
                  v-for="i in Array(idsReviews.length).keys()"
                  :key="i"
                >
                  <b-container>
                    <b-row no-gutters>
                      <b-col sm="1">
                        <router-link
                          :to="{
                            path: '/perfil',
                            query: {
                              id: getIdUsuario(i),
                            },
                          }"
                        >
                          <b-img
                            :src="getIconoReview(i)"
                            :alt="getIconoAlt(i)"
                            fluid
                            rounded="circle"
                          ></b-img>
                        </router-link>
                      </b-col>
                      <b-col sm="11">
                        <b-card-body>
                          <b-row>
                            <b-col md="5">
                              <b-form-rating
                                v-model="reviews[i].nota"
                                readonly
                                stars="10"
                                class="border-0"
                                show-value
                              ></b-form-rating>
                            </b-col>
                          </b-row>
                          <b-row class="mt-2">
                            <b-col>
                              <b-card-text>{{ getReviewTexto(i) }}</b-card-text>
                            </b-col>
                          </b-row>
                        </b-card-body>
                      </b-col>
                    </b-row>
                  </b-container>
                </b-card>
              </b-col>
            </b-row>
          </b-card-group>
          <h4 align="left" class="mb-4">Escribe una reseña</h4>
          <b-form @submit.prevent="submit">
            <b-form-group
              id="nota"
              label="Nota:"
              label-for="input-nota"
              description=""
            >
              <b-form-rating
                v-model="form.nota"
                required
                id="input-nota"
                name="nota"
                stars="10"
                class="border-0"
              >
              </b-form-rating>
            </b-form-group>

            <b-form-group
              id="texto"
              label="Reseña:"
              label-for="input-texto"
              description=""
            >
              <b-form-textarea
                v-model="form.texto"
                required
                id="input-texto"
                name="texto"
                rows="5"
              >
              </b-form-textarea>
            </b-form-group>
            <b-button type="submit" variant="primary" class="mb-4"
              >Enviar</b-button
            >
          </b-form>
        </b-col>
      </b-row>
      <b-row>
        <h3 align="left" class="mb-4">Series similares</h3>
        <b-card-group id="temporadas" :key="getKey()">
          <b-card v-for="i in Array(6).keys()" :key="i" class="border-0">
            <router-link
              :to="{
                path: '/serie',
                query: {
                  id: getIdSimilar(i),
                },
              }"
            >
              <b-card-img
                :src="getPosterSimilar(i)"
                :alt="getNombreSimilar(i)"
                class="posterTemporada"
              ></b-card-img>
            </router-link>
            <b-card-text class="nombreTemporada">{{
              getNombreSimilar(i)
            }}</b-card-text>
          </b-card>
        </b-card-group>
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
      seriesSimilares: [],
      similaresObtenidas: false,
      form: {
        nota: "",
        texto: "",
      },
      reviewsObtenidos: false,
      reviews: [],
      idsReviews: [],
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
        this.obtenido1 = false;
        this.obtenido2 = false;
        this.terminaCargar1 = false;
        this.terminaCargar2 = false;
        this.capitulosObtenidos = false;
        this.serieComprobada = false;
        this.reviewsObtenidos = false;
        this.similaresObtenidas = false;
      },
      deep: true,
      immediate: true,
    },
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
        return this.temporadas[(i - 1) * this.getPerPage() + j][
          "season_number"
        ];
      else return "";
    },
    success1(data) {
      console.log("Success callback: " + data);
      this.resultado = JSON.parse(data);

      var aux = this.resultado["seasons"].length;
      var c = [];

      for (var o = 0; o < aux; o++) {
        var res = this.resultado["seasons"][o];
        c.push(res);
      }

      this.temporadas = c;
      this.contadorTemporadas = aux;

      for (var m = 0, k = 1; m < this.temporadas.length; m += 6, k++) {
        this.paginasTemporadas.push(k);
      }

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
          console.log(res);
        });
      }

      this.contador = this.creadores.length;

      if (this.contador < 6) this.numElementos = Array.from(Array(6).keys());
      else this.numElementos = Array.from(Array(6).keys());

      this.obtenido2 = true;
      return " hola";
    },
    async getImagenes(id) {
      themoviedb.people.getImages({ id: id }, this.success3, this.error3);
      return " hola";
    },
    getNumElementos() {
      var aux = this.contador;
      this.contador -= 6;

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
        return (
          "https://image.tmdb.org/t/p/original" +
          String(
            this.temporadas[(i - 1) * this.getPerPage() + j]["poster_path"]
          )
        );
      } else
        return "https://firebasestorage.googleapis.com/v0/b/mitfg-12618.appspot.com/o/notfoundimage.png?alt=media&token=18058605-604d-4330-9fe2-b5706d9d1835";
    },
    getNombreTemporada(i, j) {
      var path = this.temporadas[(i - 1) * this.getPerPage() + j];

      if (path != undefined)
        return this.temporadas[(i - 1) * this.getPerPage() + j]["name"];
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

            if (!seriesPendientes.includes(id)) seriesPendientes.push(id);

            ref
              .set(
                {
                  seriesPendientes: seriesPendientes,
                },
                { merge: true }
              )
              .then(function () {
                console.log("Document successfully written!");
              })
              .catch(function (error) {
                console.log("Error writing document: ", error);
              });
          } else {
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
    submit() {
      var _this = this;
      var db = firebase.firestore();
      var ref = db.collection("Reviews");
      var ident = firebase.auth().currentUser.uid;

      var contenido = {tipo: "serie", id: this.getIdTemporada()};

      ref
        .add({
          // guarda reseña en documento  de Reviews
          nota: _this.form.nota,
          texto: _this.form.texto,
          usuario: ident,
          idContenido: contenido
        })
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id); //id generado

          var ident = firebase.auth().currentUser.uid;
          var ref1 = db.collection("Usuario").doc(ident);

          var idSerie = "serie" + this.getIdTemporada();
          var ref2 = db.collection("Contenidos").doc(idSerie);

          ref1
            .get()
            .then((doc) => {
              if (doc.exists) {
                var c = doc.data().notas;

                if (c == []){
                  var m = {};
                  m[_this.form.nota] = 1;
                  c = m;
                }

                if (isNaN(c[_this.form.nota])) c[_this.form.nota] = 1;
                else c[_this.form.nota] += 1;

                var b = doc.data().reviews;
                if (b == []) b = [docRef.id];
                else b.push(docRef.id);

                ref1
                  .update({
                    // guarda id de la reseña en documento de Usuario
                    reviews: b,
                    notas: c,
                  })
                  .then((data) => {
                    console.log("Document written successfully: ", data);

                    ref2 //guarda id de la reseña en documento de la serie
                      .get()
                      .then((doc) => {
                        if (doc.exists) {
                          //la serie ya existe en la base de datos --> se añade la reseña a su lista y se añade la nota
                          var a = doc.data().notas;

                          if (isNaN(a[_this.form.nota])) a[_this.form.nota] = 1;
                          else a[_this.form.nota] += 1;

                          ref2
                            .update({
                              reviews: firebase.firestore.FieldValue.arrayUnion(
                                docRef.id
                              ),
                              notas: a,
                            })
                            .then((data) => {
                              console.log(
                                "Document written successfully: ",
                                data
                              );
                              this.$router.go();
                            })
                            .catch((error) => {
                              console.error("Error adding document: ", error);
                              this.$router.go();
                            });
                        } else {
                          //esta es la primera reseña de la serie --> hay que crearla en la base de datos
                          var n = {};
                          n[_this.form.nota] = 1;

                          ref2
                            .set({
                              reviews: [docRef.id],
                              notas: n,
                            })
                            .then((data) => {
                              console.log(
                                "Document written successfully: ",
                                data
                              );
                              this.$router.go();
                            })
                            .catch((error) => {
                              console.error("Error adding document: ", error);
                              this.$router.go();
                            });
                        }
                      })
                      .catch((error) => {
                        console.error("Error adding document: ", error);
                      });
                  })
                  .catch((error) => {
                    console.error("Error updating document: ", error);
                  });
              } else {
                console.log("El documento no existe");
              }
            })
            .catch((error) => {
              console.error("Error getting document: ", error);
            });
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    },
    obtenerReviewPorID(a) {
      var _this = this;
      var db = firebase.firestore();
      var num = a;

      db.collection("Reviews")
        .doc(_this.idsReviews[num])
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log("RESULTADO REVIEW: ", doc.data());
            var data = doc.data();

            var ident = data.usuario;

            var ref = db.collection("Usuario").doc(ident);

            ref
              .get()
              .then((doc) => {
                if (doc.exists) {
                  _this.reviews[num] = data;
                  _this.reviews[num].usuario = [
                    doc.data().fotoPerfil,
                    doc.data().alternativo,
                    data.usuario,
                  ];

                  if (_this.reviews.length == _this.idsReviews.length) {
                    _this.reviewsObtenidos = true;
                  }
                } else {
                  console.log("Document doesn't exist");
                }
              })
              .catch((error) => {
                console.error("Error getting document: ", error);
              });
          } else {
            console.log("Document doesn't exist");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    },
    getReviews() {
      var _this = this;
      var idSerie = "serie" + this.getIdTemporada();
      var db = firebase.firestore();
      var ref = db.collection("Contenidos").doc(idSerie);

      ref
        .get()
        .then((doc) => {
          if (doc.exists) {
            var idsReviews = doc.data().reviews;
            var ids = JSON.parse(JSON.stringify(idsReviews));

            _this.idsReviews = ids.slice(-3);
            _this.notas = JSON.parse(JSON.stringify(doc.data())).notas;

            for (const l of Object.keys(doc.data().notas)) {
              _this.datos.datasets[0].data[l - 1] = doc.data().notas[l];
            }

            for (const key of _this.idsReviews.keys()) {
              _this.obtenerReviewPorID(key);
            }
          } else {
            _this.reviewsObtenidos = true;
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    },
    getReviewNota(i) {
      if (this.reviews[i] != undefined) {
        return this.reviews[i].nota / 2;
      } else return "";
    },
    getReviewTexto(i) {
      if (this.reviews[i] != undefined) {
        return this.reviews[i].texto;
      } else return "";
    },
    getIconoReview(i) {
      if (this.reviews[i] != undefined) {
        return this.reviews[i].usuario[0];
      } else return "";
    },
    getIconoAlt(i) {
      if (this.reviews[i] != undefined) {
        return this.reviews[i].usuario[1];
      } else return "";
    },
    getIdUsuario(i) {
      if (this.reviews[i] != undefined) {
        return this.reviews[i].usuario[2];
      } else return "";
    },
    getDatos() {
      return this.datos;
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
        this.notaMedia = sum / cont;
        return sum / cont;
      }
    },
    leerNotas() {
      var texto = "";

      for (var i in this.notas) {
        if (this.notas[i] > 1)
          texto +=
            this.notas[i] +
            " personas le han dado una puntuación de " +
            i +
            ". ";
        else
          texto +=
            this.notas[i] + " persona le ha dado una puntuación de " + i + ". ";
      }

      return texto;
    },
    existSim(data) {
      console.log("Success callback: " + data);
      var datos = JSON.parse(data);

      this.seriesSimilares = datos;
      this.similaresObtenidas = true;
    },
    errorSim(data) {
      console.log("Error: ", data);
    },
    getSimilares() {
      themoviedb.tv.getSimilar(
        { id: this.getIdTemporada() },
        this.existSim,
        this.errorSim
      );
    },
    getNombreSimilar(i) {
      if (this.seriesSimilares["results"][i] != undefined) {
        return this.seriesSimilares["results"][i]["name"];
      } else return "";
    },
    getIdSimilar(i) {
      if (this.seriesSimilares["results"][i] != undefined) {
        return this.seriesSimilares["results"][i]["id"];
      } else return "";
    },
    getPosterSimilar(i) {
      var path = this.seriesSimilares["results"][i];
      if (path != undefined && path["poster_path"] != null) {
        return (
          "https://image.tmdb.org/t/p/original" +
          String(this.seriesSimilares["results"][i]["poster_path"])
        );
      } else
        return "https://firebasestorage.googleapis.com/v0/b/mitfg-12618.appspot.com/o/notfoundimage.png?alt=media&token=18058605-604d-4330-9fe2-b5706d9d1835";
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