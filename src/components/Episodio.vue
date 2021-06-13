<template>
  <div class="episodio">
    <div v-if="!datosObtenidos">
      {{ buscarEpisodio() }}
    </div>
    <div v-if="!datosSerieObtenidos">
      {{ buscarSerie() }}
    </div>
    <div v-if="!reviewsObtenidos">
      {{ getReviews() }}
    </div>

    <b-container v-if="datosObtenidos && datosSerieObtenidos && reviewsObtenidos">
      <b-row>
        <b-col cols="3" class="mt-4">
          <div>
            <b-img
              :src="getPoster()"
              :alt="getTitulo()"
              width="200px"
              class="poster"
              fluid-grow
            />
          </div>
          <bar-chart
            :chartdata="datos"
            :options="options"
            :height="200"
            class="mt-4"
          />
          <div>Nota media: {{ getNotaMedia() * 2 }}</div>
          <b-form-rating
            v-model="notaMedia"
            readonly
          ></b-form-rating>
        </b-col>
        <b-col cols="9">
          <div class="descripcion">
            <h3 align="left">
              <router-link
                style="color: #9A7ACD"
                :to="{ path: '/serie', query: { id: getIdSerie() } }"
                >{{ getTitulo() }}</router-link
              >,
              <router-link
                style="color: #9A7ACD"
                :to="{
                  path: '/temporada',
                  query: {
                    id: getIdSerie(),
                    numero: getNumTemporada(),
                    nombre: getTitulo(),
                  },
                }"
                >Temporada {{ getNumTemporada() }}</router-link
              >
            </h3>
            <h1 align="left">Episodio {{ getNumEpisodio() }}: {{ getTituloEpisodio() }}
            </h1>
            <p align="left">{{ infoEpisodio["overview"] }}</p>
          </div>
          <div class="creadoPor" v-if="datosObtenidos">
            <h3 align="left">Actores</h3>

            <b-pagination
              v-model="currentPageA"
              :total-rows="getNumActores()"
              :per-page="getPerPage()"
              aria-controls="actores"
              class="mt-2"
              :key="getKey()"
            ></b-pagination>
            <b-card-group id="actores" deck>
              <b-card
                v-for="j in Array(getPerPage()).keys()"
                :key="j"
                class="border-0"
              >
                <router-link
                  :to="{
                    path: '/persona',
                    query: { id: getIdActor(currentPageA, j) },
                  }"
                >
                  <b-card-img
                    :src="getActor(currentPageA, j)"
                    :alt="getNombreActor(currentPageA, j)"
                  ></b-card-img>
                </router-link>

                <b-card-text class="nombre">{{
                  getNombreActor(currentPageA, j)
                }}</b-card-text>
                <b-card-text class="rol">{{
                  getRolActor(currentPageA, j)
                }}</b-card-text>
              </b-card>
              <div v-if="seguir1">
                {{ getNumElementosActores() }}
              </div>
            </b-card-group>

            <h3 align="left">Equipo</h3>

            <b-pagination
              v-model="currentPageE"
              :total-rows="getNumEquipo()"
              :per-page="getPerPage()"
              aria-controls="equipo"
              class="mt-2"
              :key="getKey()"
            ></b-pagination>
            <b-card-group id="equipo" :key="getKey()">
              <b-card v-for="j in Array(getPerPage()).keys()" :key="j" class="border-0">
                <router-link
                  :to="{
                    path: '/persona',
                    query: { id: getIdEquipo(currentPageE, j) },
                  }"
                >
                  <b-card-img
                    :src="getEquipo(currentPageE, j)"
                    :alt="getNombreEquipo(currentPageE, j)"
                  ></b-card-img>
                </router-link>
                <b-card-text class="nombre">{{
                  getNombreEquipo(currentPageE, j)
                }}</b-card-text>
                <b-card-text class="rol">{{
                  getRolEquipo(currentPageE, j)
                }}</b-card-text>
              </b-card>
              <div v-if="seguir2">
                {{ getNumElementosEquipo() }}
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
                      <b-col md="1">
                        <b-img
                          :src="getIconoReview(i)"
                          :alt="getIconoAlt(i)"
                          fluid
                          rounded="circle"
                        ></b-img>
                      </b-col>
                      <b-col md="11">
                        <b-card-body>
                          <b-row>
                            <b-col md="5">
                              <b-form-rating
                                v-model="reviews[i].nota"
                                readonly
                                stars="10"
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
    </b-container>
  </div>
