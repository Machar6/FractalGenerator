// Multiplies two complex numbers
function multiply(c1, c2) {
    return {
        real: c1.real * c2.real - c1.imag * c2.imag,
        imag: c1.real * c2.imag + c1.imag * c2.real
    };
}

// Adds two complex numbers
function add(c1, c2) {
    return {
        real: c1.real + c2.real,
        imag: c1.imag + c2.imag
    };
}

// Returns the squared norm (magnitude) of a complex number
function norm(c) {
    return c.real * c.real + c.imag * c.imag;
}

// Returns the magnitude (absolute value) of a complex number
function magnitude(c) {
    return Math.sqrt(c.real * c.real + c.imag * c.imag);
}

// Returns the argument (angle) of a complex number, scaled to [0, 1]
function turn(c) {
    let arg = Math.atan2(c.imag, c.real);
    if (arg < 0) arg += Math.PI;
    return arg / Math.PI;
}

// Converts HSV color to RGB
function hsv2rgb(h, s, v) {
    let r, g, b;
    if (s === 0) {
        r = g = b = v;
    } else {
        h = 6 * (h - Math.floor(h));
        const i = Math.floor(h);
        const f = h - i;
        const p = v * (1 - s);
        const q = v * (1 - s * f);
        const t = v * (1 - s * (1 - f));
        switch (i) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            default: r = v; g = p; b = q; break;
        }
    }
    return {
        r: Math.round(255 * r),
        g: Math.round(255 * g),
        b: Math.round(255 * b),
    };
}

// Generates the Mandelbrot set with color decomposition
function mandelbrotColorDecomposition(w, h, nMax, r, er2) {
    const img = new Uint8Array(3 * w * h);

    // Loop through each pixel
    for (let j = 0; j < h; j++) {
        const y = (h / 2 - (j + 0.5)) / (h / 2) * r;
        for (let i = 0; i < w; i++) {
            const x = (i + 0.5 - w / 2) / (h / 2) * r - 1;
            let c = { real: x, imag: y };
            let z = { real: 0, imag: 0 };
            let k;

            // Iterate for Mandelbrot set computation
            for (k = 0; k < nMax; k++) {
                z = add(multiply(z, z), c);
                if (norm(z) > er2) break;
            }

            let hue = 0, sat = 0, val = 0; // Default black color

            // Calculate color if the point is within the set
            if (k < nMax) {
                const et = k / nMax;
                const normalizedArgument = turn(z);
                hue = et;
                sat = 0.8;
                val = normalizedArgument;
            }

            // Convert HSV to RGB and set pixel color
            const { r: red, g: grn, b: blu } = hsv2rgb(hue, sat, val);
            const index = 3 * (j * w + i);
            img[index] = red;
            img[index + 1] = grn;
            img[index + 2] = blu;
        }
    }
    return img;
}

// Draw the image on the canvas
function drawImage(canvas, img, w, h) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(w, h);

    // Set pixel data
    for (let i = 0; i < img.length; i += 3) {
        const x = (i / 3) % w;
        const y = Math.floor((i / 3) / w);
        const index = (y * w + x) * 4;
        imageData.data[index] = img[i];     // R
        imageData.data[index + 1] = img[i + 1]; // G
        imageData.data[index + 2] = img[i + 2]; // B
        imageData.data[index + 3] = 255;   // A (alpha)
    }
    ctx.putImageData(imageData, 0, 0);
}

// Update the radius value from the slider input
document.getElementById('radiusSlider').addEventListener('input', function () {
    document.getElementById('radiusValue').textContent = this.value;
});

// Measure rendering time
function measureRendering(callback) {
    const startTime = performance.now();
    callback();
    const endTime = performance.now();
    document.getElementById("renderTime").textContent = `Rendering time: ${(endTime - startTime).toFixed(2)} ms`;
}

// Render the canvas
function renderCanvas() {
    measureRendering(() => {
        drawImage(canvas, mandelbrotColorDecomposition(canvas.width, canvas.height, nMax, r, er2), canvas.width, canvas.height);
    });
}

// Apply changes based on slider input
function apply() {
    er2 = parseInt(document.getElementById('radiusSlider').value);
    renderCanvas();
}

// Initial render
renderCanvas();
