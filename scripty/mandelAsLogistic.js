function mandelAsLogistic() {
  const imgData = ctx.createImageData(canvas.width, canvas.height);
  const shift = -1;

  // Get colors from the color pickers
  const lowColor = hexToRgb(document.getElementById("lowColorPicker").value);
  const highColor = hexToRgb(document.getElementById("highColorPicker").value);

  for (let x = 0; x < canvas.width; x++) {
    const r_x = (max / (canvas.width / 2)) * (x - canvas.width / 2) - shift;

    for (let y = 0; y < canvas.height; y++) {
      const r_y = -(max / (canvas.height / 2)) * (y - canvas.height / 2);

      let z_x2 = 0, z_y2 = 0, z_x = 0, z_y = 0, iter = 0;

      while (z_x2 + z_y2 < 6 && iter < maxIter) {
        z_x2 = z_x * z_x;
        z_y2 = z_y * z_y;

        const z_x_temp = Math.pow((z_x * z_x + z_y * z_y), exp / 2) * Math.cos(exp * Math.atan2(z_y, z_x)) 
                         + r_x / 2 - (r_x * r_x) / 4 + (r_y * r_y) / 4;
        z_y = Math.pow((z_x * z_x + z_y * z_y), exp / 2) * Math.sin(exp * Math.atan2(z_y, z_x)) 
              + r_y / 2 - (r_x * r_y) / 2;
        z_x = z_x_temp;
        iter++;
      }
      const idx = (x + y * canvas.width) * 4;
      if (iter === maxIter) {
        imgData.data[idx + 0] = 0;
        imgData.data[idx + 1] = 0;
        imgData.data[idx + 2] = 0;
      } else {
      // Color interpolation based on iterations
      const t = iter / maxIter; // Normalize iterations
      imgData.data[idx + 0] = Math.floor(lowColor[0] * (1 - t) + highColor[0] * t); // Red
      imgData.data[idx + 1] = Math.floor(lowColor[1] * (1 - t) + highColor[1] * t); // Green
      imgData.data[idx + 2] = Math.floor(lowColor[2] * (1 - t) + highColor[2] * t); // Blue
      }
      imgData.data[idx + 3] = 255; // Full opacity
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

// Helper function to convert HEX to RGB
function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

// Event for the iteration slider
document.getElementById("iterationsSlider").addEventListener("input", function () {
  document.getElementById("iterationsValue").textContent = this.value;
});

function measureRendering(callback) {
  const startTime = performance.now();
  callback();
  const endTime = performance.now();
  document.getElementById("renderTime").textContent = `Rendering time: ${(endTime - startTime).toFixed(2)} ms`;
}

function renderCanvas() {
  measureRendering(() => {
    mandelAsLogistic();
  });
}

function apply() {
  maxIter = parseInt(document.getElementById("iterationsSlider").value);
  exp = parseFloat(document.getElementById("exponent").value);
  renderCanvas();
}

// Initialization
renderCanvas();
