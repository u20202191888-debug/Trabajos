document.addEventListener("DOMContentLoaded", () => {
  Papa.parse("datos/mineria.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      const data = results.data;

      const nacional = {};
      data.forEach(row => {
        let anio = row["Año Produccion"] || row["Año_Produccion"] || "";
        anio = anio.replace(/[^0-9]/g, ""); // limpiar 2,015 -> 2015
        let cantidadStr = row["Cantidad Producción"] || row["Cantidad Produccion"] || "0";
        let produccion = parseFloat(cantidadStr.replace(/,/g, "")) || 0;

        if (anio && produccion > 0) {
          nacional[anio] = (nacional[anio] || 0) + produccion;
        }
      });

      const labels = Object.keys(nacional).sort();
      const values = labels.map(anio => nacional[anio]);

      new Chart(document.getElementById("graficoNacional"), {
        type: "line",
        data: {
          labels: labels,
          datasets: [{
            label: "Producción Total Nacional",
            data: values,
            borderColor: "rgba(231, 76, 60, 0.9)",
            fill: false
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Producción Nacional Anual"
            }
          }
        }
      });
    }
  });
});
