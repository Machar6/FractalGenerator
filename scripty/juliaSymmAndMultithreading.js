// Function to draw Julia set with workers
function draw_julia() {
    for (let i = 0; i < numWorkers; i++) {
        const worker = new Worker(URL.createObjectURL(new Blob([`
            function getColor(iteration, maxIterations) {
                if (iteration === maxIterations) {
                    return 'black'; // Points inside the Julia set
                }
                const t = iteration / maxIterations;
                const b = Math.floor(9 * (1 - t) * t * t * t * 255); // Blue gradient
                const g = Math.floor(15 * (1 - t) * (1 - t) * t * t * 255); // Green gradient
                const r = Math.floor(9 * (1 - t) * (1 - t) * (1 - t) * t * 255); // Red gradient
                return \`rgb(\${r}, \${g}, \${b})\`;
            }

            self.onmessage = function(event) {
                const { startY, endY, width, height, xMin, xMax, yMin, yMax, maxIterations, cReal, cImag } = event.data;
                const pixels = [];
                for (let py = startY; py < endY; py++) {
                    for (let px = 0; px < width; px++) {
                        const zx = xMin + (px / width) * (xMax - xMin);
                        const zy = yMax - (py / height) * (yMax - yMin);
                        let iteration = 0, tempZx = zx, tempZy = zy;
                        while (tempZx * tempZx + tempZy * tempZy <= 4 && iteration < maxIterations) {
                            let xTemp = tempZx * tempZx - tempZy * tempZy + cReal;
                            tempZy = 2 * tempZx * tempZy + cImag;
                            tempZx = xTemp;
                            iteration++;
                        }
                        const color = getColor(iteration, maxIterations);
                        pixels.push({ px, py, color });
                    }
                }
                self.postMessage({ pixels });
            }
        `], { type: 'application/javascript' })));

        worker.onmessage = (e) => {
            e.data.pixels.forEach(({ px, py, color }) => {
                ctx.fillStyle = color;
                ctx.fillRect(px, py, 1, 1);
            });
        };
        worker.postMessage({
            startY: i * chunkHeight,
            endY: (i + 1) * chunkHeight,
            width: canvas.width,
            height: canvas.height,
            xMin, xMax, yMin, yMax,
            maxIterations,
            cReal, cImag
        });
    }
}

// Update maxIter and re-render when the slider changes
document.getElementById('iterationsSlider1').addEventListener('input', function () {
  document.getElementById('iterationsValue1').textContent = this.value;
});

// Update maxIter and re-render when the slider changes
document.getElementById('numWorkers').addEventListener('input', function () {
  document.getElementById('numWorkersValue').textContent = this.value;
});

function measureRendering(callback) {
  const startTime = performance.now();
  callback();
  const endTime = performance.now();
  document.getElementById("renderTime").textContent = `Rendering time: ${(endTime - startTime).toFixed(2)} ms`;
}

// Render canvas with Julia set
function renderCanvas() {
    measureRendering(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw_julia();
    });
}

// Re-render when the "apply" button is clicked
function apply() {
    maxIterations = parseInt(document.getElementById('iterationsSlider1').value);
    numWorkers = parseInt(document.getElementById('numWorkers').value);
    cReal = parseFloat(document.getElementById('cReal').value);
    cImag = parseFloat(document.getElementById('cImag').value);  
    renderCanvas();
}

renderCanvas();