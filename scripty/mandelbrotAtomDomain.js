function cnorm(z) {
    return Math.pow(z.re, 2) + Math.pow(z.im, 2);
  }
  function hsv2rgb(h, s, v) {
    let r, g, b;
    let i, f, p, q, t;
    let hue = h * 6;
    let index = Math.floor(hue);
    f = hue - index;
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));
    switch (index % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }
    return {
        red: Math.min(Math.max(Math.floor(255 * r + 0.5), 0), 255),
        green: Math.min(Math.max(Math.floor(255 * g + 0.5), 0), 255),
        blue: Math.min(Math.max(Math.floor(255 * b + 0.5), 0), 255)
    };
  }
  
  function complexDivide(a, b) {
    const denominator = b.re * b.re + b.im * b.im;  
    const realPart = (a.re * b.re + a.im * b.im) / denominator;  
    const imaginaryPart = (a.im * b.re - a.re * b.im) / denominator; 
    return { re: realPart, im: imaginaryPart };
  }
  
  function componentCenter(c0, period, mMax) {
    let c = c0;
    for (let m = 0; m < mMax; m++) {
        let z = { re: 0, im: 0 };  
        let dc = { re: 0, im: 0 }; 
        for (let i = 0; i < period; ++i) {
            dc = {
                re: 2 * (z.re * dc.re - z.im * dc.im) + 1,  
                im: 2 * (z.re * dc.im + z.im * dc.re)      
            };  // dc = 2*z*dc + 1
            z = { re: z.re * z.re - z.im * z.im + c.re, im: 2 * z.re * z.im + c.im };  // z = z*z + c
        }   
        c = { 
            re: c.re -  complexDivide(z, dc).re, 
            im: c.im - complexDivide(z, dc).im
        };  // c = c - z/dc
    }
    return c;
  }
  //Function to get the value of m for the clicked point
  function getMValueAt(x, y) {
    let z = { re: 0, im: 0 };
    const c = { re: x, im: y };
    let dc = { re: 0, im: 0 };
    let mz = Infinity;
    let m = 0;
  
    for (let k = 1; k < n; k++) {
        dc = {
            re: 2 * (z.re * dc.re - z.im * dc.im),
            im: 2 * (z.re * dc.im + z.im * dc.re)
        };
        z = {
            re: z.re * z.re - z.im * z.im + c.re,
            im: 2 * z.re * z.im + c.im
        };
        const z2 = cnorm(z);
        if (z2 < mz) {
            mz = z2;
            m = k;
        }
        if (z2 > r2) break;
    }
    return m;
  }
  
  function basinOfAttr() {
    for (let j = 0; j < canvasAtom.height; j++) {
        const y = imMax - (imMax - imMin) * j / canvasAtom.height;
        for (let i = 0; i < canvasAtom.width; i++) {
            const x = reMin + (reMax - reMin) * i / canvasAtom.width;
            let z = { re: 0, im: 0 };
            const c = { re: x, im: y };

            let dc = { re: 0, im: 0 }; //derivative of c
            let mz = Infinity; //minimum distance
            let m = 0; // period of basin of attraction
            let de = -1; //eccentricity of the point (used for brightness calculation)

  
            for (let k = 1; k < n; k++) {
                dc = {
                    re: 2 * (z.re * dc.re - z.im * dc.im),
                    im: 2 * (z.re * dc.im + z.im * dc.re)
                };
                z = {
                    re: z.re * z.re - z.im * z.im + c.re,
                    im: 2 * z.re * z.im + c.im
                };
                const z2 = cnorm(z);
                if (z2 < mz) {
                    mz = z2;
                    m = k;
                }
                if (z2 > r2) {
                    de = 2 * Math.sqrt(z.re * z.re + z.im * z.im) * Math.log(Math.sqrt(z.re * z.re + z.im * z.im)) / (Math.sqrt(dc.re * dc.re + dc.im * dc.im) * dc0);
                    break;
                }
            }
  
            //  colour for a given m
            if (m <= maxPeriod) {
                const hue = (1 - (m * gold % 1) + hueShift) % 1;
                const val = de >= 0 ? Math.tanh(de) : brightness;
                const { red, green, blue } = hsv2rgb(hue, satVal, val);
                colorMap[m] = { red, green, blue }; // colours to the map according to m
  
                const index = 4 * (j * canvasAtom.width + i);
                imageData.data[index] = red;
                imageData.data[index + 1] = green;
                imageData.data[index + 2] = blue;
                imageData.data[index + 3] = 255; // Opaque
            } else {
                const index = 4 * (j * canvasAtom.width + i);
                imageData.data[index] = 0;
                imageData.data[index + 1] = 0;
                imageData.data[index + 2] = 0;
                imageData.data[index + 3] = 0; // Transparent
            }
        }
    }
    ctxAtom.putImageData(imageData, 0, 0);
  }
    let colorMap = {};  
    const phi = (Math.sqrt(5) + 1) / 2;
    const gold = 1 / (phi * phi);
  
    let maxIterations = 1000;
  
    let reCenter = -0.3; 
    let imCenter = 0;    
    let zoomFactor = 1.3; 
  
    let reMin = reCenter - (2.5 / zoomFactor);
    let reMax = reCenter + (1.5 / zoomFactor);
    let imMin = imCenter - (2 / zoomFactor);
    let imMax = imCenter + (2 / zoomFactor);
  
    let hueShift = 0.7;
    let satVal = 0.5;
    let brightness = 0.2;
    
    let maxPeriod = 150;
    let n = 100;
    const canvasAtom = document.getElementsByClassName('atomDomains')[0];
    const ctxAtom = canvasAtom.getContext('2d');
    const imageData = ctxAtom.createImageData(canvasAtom.width, canvasAtom.height);
  
    const r = 2;
    const r2 = r * r;
    const dc0 = r / (canvasAtom.height / 2);
    let points = []; 
  

    function updateCenter(){
      reCenter = (reMin + reMax) / 2;
      imCenter = (imMin + imMax) / 2;
    };
  
   // Zoom in
  document.getElementById("zoomIn").onclick = () => {
    zoomFactor /= 2;

    const reRange = (reMax - reMin) / 2;
    const imRange = (imMax - imMin) / 2;

    reMin = reCenter - reRange / 2;
    reMax = reCenter + reRange / 2;
    imMin = imCenter - imRange / 2;
    imMax = imCenter + imRange / 2;
  
    renderCanvas();
  };
  
  // Zoom out
  document.getElementById("zoomOut").onclick = () => {
    zoomFactor *= 2;
    const reRange = (reMax - reMin) * 2;
    const imRange = (imMax - imMin) * 2;
  
    reMin = reCenter - reRange / 2;
    reMax = reCenter + reRange / 2;
    imMin = imCenter - imRange / 2;
    imMax = imCenter + imRange / 2;
  
    renderCanvas();
  };
  
  // Reset view
  document.getElementById("resetView").onclick = () => {
    points = [];
    zoomFactor = 1.3;
    reMin = -0.3 - (2.5 / zoomFactor);
    reMax = -0.3 + (1.5 / zoomFactor);
    imMin = -2 / zoomFactor;
    imMax = 2 / zoomFactor;
    updateCenter();
    renderCanvas();
  };
  
  // move left
  document.getElementById("left").onclick = () => {
    const shift = (reMax - reMin) * 0.1; // 10 % šířky
    reMin -= shift;
    reMax -= shift;
    updateCenter();
    renderCanvas();
  };
  
  // move right
  document.getElementById("right").onclick = () => {
    const shift = (reMax - reMin) * 0.1; // 10 % šířky
    reMin += shift;
    reMax += shift;
    updateCenter();
    renderCanvas();
  };
  
  // move up
  document.getElementById("up").onclick = () => {
    const shift = (imMax - imMin) * 0.1; // 10 % výšky
    imMin += shift;
    imMax += shift;
    updateCenter();
    renderCanvas();
  };
  
  // move down
  document.getElementById("down").onclick = () => {
    const shift = (imMax - imMin) * 0.1; // 10 % výšky
    imMin -= shift;
    imMax -= shift;
    updateCenter();
    renderCanvas();
  };

  updateCenter();
  
    function renderCanvas() {
      measureRendering(() => {
        basinOfAttr();
      });
      updateZoomInfo();
  }
  
  function renderCanvas() {
    measureRendering(() => {
    basinOfAttr();

    points.forEach(point => {
        const nucleusX = (point.re - reMin) / (reMax - reMin) * canvasAtom.width;
        const nucleusY = (imMax - point.im) / (imMax - imMin) * canvasAtom.height;
  
        ctxAtom.fillStyle = 'red';
        ctxAtom.beginPath();
        ctxAtom.arc(nucleusX, nucleusY, 2, 0, 2 * Math.PI);
        ctxAtom.fill();
    });
  });
  updateZoomInfo();
  }
  
  function measureRendering(callback) {
      const startTime = performance.now();
      callback();
      const endTime = performance.now();
      document.getElementById("renderTime").textContent = `Rendering time: ${(endTime - startTime).toFixed(2)} ms`;
  }
  
  function updateZoomInfo() {
    const originalScale = 1.3;
    let zoomFactorUpdate = originalScale / zoomFactor;
    document.getElementById("zoomInfo").innerText = `Zoom: ${zoomFactorUpdate.toFixed(2)}x`;
  }
  
    function getMousePos(canvas, event) {
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;
        const xComplex = reMin + (reMax - reMin) * mouseX / canvas.width;
        const yComplex = imMax - (imMax - imMin) * mouseY / canvas.height;
        return {
            x: mouseX,
            y: mouseY,
            complexRe: xComplex,
            complexIm: yComplex
        };
    }
  
