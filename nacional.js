document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Página cargada. Iniciando lectura del CSV...");

  Papa.parse("datos/mineria.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      console.log("📂 Datos cargados del CSV:", results.data);

      const data = results.data;
      const minerales = {};
      const departamentos = {};

          data.forEach(row => {
          console.log("Fila CSV:", row); 

          let mineral = row["Recurso_Natural"];
          let dep = row["Departamento"];
          let cantidadStr = row["Cantidad_Produccion"] || "0";
          let produccion = parseFloat(cantidadStr.replace(/,/g, "")) || 0;

          if (mineral) {
            minerales[mineral] = (minerales[mineral] || 0) + produccion;
          }
          if (dep) {
            departamentos[dep] = (departamentos[dep] || 0) + produccion;
          }
        });

      const topMinerales = Object.entries(minerales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

      const labelsMinerales = topMinerales.map(item => item[0]);
      const valoresMinerales = topMinerales.map(item => item[1]);

      new Chart(document.getElementById("graficoTopNacional"), {
        type: "line",
        data: {
          labels: labelsMinerales,
          datasets: [{
            label: "Producción Total de Minerales",
            data: valoresMinerales,
            borderColor: "rgba(231, 76, 60, 0.9)",
            backgroundColor: "rgba(231, 76, 60, 0.7)",
            fill: false,
            pointRadius: 8,
            pointHoverRadius: 12
          }]
        },
        options: {
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => 
                  `${labelsMinerales[context.dataIndex]}: ${context.raw.toLocaleString()}`
              }
            }
          },
          scales: {
            x: { title: { display: true, text: "Minerales" } },
            y: { beginAtZero: true, title: { display: true, text: "Producción Total" } }
          }
        }
      });

      const depEntries = Object.entries(departamentos)
        .sort((a, b) => b[1] - a[1]);

      const labelsDeps = depEntries.map(item => item[0]);
      const valoresDeps = depEntries.map(item => item[1]);

      new Chart(document.getElementById("graficoDepartamentosTop"), {
        type: "bar",
        data: {
          labels: labelsDeps,
          datasets: [{
            label: "Producción por Departamento",
            data: valoresDeps,
            backgroundColor: "rgba(52, 152, 219, 0.7)"
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: { title: { display: true, text: "Departamentos" } },
            y: { beginAtZero: true, title: { display: true, text: "Producción Total" } }
          }
        }
      });
    }
  });
});

