
function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function drawMandelbrotWithDistanceEstimation() {
    const imgData = ctx.createImageData(canvas.width, canvas.height);
    const insideColor = hexToRgb(document.getElementById('lowColorPicker').value);
    const outsideColor = hexToRgb(document.getElementById('highColorPicker').value);

    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            const reC = reMin + x * (reMax - reMin) / canvas.width;
            const imC = imMin + y * (imMax - imMin) / canvas.height;

            let zRe = 0, zIm = 0;
            let dzRe = 1, dzIm = 0;
            let iter = 0;

            while (iter < maxIterations) {
                const zReSquared = zRe * zRe;
                const zImSquared = zIm * zIm;

                if (zReSquared + zImSquared > 4) {
                    break;
                }

                const zReTemp = zReSquared - zImSquared + reC;
                const zImTemp = 2 * zRe * zIm + imC;

                const dzReTemp = 2 * (zRe * dzRe - zIm * dzIm) + 1;
                const dzImTemp = 2 * (zRe * dzIm + zIm * dzRe);

                zRe = zReTemp;
                zIm = zImTemp;
                dzRe = dzReTemp;
                dzIm = dzImTemp;

                iter++;
            }

            const pos = (x + y * canvas.width) * 4;

            if (iter === maxIterations) {
                // Calculate distance estimation
                const modulus = Math.sqrt(zRe * zRe + zIm * zIm);
                const dzModulus = Math.sqrt(dzRe * dzRe + dzIm * dzIm);
                let distance = 0;

                if (dzModulus !== 0) {
                    distance = 2*(modulus * Math.log(modulus)) / dzModulus;
                }

                // Map distance to brightness
                const brightness = 255 - Math.min(255, distance * 10);

                imgData.data[pos + 0] = insideColor[0] * (brightness / 255);
                imgData.data[pos + 1] = insideColor[1] * (brightness / 255);
                imgData.data[pos + 2] = insideColor[2] * (brightness / 255);
                imgData.data[pos + 3] = 255;
            } else {
                // Map iteration count to outside color
                const t = iter / maxIterations;

                imgData.data[pos + 0] = outsideColor[0] * t;
                imgData.data[pos + 1] = outsideColor[1] * t;
                imgData.data[pos + 2] = outsideColor[2] * t;
                imgData.data[pos + 3] = 255;
            }
        }
    }

    ctx.putImageData(imgData, 0, 0);
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
        drawMandelbrotWithDistanceEstimation();
    });
}

function apply() {
    maxIterations = parseInt(document.getElementById('iterationsSlider').value);
    renderCanvas();
}

// Initial render
renderCanvas();