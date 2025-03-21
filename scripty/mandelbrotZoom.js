const canvas = document.getElementsByClassName("mandelbrot")[0];
const ctx = canvas.getContext("2d");

// Input elements for center coordinates
const inputRe = document.getElementById("centerRe");
const inputIm = document.getElementById("centerIm");
const periodInfo = document.getElementById("periodInfo");

// Overscan setup for smooth rendering
const overscan = 0.5;
const virtualWidth = canvas.width * (1 + 2 * overscan);
const virtualHeight = canvas.height * (1 + 2 * overscan);

// Virtual canvas for optimized rendering
const virtualCanvas = document.createElement("canvas");
const virtualCtx = virtualCanvas.getContext("2d");
virtualCanvas.width = virtualWidth;
virtualCanvas.height = virtualHeight;

// Initial offset and scale
let offsetX = -0.5, offsetY = 0;
let scale = 4; // Initial zoom level
let dragStart = null;
let dragOffsetX = 0, dragOffsetY = 0;

// Zoom in action
document.getElementById("zoomIn").onclick = () => {
    scale /= 2;
    renderCanvas();
};

// Zoom out action
document.getElementById("zoomOut").onclick = () => {
    scale *= 2;
    renderCanvas();
};

// Reset view to initial parameters
document.getElementById("resetView").onclick = () => {
    offsetX = -0.5;
    offsetY = 0;
    scale = 4;
    renderCanvas();
};

// Main rendering function
function renderCanvas() {
    measureRendering(() => {
        drawVirtualCanvas();
        draw();
    });
    updateZoomInfo();
    updateInputs();
    detectPeriod();
}

// Measure rendering time
function measureRendering(callback) {
    const startTime = performance.now();
    callback();
    const endTime = performance.now();
    document.getElementById("renderTime").textContent = `Rendering time: ${(endTime - startTime).toFixed(2)} ms`;
}

// Update input fields with current offset
function updateInputs() {
    inputRe.value = offsetX;
    inputIm.value = offsetY;
}

// Update zoom information
function updateZoomInfo() {
    const originalScale = 4;
    const zoomFactor = originalScale / scale;
    document.getElementById("zoomInfo").innerText = `Zoom: ${zoomFactor.toFixed(2)}x`;
}

// Dynamically calculate max iterations based on zoom level
function getMaxIterations() {
    const baseIterations = 100;
    const zoomFactor = 4 / scale;
    const maxIterations = Math.min(6000, Math.floor(baseIterations * Math.pow(zoomFactor, 0.3)));
    document.getElementById("iterationInfo").innerText = `Max iterations: ${maxIterations}`;
    return maxIterations;
}

// Check if a point is inside the Mandelbrot set cardioid or period-2 region
function isInMandelbrot(x, y) {
    const q = (x - 0.25) ** 2 + y ** 2;
    return q * (q + (x - 0.25)) <= 0.25 * y ** 2 || (x + 1) ** 2 + y ** 2 <= 0.0625;
}

// Compute Mandelbrot iterations for a point
function mandelbrot(x0, y0, maxIter) {
    let x = 0, y = 0;
    let iter = 0;

    while (x * x + y * y <= 4 && iter < maxIter) {
        const xtemp = x * x - y * y + x0;
        y = 2 * x * y + y0;
        x = xtemp;
        iter++;
    }

    return iter;
}

// Detect period for the selected point
function detectPeriod() {
    const maxIterP = 2000;
    const cx = offsetX;
    const cy = offsetY;
    const z0 = math.complex(0, 0);
    const c = math.complex(cx, cy);
    const list = [z0];
    
    for (let i = 1; i < maxIterP; i++) {
        const zn = math.add(math.multiply(list[i - 1], list[i - 1]), c);
        list.push(zn);
    }

    let period = "Divergence";
    for (let x = 500; x < list.length - 1; x++) {
        for (let y = x + 1; y < list.length; y++) {
            if (Math.abs(list[x].re - list[y].re) < 0.0001 && Math.abs(list[x].im - list[y].im) < 0.0001) {
                period = y - x;
                break;
            }
        }
        if (period !== "Divergence") break;
    }

    periodInfo.textContent = `Period: ${period}`;
}

// Render the Mandelbrot set to the virtual canvas
function drawVirtualCanvas() {
    const maxIter = getMaxIterations();
    const imgData = virtualCtx.createImageData(virtualWidth, virtualHeight);

    for (let py = 0; py < virtualHeight; py++) {
        for (let px = 0; px < virtualWidth; px++) {
            const x = ((px - overscan * canvas.width) / canvas.width - 0.5) * scale + offsetX;
            const y = ((py - overscan * canvas.height) / canvas.height - 0.5) * scale + offsetY;

            let color;
            if (isInMandelbrot(x, y)) {
                color = [0, 0, 0];
            } else {
                const iter = mandelbrot(x, y, maxIter);
                color = iter === maxIter ? [0, 0, 0] : [iter * 10 % 255, iter * 5 % 255, iter * 20 % 255];
            }

            const idx = (py * virtualWidth + px) * 4;
            imgData.data[idx] = color[0];
            imgData.data[idx + 1] = color[1];
            imgData.data[idx + 2] = color[2];
            imgData.data[idx + 3] = 255;
        }
    }
    virtualCtx.putImageData(imgData, 0, 0);
}

// Draw the virtual canvas onto the visible canvas
function draw() {
    const sx = overscan * canvas.width - dragOffsetX;
    const sy = overscan * canvas.height - dragOffsetY;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(virtualCanvas, sx, sy, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 2, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();

    updateInputs();
}

// Enable dragging to move the view
canvas.onmousedown = (e) => {
    dragStart = { x: e.offsetX, y: e.offsetY };
    canvas.style.cursor = "grabbing";
};

canvas.onmousemove = (e) => {
    if (dragStart) {
        dragOffsetX = e.offsetX - dragStart.x;
        dragOffsetY = e.offsetY - dragStart.y;

        const dx = dragOffsetX / canvas.width * scale;
        const dy = dragOffsetY / canvas.height * scale;

        inputRe.value = offsetX - dx;
        inputIm.value = offsetY - dy;

        draw();
    } else {
        canvas.style.cursor = "grab";
    }
};

// Finalize dragging and update view
canvas.onmouseup = () => {
    if (dragStart) {
        const dx = dragOffsetX / canvas.width * scale;
        const dy = dragOffsetY / canvas.height * scale;

        offsetX -= dx;
        offsetY -= dy;

        dragOffsetX = 0;
        dragOffsetY = 0;
        dragStart = null;
        renderCanvas();
    }
};

// Handle mouse leaving canvas
canvas.onmouseleave = canvas.onmouseup;

// Update center when inputs change
inputRe.onchange = () => {
    offsetX = parseFloat(inputRe.value);
    renderCanvas();
};

inputIm.onchange = () => {
    offsetY = parseFloat(inputIm.value);
    renderCanvas();
};

// Initial render
renderCanvas();
