// Function to calculate the Julia set iteration
function julia(zRe, zIm, cReal, cImag) {
  let iter = 0;
  
  while (zRe * zRe + zIm * zIm <= 4 && iter < maxIter) {
      let zReNew = zRe * zRe - zIm * zIm + cReal;
      let zImNew = 2 * zRe * zIm + cImag;
      zRe = zReNew;
      zIm = zImNew;
      iter++;
  }

  return iter;
}

// Function to map iteration count to color using low and high colors
function getColor(iter) {
  const lowColor = document.getElementById('lowColorPicker').value;
  const highColor = document.getElementById('highColorPicker').value;

  // Convert hex to RGB
  const lowRgb = hexToRgb(lowColor);
  const highRgb = hexToRgb(highColor);

  // Interpolate between low and high colors based on iteration count
  const ratio = iter / maxIter;
  const r = Math.round(lowRgb.r + ratio * (highRgb.r - lowRgb.r));
  const g = Math.round(lowRgb.g + ratio * (highRgb.g - lowRgb.g));
  const b = Math.round(lowRgb.b + ratio * (highRgb.b - lowRgb.b));

  return `rgb(${r}, ${g}, ${b})`;
}

// Helper function to convert hex to RGB
function hexToRgb(hex) {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return { r, g, b };
}

// Check if all border pixels of a rectangle have the same iteration count
function checkBorder(x, y, rectWidth, rectHeight, cReal, cImag) {
  let iter = numberOfIter(x, y, cReal, cImag);  // Top-left corner
  for (let i = 0; i < rectWidth; i++) {
      if (numberOfIter(x + i, y, cReal, cImag) !== iter || numberOfIter(x + i, y + rectHeight - 1, cReal, cImag) !== iter) {
          return false;
      }
  }
  for (let j = 0; j < rectHeight; j++) {
      if (numberOfIter(x, y + j, cReal, cImag) !== iter || numberOfIter(x + rectWidth - 1, y + j, cReal, cImag) !== iter) {
          return false;
      }
  }
  return true;
}

// Fill a rectangle with the same iteration count
function fillRectangle(x, y, rectWidth, rectHeight, iter) {
  ctx.fillStyle = getColor(iter);
  ctx.fillRect(x, y, rectWidth, rectHeight);
}

// Draw the rectangle border if `showRectangles` is true
function drawRectangleBorder(x, y, rectWidth, rectHeight) {
  if (showRectangles) {
      ctx.strokeStyle = 'blue';  // Border color
      ctx.lineWidth = 1;  // Border thickness
      ctx.strokeRect(x, y, rectWidth, rectHeight);  // Draw the border
  }
}

// Advanced rectangle checking using Mariani-Silver algorithm
function advancedRectangleCheck(x, y, rectWidth, rectHeight, cReal, cImag) {
  drawRectangleBorder(x, y, rectWidth, rectHeight);  // Draw the border of the current rectangle

  if (rectWidth <= minimalRectSize || rectHeight <= minimalRectSize) {
      const iter = numberOfIter(x, y, cReal, cImag);
      fillRectangle(x, y, rectWidth, rectHeight, iter);
      return;
  }

  if (checkBorder(x, y, rectWidth, rectHeight, cReal, cImag)) {
      const iter = numberOfIter(x, y, cReal, cImag);
      fillRectangle(x, y, rectWidth, rectHeight, iter);
  } else {
      const halfWidth = Math.ceil(rectWidth / 2);
      const halfHeight = Math.ceil(rectHeight / 2);

      advancedRectangleCheck(x, y, halfWidth, halfHeight, cReal, cImag);
      advancedRectangleCheck(x + halfWidth, y, rectWidth - halfWidth, halfHeight, cReal, cImag);
      advancedRectangleCheck(x, y + halfHeight, halfWidth, rectHeight - halfHeight, cReal, cImag);
      advancedRectangleCheck(x + halfWidth, y + halfHeight, rectWidth - halfWidth, rectHeight - halfHeight, cReal, cImag);
  }
}

// Map pixel coordinates to Julia set coordinates
function numberOfIter(x, y, cReal, cImag) {
  const zRe = reMin + (x / canvas.width) * (reMax - reMin);
  const zIm = imMax - (y / canvas.height) * (imMax - imMin);
  return julia(zRe, zIm, cReal, cImag);
}

// Main function to render the Julia set using advanced rectangle checking
function rectangleChecking(cReal, cImag) {
  for (let x = 0; x < canvas.width; x += initialRectSize) {
      for (let y = 0; y < canvas.height; y += initialRectSize) {
          const rectWidth = Math.min(initialRectSize, canvas.width - x);
          const rectHeight = Math.min(initialRectSize, canvas.height - y);
          advancedRectangleCheck(x, y, rectWidth, rectHeight, cReal, cImag);
      }
  }
}

// Update maxIter and re-render when the slider changes
document.getElementById('iterationsSlider1').addEventListener('input', function () {
  document.getElementById('iterationsValue1').textContent = this.value;
});

document.getElementById('minimalRectSize').addEventListener('input', function () {
  initialRectSize = document.getElementById('initialRectSize').value;
  if (parseInt(this.value) > parseInt(initialRectSize)) {
    this.value = initialRectSize; // Prevent min > max
  }
  document.getElementById('minValue').textContent = this.value;
});

document.getElementById('initialRectSize').addEventListener('input', function () {
  minimalRectSize = document.getElementById('minimalRectSize').value;
  if (parseInt(this.value) < parseInt(minimalRectSize)) {
    this.value = minimalRectSize; // Prevent max < min
  }
  document.getElementById('maxValue').textContent = this.value;
});

// Event listeners for color pickers
document.getElementById('lowColorPicker').addEventListener('input', function () {
  lowColor = this.value;
});
document.getElementById('highColorPicker').addEventListener('input', function () {
  highColor = this.value;
});

function measureRendering(callback) {
  const startTime = performance.now();
  callback();
  const endTime = performance.now();
  document.getElementById("renderTime").textContent = `Rendering time: ${(endTime - startTime).toFixed(2)} ms`;
}

function renderCanvas() {
  measureRendering(() => {
      rectangleChecking(cReal, cImag);
  });
}

// Re-render when the "apply" button is clicked
function apply() {
  maxIter = parseInt(document.getElementById('iterationsSlider1').value);
  initialRectSize = parseInt(document.getElementById('initialRectSize').value);
  minimalRectSize = parseInt(document.getElementById('minimalRectSize').value);
  cReal = parseFloat(document.getElementById('cReal').value);
  cImag = parseFloat(document.getElementById('cImag').value);
  renderCanvas();
}

// Re-render when the checkbox state changes
document.getElementById('showRectanglesCheckbox').addEventListener('change', function () {
  showRectangles = this.checked;
  renderCanvas();
});

renderCanvas(); 
