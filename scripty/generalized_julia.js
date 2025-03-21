// Function to draw the Julia set based on the exponent d and constants cRe, cIm
function drawJulia(d, cRe, cIm) {
  const imgData = ctx.createImageData(canvas.width, canvas.height);

  // Getting colors from the color pickers
  const lowColor = hexToRgb(document.getElementById("lowColorPicker").value);
  const highColor = hexToRgb(document.getElementById("highColorPicker").value);
  
  // Loop through the pixels in the canvas (width)
  for (let x = 0; x < canvas.width; x++) {
    // Loop through the pixels in the canvas (height)
    for (let y = 0; y < canvas.height; y++) {
      let reZ = reMax / (canvas.width / 2) * (x - canvas.width / 2);  // Map pixel to complex plane (real part)
      let imZ = imMax / (canvas.height / 2) * (canvas.height / 2 - y);  // Map pixel to complex plane (imaginary part)

      let zRe = reZ, zIm = imZ, iter = 0;

      // Iterate while the norm of z is below a certain threshold and maximum iterations are not reached
      while (zRe * zRe + zIm * zIm <= 40 && iter < maxIterations) {
        // Convert to polar coordinates
        const modulus = Math.sqrt(zRe * zRe + zIm * zIm);
        const argument = Math.atan2(zIm, zRe);

        // Update real and imaginary parts of z using the exponent
        const zReTemp = modulus === 0 ? cRe : Math.pow(modulus, d) * Math.cos(d * argument) + cRe;
        const zImTemp = modulus === 0 ? cIm : Math.pow(modulus, d) * Math.sin(d * argument) + cIm;

        zRe = zReTemp;
        zIm = zImTemp;
        iter++;
      }

      // Interpolate colors based on iterations
      const index = (x + y * canvas.width) * 4;
      if (iter === maxIterations) {
        imgData.data[index + 0] = 0;
        imgData.data[index + 1] = 0;
        imgData.data[index + 2] = 0;
      } else {
        const t = iter / maxIterations; // Normalize iterations
        imgData.data[index + 0] = Math.floor(lowColor[0] * (1 - t) + highColor[0] * t); // Red
        imgData.data[index + 1] = Math.floor(lowColor[1] * (1 - t) + highColor[1] * t); // Green
        imgData.data[index + 2] = Math.floor(lowColor[2] * (1 - t) + highColor[2] * t); // Blue
      }
      imgData.data[index + 3] = 255; // Full opacity
    }
  }

  ctx.putImageData(imgData, 0, 0);  // Draw the image data on the canvas
}

// Helper function to convert HEX to RGB
function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

// Event for the iterations slider
document.getElementById("iterationsSlider").addEventListener("input", function () {
  document.getElementById("iterationsValue").textContent = this.value;
});

// Function to measure rendering time
function measureRendering(callback) {
  const startTime = performance.now();
  callback();  // Execute the rendering callback
  const endTime = performance.now();
  document.getElementById("renderTime").textContent = `Rendering time: ${(endTime - startTime).toFixed(2)} ms`;  // Display rendering time
}

// Function to render the canvas with the current parameters
function renderCanvas() {
  const cRe = parseFloat(document.getElementById("cReal").value);  // Get the real part of constant c from input
  const cIm = parseFloat(document.getElementById("cImag").value);  // Get the imaginary part of constant c from input
  measureRendering(() => {
    drawJulia(exp, cRe, cIm);  // Draw the Julia set with the current exponent and constants
  });
}

// Function to apply the user inputs and render the updated Julia set
function apply() {
  maxIterations = parseInt(document.getElementById("iterationsSlider").value);  // Get max iterations from slider
  exp = parseFloat(document.getElementById("exponent").value);  // Get exponent from input field
  renderCanvas();  // Render the updated Julia set
}

// Initialization
renderCanvas();  // Initial render of the canvas
