const circleCanvas = document.getElementById('circleCanvas');
const cardioidCanvas = document.getElementById('cardioidCanvas');
const circleCtx = circleCanvas.getContext('2d');
const cardioidCtx = cardioidCanvas.getContext('2d');
const radius = circleCanvas.width / 2.5; 
const centerX = circleCanvas.width / 2;
const centerY = circleCanvas.width / 2;
const periodSlider = document.getElementById('periodSlider');
const periodValue = document.getElementById('periodValue');

// Function to draw axes with labels for both the circle and cardioid canvas
function drawAxesWithLabels(ctx, centerX, centerY, maxVal, scale) {
    ctx.strokeStyle = 'gray';
    ctx.beginPath();

    // X-axis
    ctx.moveTo(centerX - maxVal * scale - 10, centerY);  
    ctx.lineTo(centerX + maxVal * scale + 10, centerY);

    // Y-axis
    ctx.moveTo(centerX, centerY - maxVal * scale - 10);
    ctx.lineTo(centerX, centerY + maxVal * scale + 10);
    ctx.stroke();

    ctx.font = '10px Arial';
    ctx.fillStyle = 'black';

    // Tick marks and labels
    for (let i = -maxVal; i <= maxVal; i += 0.5) {
        const xPos = centerX + i * scale;
        const yPos = centerY - i * scale;

        // X-axis labels and ticks
        ctx.moveTo(xPos, centerY - 5);
        ctx.lineTo(xPos, centerY + 5);
        if (i !== 0) {  
            ctx.fillText(i.toFixed(1), xPos - 10, centerY + 20);
        }

        // Y-axis labels and ticks
        ctx.moveTo(centerX - 5, yPos);
        ctx.lineTo(centerX + 5, yPos);
        if (i !== 0) { 
            ctx.fillText(i.toFixed(1), centerX + 10, yPos + 3);
        }
    }
    ctx.stroke();
}

// Function to compute the period of a given point
function periods(x, y) {
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
                    if (i > 1000 && Math.abs(( list[i].re  - list[j].re)) < 0.0001 && Math.abs((list[i].im  - list[j].im)) < 0.0001) {
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

// Function to draw the unit circle and the transformed cardioid based on a given period
function drawUnitCircleAndTransformedCardioid(period) {
    const angleStep = 2 * Math.PI / period; 
    
    circleCtx.clearRect(0, 0, circleCanvas.width, circleCanvas.height);
    cardioidCtx.clearRect(0, 0, cardioidCanvas.width, cardioidCanvas.height);

    const unitScale = radius;
    const cardioidScale = radius;  

    // Draw axes with labels on both canvases
    drawAxesWithLabels(circleCtx, centerX, centerY, 1.5, unitScale);
    drawAxesWithLabels(cardioidCtx, centerX, centerY, 1.5, cardioidScale);

    // Draw unit circle
    circleCtx.strokeStyle = 'black';
    circleCtx.beginPath();
    circleCtx.arc(centerX, centerY, unitScale, 0, 2 * Math.PI);
    circleCtx.stroke();

    // Draw cardioid 
    cardioidCtx.strokeStyle = 'blue';
    cardioidCtx.beginPath();
    for (let angle = 0; angle <= 2 * Math.PI; angle += 0.01) {
        const x = 0.5 * Math.cos(angle) - 0.25 * Math.cos(2 * angle);
        const y = 0.5 * Math.sin(angle) - 0.25 * Math.sin(2 * angle);

        const cardioidX = centerX + x * cardioidScale;
        const cardioidY = centerY + y * cardioidScale;

        if (angle === 0) {
            cardioidCtx.moveTo(cardioidX, cardioidY);
        } else {
            cardioidCtx.lineTo(cardioidX, cardioidY);
        }
    }
    cardioidCtx.stroke();  
    // Draw transformed points for cardioid
    for (let i = 0; i < period; i++) {
        const angle = i * angleStep;

        // Calculate the transformed point on the cardioid
        const x = 0.5 * Math.cos(angle) - 0.25 * Math.cos(2 * angle);
        const y = 0.5 * Math.sin(angle) - 0.25 * Math.sin(2 * angle);

        // Transform to canvas coordinates for the cardioid
        const cardioidX = centerX + x * cardioidScale;
        const cardioidY = centerY + y * cardioidScale;   

        cardioidCtx.beginPath();
        cardioidCtx.arc(cardioidX, cardioidY, 5, 0, 2 * Math.PI);
        cardioidCtx.fillStyle = 'red'; 
        cardioidCtx.fill();
        cardioidCtx.closePath();

        // Display the coordinates on the cardioid
        const cardioidCoordText = periods(x, y);
        cardioidCtx.font = '12px Arial';
        cardioidCtx.fillStyle = 'red';
        cardioidCtx.fillText(cardioidCoordText, cardioidX + 10, cardioidY - 10);

        const unitX = Math.cos(angle);
        const unitY = Math.sin(angle);

        // Transform to canvas coordinates for the unit circle
        const circleX = centerX + unitX * unitScale;
        const circleY = centerY + unitY * unitScale;

        // Draw the point on the unit circle
        circleCtx.beginPath();
        circleCtx.arc(circleX, circleY, 5, 0, 2 * Math.PI);
        circleCtx.fillStyle = 'red'; 
        circleCtx.fill();
        circleCtx.closePath();
        // greatest common divisors
        var gcd = function(a, b) {
            if (b == 0) {
                return a;
            }
            return gcd(b, a % b);
        };

        const coordText = period / gcd(period, i);

        circleCtx.font = '12px Arial';
        circleCtx.fillStyle = 'red';
        circleCtx.fillText(coordText, circleX + 10, circleY - 10);
    }
}

// Initial draw
drawUnitCircleAndTransformedCardioid(periodSlider.value);

// Update the canvas whenever the slider is moved
periodSlider.addEventListener('input', function() {
    periodValue.textContent = periodSlider.value;
    drawUnitCircleAndTransformedCardioid(periodSlider.value);
});
