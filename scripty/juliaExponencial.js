function juliaExponencial() {
  var imgData = ctx.createImageData(canvas.width, canvas.height);

  // grid
  for (var x = 0; x < canvas.width; x++) {
    for (var y = 0; y < canvas.height; y++) {
      // canvas to complex
      var zReInitial = max / (canvas.width / 2) * (x - canvas.width / 2) - posunXcomplex;
      var zImInitial = -max / (canvas.height / 2) * (y - canvas.height / 2);

      var iter1 = 0;
      var zRe = zReInitial;
      var zIm = zImInitial;

      // iteration cycle
      while ( zRe  < r_c && iter1 < maxIter) {
        let uRe = beta * (Math.exp(zRe) * (lambdax * Math.cos(zIm) - lambday * Math.sin(zIm))) + (1 - beta) * zRe;
        let uIm = beta * (Math.exp(zRe) * (lambdax * Math.sin(zIm) + lambday * Math.cos(zIm))) + (1 - beta) * zIm;

        zRe = alpha * (Math.exp(uRe) * (lambdax * Math.cos(uIm) - lambday * Math.sin(uIm))) + (1 - alpha) * zReInitial;
        zIm = alpha * (Math.exp(uRe) * (lambdax * Math.sin(uIm) + lambday * Math.cos(uIm))) + (1 - alpha) * zImInitial;

        zReInitial = zRe;
        zImInitial = zIm;

        iter1++;
      }
      // Coloring based on the number of iterations
      var pozice = (x + y * canvas.width) * 4;

      if (iter1 === maxIter) {
        // Black for points that do not escape
        imgData.data[pozice + 0] = 0;
        imgData.data[pozice + 1] = 0;
        imgData.data[pozice + 2] = 0;
      } else {
        // Map the iteration count to a color
        if (iter1 < maxIter * 0.2) {
          // Red for quick escape
          imgData.data[pozice + 0] = 255;
          imgData.data[pozice + 1] = 0;
          imgData.data[pozice + 2] = 0;
        } else if (iter1 < maxIter * 0.4) {
          // Orange
          imgData.data[pozice + 0] = 255;
          imgData.data[pozice + 1] = 165;
          imgData.data[pozice + 2] = 0;
        } else if (iter1 < maxIter * 0.6) {
          // Yellow
          imgData.data[pozice + 0] = 255;
          imgData.data[pozice + 1] = 255;
          imgData.data[pozice + 2] = 0;
        } else if (iter1 < maxIter * 0.8) {
          // Green
          imgData.data[pozice + 0] = 0;
          imgData.data[pozice + 1] = 255;
          imgData.data[pozice + 2] = 0;
        } else if (iter1 < maxIter * 0.9) {
          // Blue
          imgData.data[pozice + 0] = 0;
          imgData.data[pozice + 1] = 0;
          imgData.data[pozice + 2] = 255;
        } else {
          // Violet
          imgData.data[pozice + 0] = 238;
          imgData.data[pozice + 1] = 130;
          imgData.data[pozice + 2] = 238;
        }
      }

      // Full opacity
      imgData.data[pozice + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

// Initialization and execution

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
    juliaExponencial();
  });
}

function apply() {

  maxIter = parseInt(document.getElementById('iterationsSlider1').value);
  alpha = parseFloat(document.getElementById('alpha').value);
  beta = parseFloat(document.getElementById('beta').value);
  lambday = parseFloat(document.getElementById('lambday').value);
  lambdax = parseFloat(document.getElementById('lambdax').value);
  renderCanvas();
}
renderCanvas();


