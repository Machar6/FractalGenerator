// Function to calculate the Mandelbrot set value for a given complex number
function mandelbrot(c) {
    let z = { x: 0, y: 0 }; // Start at the origin
    let iterations = 0; // Count the number of iterations
    while (z.x * z.x + z.y * z.y <= 4 && iterations < nMax) {
        let xTemp = z.x * z.x - z.y * z.y + c.x; // Real part of z^2 + c
        z.y = 2 * z.x * z.y + c.y; // Imaginary part of z^2 + c
        z.x = xTemp;
        iterations++;
    }
    return iterations; // Return the number of iterations
}

// Function to map a value to a color based on a gradient (HSL)
function colorMap(value) {
    const hue = 360 * value; // Hue proportional to the value
    return `hsl(${hue}, 90%, 50%)`; // Saturated and bright colors
}

// Function to map a value from one range to another
function mapRange(value, inputMin, inputMax, outputMin, outputMax) {
    return (value - inputMin) * (outputMax - outputMin) / (inputMax - inputMin) + outputMin;
}

// Function to draw the Mandelbrot set on the canvas
function draw_mandelbrot() {
    const data = new Array(canvas.width * canvas.height); // Store iteration counts for all pixels

    // Calculate the Mandelbrot set and build a histogram
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const cx = mapRange(x, 0, canvas.width, -2.2, 0.8); // Map x to complex plane
            const cy = mapRange(y, 0, canvas.height, -1.5, 1.5); // Map y to complex plane
            const iterations = mandelbrot({ x: cx, y: cy }); // Compute iterations
            data[y * canvas.width + x] = iterations; // Store iterations
            if (iterations < nMax) {
                histogram[iterations]++; // Update histogram
            }
        }
    }

    // Build the cumulative distribution function (CDF) for normalized coloring
    const cdf = new Array(nMax + 1).fill(0);
    let total = 0;
    for (let i = 0; i <= nMax; i++) {
        total += histogram[i]; // Cumulative sum
        cdf[i] = total;
    }

    // Normalize the CDF to values between 0 and 1
    for (let i = 0; i <= nMax; i++) {
        cdf[i] /= total; // Normalize to percentage
    }

    // Apply histogram-based coloring and render the Mandelbrot set
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const iterations = data[y * canvas.width + x];
            const colorValue = cdf[iterations]; // Use normalized CDF for smooth coloring
            const color = iterations === nMax ? 'black' : colorMap(colorValue); // Black for inside the set
            ctx.fillStyle = color;
            ctx.fillRect(x, y, 1, 1); // Draw pixel
        }
    }
}

// Update the iteration count display when the slider changes
document.getElementById('iterationsSlider').addEventListener('input', function () {
    document.getElementById('iterationsValue').textContent = this.value;
});

// Measure rendering time for performance analysis
function measureRendering(callback) {
    const startTime = performance.now();
    callback(); // Execute the rendering callback
    const endTime = performance.now();
    document.getElementById("renderTime").textContent = `Rendering time: ${(endTime - startTime).toFixed(2)} ms`;
}

// Function to render the Mandelbrot set on the canvas
function renderCanvas() {
    measureRendering(() => {
        draw_mandelbrot(); // Main rendering logic
    });
}

// Apply updated settings (iterations) and redraw the canvas
function apply() {
    nMax = parseInt(document.getElementById('iterationsSlider').value); // Get max iterations
    histogram = new Array(nMax + 1).fill(0); // Reset histogram
    renderCanvas(); // Re-render the canvas
}

// Initial rendering of the Mandelbrot set
renderCanvas();
