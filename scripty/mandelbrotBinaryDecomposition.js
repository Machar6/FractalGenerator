// Function to calculate the norm of a complex number
function mandelbrotBinaryDecomposition() {
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    // Loop through each pixel in the canvas
    for (let j = 0; j < canvas.height; j++) {
        let y = (canvas.height / 2 - (j + 0.5)) / (canvas.height / 2) * r;
        for (let i = 0; i < canvas.width; i++) {
            let x = (i + 0.5 - canvas.width / 2) / (canvas.height / 2) * r - 1;
            let c = { real: x, imag: y };
            let z = { real: 0, imag: 0 };
            let k;

            // Iterate to determine if the point escapes the Mandelbrot set
            for (k = 0; k < nMax; k++) {
                let zReal2 = z.real * z.real - z.imag * z.imag + c.real;
                let zImag2 = 2 * z.real * z.imag + c.imag;
                z.real = zReal2;
                z.imag = zImag2;

                if (z.real * z.real + z.imag * z.imag > er2) break; // Exit if point escapes
            }

            // Color pixels based on the escape condition
            let index = (j * canvas.width + i) * 4;
            let color = (k < nMax && z.imag < 0) ? 255 : 0;
            data[index] = color;     // Red component
            data[index + 1] = color; // Green component
            data[index + 2] = color; // Blue component
            data[index + 3] = 255;   // Alpha component
        }
    }

    ctx.putImageData(imageData, 0, 0); // Apply the generated image to the canvas
}

// Update displayed radius value when slider is adjusted
document.getElementById('radiusSlider').addEventListener('input', function () {
    document.getElementById('radiusValue').textContent = this.value;
});

// Measure and display rendering time
function measureRendering(callback) {
    const startTime = performance.now(); // Start timer
    callback(); // Execute the callback
    const endTime = performance.now(); // End timer
    document.getElementById("renderTime").textContent = `Rendering time: ${(endTime - startTime).toFixed(2)} ms`;
}

// Trigger rendering of the canvas
function renderCanvas() {
    measureRendering(() => {
        mandelbrotBinaryDecomposition(); // Render Mandelbrot set
    });
}

// Apply changes from the radius slider and render
function apply() {
    er2 = parseInt(document.getElementById('radiusSlider').value); // Get new radius value
    renderCanvas(); // Re-render with the updated value
}

// Initial rendering when the page loads
renderCanvas();
