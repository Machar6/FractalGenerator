// Function to compute Mandelbrot Set for a point (c)
function mandelbrot(cRe, cIm) {
    let zRe = 0, zIm = 0;
    let iter = 0;

    while (zRe * zRe + zIm * zIm <= 4 && iter < maxIter) {
        let zReNew = zRe * zRe - zIm * zIm + cRe;
        let zImNew = 2 * zRe * zIm + cIm;
        zRe = zReNew;
        zIm = zImNew;
        iter++;
    }

    return iter;
}

// Function to map iteration count to grayscale (for Sobel filtering)
function getGrayScale(iter) {
    return iter === maxIter ? 0 : Math.floor((iter / maxIter) * 255);
}

// Function to map iteration count to color (hue for visualization)
function getColor(iter) {
    if (iter === maxIter) {
        return 'white';  // Points inside the set are white
    } else {
        const hue = (iter / maxIter) * 60;  
        return `hsl(${hue}, 100%, 50%)`;
    }
}

// Render the Mandelbrot set and return the grayscale image data
function renderMandelbrot() {
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const cRe = reMin + (x / canvas.width) * (reMax - reMin);
            const cIm = imMin + (y / canvas.height) * (imMax - imMin);

            const iter = mandelbrot(cRe, cIm);
            const color = getColor(iter);
            ctx.fillStyle = color;
            ctx.fillRect(x, y, 1, 1);

            // Store grayscale value for Sobel edge detection
            const gray = getGrayScale(iter);
            const index = (y * canvas.width + x) * 4;
            data[index] = gray;       // Red channel
            data[index + 1] = gray;   // Green channel
            data[index + 2] = gray;   // Blue channel
            data[index + 3] = 255;    // Alpha channel
        }
    }

    return imageData;
}

// Sobel edge detection with black edges
function sobelEdgeDetection(imageData) {
    
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;

    const output = new Uint8ClampedArray(data.length);

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let gX = 0, gY = 0;

            // Apply Sobel filter
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const i = ((y + ky) * width + (x + kx)) * 4;
                    const intensity = data[i];  // Grayscale value

                    gX += sobelX[ky + 1][kx + 1] * intensity;
                    gY += sobelY[ky + 1][kx + 1] * intensity;
                }
            }

            const gradient = Math.sqrt(gX * gX + gY * gY);  // Magnitude of gradient
            const index = (y * width + x) * 4;
            const edgeValue = gradient > 128 ? 0 : 255;  // Black edge (0) and white background (255)

            output[index] = edgeValue;       // Red channel
            output[index + 1] = edgeValue;   // Green channel
            output[index + 2] = edgeValue;   // Blue channel
            output[index + 3] = 255;         // Alpha channel
        }
    }

    return new ImageData(output, width, height);
}


// Main function to render the Mandelbrot set and apply Sobel edge detection
function mandelbrotEdgeDetection() {
    // First render the Mandelbrot set
    const mandelbrotImageData = renderMandelbrot();

    // Apply Sobel edge detection with black edges
    const edgeImageData = sobelEdgeDetection(mandelbrotImageData);

    // Display the edge-detected image on the canvas
    ctx.putImageData(edgeImageData, 0, 0);
}

document.getElementById('iterationsSlider1').addEventListener('input', function () {
    document.getElementById('iterationsValue1').textContent = this.value;
  });

  function measureRendering(callback) {
    const startTime = performance.now();
    callback();
    const endTime = performance.now();
    document.getElementById("renderTime").textContent = `Rendering time: ${(endTime - startTime).toFixed(2)} ms`;
  }
  
  function renderCanvas() {
    measureRendering(() => {
        mandelbrotEdgeDetection();
    });
  }
  
  
  function apply() {

    maxIter = parseInt(document.getElementById('iterationsSlider1').value);
  
    renderCanvas();
  }

  renderCanvas();