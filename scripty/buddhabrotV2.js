function generateBuddhabrot() {
    const width = canvas.width;
    const height = canvas.height;
  
    const realMin = -2;
    const realMax = 1;
    const imaginaryMin = -1.5;
    const imaginaryMax = 1.5;
  
    let largeArray = new Array(width).fill(null).map(() => new Array(height).fill(0));
  
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
          let cr = realMin + (x / width) * (realMax - realMin);
          let ci = imaginaryMin + (y / height) * (imaginaryMax - imaginaryMin);
          let zr = 0.0, zi = 0.0;
  
          let iterHistoryRe = [];
          let iterHistoryIm = [];
  
          let n;
          let escaped = false;
  
          for (n = 0; n < maxIterations; n++) {
              let r2 = zr * zr;
              let i2 = zi * zi;
              let ri2 = zr * zi * 2;
              zr = r2 - i2 + cr;
              zi = ri2 + ci;
  
              iterHistoryRe.push(zr);
              iterHistoryIm.push(zi);
  
              if (zr * zr + zi * zi > escapeRadiusSquared) {
                  escaped = true;
                  break;
              }
          }
  
          if (escaped) {
              for (let i = 0; i < n; i++) {
                  let j = (iterHistoryRe[i] - realMin) * (width / (realMax - realMin));
                  let k = (iterHistoryIm[i] - imaginaryMin) * (height / (imaginaryMax - imaginaryMin));
  
                  if (j >= 0 && j < width && k >= 0 && k < height) {
                      largeArray[Math.floor(j)][Math.floor(k)]++;
                  }
              }
          }
      }
  }
  
  
    renderBuddhabrot(largeArray, width, height);
  }
  
  function renderBuddhabrot(largeArray, width, height) {
    const imageData = ctx.createImageData(width, height);
  
    const lowColor = hexToRGB(document.getElementById('lowColorPicker').value);
    const highColor = hexToRGB(document.getElementById('highColorPicker').value);
  
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const value = largeArray[x][y];
            const color = valueToColor(value, lowColor, highColor);
            const index = (x + y * width) * 4;
            imageData.data[index + 0] = color.r;
            imageData.data[index + 1] = color.g;
            imageData.data[index + 2] = color.b;
            imageData.data[index + 3] = 255;
        }
    }
    ctx.putImageData(imageData, 0, 0);
  }
  
  function valueToColor(value, lowColor, highColor) {
    if (value === 0) {
        return { r: lowColor.r, g: lowColor.g, b: lowColor.b };
    }
  
    const intensity = Math.min(1, value * scaleColor / 255);
    const r = lowColor.r + intensity * (highColor.r - lowColor.r);
    const g = lowColor.g + intensity * (highColor.g - lowColor.g);
    const b = lowColor.b + intensity * (highColor.b - lowColor.b);
  
    return { r: Math.floor(r), g: Math.floor(g), b: Math.floor(b) };
  }
  
  function hexToRGB(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }
  
  const canvas = document.getElementsByClassName('mandelbrot')[0];
  const ctx = canvas.getContext('2d');
  
  let maxIterations = 500;
  const escapeRadiusSquared = 6.0;
  const scaleColor = 5;
  
  document.getElementById('iterationsSlider').addEventListener('input', function () {
    document.getElementById('iterationsValue').textContent = this.value;
  });
  
  function measureRendering(callback) {
    const startTime = performance.now();
    callback();
    const endTime = performance.now();
    document.getElementById("renderTime").textContent = `Rendering time: ${(endTime - startTime).toFixed(2)} ms`;
  }
  
  function renderCanvas() {
    measureRendering(() => {
        generateBuddhabrot();
    });
  }
  
  function apply() {
    maxIterations = parseInt(document.getElementById('iterationsSlider').value);
    renderCanvas();
  }
  
  // Initial draw
  renderCanvas();
  