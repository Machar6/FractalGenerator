// Function to compute potential function with smooth coloring
function mandelbrotSmooth(x, y) {
  let zx = 0, zy = 0, zx2 = 0, zy2 = 0;
  let n = 0;
  while (zx2 + zy2 <= 16 && n < maxIterations) {
      zy = 2 * zx * zy + y;
      zx = zx2 - zy2 + x;
      zx2 = zx * zx;
      zy2 = zy * zy;
      n++;
  }

  if (n < maxIterations) {
      const logZn = Math.log(zx2 + zy2) / 2;
      const nu = n - Math.log(logZn / Math.log(4)) / Math.log(2);
      return nu; // Fractional iteration count
  }

  return maxIterations;
}

// Function to compute potential function without smooth coloring
function mandelbrot(x, y) {
  let zx = 0, zy = 0, zx2 = 0, zy2 = 0;
  let n = 0;
  while (zx2 + zy2 <=  16 && n < maxIterations) {
      zy = 2 * zx * zy + y;
      zx = zx2 - zy2 + x;
      zx2 = zx * zx;
      zy2 = zy * zy;
      n++;
  }
  return n; // Integer iteration count
}

// Function to map the iteration count to a color using the selected palette
function getColor(iteration) {
  if (iteration === maxIterations) {
      return 'black'; // Points inside the Mandelbrot set are black
  }

  const paletteType = document.getElementById('paletteSwitch').value;
  const t = iteration / maxIterations;

  if (paletteType === 'default') {
    const r = Math.floor(9 * (1 - t) * t * t * t * 255);
    const g = Math.floor(15 * (1 - t) * (1 - t) * t * t * 255);
    const b = Math.floor(9 * (1 - t) * (1 - t) * (1 - t) * t * 255);
    return `rgb(${r}, ${g}, ${b})`;
  } else if (paletteType === 'sinus') {
      const paletteSize = 256;
      const index = Math.floor(t * paletteSize);
      const r = Math.floor(128 + 127 * Math.sin(2 * Math.PI * index / paletteSize));
      const g = Math.floor(128 + 127 * Math.sin(2 * Math.PI * index / paletteSize + 2 * Math.PI / 3));
      const b = Math.floor(128 + 127 * Math.sin(2 * Math.PI * index / paletteSize + 4 * Math.PI / 3));
      return `rgb(${r}, ${g}, ${b})`;
  }
}


// Draw the Mandelbrot set with smooth or non-smooth coloring based on the switch state
function drawMandelbrot() {

  const zoom = 250;
  const shiftX = -200;
  const shiftY = 0;
  for (let x = 0; x < canvas.width; x++) {
      for (let y = 0; y < canvas.height; y++) {
          // Map pixel to the complex plane
          const cx = (x - canvas.width / 2 + shiftX) / zoom;
          const cy = (y - canvas.height / 2 + shiftY) / zoom;

          // Get the iteration count based on the switch state
          const smooth = document.getElementById('smoothSwitch').checked;
          const iteration = smooth ? mandelbrotSmooth(cx, cy) : mandelbrot(cx, cy);

          // Map the iteration count to a color
          const color = getColor(iteration);

          // Draw the pixel
          ctx.fillStyle = color;
          ctx.fillRect(x, y, 1, 1);
      }
  }
}

// Update iterations value on slider change
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
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawMandelbrot();
  });
}

// Redraw Mandelbrot set on switch toggle or palette change
document.getElementById('smoothSwitch').addEventListener('change', renderCanvas);
document.getElementById('paletteSwitch').addEventListener('change', renderCanvas);

// Apply changes and redraw Mandelbrot set
function apply() {
  maxIterations = parseInt(document.getElementById('iterationsSlider1').value);
  renderCanvas();
}

// Initial draw
renderCanvas();
