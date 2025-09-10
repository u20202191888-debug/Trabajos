document.addEventListener("DOMContentLoaded", () => {
  Papa.parse("datos/mineria.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      const data = results.data;
      const departamentos = {};

      data.forEach(row => {
        let dep = row["Departamento"];
        let cantidadStr = row["Cantidad Producción"] || row["Cantidad Produccion"] || "0";
        let produccion = parseFloat(cantidadStr.replace(/,/g, "")) || 0;

        if (dep && produccion > 0) {
          departamentos[dep] = (departamentos[dep] || 0) + produccion;
        }
      });

      // Top 5 departamentos
      const topDeps = Object.entries(departamentos)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      new Chart(document.getElementById("graficoDepartamentos"), {
        type: "bar",
        data: {
          labels: topDeps.map(item => item[0]),
          datasets: [{
            label: "Producción Total",
            data: topDeps.map(item => item[1]),
            backgroundColor: "rgba(46, 204, 113, 0.7)"
          }]
        },
        options: { responsive: true }
      });

      // Torta con todos los departamentos
      new Chart(document.getElementById("graficoTortaDepartamentos"), {
        type: "pie",
        data: {
          labels: Object.keys(departamentos),
          datasets: [{
            label: "Producción",
            data: Object.values(departamentos),
            backgroundColor: [
              "#1abc9c","#3498db","#9b59b6","#f1c40f","#e67e22",
              "#e74c3c","#2ecc71","#34495e","#16a085","#8e44ad"
            ]
          }]
        }
      });
    }
  });
});
