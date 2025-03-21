// Convert hex color to RGB object
function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return {r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255};
}

function drawJuliaWithDistanceEstimation() {
    const imgData = ctx.createImageData(canvas.width, canvas.height);
    const lowColor = document.getElementById('lowColorPicker').value; // Get low color
    const highColor = document.getElementById('highColorPicker').value; // Get high color
    // Convert colors to RGB
    const lowColorRGB = hexToRgb(lowColor);
    const highColorRGB = hexToRgb(highColor);

    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            const reC = reMin + x * (reMax - reMin) / canvas.width;
            const imC = imMax - y * (imMax - imMin) / canvas.height;

            let zRe = reC;
            let zIm = imC;
            let dzRe = 1;
            let dzIm = 0;
            let iter = 0;

            while (iter < maxIterations) {
                const zReSquared = zRe * zRe;
                const zImSquared = zIm * zIm;

                if (zReSquared + zImSquared > 4) {
                    break;
                }

                const zReTemp = zReSquared - zImSquared + cReal;
                const zImTemp = 2 * zRe * zIm + cImag;

                const dzReTemp = 2 * (zRe * dzRe - zIm * dzIm);
                const dzImTemp = 2 * (zRe * dzIm + zIm * dzRe) + 1;

                zRe = zReTemp;
                zIm = zImTemp;
                dzRe = dzReTemp;
                dzIm = dzImTemp;

                iter++;
            }

            let distance = 0;
            const modulus = Math.sqrt(zRe * zRe + zIm * zIm);
            const dzModulus = Math.sqrt(dzRe * dzRe + dzIm * dzIm);
            
            if (dzModulus !== 0) {
                distance = (modulus * Math.log(modulus)) / dzModulus;
            }
            
            // Interpolate between low and high color based on distance or iteration
            const colorValue = iter === maxIterations ? 255 : (iter / maxIterations) * 255;
            const color = interpolateColor(lowColorRGB, highColorRGB, colorValue / 255);
            
            const pozice = (x + y * canvas.width) * 4;
            imgData.data[pozice + 0] = color.r; // Red
            imgData.data[pozice + 1] = color.g; // Green
            imgData.data[pozice + 2] = color.b; // Blue
            imgData.data[pozice + 3] = 255; // Full opacity
        }
    }

    ctx.putImageData(imgData, 0, 0);
}

// Interpolate between two RGB colors
function interpolateColor(low, high, factor) {
    const r = low.r + (high.r - low.r) * factor;
    const g = low.g + (high.g - low.g) * factor;
    const b = low.b + (high.b - low.b) * factor;
    return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
}


// Event listeners for color pickers
document.getElementById('lowColorPicker').addEventListener('input', function () {
    lowColor = this.value;
  });
  document.getElementById('highColorPicker').addEventListener('input', function () {
    highColor = this.value;
  });

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
            drawJuliaWithDistanceEstimation();
      
        });
      }
      
      function apply() {
        cReal = parseFloat(document.getElementById('cReal').value);
        cImag = parseFloat(document.getElementById('cImag').value);
        maxIterations = parseInt(document.getElementById('iterationsSlider').value);
      
        renderCanvas();
      }

      renderCanvas();
