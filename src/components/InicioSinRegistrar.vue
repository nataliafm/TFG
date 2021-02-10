<template>
  <div class="inicioSinRegistrar">
    <div class="registrate">
      Regístrate para acceder a todos nuestros contenidos
      <b-container class="beneficios">
        <b-row class="fila"> 
          <b-col class="card-ventaja" md="6">Guarda tus series favoritas</b-col>
          <b-col class="card-ventaja" md="6">Puntúa series y escribe reseñas</b-col>
        </b-row>
        <div></div>
        <b-row class="fila">
          <b-col class="card-ventaja" md="6">Crea listas</b-col>
          <b-col class="card-ventaja" md="6">Encuentra tu próxima serie favorita</b-col>
        </b-row>
        <b-row class="fila">
          <b-col class="card-ventaja" md="6">Interactúa con otros amantes de las series</b-col>
          <b-col class="card-ventaja" md="6">Accede a subtítulos y pistas de audiodescripción reunidos por la comunidad</b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
export default {
  name: "InicioSinRegistrar",
  props: {},
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
.registrate {
  width: 80%;
  margin: auto;
  margin-top: 7%;
  background-color: #585a599e;
  color: rgb(255, 255, 255);
  font-size: 150%;
}
.beneficios {
  width: 80%;
  margin: auto;
}
.card-ventaja {
  width: 20%;
  margin-top: 2%;
  margin-bottom: 2%;
  color: rgb(255, 255, 255);
}
</style>
