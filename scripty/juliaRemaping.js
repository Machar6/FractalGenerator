
        // Map canvas coordinates to the complex plane
        function toComplex(x, y) {
            return {
                re: (x - canvas.width / 2) / scale,
                im: (canvas.height / 2 - y) / scale
            };
        }
  
        // Map complex plane coordinates to canvas
        function toCanvas(z) {
            return {
                x: z.re * scale + canvas.width / 2,
                y: canvas.height / 2 - z.im * scale
            };
        }
  
        // Function to perform the transformation sqrt(z - c)
        function transform(z, c) {
            const zMinusC = {
                re: z.re - c.re,
                im: z.im - c.im
            };
            const magnitude = Math.sqrt(Math.sqrt(zMinusC.re * zMinusC.re + zMinusC.im * zMinusC.im));
            const angle = Math.atan2(zMinusC.im, zMinusC.re) / 2;
            return {
                re: magnitude * Math.cos(angle),
                im: magnitude * Math.sin(angle)
            };
        }
        function remap(iterations) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);   

          let points = [];
          let step = Math.pow(1.4,iterations);

          for (let x = 0; x < canvas.width; x += step) {
            for (let y = 0; y < canvas.height; y+= step) {
                const z = toComplex(x, y);
                points.push({ z, color: (z.re * z.re + z.im * z.im <= 4) ? 'black' : 'white' });
            }
        }
        
          
// Apply transformation
for (let i = 0; i < iterations; i++) {
    const transformedPoints = [];

    // Transform all points
    points.forEach(point => {
        if (point.color === 'black') {
            const transformed = transform(point.z, c);
            const symmetricZ = { re: -transformed.re, im: -transformed.im };

            transformedPoints.push({ z: transformed, color: 'black' });
            transformedPoints.push({ z: symmetricZ, color: 'black' });
        }
    });

    points = [];
    for (let j = 0; j < transformedPoints.length; j ++) {
        points.push(transformedPoints[j]);

    }
}
      
          // Draw the result on the canvas
          points.forEach(point => {
              const canvasPos = toCanvas(point.z);
              ctx.fillStyle = point.color;
              ctx.fillRect(canvasPos.x, canvasPos.y, 1, 1);
          });
      }
        
  document.getElementById('iterationsSlider2').addEventListener('input', function () {
    document.getElementById('iterationsValue2').textContent = this.value;
  });

  function measureRendering(callback) {
    const startTime = performance.now();
    callback();
    const endTime = performance.now();
    document.getElementById("renderTime").textContent = `Rendering time: ${(endTime - startTime).toFixed(2)} ms`;
  }
  
  function renderCanvas() {
    measureRendering(() => {
        remap(iterations);
    });
  }
  
  function apply() {
    // Get the period value from input field
    iterations = parseInt(document.getElementById('iterationsSlider2').value);
    c = { re: parseFloat(document.getElementById('cReal').value), 
          im: parseFloat(document.getElementById('cImag').value) };
          renderCanvas();
  }  
  
  renderCanvas();