 document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Página cargada. Iniciando lectura del CSV...");

  Papa.parse("datos/mineria.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      console.log("📂 Datos cargados del CSV:", results.data);

      const data = results.data;
      if (!data || data.length === 0) {
        return;
      }

      const minerales = {};
      data.forEach((row, i) => {
        let mineral = row["Recurso Natural"] || row["Recurso_Natural"];
        let cantidadStr = row["Cantidad Producción"] || row["Cantidad Produccion"] || row["Cantidad_Produccion"] || "0";
        let produccion = parseFloat(cantidadStr.replace(/,/g, "")) || 0;

        if (mineral && produccion > 0) {
          minerales[mineral] = (minerales[mineral] || 0) + produccion;
        } else {
        }
      });

      console.log("📊 Totales agrupados por mineral:", minerales);

      // Tomar top 5 minerales
      const topMinerales = Object.entries(minerales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      if (topMinerales.length === 0) {
        return;
      }

      const labels = topMinerales.map(item => item[0]);
      const values = topMinerales.map(item => item[1]);

      new Chart(document.getElementById("graficoTopMinerales"), {
        type: "bar",
        data: {
          labels: labels,
          datasets: [{
            label: "Producción Total",
            data: values,
            backgroundColor: "rgba(52, 152, 219, 0.7)"
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: "Top 5 Recursos Naturales Extraídos en Colombia (2012-2024)"
            }
          }
        }
      });
    },
    error: function(err) {
    }
  });
});