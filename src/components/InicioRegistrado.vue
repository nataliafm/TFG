<template>
  <div class="inicioRegistrado">
    <div v-if="!infoAmigosObtenida">
      {{ getInfoAmigos() }}
    </div>
    <b-container v-if="infoAmigosObtenida">
      <b-row>
        <b-col>
          <h3 align="left" class="mb-4">Última actividad de tus amigos</h3>
          <b-pagination
            v-model="currentPageEpisodios"
            :total-rows="getNumEpisodios()"
            :per-page="perPage"
            aria-controls="episodios"
            :key="getKey()"
          ></b-pagination>
          <b-card-group id="episodios" :key="getKey()">
            <b-card
              v-for="i in Array(getPerPage()).keys()"
              :key="i"
              class="border-0"
              deck
            >
              <router-link
                v-if="getIdAmigo(currentPageEpisodios, i) != ''"
                :to="{
                  path: '/perfil',
                  query: { id: getIdAmigo(currentPageEpisodios, i) },
                }"
              >
                <b-card-text v-if="getIdAmigo(currentPageEpisodios, i) != ''"
                  ><b-avatar
                    :src="getFotoPerfil(currentPageEpisodios, i)"
                    :alt="getAltPerfil(currentPageEpisodios, i)"
                    size="sm"
                  ></b-avatar>
                  {{ getUsernamePerfil(currentPageEpisodios, i) }}</b-card-text
                >
              </router-link>

              <b-card-img
                class="mt-2"
                :src="getFotoSerie(currentPageEpisodios, i)"
                :alt="getAltSerie(currentPageEpisodios, i)"
              ></b-card-img>
              <b-card-text class="mt-2">{{
                getTextoCap(currentPageEpisodios, i)
              }}</b-card-text>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <h3 align="left" class="mb-4">Últimas reseñas de tus amigos</h3>
          <b-card-group id="reviews" :key="getKey()">
            <b-row>
              <b-col cols="12">
                <b-card
                  no-body
                  class="overflow-hidden border-0 mb-3 text-left"
                  v-for="i in Array(getNumReviews()).keys()"
                  :key="i"
                >
                  <b-container>
                    <b-row no-gutters>
                      <b-col sm="1">
                        <b-card-img :src="getReviewFoto(i)" :alt="getReviewNombre(i)"></b-card-img>
                        <b-card-text>{{ getReviewNombre(i) }}</b-card-text>
                      </b-col>
                      <b-col sm="11">
                        <router-link
                          v-if="getIdAmigoR(i) != ''"
                          :to="{
                            path: '/perfil',
                            query: { id: getIdAmigoR(i) },
                          }"
                        >
                          <b-card-text class="ml-5" v-if="getIdAmigoR(i) != ''"
                            ><b-avatar
                              :src="getFotoPerfilR(i)"
                              :alt="getAltPerfilR(i)"
                              size="sm"
                            ></b-avatar>
                            {{ getUsernamePerfilR(i) }}</b-card-text
                          >
                        </router-link>
                        <b-card-body>
                          <b-row>
                            <b-col md="5">
                              <b-form-rating
                                v-model="infoReviews[i].nota"
                                readonly
                                stars="10"
                                class="border-0"
                                show-value
                              ></b-form-rating>
                            </b-col>
                          </b-row>
                          <b-row class="mt-2 ml-2">
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
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import firebase from "firebase";
import themoviedb from "themoviedb-javascript-library";

