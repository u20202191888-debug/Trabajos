document.addEventListener("DOMContentLoaded", () => {
    Papa.parse("datos/mineria.csv", {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
          const data = results.data;

          const departamentos = {};
          data.forEach(row => {
            let depto = row["Departamento"];
            let cantidadStr = row["Cantidad_Produccion"] || row["Cantidad_Produccion"] || "0";
            let produccion = parseFloat(cantidadStr.replace(/,/g, "")) || 0;

            if (depto && produccion > 0) {
              departamentos[depto] = (departamentos[depto] || 0) + produccion;
            }
          });

          const labels = Object.keys(departamentos);
          const values = Object.values(departamentos);

          new Chart(document.getElementById("graficoDepartamentos"), {
            type: "bar",
            data: {
              labels: labels,
              datasets: [{
                label: "Producción Total",
                data: values,
                backgroundColor: "rgba(39, 174, 96, 0.7)"
              }]
            },
            options: {
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Producción Total por Departamento"
                }
              },
              scales: {
                x: { ticks: { autoSkip: false, maxRotation: 90, minRotation: 45 } }
              }
            }
          });
        }
    });
});
