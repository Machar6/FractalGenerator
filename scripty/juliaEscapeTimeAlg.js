// Converts a hex color code to RGB array [r, g, b]
function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

// Interpolates between two RGB colors based on parameter t (from 0 to 1)
function interpolateColor(lowColor, highColor, t) {
    return [
        lowColor[0] * (1 - t) + highColor[0] * t,
        lowColor[1] * (1 - t) + highColor[1] * t,
        lowColor[2] * (1 - t) + highColor[2] * t,
    ];
}

// Escape time algorithm for the Julia set fractal
function escapeTimeAlgorithm(cReal, cImag, maxIterations, zReal, zImag) {
    let zRealSq, zImagSq;

    // Iterate and check if the point escapes the set
    for (let i = 0; i < maxIterations; i++) {
        zRealSq = zReal * zReal;
        zImagSq = zImag * zImag;

        // If the point escapes, return the iteration count
        if (zRealSq + zImagSq > 4.0) {
            return i;
        }

        // Update z based on the Julia set formula
        zImag = 2.0 * zReal * zImag + cImag;
        zReal = zRealSq - zImagSq + cReal;
    }

    return maxIterations; // If the point does not escape, return max iterations
}

// Draws the Julia set on a canvas with interpolation between two colors
function drawJulia(canvas, width, height, maxIterations, cReal, cImag) {
    const ctx = canvas.getContext("2d");
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    const scale = 4 / width; // Scale for the canvas coordinates to complex plane
    const centerX = width / 2; // Canvas center X
    const centerY = height / 2; // Canvas center Y

    // Get the low and high colors from the color pickers
    const lowColor = hexToRgb(document.getElementById('lowColorPicker').value);
    const highColor = hexToRgb(document.getElementById('highColorPicker').value);

    // Loop through each pixel in the canvas
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let zReal = (x - centerX) * scale; // Map pixel to complex plane
            let zImag = (centerY - y) * scale;

            let result = escapeTimeAlgorithm(cReal, cImag, maxIterations, zReal, zImag);

            let index = (y * width + x) * 4;

            // Set pixel color based on the iteration result
            if (result === maxIterations) {
                data[index] = highColor[0];
                data[index + 1] = highColor[1];
                data[index + 2] = highColor[2];
                data[index + 3] = 255; // Fully opaque
            } else {
                let t = result / maxIterations; // Normalize iteration result
                let color = interpolateColor(lowColor, highColor, t);
                data[index] = color[0];
                data[index + 1] = color[1];
                data[index + 2] = color[2];
                data[index + 3] = 255; // Fully opaque
            }
        }
    }

    // Draw the generated image on the canvas
    ctx.putImageData(imageData, 0, 0);
}

// Event listeners for the color pickers to update the colors dynamically
document.getElementById('lowColorPicker').addEventListener('input', function () {
    lowColor = this.value;
});
document.getElementById('highColorPicker').addEventListener('input', function () {
    highColor = this.value;
});

// Event listener for the iterations slider to update the iteration count display
document.getElementById('iterationsSlider').addEventListener('input', function () {
    document.getElementById('iterationsValue').textContent = this.value;
});

// Function to measure rendering time and display it
function measureRendering(callback) {
    const startTime = performance.now();
    callback();
    const endTime = performance.now();
    document.getElementById("renderTime").textContent = `Rendering time: ${(endTime - startTime).toFixed(2)} ms`;
}

// Render the Julia set on the canvas with the current parameters
function renderCanvas() {
    measureRendering(() => {
        const cReal = parseFloat(document.getElementById('cReal').value); // Real part of c
        const cImag = parseFloat(document.getElementById('cImag').value); // Imaginary part of c
        drawJulia(canvas, canvas.width, canvas.height, maxIterations, cReal, cImag);
    });
}

// Apply changes (from the UI) and re-render the Julia set
function apply() {
    maxIterations = parseInt(document.getElementById('iterationsSlider').value); // Get iterations from slider
    renderCanvas(); // Re-render the fractal
}

// Initial rendering
renderCanvas();
