function createMandelbrotImage(w, h, n, r, realOffset) {
    const img = new Uint8Array(w * h);
    const r2 = r * r; // Square of radius for escape condition

    // Multiply two complex numbers
    function multiply(c1, c2) {
        return {
            real: c1.real * c2.real - c1.imag * c2.imag,
            imag: c1.real * c2.imag + c1.imag * c2.real
        };
    }

    // Add two complex numbers
    function add(c1, c2) {
        return {
            real: c1.real + c2.real,
            imag: c1.imag + c2.imag
        };
    }

    // Calculate the norm (squared magnitude) of a complex number
    function norm(c) {
        return c.real * c.real + c.imag * c.imag;
    }

    // Iterate over each pixel
    for (let j = 0; j < h; j++) {
        const y = (h / 2 - (j + 0.5)) / (h / 2) * r;
        for (let i = 0; i < w; i++) {
            const x = (i + 0.5 - w / 2) / (h / 2) * r + realOffset;
            let c = { real: x, imag: y }; // Complex coordinate
            let z = { real: 0, imag: 0 }; // Initial z value
            let k;

            // Mandelbrot iteration
            for (k = 0; k < n; k++) {
                z = multiply(z, z);
                z = add(z, c);
                if (norm(z) > r2) break; // Escape condition
            }

            // Binary coloring: 0 or 255 based on iteration count
            img[j * w + i] = (k & 1) ? 0 : 255;
        }
    }
    return img;
}

function drawImage(canvas, img, w, h) {
    const ctx = canvas.getContext('2d');
    canvas.width = w;
    canvas.height = h;
    const imageData = ctx.createImageData(w, h);

    // Fill image data based on the binary color
    for (let i = 0; i < img.length; i++) {
        const index = i * 4;
        const color = img[i];
        imageData.data[index] = color;     // R
        imageData.data[index + 1] = color; // G
        imageData.data[index + 2] = color; // B
        imageData.data[index + 3] = 255;   // A (fully opaque)
    }

    ctx.putImageData(imageData, 0, 0);
}

// Update UI and display current slider values
document.getElementById('iterationsSlider').addEventListener('input', function () {
    document.getElementById('iterationsValue').textContent = this.value;
});
document.getElementById('radius').addEventListener('input', function () {
    document.getElementById('radiusValue').textContent = this.value;
});

// Measure and display rendering time
function measureRendering(callback) {
    const startTime = performance.now();
    callback();
    const endTime = performance.now();
    document.getElementById("renderTime").textContent = `Rendering time: ${(endTime - startTime).toFixed(2)} ms`;
}

// Render the Mandelbrot set on the canvas
function renderCanvas() {
    measureRendering(() => {
        drawImage(canvas, createMandelbrotImage(canvas.width, canvas.height, nMax, r1, realOffset), canvas.width, canvas.height);
    });
}

// Apply user settings and render the Mandelbrot set
function apply() {
    nMax = parseInt(document.getElementById('iterationsSlider').value);
    r1 = parseInt(document.getElementById('radius').value);
    renderCanvas();
}

// Initial rendering
renderCanvas();
