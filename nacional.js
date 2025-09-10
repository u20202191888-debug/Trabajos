document.addEventListener("DOMContentLoaded", () => {
  Papa.parse("datos/mineria.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      const data = results.data;
      const minerales = {};
      const departamentos = {};

      data.forEach(row => {
        let mineral = row["Recurso Natural"] || row["Recurso_Natural"];
        let dep = row["Departamento"];
        let cantidadStr = row["Cantidad Producción"] || row["Cantidad Produccion"] || "0";
        let produccion = parseFloat(cantidadStr.replace(/,/g, "")) || 0;

        if (mineral) {
          minerales[mineral] = (minerales[mineral] || 0) + produccion;
        }
        if (dep) {
          departamentos[dep] = (departamentos[dep] || 0) + produccion;
        }
      });

      // Top 5 minerales
      const topMinerales = Object.entries(minerales).sort((a, b) => b[1] - a[1]).slice(0, 5);

      new Chart(document.getElementById("graficoTopNacional"), {
        type: "bar",
        data: {
          labels: topMinerales.map(item => item[0]),
          datasets: [{
            label: "Producción Total",
            data: topMinerales.map(item => item[1]),
            backgroundColor: "rgba(231, 76, 60, 0.7)"
          }]
        }
      });

      // Top 5 departamentos
      const topDeps = Object.entries(departamentos).sort((a, b) => b[1] - a[1]).slice(0, 5);

      new Chart(document.getElementById("graficoDepartamentosTop"), {
        type: "bar",
        data: {
          labels: topDeps.map(item => item[0]),
          datasets: [{
            label: "Producción Total",
            data: topDeps.map(item => item[1]),
            backgroundColor: "rgba(155, 89, 182, 0.7)"
          }]
        }
      });
    }
  });
});
