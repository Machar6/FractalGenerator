const canvas = document.getElementsByClassName('mandelbrot')[0];
const ctx = canvas.getContext('2d');

function mandelbrot(cx, cy, maxIter) {
    let x = 0, y = 0, iteration = 0;
    while (x*x + y*y <= 4 && iteration < maxIter) {
        let xNew = x*x - y*y + cx;
        y = 2*x*y + cy;
        x = xNew;
        iteration++;
    }
    return iteration;
}

function drawMandelbrotSet() {
    let imgData = ctx.createImageData(canvas.width, canvas.height);
    let maxIter = 100;
    let scaleX = 2.5 / canvas.width; // Width scaling for Mandelbrot set
    let scaleY = 2.5 / canvas.height; // Height scaling for Mandelbrot set

    for (let px = 0; px < canvas.width; px++) {
        for (let py = 0; py < canvas.height; py++) {
            // Mapping pixel coordinates to the complex plane
            let cx = (px - canvas.width / 2) * scaleX - 0.4;
            let cy = (py - canvas.height / 2) * scaleY + 0.001;

            let iter = mandelbrot(cx, cy, maxIter);
            let color = Math.floor(255 - (iter / maxIter) * 255); // Scale iteration count to [0, 255]
            
            let idx = (px + py * canvas.width) * 4;
            imgData.data[idx] = color;      // Red
            imgData.data[idx + 1] = color;  // Green
            imgData.data[idx + 2] = color;  // Blue
            imgData.data[idx + 3] = 255;    // Alpha (fully opaque)
        }
    }
    ctx.putImageData(imgData, 0, 0);
}

const cardioidCanvas1 = document.getElementsByClassName('mandelbrot')[0];
const cardioidCtx1 = cardioidCanvas1.getContext('2d');
const scale = cardioidCanvas1.width / 2.5; 
const centerX1 = cardioidCanvas1.width/2;
const centerY1 = cardioidCanvas1.width/2;
const periodSlider1 = document.getElementById('periodSlider1');
const periodValue1 = document.getElementById('periodValue1');

function drawAxesWithLabels1(ctx, centerX1, centerY1, maxVal, scale) {
    ctx.strokeStyle = 'gray';
    ctx.beginPath();

    // X-axis
    ctx.moveTo(centerX1 - maxVal * scale - 10, centerY1);  // Extend slightly beyond the range
    ctx.lineTo(centerX1 + maxVal * scale + 10, centerY1);

    // Y-axis
    ctx.moveTo(centerX1, centerY1  - maxVal * scale - 10);  // Extend slightly beyond the range
    ctx.lineTo(centerX1, centerY1  + maxVal * scale + 10);
    ctx.stroke();

    ctx.font = '10px Arial';
    ctx.fillStyle = 'gray';

    // Tick marks and labels
    for (let i = -maxVal; i <= maxVal; i += 0.5) {
        const xPos = centerX1 + i * scale;
        const yPos = centerY1 - i * scale;

        // X-axis labels and ticks
        ctx.moveTo(xPos, centerY1 - 5);
        ctx.lineTo(xPos, centerY1 + 5);
        if (i !== 0) {  // Avoid placing a label directly at the origin
            ctx.fillText(i.toFixed(1), xPos - 10, centerY1 + 20);
        }

        // Y-axis labels and ticks
        ctx.moveTo(centerX1 - 5, yPos);
        ctx.lineTo(centerX1 + 5, yPos);
        if (i !== 0) {  // Avoid placing a label directly at the origin
            ctx.fillText(i.toFixed(1), centerX1 + 10, yPos + 3);
        }
    }
    ctx.stroke();
}

// Behavior of orbit checking function
function periods1(x, y) {
    var list = [];
    var maxIter = 2000;
    var cx = math.complex(x, y);
    var z = math.complex(0, 0);
    list[0] = z;

    for (var iterace = 1; iterace < maxIter; iterace++) {
        list[iterace] = math.add(cx, math.multiply(list[iterace - 1], list[iterace - 1]));
    }

    var hit = false;
    for (var i = 0; i < list.length - 1; i++) {
        for (var j = i + 1; j < list.length; j++) {
            if (i > 1000 && Math.abs((list[i].re - list[j].re)) < 0.0001 && Math.abs((list[i].im - list[j].im)) < 0.0001) {
                hit = true;
                break;
            }
        }
        if (hit == true) {
            break;
        }
    }
    return j - i;
}

