<template>
  <div class="temporada">
    <div v-if="!datosObtenidos">
      {{ buscarTemporada() }}
    </div>
    <div v-if="!reviewsObtenidos && datosObtenidos">
      {{ getReviews() }}
    </div>

    <b-container v-if="datosObtenidos && reviewsObtenidos">
      <b-row>
        <b-col md="3" class="mt-4">
          <div>
            <b-img
              :src="getPoster()"
              :alt="getTituloSerie()"
              width="200px"
              class="poster"
              fluid-grow
            />
          </div>
          <h5 class="mt-4" aria-describedby="static-text" tabindex="0">
            Estadísticas de puntuación
          </h5>
          <span id="static-text" style="display: none">{{ leerNotas() }}</span>
          <bar-chart
            :chartdata="datos"
            :options="options"
            :height="300"
            class="mt-4"
          />
          <div>Nota media: {{ getNotaMedia() }}</div>
          <b-form-rating
            v-model="notaMedia"
            readonly
            class="border-0"
            stars="10"
          ></b-form-rating>
        </b-col>
        <b-col md="9">
          <div class="descripcion">
            <h3 align="left">
              <router-link
                style="color: #9a7acd"
                :to="{ path: '/serie', query: { id: getIdSerie() } }"
                >{{ getTituloSerie() }}</router-link
              >:
            </h3>

            <h1 align="left">Temporada {{ resultado["season_number"] }}</h1>
            <p align="left">{{ resultado["overview"] }}</p>
          </div>
          <h3 align="left">Capítulos</h3>
          <b-pagination
            v-model="currentPage"
            :total-rows="getNumEpisodios()"
            :per-page="getPerPage()"
            aria-controls="episodios"
            class="mt-2"
            :key="getKey()"
          ></b-pagination>
          <b-card-group id="episodios" :key="getKey()">
            <b-card
              v-for="i in Array(getPerPage()).keys()"
              :key="i"
              class="border-0"
              deck
            >
              <b-card-body>
                <router-link
                  :to="{
                    name: 'episodio',
                    query: {
                      id: getIdSerie(),
                      nombre: getTitulo(),
                      temp: getNumeroTemporada(),
                      num: getNum(currentPage, i),
                    },
                    params: { pathPoster: getPoster() },
                  }"
                >
                  <b-img
                    :src="getPath(currentPage, i)"
                    :alt="getNumCapitulo(currentPage, i)"
                    fluid-grow
                    class="imagen"
                  ></b-img>
                </router-link>

                <b-card-title id="titulo">{{
                  getNombreEpisodio(currentPage, i)
                }}</b-card-title>
                <b-card-sub-title>{{
                  getFechaEstreno(currentPage, i)
                }}</b-card-sub-title>
                <b-card-text>{{ getDescripcion(currentPage, i) }}</b-card-text>
              </b-card-body>
            </b-card>
          </b-card-group>
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
                              id: getIdPersona(i)
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
    </b-container>
  </div>
</template>

<script>
import themoviedb from "themoviedb-javascript-library";
import firebase from "firebase";

