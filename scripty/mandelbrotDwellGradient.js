// Function to calculate the squared magnitude (norm) of a complex number
function norm(cReal, cImag) {
    return cReal * cReal + cImag * cImag;
}

// Function to calculate the magnitude (absolute value) of a complex number
function magnitude(cReal, cImag) {
    return Math.sqrt(cReal * cReal + cImag * cImag);
}

// Converts HSV (Hue, Saturation, Value) to RGB (Red, Green, Blue) color space
function hsv2rgb(h, s, v) {
    let r, g, b;
    if (s === 0) {
        r = g = b = v; // If saturation is 0, the color is grayscale
    } else {
        h = 6 * (h - Math.floor(h)); // Scale hue to a 0-6 range
        const i = Math.floor(h); // Get the integer part of hue
        const f = h - i; // Fractional part of hue
        const p = v * (1 - s); // p = value at the lowest saturation
        const q = v * (1 - s * f); // q = value between p and v
        const t = v * (1 - s * (1 - f)); // t = value between p and v
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
        r: Math.round(255 * r), // Convert to RGB and scale to [0, 255]
        g: Math.round(255 * g),
        b: Math.round(255 * b),
    };
}

// Function to create the Mandelbrot image with given parameters
function createImage(w, h, n, s, r, r2) {
    const TwoPi = 2 * Math.PI; // Constant for full circle in radians
    const mu = new Float32Array((w + 1) * (h + 1)); // Array to store the fractal escape times
    const img = new Uint8Array(3 * w * h); // Array to store pixel colors

    // Loop over each pixel in the image
    for (let j = 0; j < h + 1; j++) {
        const y = (h / 2 - (j + 0.5)) / (h / 2) * r; // Calculate the corresponding y-coordinate
        for (let i = 0; i < w + 1; i++) {
            const x = (i + 0.5 - w / 2) / (h / 2) * r - 1; // Calculate the corresponding x-coordinate
            let cReal = x;
            let cImag = y;
            let zReal = 0;
            let zImag = 0;
            let k;

            // Mandelbrot escape-time algorithm
            for (k = 0; k < n; k++) {
                const zNewReal = zReal * zReal - zImag * zImag + cReal;
                const zNewImag = 2 * zReal * zImag + cImag;
                zReal = zNewReal;
                zImag = zNewImag;
                if (norm(zReal, zImag) > r2) break; // Break if the point escapes
            } 
            // Store the escape time or coloring information
            mu[j * (w + 1) + i] = k === n ? 0 : k + 1 - Math.log2(Math.log(magnitude(zReal, zImag)));
        }
    }

    let k0, kx, ky;
    let v1, v2, v3, vNorm;
    let g1, g2, g3;
    let hue, sat, val;

    // Loop to compute gradients and assign colors to each pixel
    for (let j = 0; j < h; j++) {
        for (let i = 0; i < w; i++) {
            k0 = j * (w + 1) + i; // Current pixel position
            kx = j * (w + 1) + (i + 1); // Pixel on the right
            ky = (j + 1) * (w + 1) + i; // Pixel below
            v1 = mu[kx] - mu[k0]; // Gradient in the x-direction
            v2 = mu[ky] - mu[k0]; // Gradient in the y-direction
            v3 = s * 4; // Gradient impact in the z-direction
            vNorm = Math.sqrt(v1 * v1 + v2 * v2 + v3 * v3); // Compute the gradient magnitude
            g1 = v1 / vNorm; // Normalize the gradient components
            g2 = v2 / vNorm;
            g3 = v3 / vNorm;
            hue = Math.atan2(g1, g2) / TwoPi; // Calculate hue from the gradient
            sat = mu[k0] > 0 ? 0.5 : 0; // Set saturation based on escape time
            val = g3; // Value from the z-direction gradient

            // Convert hue, saturation, and value to RGB
            const { r: red, g: grn, b: blu } = hsv2rgb(hue, sat, val);

            // Set the RGB values for the current pixel
            const index = 3 * (j * w + i);
            img[index] = red;
            img[index + 1] = grn;
            img[index + 2] = blu;
        }
    }

    return img; // Return the generated image
}

// Function to draw the generated image on a canvas
function drawImage(canvas, img, w, h) {
    const ctx = canvas.getContext('2d');
    canvas.width = w;
    canvas.height = h;
    const imageData = ctx.createImageData(w, h);

    // Populate the image data with RGB values
    for (let i = 0; i < img.length; i += 3) {
        const x = (i / 3) % w;
        const y = Math.floor((i / 3) / w);
        const index = (y * w + x) * 4;
        imageData.data[index] = img[i];     // R
        imageData.data[index + 1] = img[i + 1]; // G
        imageData.data[index + 2] = img[i + 2]; // B
        imageData.data[index + 3] = 255; // A (alpha channel, fully opaque)
    }
    ctx.putImageData(imageData, 0, 0); // Put the image data onto the canvas
}

// Event listener to update iteration count on slider change
document.getElementById('iterationsSlider').addEventListener('input', function () {
    document.getElementById('iterationsValue').textContent = this.value;
});

// Function to measure and display rendering time
function measureRendering(callback) {
    const startTime = performance.now(); // Start timer
    callback(); // Call the rendering callback
    const endTime = performance.now(); // End timer
    document.getElementById("renderTime").textContent = `Rendering time: ${(endTime - startTime).toFixed(2)} ms`; // Display rendering time
}

// Function to render the fractal on the canvas
function renderCanvas() {
    measureRendering(() => {
        drawImage(canvas, createImage(canvas.width, canvas.height, nMax, 0.5, r, 25 * 25), canvas.width, canvas.height);
    });
}

// Function to apply user-selected settings and re-render the canvas
function apply() {
    nMax = parseInt(document.getElementById('iterationsSlider').value); // Get number of iterations from the slider
    renderCanvas(); // Re-render the canvas with new settings
}

// Initial render of the fractal
renderCanvas();