// Draw transformed unit circle and cardioid
function drawUnitCircleAndTransformedCardioid1(period) {
    const angleStep = 2 * Math.PI / period;  // Angle between each point
    
    // Clear canvas, but keep Mandelbrot set in the background
    cardioidCtx1.clearRect(0, 0, cardioidCanvas1.width, cardioidCanvas1.height);
    drawMandelbrotSet();  // Keep drawing Mandelbrot background

    // Draw axes with labels
    drawAxesWithLabels1(cardioidCtx1, centerX1 + 128, centerY1, 2, scale);

    // Draw cardioid curve
    cardioidCtx1.strokeStyle = 'blue';
    cardioidCtx1.beginPath();
    for (let angle = 0; angle <= 2 * Math.PI; angle += 0.01) {
      const x = 0.5 * Math.cos(angle) - 0.25 * Math.cos(2 * angle);
      const y = 0.5 * Math.sin(angle) - 0.25 * Math.sin(2 * angle);

      // Transform to canvas coordinates for the cardioid
      const cardioidX1 = centerX1 + 128 + x * scale;
      const cardioidY1 = centerY1 + y * scale;

      if (angle === 0) {
          cardioidCtx1.moveTo(cardioidX1, cardioidY1);
      } else {
          cardioidCtx1.lineTo(cardioidX1, cardioidY1);
      }
    }
    cardioidCtx1.stroke();  // Draw cardioid curve  

    // Draw the period-2 hyperbolic component (blue circle)
    cardioidCtx1.strokeStyle = 'blue';  // Blue line for the period-2 circle
    cardioidCtx1.beginPath();
    for (let angle = 0; angle <= 2 * Math.PI; angle += 0.01) {
        const period2X = -1 + (1 / 4) * Math.cos(angle);  // x for period-2 circle
        const period2Y = (1 / 4) * Math.sin(angle);       // y for period-2 circle

        // Transform to canvas coordinates for the period-2 circle
        const period2CanvasX = centerX1 + 128 + period2X * scale;
        const period2CanvasY = centerY1 + period2Y * scale;

        if (angle === 0) {
            cardioidCtx1.moveTo(period2CanvasX, period2CanvasY);
        } else {
            cardioidCtx1.lineTo(period2CanvasX, period2CanvasY);
        }
    }
    cardioidCtx1.stroke();  // Draw the blue circle

    // Draw transformed points for both cardioid and period-2 circle
    for (let i = 0; i < period; i++) {
        const angle = i * angleStep;

        // Calculate the transformed point on the cardioid
        const x = 0.5 * Math.cos(angle) - 0.25 * Math.cos(2 * angle);
        const y = 0.5 * Math.sin(angle) - 0.25 * Math.sin(2 * angle);
        
        // Transform to canvas coordinates for the cardioid
        const cardioidX1 = centerX1 + 128 + x * scale;
        const cardioidY1 = centerY1 + y * scale;   

        if (periods1(x, y) == period) {
            // Draw the transformed point on the cardioid
            cardioidCtx1.beginPath();
            cardioidCtx1.arc(cardioidX1, cardioidY1, 5, 0, 2 * Math.PI);
            cardioidCtx1.fillStyle = 'red';  // Points red as in the cardioid
            cardioidCtx1.fill();
            cardioidCtx1.closePath();

            // Display the coordinates on the cardioid
            const cardioidCoordText1 = periods1(x, y);
            cardioidCtx1.font = '12px Arial';
            cardioidCtx1.fillStyle = 'red';
            cardioidCtx1.fillText(cardioidCoordText1, cardioidX1 + 5, cardioidY1 - 5);
        }

        // Greatest common divisor function
        var gcd1 = function(a, b) {
            if (b == 0) {
                return a;
            }
            return gcd1(b, a % b);
        };

        const coordText = period / gcd1(period, i);

        // Calculate the transformed point on the period-2 circle
        const period2X = -1 + (1 / 4) * Math.cos(angle);  // x for period-2 circle
        const period2Y = (1 / 4) * Math.sin(angle);       // y for period-2 circle
        
        // Transform to canvas coordinates for the period-2 circle
        const period2CanvasX = centerX1 + 128 + period2X * scale;
        const period2CanvasY = centerY1 + period2Y * scale;

        if (periods1(period2X, period2Y) == period) {
            // Draw the transformed point on the period-2 circle
            cardioidCtx1.beginPath();
            cardioidCtx1.arc(period2CanvasX, period2CanvasY, 5, 0, 2 * Math.PI);
            cardioidCtx1.fillStyle = 'red';  // Points blue as in the period-2 circle
            cardioidCtx1.fill();
            cardioidCtx1.closePath();

            // Display the coordinates on the period-2 circle
            const period2CoordText = 2*coordText;
            cardioidCtx1.font = '12px Arial';
            cardioidCtx1.fillStyle = 'red';
            cardioidCtx1.fillText(period2CoordText, period2CanvasX + 5, period2CanvasY - 5);
        }
    }
}
// Initial draw
drawUnitCircleAndTransformedCardioid1(periodSlider1.value);


// Update the canvas whenever the slider is moved
periodSlider1.addEventListener('input', function() {
    periodValue1.textContent = periodSlider1.value;
    drawUnitCircleAndTransformedCardioid1(periodSlider1.value);
});