export default {
  name: "Temporada",
  props: {},
  data() {
    return {
      resultado: "",
      datosObtenidos: false,
      tituloSerie: "",
      numCapitulos: "",
      pathsFotos: [],
      idSerie: "",
      numeroTemporada: "",
      perPage: 3,
      llave: true,
      currentPage: 1,
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
  methods: {
    myEventHandler(e) {
      if (e.target.innerWidth < 580) {
        this.perPage = 1;
      } else if (e.target.innerWidth > 580 && e.target.innerWidth < 1000) {
        this.perPage = 2;
      } else {
        this.perPage = 3;
      }

      this.llave = !this.llave;
    },
    getKey() {
      return this.llave;
    },
    getPerPage() {
      return this.perPage;
    },
    getNumEpisodios() {
      return this.resultado["episodes"].length;
    },
    getIdSerie() {
      return this.idSerie;
    },
    getTitulo() {
      return this.tituloSerie;
    },
    getNumeroTemporada() {
      return this.numeroTemporada;
    },
    getNumCapitulo(i, j) {
      if (
        this.resultado["episodes"][(i - 1) * this.getPerPage() + j] != undefined
      )
        return "Imagen episodio " + (i - 1) * this.getPerPage() + j + 1;
      else return "";
    },
    getNum(i, j) {
      if (
        this.resultado["episodes"][(i - 1) * this.getPerPage() + j] != undefined
      )
        return (i - 1) * this.getPerPage() + j + 1;
      else return "";
    },
    buscarTemporada() {
      var _this = this;
      this.idSerie = _this.$route.query.id;
      this.numeroTemporada = _this.$route.query.numero;
      this.tituloSerie = _this.$route.query.nombre;

      this.getIdTemporada()
        .then((res) => {
          console.log("1 " + res);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async getIdTemporada() {
      themoviedb.tvSeasons.getById(
        { id: this.idSerie, season_number: this.numeroTemporada },
        this.successCB,
        this.errorCB
      );
      return " hola";
    },
    successCB(data) {
      console.log("Success callback: " + data);
      this.resultado = JSON.parse(data);

      this.numCapitulos = Array.from(
        Array(this.resultado["episodes"].length).keys()
      );

      this.datosObtenidos = true;
    },
    errorCB(data) {
      console.log("Error callback: " + data);
    },
    getPoster() {
      return (
        "https://image.tmdb.org/t/p/original/" + this.resultado["poster_path"]
      );
    },
    getTituloSerie() {
      return this.tituloSerie;
    },
    getPath(i, j) {
      if (
        this.resultado["episodes"][(i - 1) * this.getPerPage() + j] != undefined
      ) {
        var path = String(
          this.resultado["episodes"][(i - 1) * this.getPerPage() + j][
            "still_path"
          ]
        );
        if (path != "null") {
          return "https://image.tmdb.org/t/p/original" + path;
        } else {
          return "https://firebasestorage.googleapis.com/v0/b/mitfg-12618.appspot.com/o/notfoundimage.png?alt=media&token=18058605-604d-4330-9fe2-b5706d9d1835";
        }
      } else {
        return "";
      }
    },
    getNombreEpisodio(i, j) {
      if (
        this.resultado["episodes"][(i - 1) * this.getPerPage() + j] != undefined
      )
        return this.resultado["episodes"][(i - 1) * this.getPerPage() + j][
          "name"
        ];
      else return "";
    },
    getFechaEstreno(i, j) {
      if (
        this.resultado["episodes"][(i - 1) * this.getPerPage() + j] != undefined
      )
        return (
          "Fecha de estreno: " +
          this.resultado["episodes"][(i - 1) * this.getPerPage() + j][
            "air_date"
          ]
        );
      else return "";
    },
    getDescripcion(i, j) {
      if (
        this.resultado["episodes"][(i - 1) * this.getPerPage() + j] != undefined
      )
        return this.resultado["episodes"][(i - 1) * this.getPerPage() + j][
          "overview"
        ];
      else return "";
    },
    submit() {
      var _this = this;
      var db = firebase.firestore();
      var ref = db.collection("Reviews");
      var ident = firebase.auth().currentUser.uid;

      var contenido = {tipo: "temporada", id: [this.getIdSerie(), this.getNumeroTemporada()]};

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

          var idSerie = "temporada" + this.getIdTemp();
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
            console.log("RESULTADO: ", doc.data());
            var data = doc.data();

            var ident = data.usuario;

            var ref = db.collection("Usuario").doc(ident);

            ref
              .get()
              .then((doc) => {
                if (doc.exists) {
                  var a = [
                    doc.data().fotoPerfil,
                    doc.data().alternativo,
                    data.usuario,
                  ];

                  data.usuario = a;

                  _this.reviews[num] = data;

                  if (_this.reviews.length == _this.idsReviews.length) {
                    _this.reviewsObtenidos = true;
                  }
                } else {
                  console.log("no existe el documento");
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
      var idSerie = "temporada" + this.getIdTemp();
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
    getIdPersona(i) {
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
    getIdTemp() {
      return this.resultado.id;
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
  color: #4b4453;
}
.capitulos {
  width: 100%;
}
.carta {
  width: 100%;
}
.foto {
  width: 200px;
}
.carta {
  color: rgb(0, 0, 0);
  border: none;
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
  margin-top: 1em;
  font-size: small;
}
h1 {
  font-weight: bolder;
}
h3 {
  font-weight: bold;
}
.imagen {
  max-width: 400px;
}
#titulo {
  margin-top: 1em;
}
</style>