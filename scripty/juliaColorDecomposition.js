// Function to multiply two complex numbers
function multiplyComplex(a, b) {
    return {
        real: a.real * b.real - a.imag * b.imag,
        imag: a.real * b.imag + a.imag * b.real,
    };
}

// Function to add two complex numbers
function addComplex(a, b) {
    return {
        real: a.real + b.real,
        imag: a.imag + b.imag,
    };
}

// Function to calculate the norm of a complex number
function normComplex(a) {
    return a.real * a.real + a.imag * a.imag;
}

// Function to calculate the argument (angle) of a complex number
function turn(a) {
    let arg = Math.atan2(a.imag, a.real);
    if (arg < 0) arg += Math.PI;
    return arg / Math.PI;
}

// Function to convert HSV values to RGB
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

// Function to generate color-decomposed Julia set image
function juliaColorDecomposition(w, h, nMax, r, cReal, cImag, r2) {
    const img = new Uint8Array(3 * w * h);

    // Loop through each pixel in the canvas
    for (let j = 0; j < h; j++) {
        const y = (h / 2 - (j + 0.5)) / (h / 2) * r;
        for (let i = 0; i < w; i++) {
            const x = (i + 0.5 - w / 2) / (h / 2) * r;
            let z = { real: x, imag: y };
            let k;

            const c = { real: cReal, imag: cImag };

            // Iterate to calculate Julia set
            for (k = 0; k < nMax; k++) {
                z = addComplex(multiplyComplex(z, z), c);
                if (normComplex(z) > r2) break;
            }

            let hue = 0, sat = 0, val = 0; // default color for interior

            if (k < nMax) { // exterior
                const et = k / nMax;
                const final_angle = turn(z);
                hue = et;
                sat = 0.8;
                val = final_angle;
            }

            // Convert HSV to RGB and store the color
            const { r: red, g: grn, b: blu } = hsv2rgb(hue, sat, val);
            const index = 3 * (j * w + i);
            img[index] = red;
            img[index + 1] = grn;
            img[index + 2] = blu;
        }
    }
    return img;
}

// Function to draw image on the canvas
function drawImage(canvas, img, w, h) {
    const ctx = canvas.getContext('2d');
    canvas.width = w;
    canvas.height = h;
    const imageData = ctx.createImageData(w, h);

    // Loop through pixel array and set image data
    for (let i = 0; i < img.length; i += 3) {
        const x = (i / 3) % w;
        const y = Math.floor((i / 3) / w);
        const index = (y * w + x) * 4;
        imageData.data[index] = img[i];     // R
        imageData.data[index + 1] = img[i + 1]; // G
        imageData.data[index + 2] = img[i + 2]; // B
        imageData.data[index + 3] = 255; // A
    }
    ctx.putImageData(imageData, 0, 0);
}

// Function to measure rendering time
function measureRendering(callback) {
    const startTime = performance.now();
    callback();
    const endTime = performance.now();
    document.getElementById("renderTime").textContent = `Rendering time: ${(endTime - startTime).toFixed(2)} ms`;
}

// Function to render the canvas with the Julia set image
function renderCanvas() {
    measureRendering(() => {
        drawImage(canvas, juliaColorDecomposition(canvas.width, canvas.height, nMax, r, cReal, cImag, r2), canvas.width, canvas.height);
    });
}

// Event listeners for sliders to update values
document.getElementById('iterationsSlider').addEventListener('input', function () {
    document.getElementById('iterationsValue').textContent = this.value;
});

document.getElementById('radiusSlider').addEventListener('input', function () {
    document.getElementById('radiusValue').textContent = this.value;
});

// Function to apply settings from the form and render the canvas
function apply() {
    nMax = parseInt(document.getElementById('iterationsSlider').value);
    cReal = parseFloat(document.getElementById('cReal').value);
    cImag = parseFloat(document.getElementById('cImag').value);
    r2 = parseInt(document.getElementById('radiusSlider').value);

    renderCanvas();
}

renderCanvas();
