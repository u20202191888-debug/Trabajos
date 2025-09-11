document.addEventListener("DOMContentLoaded", () => {
  Papa.parse("datos/mineria.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      const data = results.data;
      if (!data || data.length === 0) return;

      const departamentos = [...new Set(data.map(row => row["Departamento"]))].sort();
      const select = document.getElementById("departamentoSelect");

      departamentos.forEach(dep => {
        const opt = document.createElement("option");
        opt.value = dep;
        opt.textContent = dep;
        select.appendChild(opt);
      });

      let chartBarras, chartTorta;

      function actualizarGraficos(departamento) {
        const mineralesDepto = {};

        data.forEach(row => {
          if (row["Departamento"] === departamento) {
            const mineral = row["Recurso_Natural"] || row["Recurso Natural"];
            let cantidad = parseFloat((row["Cantidad_Produccion"] || "0").replace(/,/g, ""));
            if (!isNaN(cantidad)) {
              mineralesDepto[mineral] = (mineralesDepto[mineral] || 0) + cantidad;
            }
          }
        });

        const entries = Object.entries(mineralesDepto).sort((a, b) => b[1] - a[1]);
        const top = entries.slice(0, 5);

        const labelsBarras = top.map(x => x[0]);
        const valoresBarras = top.map(x => x[1]);

        const labelsTorta = entries.map(x => x[0]);
        const valoresTorta = entries.map(x => x[1]);

        if (chartBarras) chartBarras.destroy();
        if (chartTorta) chartTorta.destroy();

        chartBarras = new Chart(document.getElementById("graficoDeptoBarras"), {
          type: "bar",
          data: {
            labels: labelsBarras,
            datasets: [{
              label: "Producción",
              data: valoresBarras,
              borderColor: "rgba(206, 215, 31, 0.9)",
              backgroundColor: "rgba(157, 7, 7, 0.5)",
              fill: false,
              showLine: true,
              pointRadius: 8,
              pointHoverRadius: 12
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: { beginAtZero: true }
            }
          }
        });
        chartTorta = new Chart(document.getElementById("graficoDeptoTorta"), {
          type: "pie",
          data: {
            labels: labelsTorta,
            datasets: [{
              data: valoresTorta,
              backgroundColor: [
                "#e74c3c","#3498db","#2ecc71",
                "#f1c40f","#9b59b6","#34495e",
                "#1abc9c","#d35400","#7f8c8d"
              ]
            }]
          },
          options: { responsive: true }
        });
      }

      actualizarGraficos(departamentos[0]);
      select.addEventListener("change", (e) => {
        actualizarGraficos(e.target.value);
      });
    }
  });
});
