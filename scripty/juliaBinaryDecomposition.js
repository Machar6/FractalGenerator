// Function to calculate the norm (square of the magnitude) of a complex number
function cnorm(z) {
  return z.real * z.real + z.imag * z.imag;
}

// Function that performs the binary decomposition of the Julia set and draws the image
function juliaBinaryDecomposition() {
  const imageData = ctx.createImageData(canvas.width, canvas.height);  
  const data = imageData.data;  

  for (let j = 0; j < canvas.height; j++) {
    let y = (canvas.height / 2 - (j + 0.5)) / (canvas.height / 2) * r; 
    
    for (let i = 0; i < canvas.width; i++) {
      let x = (i + 0.5 - canvas.width / 2) / (canvas.height / 2) * r;  
      let z = { real: x, imag: y };  // Initialize complex number z
      let k;

      // Iterate over the maximum number of iterations
      for (k = 0; k < nMax; k++) {
        let zReal2 = z.real * z.real - z.imag * z.imag + c.real;  
        let zImag2 = 2 * z.real * z.imag + c.imag;  
        z.real = zReal2;  
        z.imag = zImag2;  

        // Check if the norm of z exceeds the radius squared
        if (cnorm(z) > r2) break;  // Exit loop if the norm is too large
      }

      // Set pixel color based on whether the point escapes or not
      let index = (j * canvas.width + i) * 4;
      let color = (k < nMax && z.imag < 0) ? 255 : 0;  // If inside Julia set, set color to white
      data[index] = color;     // Red
      data[index + 1] = color; // Green
      data[index + 2] = color; // Blue
      data[index + 3] = 255;   // Alpha
    }
  }

  ctx.putImageData(imageData, 0, 0);  // Draw the image data on the canvas
}

// Event listeners to update slider values displayed
document.getElementById('iterationsSlider').addEventListener('input', function () {
  document.getElementById('iterationsValue').textContent = this.value;
});

document.getElementById('radiusSlider').addEventListener('input', function () {
  document.getElementById('radiusValue').textContent = this.value;
});

// Function to measure the rendering time and display it
function measureRendering(callback) {
  const startTime = performance.now();  
  callback();  
  const endTime = performance.now(); 
  document.getElementById("renderTime").textContent = `Rendering time: ${(endTime - startTime).toFixed(2)} ms`;  // Display rendering time
}

// Function to trigger the canvas rendering with timing measurement
function renderCanvas() {
  measureRendering(() => {
    juliaBinaryDecomposition();  
  });
}

// Function to apply the user inputs and render the updated Julia set
function apply() {
  nMax = parseInt(document.getElementById('iterationsSlider').value);  
  c = { 
    real: parseFloat(document.getElementById('cReal').value), 
    imag: parseFloat(document.getElementById('cImag').value) 
  } 
  r2 = parseInt(document.getElementById('radiusSlider').value);  
  renderCanvas();  // Render the updated Julia set
};

renderCanvas();  // Initial render of the canvas
