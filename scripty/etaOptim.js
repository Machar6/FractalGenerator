// Converts HEX color code to RGB
function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

// Interpolates between two RGB colors based on a parameter t
function interpolateColor(lowColor, highColor, t) {
    return [
        lowColor[0] * (1 - t) + highColor[0] * t,
        lowColor[1] * (1 - t) + highColor[1] * t,
        lowColor[2] * (1 - t) + highColor[2] * t,
    ];
}

// Checks if a point is inside the cardioid or period-2 bulb of the Mandelbrot set
function isInCardioidOrBulb(x, y) {
    let q = (x - 0.25) * (x - 0.25) + y * y;
    if (q * (q + (x - 0.25)) <= 0.25 * y * y) {
        return true;
    }
    if ((x + 1) * (x + 1) + y * y <= 0.0625) {
        return true;
    }
    return false;
}

// Escape time algorithm to calculate the number of iterations until escape
function escapeTimeAlgorithm(cReal, cImag, maxIterations) {
    let zReal = 0.0;
    let zImag = 0.0;
    let zRealSq, zImagSq;

    // Iterate until the point escapes or reaches max iterations
    for (let i = 0; i < maxIterations; i++) {
        zRealSq = zReal * zReal;
        zImagSq = zImag * zImag;

        if (zRealSq + zImagSq > 4.0) {
            return i;
        }

        zImag = 2.0 * zReal * zImag + cImag;
        zReal = zRealSq - zImagSq + cReal;
    }

    return maxIterations;
}

// Determines if a point belongs to the Mandelbrot set using escape time algorithm
function mandelbrot(cReal, cImag, maxIterations) {
    if (isInCardioidOrBulb(cReal, cImag)) {
        return -1;  // Point inside cardioid or bulb, treat it as part of the set
    }
    return escapeTimeAlgorithm(cReal, cImag, maxIterations); // Use escape time for other points
}

// Draws the Mandelbrot set on the canvas
function drawMandelbrot(canvas, width, height, maxIterations) {
    const imageData = ctx.createImageData(width, height);  // Create image data for the canvas
    const data = imageData.data;
    const scale = 3.5 / width;  
    const offsetX = -2.5;  
    const offsetY = -1.75; 

    const lowColor = hexToRgb(document.getElementById('lowColorPicker').value);
    const highColor = hexToRgb(document.getElementById('highColorPicker').value);

    // Loop over each pixel on the canvas
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let cReal = x * scale + offsetX; 
            let cImag = y * scale + offsetY;  
            let result = mandelbrot(cReal, cImag, maxIterations);  // Get the result for this point

            let index = (y * width + x) * 4;  // Calculate the index in the image data array

            if (result === -1) {
                data[index] = highColor[0];  
                data[index + 1] = highColor[1];
                data[index + 2] = highColor[2];
                data[index + 3] = 255;  // Full opacity
            } else {
                let t = result / maxIterations; 
                let color = interpolateColor(lowColor, highColor, t); 
                data[index] = color[0];  
                data[index + 1] = color[1];
                data[index + 2] = color[2];
                data[index + 3] = 255;
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);  // Put the image data onto the canvas
}

// Event listeners for the color pickers
document.getElementById('lowColorPicker').addEventListener('input', function () {
    lowColor = this.value;
});
document.getElementById('highColorPicker').addEventListener('input', function () {
    highColor = this.value;
});

// Event listener for the iterations slider
document.getElementById('iterationsSlider').addEventListener('input', function () {
    document.getElementById('iterationsValue').textContent = this.value;
});

// Measures the time taken for rendering
function measureRendering(callback) {
    const startTime = performance.now();
    callback();
    const endTime = performance.now();
    document.getElementById("renderTime").textContent = `Rendering time: ${(endTime - startTime).toFixed(2)} ms`;
}

// Renders the canvas with the current settings
function renderCanvas() {
    measureRendering(() => {
        drawMandelbrot(canvas, canvas.width, canvas.height, maxIterations);
    });
}

// Applies the settings and re-renders the canvas
function apply() {
    maxIterations = parseInt(document.getElementById('iterationsSlider').value);
    renderCanvas();
}

// Initial rendering
renderCanvas();
