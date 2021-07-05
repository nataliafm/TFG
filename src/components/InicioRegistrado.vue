<template>
  <div class="inicioRegistrado">
    <div v-if="!infoAmigosObtenida">
      {{ getInfoAmigos() }}
    </div>
    <b-container v-if="infoAmigosObtenida">
      <h3 v-if="!renderInfo">
        Añade a amigos para ver su última actividad aquí
      </h3>
      <b-row v-if="renderInfo">
        <b-col v-if="renderCaps">
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
              <b-card-text class="mt-2 nombre">{{
                getTextoCap(currentPageEpisodios, i)
              }}</b-card-text>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
      <b-row v-if="renderInfo">
        <b-col v-if="renderReviews">
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
                  <b-container v-if="infoReviews[i] != undefined">
                    <b-row no-gutters>
                      <b-col sm="1">
                        <b-card-img
                          :src="getReviewFoto(i)"
                          :alt="getReviewNombre(i)"
                        ></b-card-img>
                        <b-card-text class="nombre">{{
                          getReviewNombre(i)
                        }}</b-card-text>
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
                          <b-row no-gutters>
                            <b-col md="5">
                              <b-form-rating
                                v-if="infoReviews[i] != undefined"
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
      renderReviews: false,
      renderCaps: false,
    };
  },
  created() {
    window.addEventListener("resize", this.myEventHandler);
  },
  destroyed() {
    window.removeEventListener("resize", this.myEventHandler);
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
    aniadirReview(datos, i) {
      console.log("HA ENTRADO ", i, datos);
      var db = firebase.firestore();
      var ref = db.collection("Reviews").doc(datos.ultimoReview);
      var _this = this;

      ref
        .get()
        .then((d) => {
          if (d.exists) {
            console.log("RESULTADO 2: ", d.data());

            console.log("kwjengkjeng ", i);

            _this.infoReviews[i] = d.data();
            _this.reviewActual = i;

            console.log("aeiou ", _this.infoReviews);

            if (d.data().idContenido.tipo == "serie") {
              themoviedb.tv.getById(
                { id: d.data().idContenido.id },
                _this.exitoR,
                _this.error
              );
            } else {
              themoviedb.tv.getById(
                { id: d.data().idContenido.id[0] },
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
    },
    getInfoAmigo(i) {
      var _this = this;
      var db = firebase.firestore();

      db.collection("Usuario")
        .doc(this.idsAmigos[i])
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
            console.log("llega aqui ", datos);

            console.log("holaholahola ", i, _this.infoAmigos);
            console.log("ccccc ", _this.infoReviews);
            console.log("ddddd ", _this.infoCapitulos);

            console.log(datos.ultimoReview == undefined);
            console.log(datos.ultimoCap.length == 0);
            console.log(i);

            if (datos.ultimoReview != undefined) {
              console.log("llegaaa");
              _this.aniadirReview(datos, i);
            } else if (datos.ultimoCap.length > 0) {
              themoviedb.tv.getById(
                { id: _this.infoAmigos[i].ultimoCap[0] },
                _this.exito,
                _this.error
              );
            } else {
              console.log("Holaaa");
              if (_this.infoAmigos.length == _this.idsAmigos.length) {
                _this.infoAmigosObtenida = true;
              }
            }
          } else {
            console.log("Document doesn't exist");
          }
        });
    },
    exitoR(data) {
      console.log("Datosss:", data);
      var datos = JSON.parse(data);

      this.renderReviews = true;

      var id;

      for (var k of this.infoReviews.keys()) {
        if (this.infoReviews[k].idContenido.id[0] == datos["id"]) id = k;
      }

      var viejo = this.infoReviews[id];

      viejo["foto"] = datos["poster_path"];
      viejo["nombre"] = datos["name"];

      this.infoReviews[id] = viejo;

      if (this.infoAmigos[id].ultimoCap.length > 0) {
        themoviedb.tv.getById(
          { id: this.infoAmigos[id].ultimoCap[0] },
          this.exito,
          this.error
        );
      } else {
        if (this.infoAmigos.length == this.idsAmigos.length && this.infoReviews.length == this.getNumR()){
        //if (this.infoAmigos.length == this.idsAmigos.length) {
          console.log("ha entrado 1");
          this.infoAmigosObtenida = true;
        }
      }
    },
    exito(data) {
      console.log("Document data 1:", data);
      var datos = JSON.parse(data);

      this.infoCapitulos.set(datos["id"], {
        foto: datos["poster_path"],
        nombre: datos["name"],
      });

      console.log("aaaaa ", this.infoCapitulos);

      //if (this.infoAmigos.length == this.idsAmigos.length) {
      if (this.infoAmigos.length == this.idsAmigos.length && this.infoCapitulos.size == this.getNumCapitulos()){
        console.log("ha entrado 2", this.infoAmigos, this.infoCapitulos);
        this.infoAmigosObtenida = true;
        this.renderCaps = true;
      }
    },
    getNumCapitulos() {
      var num = 0;

      for (var k of this.infoAmigos.keys()) {
        if (this.infoAmigos[k].ultimoCap.length > 0) num++;
      }

      return num;
    },
    getNumR(){
      var num = 0;

      for (var k of this.infoAmigos.keys()){
        if (this.infoAmigos[k].ultimoReview != "") num++;
      }

      return num;
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
    myEventHandler(e) {
      console.log(e.target.innerWidth);
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
    getPerPage() {
      return this.perPage;
    },
    getKey() {
      return this.llave;
    },
    getFotoPerfil(i, j) {
      var array = [];
      var llaves = this.infoCapitulos.entries();

      array = Array.from(llaves);
      var path = array[(i - 1) * this.getPerPage() + j];
      var indexAmigo;

      if (path != undefined) {
        for (var x of this.infoAmigos.keys()) {
          if (this.infoAmigos[x].ultimoCap.length > 0) {
            if (this.infoAmigos[x].ultimoCap[0] == path[0]) {
              console.log("entra aqui");
              indexAmigo = x;
            }
          }
        }

        if (this.infoAmigos[indexAmigo] != undefined)
          return this.infoAmigos[indexAmigo].fotoPerfil;
        else return "";
      } else return "";
    },
    getAltPerfil(i, j) {
      var array = [];
      var llaves = this.infoCapitulos.entries();

      array = Array.from(llaves);
      var path = array[(i - 1) * this.getPerPage() + j];
      var indexAmigo;

      if (path != undefined) {
        for (var x of this.infoAmigos.keys()) {
          if (this.infoAmigos[x].ultimoCap.length > 0) {
            if (this.infoAmigos[x].ultimoCap[0] == path[0]) {
              console.log("entra aqui");
              indexAmigo = x;
            }
          }
        }

        if (this.infoAmigos[indexAmigo] != undefined)
          return this.infoAmigos[indexAmigo].altPerfil;
        else return "";
      } else return "";
    },
    getUsernamePerfil(i, j) {
      var array = [];
      var llaves = this.infoCapitulos.entries();

      array = Array.from(llaves);
      var path = array[(i - 1) * this.getPerPage() + j];
      var indexAmigo;

      if (path != undefined) {
        for (var x of this.infoAmigos.keys()) {
          if (this.infoAmigos[x].ultimoCap.length > 0) {
            if (this.infoAmigos[x].ultimoCap[0] == path[0]) {
              console.log("entra aqui");
              indexAmigo = x;
            }
          }
        }

        if (this.infoAmigos[indexAmigo] != undefined)
          return this.infoAmigos[indexAmigo].username;
        else return "";
      } else return "";
    },
    getIdAmigo(i, j) {
      var array = [];
      var llaves = this.infoCapitulos.entries();

      array = Array.from(llaves);
      var path = array[(i - 1) * this.getPerPage() + j];
      var indexAmigo;

      if (path != undefined) {
        for (var x of this.infoAmigos.keys()) {
          if (this.infoAmigos[x].ultimoCap.length > 0) {
            if (this.infoAmigos[x].ultimoCap[0] == path[0]) {
              console.log("entra aqui");
              indexAmigo = x;
            }
          }
        }

        if (this.idsAmigos[indexAmigo] != undefined)
          return this.idsAmigos[indexAmigo];
        else return "";
      } else return "";
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
      console.log("holap ", this.infoCapitulos);
      var array = [];
      var llaves = this.infoCapitulos.entries();

      array = Array.from(llaves);
      var path = array[(i - 1) * this.getPerPage() + j];

      if (path != undefined) {
        var cap = path[1];

        if (cap.foto != undefined && cap.foto != null)
          return "https://image.tmdb.org/t/p/original" + cap.foto;
        else
          return "https://firebasestorage.googleapis.com/v0/b/mitfg-12618.appspot.com/o/notfoundimage.png?alt=media&token=18058605-604d-4330-9fe2-b5706d9d1835";
      } else return "";
    },
    getAltSerie(i, j) {
      var array = [];
      var llaves = this.infoCapitulos.entries();

      array = Array.from(llaves);
      var path = array[(i - 1) * this.getPerPage() + j];

      if (path != undefined) {
        var cap = path[1];
        return cap.nombre;
      } else return "";
    },
    getTextoCap(i, j) {
      var array = [];
      var llaves = this.infoCapitulos.entries();

      array = Array.from(llaves);
      var path = array[(i - 1) * this.getPerPage() + j];
      var indexAmigo;

      if (path != undefined) {
        for (var x of this.infoAmigos.keys()) {
          if (this.infoAmigos[x].ultimoCap.length > 0) {
            if (this.infoAmigos[x].ultimoCap[0] == path[0]) {
              console.log("entra aqui");
              indexAmigo = x;
            }
          }
        }

        var cap = this.infoAmigos[indexAmigo];

        if (cap.ultimoCap != undefined)
          return (
            "Temporada " + cap.ultimoCap[1] + ", Capítulo " + cap.ultimoCap[2]
          );
        else return "";
      } else return "";
    },
    getReviewTexto(i) {
      if (this.infoReviews[i] != undefined) {
        return this.infoReviews[i].texto;
      } else return "";
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
        console.log(this.infoReviews);
        if (this.infoReviews[i].idContenido.tipo == "serie")
          return this.infoReviews[i].nombre;
        else if (this.infoReviews[i].idContenido.tipo == "temporada")
          return (
            this.infoReviews[i].nombre +
            ", temporada " +
            this.infoReviews[i].idContenido.id[1]
          );
        else
          return (
            this.infoReviews[i].nombre +
            ", temporada " +
            this.infoReviews[i].idContenido.id[1] +
            ", episodio " +
            this.infoReviews[i].idContenido.id[2]
          );
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
.nombre {
  margin-top: 1em;
  color: #4b4453;
  font-size: small;
}
</style>