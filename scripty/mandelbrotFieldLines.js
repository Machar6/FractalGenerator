function norm(z) {
    return z.real * z.real + z.imag * z.imag;
}

function mandelbrotFieldLines(w, h, nMax, r, ER2) {
    const img = new Uint8Array(w * h); // Array to store pixel values

    for (let j = 0; j < h; ++j) {
        const y = (h / 2 - (j + 0.5)) / (h / 2) * r;
        for (let i = 0; i < w; ++i) {
            const x = (i + 0.5 - w / 2) / (h / 2) * r + realOffset1;
            let c = { real: x, imag: y }; // Complex constant
            let z = { real: 0, imag: 0 }; // Initial z value
            let k;

            for (k = 0; k < nMax; ++k) {
                // Mandelbrot iteration
                let zReal2 = z.real * z.real - z.imag * z.imag + c.real;
                let zImag2 = 2 * z.real * z.imag + c.imag;
                z.real = zReal2;
                z.imag = zImag2;

                if (norm(z) > ER2) break; // Escape condition
            }
            // Determine pixel color
            img[j * w + i] = (k < nMax && Math.abs(z.real) * 0.1 < Math.abs(z.imag)) ? 255 : 0;
        }
    }

    return img;
}

function drawImage(canvas, img, w, h) {
    const ctx = canvas.getContext('2d');
    canvas.width = w;
    canvas.height = h;
    const imageData = ctx.createImageData(w, h);

    for (let i = 0; i < img.length; i++) {
        const index = i * 4;
        const color = img[i] === 255 ? 255 : 0;

        imageData.data[index] = color;      // Red
        imageData.data[index + 1] = color;  // Green
        imageData.data[index + 2] = color;  // Blue
        imageData.data[index + 3] = 255;    // Alpha
    }

    ctx.putImageData(imageData, 0, 0);
}

// Update UI elements on slider change
document.getElementById('iterationsSlider').addEventListener('input', function () {
    document.getElementById('iterationsValue').textContent = this.value;
});
document.getElementById('radiusSlider1').addEventListener('input', function () {
    document.getElementById('radiusValue1').textContent = this.value;
});

// Measure rendering time
function measureRendering(callback) {
    const startTime = performance.now();
    callback();
    const endTime = performance.now();
    document.getElementById("renderTime").textContent = `Rendering time: ${(endTime - startTime).toFixed(2)} ms`;
}

// Render canvas with the current parameters
function renderCanvas() {
    measureRendering(() => {
        drawImage(canvas, mandelbrotFieldLines(canvas.width, canvas.height, nMax, r, ER2), canvas.width, canvas.height);
    });
}

// Apply changes from UI inputs
function apply() {
    ER = parseInt(document.getElementById('radiusSlider1').value);
    ER2 = ER * ER;
    nMax = parseInt(document.getElementById('iterationsSlider').value);
    renderCanvas();
}

// Initial rendering
renderCanvas();
