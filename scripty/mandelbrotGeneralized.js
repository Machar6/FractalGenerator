// Draws a Mandelbrot or Multibrot set based on the exponent d
function drawMandelbrot(d) {
  const imgData = ctx.createImageData(canvas.width, canvas.height);
  const shiftX = (d == 2) ? -0.8 : 0; // Shift for traditional Mandelbrot set

  // Get colors from color pickers
  const lowColor = hexToRgb(document.getElementById("lowColorPicker").value);
  const highColor = hexToRgb(document.getElementById("highColorPicker").value);

  for (let x = 0; x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {
      // Map pixel to complex plane
      const reC = reMin + shiftX + x * (reMax - reMin) / canvas.width;
      const imC = imMin + y * (imMax - imMin) / canvas.height;

      let zRe = 0, zIm = 0, iter = 0;

      while (zRe * zRe + zIm * zIm <= 50 && iter < maxIter) {
        // Convert to polar coordinates
        const modulus = Math.sqrt(zRe * zRe + zIm * zIm);
        const argument = Math.atan2(zIm, zRe);

        // Update real and imaginary parts
        const zReTemp = modulus === 0 ? reC : Math.pow(modulus, d) * Math.cos(d * argument) + reC;
        const zImTemp = modulus === 0 ? imC : Math.pow(modulus, d) * Math.sin(d * argument) + imC;

        zRe = zReTemp;
        zIm = zImTemp;
        iter++;
      }

      // Color interpolation based on iterations
      const index = (x + y * canvas.width) * 4;
      if (iter === maxIter) {
        // Point is in the set
        imgData.data[index + 0] = 0; // Red
        imgData.data[index + 1] = 0; // Green
        imgData.data[index + 2] = 0; // Blue
      } else {
        // Interpolate between low and high colors
        const t = iter / maxIter;
        imgData.data[index + 0] = Math.floor(lowColor[0] * (1 - t) + highColor[0] * t);
        imgData.data[index + 1] = Math.floor(lowColor[1] * (1 - t) + highColor[1] * t);
        imgData.data[index + 2] = Math.floor(lowColor[2] * (1 - t) + highColor[2] * t);
      }
      imgData.data[index + 3] = 255; // Full opacity
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

// Converts a HEX color to RGB array
function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

// Measures and displays rendering time
function measureRendering(callback) {
  const startTime = performance.now();
  callback();
  const endTime = performance.now();
  document.getElementById("renderTime").textContent = `Rendering time: ${(endTime - startTime).toFixed(2)} ms`;
}

// Renders the canvas with current settings
function renderCanvas() {
  measureRendering(() => {
    drawMandelbrot(exp);
  });
}

// Applies settings and re-renders
function apply() {
  maxIter = parseInt(document.getElementById("iterationsSlider").value);
  exp = parseFloat(document.getElementById("exponent").value);
  renderCanvas();
}

// Initial render
renderCanvas();
