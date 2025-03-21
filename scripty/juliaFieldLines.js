// Function to calculate the norm (squared magnitude) of a complex number
function norm(c) {
    return c.real * c.real + c.imag * c.imag;
}

// Function to generate Julia field lines based on the given parameters
function juliaFieldLines(w, h, nMax, r, ER2) {
    const img = new Uint8Array(w * h); // Array to store pixel data

    // Loop over each pixel in the canvas
    for (let j = 0; j < h; ++j) {
        const y = (h / 2 - (j + 0.5)) / (h / 2) * r;
        for (let i = 0; i < w; ++i) {
            const x = (i + 0.5 - w / 2) / (h / 2) * r;
            let z = { real: x, imag: y };
            let k;

            // Iterate the Julia function and check escape condition
            for (k = 0; k < nMax; ++k) {
                let zReal2 = z.real * z.real - z.imag * z.imag + c.real;
                let zImag2 = 2 * z.real * z.imag + c.imag;
                z.real = zReal2;
                z.imag = zImag2;

                if (norm(z) > ER2) break;
            }

            // Assign color based on iteration result and condition
            img[j * w + i] = (k < nMax && Math.abs(z.real) * 0.1 < Math.abs(z.imag)) ? 255 : 0;
        }
    }

    return img;
}

// Function to draw the generated image on the canvas
function drawImage(canvas, img, w, h) {
    const ctx = canvas.getContext('2d');
    canvas.width = w;
    canvas.height = h;
    const imageData = ctx.createImageData(w, h);

    // Convert the array to image data (RGB and alpha)
    for (let i = 0; i < img.length; i++) {
        const x = i % w;
        const y = Math.floor(i / w);
        const index = (y * w + x) * 4;
        const color = img[i] === 255 ? 255 : 0;

        imageData.data[index] = color;      // R
        imageData.data[index + 1] = color;  // G
        imageData.data[index + 2] = color;  // B
        imageData.data[index + 3] = 255;    // A (alpha)
    }

    ctx.putImageData(imageData, 0, 0);
}

// Event listeners to update displayed values when sliders are changed
document.getElementById('iterationsSlider').addEventListener('input', function () {
    document.getElementById('iterationsValue').textContent = this.value;
});
document.getElementById('radiusSlider1').addEventListener('input', function () {
    document.getElementById('radiusValue1').textContent = this.value;
});

// Measure rendering time and update display
function measureRendering(callback) {
    const startTime = performance.now();
    callback();
    const endTime = performance.now();
    document.getElementById("renderTime").textContent = `Rendering time: ${(endTime - startTime).toFixed(2)} ms`;
}

// Render the canvas using the generated Julia field lines
function renderCanvas() {
    measureRendering(() => {
        drawImage(canvas, juliaFieldLines(canvas.width, canvas.height, nMax, r, ER2), canvas.width, canvas.height);
    });
}

// Apply changes and update the canvas with new parameters
function apply() {
    ER = parseInt(document.getElementById('radiusSlider1').value);
    ER2 = ER * ER;
    nMax = parseInt(document.getElementById('iterationsSlider').value);
    c = {real: parseFloat(document.getElementById('cReal').value), 
         imag: parseFloat(document.getElementById('cImag').value)
        }
    renderCanvas();
}

// Initial rendering
renderCanvas();
