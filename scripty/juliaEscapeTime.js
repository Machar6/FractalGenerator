// Function to multiply two complex numbers
function multiplyComplex(aReal, aImag, bReal, bImag) {
    return {
        real: aReal * bReal - aImag * bImag, 
        imag: aReal * bImag + aImag * bReal  
    };
}

// Function to add two complex numbers
function addComplex(aReal, aImag, bReal, bImag) {
    return {
        real: aReal + bReal, 
        imag: aImag + bImag  
    };
}

// Function to calculate the norm (magnitude squared) of a complex number
function normComplex(real, imag) {
    return real * real + imag * imag;
}

// Function to generate Julia set image based on parameters
function createJuliaImage(w, h, n, r, cReal, cImag) {
    const img = new Uint8Array(w * h); // Initialize image array

    // Loop through each pixel and perform the Julia set calculation
    for (let j = 0; j < h; j++) {
        const y = (h / 2 - (j + 0.5)) / (h / 2) * r; 
        for (let i = 0; i < w; i++) {
            const x = (i + 0.5 - w / 2) / (h / 2) * r; 
            let zReal = x, zImag = y;
            let k;
            // Iterate the complex function to check for divergence
            for (k = 0; k < n; k++) {
                const z = multiplyComplex(zReal, zImag, zReal, zImag); // Apply the Julia function
                zReal = z.real + cReal;
                zImag = z.imag + cImag;
                if (normComplex(zReal, zImag) > r * r) break; // Check if point escapes
            }
            img[j * w + i] = (k & 1) ? 0 : 255; // Assign binary color (black or white)
        }
    }
    return img; // Return the image data
}

// Function to render the Julia set image on the canvas
function drawImage(canvas, img, w, h) {
    const ctx = canvas.getContext('2d'); // Get the canvas 2D context
    canvas.width = w;
    canvas.height = h;
    const imageData = ctx.createImageData(w, h); // Create image data for canvas

    // Loop through the image data and apply pixel colors
    for (let i = 0; i < img.length; i++) {
        const x = i % w; 
        const y = Math.floor(i / w); 
        const index = (y * w + x) * 4; 
        const color = img[i]; 
        imageData.data[index] = color;     // R
        imageData.data[index + 1] = color; // G
        imageData.data[index + 2] = color; // B
        imageData.data[index + 3] = 255;   // A (fully opaque)
    }
    ctx.putImageData(imageData, 0, 0); // Draw the image on the canvas
}

// Event listener for the slider to display current iteration value
document.getElementById('iterationsSlider1').addEventListener('input', function () {
    document.getElementById('iterationsValue1').textContent = this.value; // Display iteration value
});

// Function to measure rendering time and display it
function measureRendering(callback) {
    const startTime = performance.now(); // Start time
    callback(); 
    const endTime = performance.now(); // End time
    document.getElementById("renderTime").textContent = `Rendering time: ${(endTime - startTime).toFixed(2)} ms`; // Show render time
}

// Function to apply user inputs and trigger rendering
function renderCanvas() {
    measureRendering(() => {
        drawImage(canvas, createJuliaImage(canvas.width, canvas.height, maxIterations, r, cReal, cImag), canvas.width, canvas.height); // Call render function
    });
}

// Function to apply new parameters from input fields and update the canvas
function apply() {
    cReal = parseFloat(document.getElementById('cReal').value); // Real part of constant c
    cImag = parseFloat(document.getElementById('cImag').value); // Imaginary part of constant c
    maxIterations = parseInt(document.getElementById('iterationsSlider1').value); // Max iterations

    renderCanvas(); // Re-render with updated parameters
}

// Initial render
renderCanvas();