// Function to get the mouse position in the complex plane
canvasAtom.addEventListener('mousemove', (event) => {
  
  // Get mouse coordinates on the canvas
  var mousePos = getMousePos(canvasAtom, event);
  const m = getMValueAt(mousePos.complexRe, mousePos.complexIm);

  // Display the coordinates in the element near the cursor
  const coordsDisplay = document.getElementById('mouseCoords');
  coordsDisplay.textContent = `Re: ${mousePos.complexRe.toFixed(5)}, Im: ${mousePos.complexIm.toFixed(5)}, Period: ${m}`;

  // Set the position of the coordinates box relative to the cursor
  coordsDisplay.style.left = `${event.clientX + 10}px`; // +10px for a small offset from the cursor
  coordsDisplay.style.top = `${event.clientY + 10}px`;  // +10px for a small offset from the cursor

  // Show the coordinates box when the mouse is over the canvas
  coordsDisplay.style.display = 'block';
});

// Hide the coordinates box when the mouse leaves the canvas
canvasAtom.addEventListener('mouseleave', () => {
  const coordsDisplay = document.getElementById('mouseCoords');
  coordsDisplay.style.display = 'none';
});


// Mouse click event handler
canvasAtom.addEventListener('click', (event) => {
  // Get mouse coordinates on the canvas
  var mousePos = getMousePos(canvasAtom, event);
  // Call componentCenter to get the result for the clicked point
  const m = getMValueAt(mousePos.complexRe, mousePos.complexIm);
  const nucleus = componentCenter({ re: mousePos.complexRe, im: mousePos.complexIm }, m, maxIterations);
  const nucleusRe = nucleus.re.toFixed(4);
  const nucleusIm = nucleus.im.toFixed(4);
  // Display the coordinates in the element near the cursor
  document.getElementById("centerCoords").innerText = `Center: ${nucleusRe}${nucleusIm >= 0 ? '+' : ''}${nucleusIm}i; period ${m}`;

  points.push({ re: nucleus.re, im: nucleus.im });
  // Convert the nucleus result to pixel coordinates
  const nucleusX = (nucleus.re - reMin) / (reMax - reMin) * canvasAtom.width;
  const nucleusY = (imMax - nucleus.im) / (imMax - imMin) * canvasAtom.height;
  // Draw a point on the current canvas content
  ctxAtom.fillStyle = 'red';
  ctxAtom.beginPath();
  ctxAtom.arc(nucleusX, nucleusY, 2, 0, 2 * Math.PI);
  ctxAtom.fill();
});

document.getElementById('brightness').addEventListener('input', function () {
  brightness = parseFloat(document.getElementById('brightness').value); // Update the global brightness variable
  document.getElementById('brightnessVal').textContent = this.value * 100 + " %"; // Display the value
});

function apply() {
  brightness = parseFloat(document.getElementById('brightness').value);
  renderCanvas();
}

renderCanvas();
