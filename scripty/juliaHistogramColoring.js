function julia(z, c) {
    let iterations = 0;
    while (z.real * z.real + z.imag * z.imag <= 4 && iterations < maxIterations) {
        let xTemp = z.real * z.real - z.imag * z.imag + c.real;
        z.imag = 2 * z.real * z.imag + c.imag;
        z.real = xTemp;
        iterations++;
    }
    return iterations;
}

function colorMap(value) {
    const hue = 360 * value;
    return `hsl(${hue}, 900%, 50%)`;
}

function mapRange(value, inputMin, inputMax, outputMin, outputMax) {
    return (value - inputMin) * (outputMax - outputMin) / (inputMax - inputMin) + outputMin;
}

function draw_julia() {
    const imgData = ctx.createImageData(canvas.width, canvas.height);
    const data = new Array(canvas.width * canvas.height);

    // Calculate the Julia set and build the histogram
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const zx = mapRange(x, 0, canvas.width, -2, 2);  // Adjust range for Julia set
            const zy = mapRange(canvas.height - y, 0, canvas.height, -2, 2);
            const iterations = julia({ real: zx, imag: zy }, c);
            data[y * canvas.width + x] = iterations;
            if (iterations < maxIterations) {
                histogram[iterations]++;
            }
        }
    }

    // Build the cumulative distribution function (CDF)
    const cdf = new Array(maxIterations + 1).fill(0);
    let total = 0;
    for (let i = 0; i <= maxIterations; i++) {
        total += histogram[i];
        cdf[i] = total;
    }

    // Normalize the CDF
    for (let i = 0; i <= maxIterations; i++) {
        cdf[i] /= total;
    }

    // Apply histogram coloring and draw the Julia set
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const iterations = data[y * canvas.width + x];
            const colorValue = cdf[iterations];
            const color = iterations === maxIterations ? 'black' : colorMap(colorValue);
            ctx.fillStyle = color;
            ctx.fillRect(x, y, 1, 1);
        }
    }
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
        draw_julia();
    });
}

function apply() {
    maxIterations = parseInt(document.getElementById('iterationsSlider1').value);
    histogram = new Array(maxIterations + 1).fill(0);

    c = {
        real: parseFloat(document.getElementById('cReal').value),
        imag: parseFloat(document.getElementById('cImag').value)
    };

    renderCanvas();
}

renderCanvas();
