
function inverseBranch1(z, c) {
    return math.add(math.sqrt(math.subtract(z, c)), 0); // sqrt(z - c)
}

function inverseBranch2(z, c) {
    return math.subtract(0, math.sqrt(math.subtract(z, c))); // -sqrt(z - c)
}

// Function for generating points using inverse iteration
function inverseIteration(c, initialPoint, iterations) {
    const points = []; // Array to store points
    let z = initialPoint; // Initial point

    for (let i = 0; i < iterations; i++) {
        // Randomly choose one branch
        const branch = Math.random() < 0.5 ? inverseBranch1 : inverseBranch2;
        z = branch(z, c); 
        points.push(z); // Store the point
    }

    return points;
}

function drawPoints(points) {

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    points.forEach(point => {
        const x = Math.round((point.re + 2) / 4 * canvas.width);
        const y = Math.round((2 - point.im) / 4 * canvas.height);
        ctx.fillRect(x, y, 1, 1);
    });
}

function measureRendering(callback) {
    const startTime = performance.now();
    callback();
    const endTime = performance.now();
    document.getElementById("renderTime").textContent = `Rendering time: ${(endTime - startTime).toFixed(2)} ms`;
}

function renderCanvas() {
    measureRendering(() => {
        drawPoints(inverseIteration(cComplex, initialPoint, Math.pow(2,iterMax)));
    });
}
document.getElementById('iterationsSlider3').addEventListener('input', function () {
    document.getElementById('iterationsValue3').textContent = this.value;
  });
  
  function apply() {
    iterMax = parseInt(document.getElementById('iterationsSlider3').value);
    cReal = parseFloat(document.getElementById('cReal').value);
    cImag = parseFloat(document.getElementById('cImag').value);  
    cComplex = math.complex(cReal, cImag);
    renderCanvas();
  }

// Rendering on the canvas
renderCanvas();
