const canvasBubbles = document.getElementsByClassName('periodicBubbles')[0];
const ctxBubbles = canvasBubbles.getContext('2d');
const width = canvasBubbles.width;
const height = canvasBubbles.height;

//complex number addition
function complexAdd(a, b) {
  return { re: a.re + b.re, im: a.im + b.im };
}

//complex number multiplication
function complexMultiply(a, b) {
  return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re };
}

   // Greatest common divisor function
   function divisors(a) {
    var div = [];
     for(var i = 1; i <= a; i++){
      if(a % i == 0){
       div.push(i);  
      }
     }
    return div;
 };

// Main function for checking periodicity
function periods2(x, y, targetPeriod, maxIter = 1000) {
  var lastFew = [];  // Stores only the last few iterations
  var maxCheckLength = 2*targetPeriod;  // The length of the sliding window for cycle detection
  var cx = { re: x, im: y }; 
  var z = { re: 0, im: 0 };  

  // Iterate through the maximum number of iterations
  for (var iter = 1; iter < maxIter; iter++) {
      z = complexAdd(cx, complexMultiply(z, z));

      // Store only the last few iterations (sliding window)
      if (iter >= maxIter - maxCheckLength) {
          lastFew[(iter - (maxIter - maxCheckLength))] = z;
      }
  }

  // Check for cycles in the sliding window (lastFew)
  var hit = false;
  var period = -1;
  var div = divisors(targetPeriod);

  // Check for potential cycles, adjusting based on potential period length
 for (var j = 0; div[j] <= targetPeriod; j++) {
    let numChecks = Math.min(2, maxCheckLength - div[j]); // max. 4 checks
    for (var i = maxCheckLength - div[j] - 1; i >= maxCheckLength - div[j] - numChecks; i--) {
        if (Math.abs(lastFew[i].re - lastFew[(i + div[j])].re) < 0.0001 &&
            Math.abs(lastFew[i].im - lastFew[(i + div[j])].im) < 0.0001) {
            hit = true;
            period = div[j];
            break;
        }
    }
      if (hit) break;
  }

  return hit ? period : -1;
}
  
// Function to calculate Mandelbrot set iterations
function mandelbrotBubbles(c, maxIter, targetPeriod) {
    let z = { x: 0, y: 0 };
    let n = 0;
    let period = 0;
    
    let prevZ = { x: 0, y: 0 }; // Track the previous value of z

    while (n < maxIter) {
        const x = z.x * z.x - z.y * z.y + c.x;
        const y = 2 * z.x * z.y + c.y;
        z.x = x;
        z.y = y;

        if (z.x * z.x + z.y * z.y > 4) break;  // Escape condition

        // Detect period: if the current value is close to the previous value
        if (n % targetPeriod === 0) {
                if (Math.abs(z.x - prevZ.x) < 1e-6 && Math.abs(z.y - prevZ.y) < 1e-6) {
                    period = targetPeriod;  // If we find a matching period, we store it
                    break;
                }
        prevZ.x = z.x;
        prevZ.y = z.y;
        }

        n++;
    }

    return { escapeIter: n, period: period };  // Return both iteration count and period
}

// Function to draw the Mandelbrot set
function drawMandelbrot(targetPeriod) {
    const imgData = ctxBubbles.createImageData(width, height);
    const maxIter = 1000;
    const zoom = 250000;  // Zoom factor
    const offsetX = -1.7882;  
    const offsetY = -0.001;  

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const c = {
                x: x / zoom + offsetX,
                y: y / zoom + offsetY
            };
            
            const result = mandelbrotBubbles(c, maxIter, targetPeriod);
            const iter = result.escapeIter / maxIter;
            let color;
            
            if (result.period === targetPeriod ) {
              if(periods2(c.x,c.y, targetPeriod) == targetPeriod){
                // Highlight points that match the given period
                color = [255, 0, 0];  // Red color
              }else{
                color = [0, 0, 0];  // Black color
              }
            } else {
                // Grayscale for normal points
                const grayscale = Math.floor(255 - 255 * iter);
                color = [grayscale, grayscale, grayscale];
            }

            const index = (x + y * width) * 4;
            imgData.data[index] = color[0];       // Red
            imgData.data[index + 1] = color[1];   // Green
            imgData.data[index + 2] = color[2];   // Blue
            imgData.data[index + 3] = 255;        // Alpha (opacity)
        }
    }
    
    ctxBubbles.putImageData(imgData, 0, 0);
}

    // Function to count proper divisors of a number
    function countProperDivisors(n) {
      let count = 0;
      for (let i = 1; i < n; i++) {
          if (n % i === 0) {
              count++; // i is a proper divisor
          }
      }
      return count;
  }

  // Function to calculate the exact number of hyperbolic components
  function numberOfHyperbolicComponents(period) {
    let all_num  = Math.pow(2, period - 1);
      for (let i = 1; i < period; i++) {
          if (period % i === 0) {
              all_num -= numberOfHyperbolicComponents(i);
          }
      }
      return all_num;
  }

  let period = 4;

  function compute(period){
            // Calculate the number of hyperbolic components
    const components = numberOfHyperbolicComponents(period);
    // Display the result 
    document.getElementById("numberOfComp").textContent = `Number of hyperbolic components for period ${period}: ${components}`;
  }   
  compute(period);


// Draw the Mandelbrot set with period highlighting
let targetPeriod = 4;  

function renderCanvasBubbles() {
  measureRenderingBubbles(() => {
    targetPeriod = parseInt(document.getElementById('periodSlider2').value);
    drawMandelbrot(targetPeriod);
    compute(targetPeriod);
});
}

function measureRenderingBubbles(callback) {
    const startTime = performance.now();
    callback();
    const endTime = performance.now();
    document.getElementById("renderTimeBubbles").textContent = `Rendering time: ${(endTime - startTime).toFixed(2)} ms`;
}

document.getElementById('periodSlider2').addEventListener('input', function () {
    document.getElementById('periodValue2').textContent = this.value;
  });
  
  function applyBubbles() {
    renderCanvasBubbles();
    };
    renderCanvasBubbles();