</template>

<script>
import themoviedb from "themoviedb-javascript-library";
import firebase from "firebase";

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
      currentPageA: 1,
      currentPageE: 1,
      perPage: 6,
      posterTemporada: "",
      nombreSerie: "",
      datosSerieObtenidos: false,
      llave: true,
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
          x: {
            ticks: {
              type: "linear",
              min: 0,
              stepSize: 1,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              type: "linear",
              min: 0,
              stepSize: 1,
            },
          },
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
  methods: {
    getNumActores() {
      return this.castEpisodio.length;
    },
    getNumEquipo() {
      return this.crewEpisodio.length;
    },
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

      for (var m = 0, k = 1; m < this.crewEpisodio.length; m += 6, k++) {
        this.paginasEquipo.push(k);
      }

      this.contadorEquipo = this.crewEpisodio.length;

      if (this.contadorEquipo < 6)
        this.numElementosEquipo = Array.from(Array(6).keys());
      else this.numElementosEquipo = Array.from(Array(6).keys());

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

      for (var m = 0, k = 1; m < this.castEpisodio.length; m += 6, k++) {
        this.paginasActores.push(k);
      }

      this.contadorActores = this.castEpisodio.length;

      if (this.contadorActores < 6)
        this.numElementosActores = Array.from(Array(6).keys());
      else this.numElementosActores = Array.from(Array(6).keys());

      this.datosObtenidos = true;
    },
    buscarSerie() {
      themoviedb.tvSeasons.getById(
        { id: this.idSerie, season_number: this.numTemporada },
        this.success3,
        this.error1
      );
    },
    success3(data) {
      console.log("Success callback: " + data);
      var datos = JSON.parse(data);

      this.posterTemporada = datos["poster_path"];
      this.datosSerieObtenidos = true;
    },
    error2(data) {
      console.log("Error callback: " + data);
    },
    error1(data) {
      console.log("Error callback: " + data);
    },
    getPoster() {
      return "https://image.tmdb.org/t/p/original" + this.posterTemporada;
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
      if (this.castEpisodio[(i - 1) * this.getPerPage() + j] != undefined) {
        var path = String(this.castEpisodio[(i - 1) * this.getPerPage() + j]["profile_path"]);
        if (path != "null") {
          return "https://image.tmdb.org/t/p/original" + path;
        } else {
          return "https://firebasestorage.googleapis.com/v0/b/mitfg-12618.appspot.com/o/notfoundimage.png?alt=media&token=18058605-604d-4330-9fe2-b5706d9d1835";
        }
      } else {
        return "";
      }
    },
    getNombreActor(i, j) {
      if (this.castEpisodio[(i - 1) * this.getPerPage() + j] != undefined)
        return this.castEpisodio[(i - 1) * this.getPerPage() + j]["name"];
      else return "";
    },
    getRolActor(i, j) {
      if (this.castEpisodio[(i - 1) * this.getPerPage() + j] != undefined)
        return this.castEpisodio[(i - 1) * this.getPerPage() + j]["character"];
      else return "";
    },
    getNumElementosActores() {
      this.contadorActores -= 6;

      if (this.contadorActores > 0 && this.contadorActores < 6)
        this.numElementosActores = Array.from(Array(6).keys());
      else if (this.contadorActores <= 0) {
        this.seguir1 = false;
      } else this.numElementosActores = Array.from(Array(6).keys());
    },
    getEquipo(i, j) {
      if (this.crewEpisodio[(i - 1) * this.getPerPage() + j] != undefined) {
        var path = String(this.crewEpisodio[(i - 1) * this.getPerPage() + j]["profile_path"]);
        if (path != "null") {
          return "https://image.tmdb.org/t/p/original" + path;
        } else {
          return "https://firebasestorage.googleapis.com/v0/b/mitfg-12618.appspot.com/o/notfoundimage.png?alt=media&token=18058605-604d-4330-9fe2-b5706d9d1835";
        }
      } else {
        return "";
      }
    },
    getNombreEquipo(i, j) {
      if (this.crewEpisodio[(i - 1) * this.getPerPage() + j] != undefined)
        return this.crewEpisodio[(i - 1) * this.getPerPage() + j]["name"];
      else return "";
    },
    getRolEquipo(i, j) {
      if (this.crewEpisodio[(i - 1) * this.getPerPage() + j] != undefined)
        return this.crewEpisodio[(i - 1) * this.getPerPage() + j]["job"];
      else return "";
    },
    getNumElementosEquipo() {
      this.contadorEquipo -= 6;

      if (this.contadorEquipo > 0 && this.contadorEquipo < 6)
        this.numElementosEquipo = Array.from(Array(6).keys());
      else if (this.contadorEquipo <= 0) {
        this.seguir2 = false;
      } else this.numElementosEquipo = Array.from(Array(6).keys());
    },
    existeEquipo(i, j) {
      if (this.crewEpisodio[(i - 1) * this.getPerPage() + j] != undefined) {
        console.log(String(this.crewEpisodio[(i - 1) * this.getPerPage() + j]["profile_path"]));
        console.log(
          String(this.crewEpisodio[(i - 1) * this.getPerPage() + j]["profile_path"]) == "null"
        );
        return (
          String(this.crewEpisodio[(i - 1) * this.getPerPage() + j]["profile_path"]) != "null"
        );
      } else return false;
    },
    getIdActor(i, j) {
      if (this.castEpisodio[(i - 1) * this.getPerPage() + j] != undefined)
        return this.castEpisodio[(i - 1) * this.getPerPage() + j]["id"];
      else return "";
    },
    getIdEquipo(i, j) {
      if (this.crewEpisodio[(i - 1) * this.getPerPage() + j] != undefined)
        return this.crewEpisodio[(i - 1) * this.getPerPage() + j]["id"];
      else return "";
    },
    myEventHandler(e) {
      console.log(e.target.innerWidth);
      if (e.target.innerWidth < 580) {
        this.perPage = 2;
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

      ref
        .add({
          // guarda reseña en documento  de Reviews
          nota: _this.form.nota,
          texto: _this.form.texto,
          usuario: ident,
        })
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id); //id generado
          /*
          var ident = firebase.auth().currentUser.uid;
          var ref1 = db.collection("Usuario").doc(ident);
*/
          var idSerie = "episodio" + this.getIdSerie();
          var ref2 = db.collection("Contenidos").doc(idSerie);
          /*
          ref1
            .update({
              // guarda id de la reseña en documento de Usuario
              reviews: firebase.firestore.FieldValue.arrayUnion(docRef.id),
            })
            .then((data) => {
              console.log("Document written successfully: ", data);
            })
            .catch((error) => {
              console.error("Error adding document: ", error);
            });
*/
          ref2 //guarda id de la reseña en documento de la serie
            .get()
            .then((doc) => {
              if (doc.exists) {
                //la serie ya existe en la base de datos --> se añade la reseña a su lista y se añade la nota
                var a = doc.data().notas;

                console.log(a[_this.form.nota]);
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
                    console.log("Document written successfully: ", data);
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
                    console.log("Document written successfully: ", data);
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
            console.log("RESULTADO: ", doc.data());
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
                  ];

                  if (_this.reviews.length == _this.idsReviews.length) {
                    _this.reviewsObtenidos = true;
                  }
                } else {
                  console.log("no existe tia");
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
      var idSerie = "episodio" + this.getIdSerie();
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
              console.log(l);
              console.log(_this.datos.datasets[0].data[l - 1]);
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
        return this.reviews[i].nota;
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
    getDatos() {
      return this.datos;
    },
    getNotaMedia() {
      var sum = 0;
      var cont = 0;

      for (var i in this.notas) {
        console.log(i);
        console.log(this.notas[i]);

        cont += this.notas[i];
        sum += i * this.notas[i];
      }

      if (sum == 0){
        this.notaMedia = 0;
        return 0;
      }
      else{
        this.notaMedia = (sum / cont) / 2;
        return (sum / cont) / 2;
      }
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
h3 {
  font-weight: bold;
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
  font-size: small;
}
.actores {
  margin-top: 1em;
}
</style>