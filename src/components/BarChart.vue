

<script>
import { Bar } from "vue-chartjs";

export default {
  name: "BarChart",
  extends: Bar,
  props: 
    ['chartdata', 'options']
  ,
  mounted() {
    this.renderChart(this.chartdata, this.options);
  },
};
</script>

<style></style>