export default {
  name: "InicioRegistrado",
  props: {},
  data() {
    return {
      infoAmigosObtenida: false,
      renderInfo: true,
      idsAmigos: [],
      infoAmigos: [],
      infoCapitulos: new Map(),
      infoReviews: [],
      currentPageEpisodios: 1,
      currentPageReviews: 1,
      perPage: 6,
      llave: true,
      reviewActual: 0,
    };
  },
  methods: {
    getInfoAmigos() {
      var _this = this;
      var ident = firebase.auth().currentUser.uid;
      var db = firebase.firestore();
      var ref = db.collection("Usuario").doc(ident);

      ref
        .get()
        .then((doc) => {
          console.log("Document data:", doc.data());
          var ids = doc.data().amigos;

          if (ids.length > 0) {
            _this.idsAmigos = ids;

            for (const i of _this.idsAmigos.keys()) {
              _this.getInfoAmigo(i);
            }
          } else {
            _this.infoAmigosObtenida = true;
            _this.renderInfo = false;
          }
        })
        .catch((error) => {
          console.log("Error: ", error);
        });
    },
    getInfoAmigo(i) {
      var _this = this;
      var db = firebase.firestore();
      this.reviewActual = i;

      db.collection("Usuario")
        .doc(_this.idsAmigos[i])
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log("RESULTADO: ", doc.data());
            var datos = {
              ultimoCap: doc.data().ultimoCap,
              ultimoReview: doc.data().reviews[doc.data().reviews.length - 1],
              username: doc.data().username,
              fotoPerfil: doc.data().fotoPerfil,
              altPerfil: doc.data().alternativo,
            };

            _this.infoAmigos[i] = datos;

            if (datos.ultimoReview != undefined) {
              var ref = db.collection("Reviews").doc(datos.ultimoReview);

              ref
                .get()
                .then((doc) => {
                  if (doc.exists) {
                    console.log("RESULTADO: ", doc.data());

                    _this.infoReviews[i] = doc.data();

                    if (_this.infoReviews[i].idContenido.tipo == "serie") {
                      themoviedb.tv.getById(
                        { id: _this.infoReviews[i].idContenido.id },
                        _this.exitoR,
                        _this.error
                      );
                    } else {
                      themoviedb.tv.getById(
                        { id: _this.infoReviews[i].idContenido.id[0] },
                        _this.exitoR,
                        _this.error
                      );
                    }
                  } else {
                    console.log("Documento no existe");
                  }
                })
                .catch((error) => {
                  console.log("Error: ", error);
                });
            } else if (datos.ultimoCap != []) {
              themoviedb.tv.getById(
                { id: _this.infoAmigos[i].ultimoCap[0] },
                _this.exito,
                _this.error
              );
            }
          } else {
            console.log("Document doesn't exist");
          }
        });
    },
    exitoR(data) {
      console.log("Document data:", data);
      var datos = JSON.parse(data);

      var viejo = this.infoReviews[this.reviewActual];

      viejo["foto"] = datos["poster_path"];
      viejo["nombre"] = datos["name"];

      themoviedb.tv.getById(
        { id: this.infoAmigos[this.reviewActual].ultimoCap[0] },
        this.exito,
        this.error
      );
    },
    exito(data) {
      console.log("Document data:", data);
      var datos = JSON.parse(data);

      this.infoCapitulos.set(datos["id"], {
        foto: datos["poster_path"],
        nombre: datos["name"],
      });

      if (this.infoAmigos.length == this.idsAmigos.length) {
        console.log(this.infoAmigos);
        console.log(this.infoReviews);
        this.infoAmigosObtenida = true;
      }
    },
    error(data) {
      console.log("Error: ", data);
    },
    getNumEpisodios() {
      return this.infoCapitulos.size;
    },
    getNumReviews() {
      return this.infoReviews.length;
    },
    getPerPage() {
      return this.perPage;
    },
    getKey() {
      return this.llave;
    },
    getFotoPerfil(i, j) {
      if (this.infoAmigos[(i - 1) * this.perPage + j] != undefined)
        return this.infoAmigos[(i - 1) * this.perPage + j].fotoPerfil;
      else return "";
    },
    getAltPerfil(i, j) {
      if (this.infoAmigos[(i - 1) * this.perPage + j] != undefined)
        return this.infoAmigos[(i - 1) * this.perPage + j].altPerfil;
      else return "";
    },
    getUsernamePerfil(i, j) {
      if (this.infoAmigos[(i - 1) * this.perPage + j] != undefined)
        return this.infoAmigos[(i - 1) * this.perPage + j].username;
      else return "";
    },
    getIdAmigo(i, j) {
      if (this.idsAmigos[(i - 1) * this.perPage + j] != undefined)
        return this.idsAmigos[(i - 1) * this.perPage + j];
      else return "";
    },
    getFotoPerfilR(i) {
      if (this.infoAmigos[i] != undefined) return this.infoAmigos[i].fotoPerfil;
      else return "";
    },
    getAltPerfilR(i) {
      if (this.infoAmigos[i] != undefined) return this.infoAmigos[i].altPerfil;
      else return "";
    },
    getUsernamePerfilR(i) {
      if (this.infoAmigos[i] != undefined) return this.infoAmigos[i].username;
      else return "";
    },
    getIdAmigoR(i) {
      if (this.idsAmigos[i] != undefined) return this.idsAmigos[i];
      else return "";
    },
    getFotoSerie(i, j) {
      var path = this.infoAmigos[(i - 1) * this.getPerPage() + j];

      if (path != undefined) {
        var cap = this.infoCapitulos.get(path.ultimoCap[0]);

        if (cap.foto != undefined && cap.foto != null)
          return "https://image.tmdb.org/t/p/original" + cap.foto;
        else
          return "https://firebasestorage.googleapis.com/v0/b/mitfg-12618.appspot.com/o/notfoundimage.png?alt=media&token=18058605-604d-4330-9fe2-b5706d9d1835";
      } else return "";
    },
    getAltSerie(i, j) {
      if (this.infoAmigos[(i - 1) * this.perPage + j] != undefined) {
        var cap = this.infoCapitulos.get(
          this.infoAmigos[(i - 1) * this.perPage + j].ultimoCap[0]
        );
        return cap.nombre;
      } else return "";
    },
    getTextoCap(i, j) {
      if (this.infoAmigos[(i - 1) * this.perPage + j] != undefined)
        return (
          "Temporada " +
          this.infoAmigos[(i - 1) * this.perPage + j].ultimoCap[1] +
          " Capítulo " +
          this.infoAmigos[(i - 1) * this.perPage + j].ultimoCap[2]
        );
      else return "";
    },
    getReviewTexto(i) {
      if (this.infoReviews[i] != undefined) {
        return this.infoReviews[i].texto;
      }
      else return "";
    },
    getReviewFoto(i) {
      var path = this.infoReviews[i];

      if (path != undefined) {
        var f = this.infoReviews[i].foto;

        if (f != undefined && f != null)
          return "https://image.tmdb.org/t/p/original" + f;
        else
          return "https://firebasestorage.googleapis.com/v0/b/mitfg-12618.appspot.com/o/notfoundimage.png?alt=media&token=18058605-604d-4330-9fe2-b5706d9d1835";
      } else return "";
    },
    getReviewNombre(i) {
      if (this.infoReviews[i] != undefined) {
        return this.infoReviews[i].nombre;
      }
      else return "";
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
</style>