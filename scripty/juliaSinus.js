// Function to interpolate between two colors
function interpolateColor(color1, color2, factor) {
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);

  const r1 = (c1 >> 16) & 0xff, g1 = (c1 >> 8) & 0xff, b1 = c1 & 0xff;
  const r2 = (c2 >> 16) & 0xff, g2 = (c2 >> 8) & 0xff, b2 = c2 & 0xff;

  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));

  return `rgb(${r},${g},${b})`;
}

function juliaSinus() {
  for (let x = 0; x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {
      let zIm = (cmaxX / (canvas.height / 2)) * (y - canvas.height / 2);
      let zRe = (cmaxX / (canvas.width / 2)) * (x - canvas.width / 2);
      let iter = 0;

      while (Math.abs(zIm) < r_c && iter < maxIter) {
        const sinRe = Math.sin(zRe) * Math.cosh(zIm);
        const sinIm = Math.cos(zRe) * Math.sinh(zIm);

        const newZRe = cRe * sinRe - cIm * sinIm;
        const newZIm = cRe * sinIm + cIm * sinRe;

        zRe = newZRe;
        zIm = newZIm;

        iter++;
      }

      // Color interpolation based on iterations
      const factor = iter / maxIter; // Normalize iterations to the range 0–1
      const color = interpolateColor(lowColor, highColor, factor);

      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

// Event listeners for color pickers
document.getElementById('lowColorPicker').addEventListener('input', function () {
  lowColor = this.value;
});
document.getElementById('highColorPicker').addEventListener('input', function () {
  highColor = this.value;
});

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
    juliaSinus();
  });
}

function apply() {
  cRe = parseFloat(document.getElementById('cReal').value);
  cIm = parseFloat(document.getElementById('cImag').value);
  maxIter = parseInt(document.getElementById('iterationsSlider1').value);
  renderCanvas();
}

renderCanvas();
