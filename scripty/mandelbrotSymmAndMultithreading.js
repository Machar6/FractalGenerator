// Function to draw the Mandelbrot set using Web Workers for parallelism
function draw_mandelbrot() {
    for (let i = 0; i < numWorkers; i++) {
        // Create a worker from a dynamically generated script
        const worker = new Worker(URL.createObjectURL(new Blob([`
            // Function to calculate color based on iteration count
            function getColor(iteration, maxIterations) {
                if (iteration === maxIterations) {
                    return 'black'; // Points inside the Mandelbrot set
                }
                const t = iteration / maxIterations; // Normalized iteration count
                const b = Math.floor(9 * (1 - t) * t * t * t * 255);  // Blue gradient
                const g = Math.floor(15 * (1 - t) * (1 - t) * t * t * 255); // Green gradient
                const r = Math.floor(9 * (1 - t) * (1 - t) * (1 - t) * t * 255); // Red gradient
                return \`rgb(\${r}, \${g}, \${b})\`; // Return RGB color string
            }

            // Worker message handler for Mandelbrot calculations
            self.onmessage = function(event) {
                const { startY, endY, width, height, xMin, xMax, yMin, yMax, maxIterations } = event.data;
                const pixels = []; // Array to store pixel data

                for (let py = startY; py < endY; py++) {
                    for (let px = 0; px < width; px++) {
                        const x = xMin + (px / width) * (xMax - xMin);
                        const y = yMax - (py / height) * (yMax - yMin);
                        let iteration = 0, zx = 0, zy = 0;

                        // Mandelbrot set escape-time algorithm
                        while (zx * zx + zy * zy <= 4 && iteration < maxIterations) {
                            let xTemp = zx * zx - zy * zy + x;
                            zy = 2 * zx * zy + y;
                            zx = xTemp;
                            iteration++;
                        }

                        // Get the color for the current pixel
                        const color = getColor(iteration, maxIterations);
                        pixels.push({ px, py, color }); // Store pixel information
                    }
                }

                // Send pixel data back to the main thread
                self.postMessage({ pixels });
            }
        `], { type: 'application/javascript' })));

        // Configure the data for the current worker
        worker.postMessage({
            startY: i * chunkHeight,
            endY: (i + 1) * chunkHeight,
            width: canvas.width,
            height: canvas.height,
            xMin, xMax, yMin, yMax,
            maxIterations
        });

        // Handle responses from workers and render pixels
        worker.onmessage = (e) => {
            e.data.pixels.forEach(({ px, py, color }) => {
                ctx.fillStyle = color;
                ctx.fillRect(px, py, 1, 1); // Draw each pixel
            });
        };
    }
}

// Update iteration slider value dynamically
document.getElementById('iterationsSlider1').addEventListener('input', function () {
    document.getElementById('iterationsValue1').textContent = this.value;
});

// Update worker count dynamically
document.getElementById('numWorkers').addEventListener('input', function () {
    document.getElementById('numWorkersValue').textContent = this.value;
});

// Measure rendering time for performance insights
function measureRendering(callback) {
    const startTime = performance.now();
    callback(); // Execute the rendering process
    const endTime = performance.now();
    document.getElementById("renderTime").textContent = `Rendering time: ${(endTime - startTime).toFixed(2)} ms`;
}

// Clear and render the canvas with updated parameters
function renderCanvas() {
    measureRendering(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
        draw_mandelbrot(); // Draw Mandelbrot set
    });
}

// Apply changes and re-render the Mandelbrot set
function apply() {
    maxIterations = parseInt(document.getElementById('iterationsSlider1').value);
    numWorkers = parseInt(document.getElementById('numWorkers').value);
    renderCanvas(); // Re-render with updated values
}

// Initial render on page load
renderCanvas();
