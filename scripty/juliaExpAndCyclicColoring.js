// Generate a simple palette (smooth gradient)
    for (let i = 0; i < paletteSize; i++) {
        const r = Math.floor(128 + 127 * Math.sin(2 * Math.PI * i / paletteSize));
        const g = Math.floor(128 + 127 * Math.sin(2 * Math.PI * i / paletteSize + 2 * Math.PI / 3));
        const b = Math.floor(128 + 127 * Math.sin(2 * Math.PI * i / paletteSize + 4 * Math.PI / 3));
        palette.push(`rgb(${r},${g},${b})`);
    }

// Function to compute color based on exponential and cyclic iterations
function getColor(iteration, z) {

    if (iteration === nMax) return 'black'; // Inside Julia set

    // Exponential mapping
    const logZn = Math.log(z.re * z.re + z.im * z.im) / 2;
    const nu = Math.log(logZn / Math.log(2)) / Math.log(2);
    const smoothIteration = iteration + 1 - nu;

    // Cyclic iteration color mapping
    const colorIndex = Math.floor(smoothIteration) % paletteSize;
    return palette[colorIndex];
}

// Function to plot the Julia set
function drawJulia() {
    for (let px = 0; px < canvas.width; px++) {
        for (let py = 0; py < canvas.height; py++) {
            // Map pixel to complex number
            const x0 = xMin + (xMax - xMin) * px / canvas.width;
            const y0 = yMax - (yMax - yMin) * py / canvas.height;
            
            let x = x0;
            let y = y0;
            let iteration = 0;

            while (x*x + y*y <= escapeRadius && iteration < nMax) {
                const xtemp = x*x - y*y + c.real;
                y = 2*x*y + c.imag;
                x = xtemp;
                iteration++;
            }

            const color = getColor(iteration, { re: x, im: y });
            ctx.fillStyle = color;
            ctx.fillRect(px, py, 1, 1);
        }
    }
}

document.getElementById('iterationsSlider1').addEventListener('input', function () {
    document.getElementById('iterationsValue1').textContent = this.value;
  });

  function measureRendering(callback) {
    const startTime = performance.now();
    callback();
    const endTime = performance.now();
    document.getElementById("renderTime").textContent = `Rendering time: ${(endTime - startTime).toFixed(2)} ms`;
  }
  
  function renderCanvas() {
    measureRendering(() => {
        drawJulia();
        });
  }
  
  
  function apply() {
    c = { real: parseFloat(document.getElementById('cReal').value), 
                      imag: parseFloat(document.getElementById('cImag').value)
                     };
    nMax = parseInt(document.getElementById('iterationsSlider1').value);
  
    renderCanvas();
  }


// Start the rendering
renderCanvas();
