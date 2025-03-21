function multiply(aReal, aImag, bReal, bImag) {
    // Multiplies two complex numbers a and b
    return {
        real: aReal * bReal - aImag * bImag,
        imag: aReal * bImag + aImag * bReal
    };
}

function norm(real, imag) {
    // Returns the squared norm of a complex number
    return real * real + imag * imag;
}

function magnitude(real, imag) {
    // Returns the magnitude (absolute value) of a complex number
    return Math.sqrt(real * real + imag * imag);
}

function hsv2rgb(h, s, v) {
    // Converts HSV color to RGB
    let r, g, b;
    if (s === 0) {
        r = g = b = v;  // If saturation is zero, the color is grey
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

function createImage(w, h, cReal, cImag, n, s, r, r2) {
    const mu = new Float32Array((w + 1) * (h + 1));  // Array to store escape times for each pixel
    const img = new Uint8Array(3 * w * h);  // Array for RGB values of the image
    const TwoPi = 2 * Math.PI;  // Constant for circular calculations

    for (let j = 0; j < h + 1; j++) {
        const y = (h / 2 - (j + 0.5)) / (h / 2) * r; 
        for (let i = 0; i < w + 1; i++) {
            const x = (i + 0.5 - w / 2) / (h / 2) * r; 
            let zReal = x, zImag = y;
            let k;
            const cRealCopy = cReal, cImagCopy = cImag;

            for (k = 0; k < n; k++) {
                const z = multiply(zReal, zImag, zReal, zImag);  // z = z^2 + c
                zReal = z.real + cRealCopy;
                zImag = z.imag + cImagCopy;
                if (norm(zReal, zImag) > r2) break;  // If the point escapes the threshold, stop iterating
            }

            mu[j * (w + 1) + i] = k === n ? 0 : k + 1 - Math.log2(Math.log(magnitude(zReal, zImag)));  // Store the escape time
        }
    }

    // Calculate the gradients for each pixel to determine the coloring
    let k0, kx, ky;
    let v1, v2, v3, vNorm;
    let g1, g2, g3;
    let hue, sat, val;

    for (let j = 0; j < h; j++) {
        for (let i = 0; i < w; i++) {
            k0 = j * (w + 1) + i;  // Position of the current pixel
            kx = j * (w + 1) + (i + 1); // Pixel to the right
            ky = (j + 1) * (w + 1) + i; // Pixel below
            v1 = mu[kx] - mu[k0];  // Calculate the gradient in x-direction
            v2 = mu[ky] - mu[k0];  // Calculate the gradient in y-direction
            v3 = s * 4;  // Impact of the gradient strength
            vNorm = Math.sqrt(v1 * v1 + v2 * v2 + v3 * v3);  // Normalize the gradient
            g1 = v1 / vNorm; 
            g2 = v2 / vNorm;
            g3 = v3 / vNorm;
            hue = Math.atan2(g1, g2) / TwoPi;  // Calculate hue from gradient direction
            sat = mu[k0] > 0 ? 0.5 : 0;  // Set saturation
            val = g3;  // Set brightness based on gradient
            const { r: red, g: grn, b: blu } = hsv2rgb(hue, sat, val);  // Convert to RGB
            const index = 3 * (j * w + i);  
            img[index] = red;  
            img[index + 1] = grn;  
            img[index + 2] = blu;  
        }
    }

    return img;  // Return the generated image
}

function drawImage(canvas, img, w, h) {
    canvas.width = w;
    canvas.height = h;
    const imageData = ctx.createImageData(w, h);  

    // Map the image array to the canvas pixels
    for (let i = 0; i < img.length; i += 3) {
        const x = (i / 3) % w;
        const y = Math.floor((i / 3) / w);
        const index = (y * w + x) * 4; 
        imageData.data[index] = img[i];     // R
        imageData.data[index + 1] = img[i + 1]; // G
        imageData.data[index + 2] = img[i + 2]; // B
        imageData.data[index + 3] = 255; // A (fully opaque)
    }
    ctx.putImageData(imageData, 0, 0);  // Draw the image on the canvas
}

document.getElementById('iterationsSlider').addEventListener('input', function () {
    document.getElementById('iterationsValue').textContent = this.value;  // Update displayed iterations value
});

function measureRendering(callback) {
    const startTime = performance.now();
    callback();  
    const endTime = performance.now();
    document.getElementById("renderTime").textContent = `Rendering time: ${(endTime - startTime).toFixed(2)} ms`;  // Display rendering time
}

function renderCanvas() {
    measureRendering(() => {
        drawImage(canvas, createImage(canvas.width, canvas.height, cReal, cImag, maxIterations, 5, 1.8, 25*25), canvas.width, canvas.height);  // Render the canvas image
    });
}

function apply() {
    maxIterations = parseInt(document.getElementById('iterationsSlider').value);  
    cReal = parseFloat(document.getElementById('cReal').value); 
    cImag = parseFloat(document.getElementById('cImag').value);  
    renderCanvas();  // Render the canvas with updated parameters
};

renderCanvas();  // Initial render
