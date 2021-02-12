<template>
  <div class="serie">
    <div v-if="!obtenido">
      {{ buscaSerie() }}
    </div>
    Resultado: {{resultado['results'][0]['name']}}
  </div>
</template>

<script>
import themoviedb from "themoviedb-javascript-library";

export default {
  name: "Serie",
  props: {},
  data() {
    return {
      obtenido: false,
      resultado: "",
    };
  },
  methods: {
    parsear(aux){
        this.resultado = JSON.parse(aux);
    },
    successCB(data) {
      console.log("Success callback: " + data);
      var aux = data;
      this.obtenido = true;
      this.parsear(aux);
    },
    errorCB(data) {
      console.log("Error callback: " + data);
    },
    buscaSerie() {
      themoviedb.search.getTv(
        { query: "Breaking%20Bad" },
        this.successCB,
        this.errorCB
      );
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
</style>