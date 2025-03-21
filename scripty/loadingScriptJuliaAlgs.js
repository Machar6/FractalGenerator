const canvas = document.getElementsByClassName('mandelbrot')[0];
const ctx = canvas.getContext('2d');
const reMin = -1.8;
const reMax = 1.8;
const imMin = -1.8;
const imMax = 1.8;
const max = 1.8;
let maxIterations = 500;
let cReal = -0.7; 
let cImag = 0.27015;
let c = { re: cReal, im: cImag};
let cComplex = math.complex(cReal, cImag); 

let maxIter = 50;
let iterations = 5; 
let iterMax = 16;
const scale = 200; 
const initialPoint = math.complex(1, 0); 

const sobelX = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
];

const sobelY = [
    [-1, -2, -1],
    [ 0,  0,  0],
    [ 1,  2,  1]
];
let showRectangles = true;

let initialRectSize = 100;
let minimalRectSize = 2;

let lowColor = '#000000';
let highColor = '#ff0000';

document.getElementById('scriptSelector').addEventListener('change', function () {
    cReal = parseFloat(document.getElementById('cReal')?.value);
    cReal = isNaN(cReal) ? -0.7 : cReal;
    cImag = parseFloat(document.getElementById('cImag')?.value);
    cImag = isNaN(cImag) ? 0.27015 : cImag;
    c = { re: cReal, im: cImag};
    cComplex = math.complex(cReal, cImag);
    maxIterations = parseInt(document.getElementById('iterationsSlider')?.value) || 500;
    maxIter = parseInt(document.getElementById('iterationsSlider1')?.value) || 50;
    iterations = parseInt(document.getElementById('iterationsSlider2')?.value) || 5;
    iterMax = parseInt(document.getElementById('iterationsSlider3')?.value) || 16;
    lowColor = document.getElementById('lowColorPicker')?.value || "#000000";
    highColor = document.getElementById('highColorPicker')?.value || "#ff0000";
    maxSlider = parseInt(document.getElementById('initialRectSize')?.value) || 100;
    minSlider = parseInt(document.getElementById('minimalRectSize')?.value) || 2;


  const scriptName = this.value;
  const scriptContainer = document.getElementById('scriptContainer');
  const optionsContainer = document.getElementById('optionsContainer');
  const descriptionContainer = document.getElementById('descriptionContainer');

  while (scriptContainer.firstChild) {
    scriptContainer.removeChild(scriptContainer.firstChild);
    optionsContainer.removeChild(optionsContainer.firstChild);
    descriptionContainer.removeChild(descriptionContainer.firstChild);
  }

  if (scriptName) {
    const script = document.createElement('script');
    script.src = `scripty/${scriptName}`;
    script.type = 'text/javascript';
    scriptContainer.appendChild(script);
  }

  if (scriptName === "juliaDistanceEstimation.js" || scriptName === "juliaEscapeTimeAlg.js") {
    optionsContainer.innerHTML = `
            <div class = "options">
                <div class="row mx-auto" style="max-width:70%">
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label for="cReal" class="form-label">c (real part):</label>
                          <input id="cReal" type="text" class="form-control form-control-sm" placeholder = "c (real part)" value = "` + cReal + `" style="min-width: 150px; max-width: 250px;">
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label for="cImag" class="form-label">c (imaginary part):</label>
                          <input id="cImag" type="text" class="form-control form-control-sm" placeholder = "c (imaginary part)" value = "` + cImag + `" style="min-width: 150px; max-width: 250px;">
                        </div>
                      </div>
                    </div>
                 <label for="iterationsSlider" class="form-label mb-0" style="margin-right: 10px;">Max Iterations: </label>
                 <input type="range" class="form-range" id="iterationsSlider"  min="1" max="2000" value="` + maxIterations + `" style = "width:70%">
                 <span id="iterationsValue" class="badge bg-primary" style="margin-left: 10px; margin-right: 10px;">` + maxIterations + `</span>
                   <div class ="col-12 col-md-8">
                   <label for="lowColorPicker" class="me-2">Low Color:
                   <input type="color" id="lowColorPicker" value="` + lowColor + `" class="form-control form-control-color me-3 d-inline-block">
                   </label>
                   <label for="highColorPicker" class="me-2">High Color:
                   <input type="color" id="highColorPicker" value="` + highColor + `" class="form-control form-control-color d-inline-block">
                   </label>
                 </div>
                 <div class = "col-lg-4 col-md-4 col-sm-12 mx-auto">
                  <button type="submit" class="btn btn-block btn-outline-dark" onclick="apply()"><strong>Generate</strong></button>
                  </div>
                          <div id="renderTime" class="">Rendering time: 0 ms</div>

                 </div>
    `;

    descriptionContainer.innerHTML = `
    <p>
     <ul>
          <li><strong>c (Real Part):</strong> Allows you to set the real part of the constant \( c \).</li>
    <li><strong>c (Imaginary Part):</strong> Allows you to set the imaginary part of the constant \( c \).</li>
    <li>
    <strong>Max Iterations:</strong> Allows you to set the maximum number of iterations for the visualization.
      </li>
          <li><strong>Low Color:</strong> Determines the color of the points that quickly diverge to infinity.</li>
    <li><strong>High Color:</strong> Adjusts the color of the points where the divergence is slow.</li>

    <li><strong>Generate Button:</strong> Triggers the generation of the resulting Mandelbrot set.</li>
  
  <li>
      <strong>Rendering Time:</strong> Displays the time taken to render the visualization.
      </li>
  </ul>
    </p>
        `;
  } else if(scriptName === "juliaEdgeDetection.js") {
    optionsContainer.innerHTML = `
                      <div class = "options">
                <div class="row mx-auto" style="max-width:70%">
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label for="cReal" class="form-label">c (real part):</label>
                          <input id="cReal" type="text" class="form-control form-control-sm" placeholder = "c (real part)" value = "` + cReal + `" style="min-width: 150px; max-width: 250px;">
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label for="cImag" class="form-label">c (imaginary part):</label>
                          <input id="cImag" type="text" class="form-control form-control-sm" placeholder = "c (imaginary part)" value = "` + cImag + `" style="min-width: 150px; max-width: 250px;">
                        </div>
                      </div>
                    </div>
                    <label for="iterationsSlider1" class="form-label mb-0" style="margin-right: 10px;">Max Iterations: </label>
                    <input type="range" class="form-range" id="iterationsSlider1"  min="1" max="100" value="` + maxIter + `" style = "width:70%">
                    <span id="iterationsValue1" class="badge bg-primary" style="margin-left: 10px; margin-right: 10px;">` + maxIter + `</span>
                    <div class = "col-lg-4 col-md-4 col-sm-12 mx-auto">
                    <button type="submit" class="btn btn-block btn-outline-dark" onclick="apply()"><strong>Generate</strong></button>
                    </div>
                            <div id="renderTime" class="">Rendering time: 0 ms</div>

                   </div>
    `;
    descriptionContainer.innerHTML = `
    <p>
     <ul>
          <li><strong>c (Real Part):</strong> Allows you to set the real part of the constant \( c \).</li>
    <li><strong>c (Imaginary Part):</strong> Allows you to set the imaginary part of the constant \( c \).</li>
    <li>
    <strong>Max Iterations:</strong> Allows you to set the maximum number of iterations for the visualization.
      </li>
    <li><strong>Generate Button:</strong> Triggers the generation of the resulting Mandelbrot set.</li>
  
  <li>
      <strong>Rendering Time:</strong> Displays the time taken to render the visualization.
      </li>
  </ul>
    </p>
        `;
  }
  else if(scriptName === "juliaMIIM.js") {
    optionsContainer.innerHTML = `
                      <div class = "options">
                <div class="row mx-auto" style="max-width:70%">
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label for="cReal" class="form-label">c (real part):</label>
                          <input id="cReal" type="text" class="form-control form-control-sm" placeholder = "c (real part)" value = "` + cReal + `" style="min-width: 150px; max-width: 250px;">
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label for="cImag" class="form-label">c (imaginary part):</label>
                          <input id="cImag" type="text" class="form-control form-control-sm" placeholder = "c (imaginary part)" value = "` + cImag + `" style="min-width: 150px; max-width: 250px;">
                        </div>
                      </div>
                    </div>
                    <label for="iterationsSlider3" class="form-label mb-0" style="margin-right: 10px;">Max Iterations: </label>
                    <input type="range" class="form-range" id="iterationsSlider3"  min="1" max="21" value="` + iterMax + `" style = "width:70%">
                    <span id="iterationsValue3" class="badge bg-primary" style="margin-left: 10px; margin-right: 10px;">` + iterMax + `</span>
                    <div class = "col-lg-4 col-md-4 col-sm-12 mx-auto">
                    <button type="submit" class="btn btn-block btn-outline-dark" onclick="apply()"><strong>Generate</strong></button>
                    </div>
                            <div id="renderTime" class="">Rendering time: 0 ms</div>

                   </div>
    `;

    descriptionContainer.innerHTML = `
    <p>
     <ul>
          <li><strong>c (Real Part):</strong> Allows you to set the real part of the constant \( c \).</li>
    <li><strong>c (Imaginary Part):</strong> Allows you to set the imaginary part of the constant \( c \).</li>
    <li>
    <strong>Max Iterations:</strong> Allows you to set the maximum number of iterations for the visualization.
      </li>
    <li><strong>Generate Button:</strong> Triggers the generation of the resulting Mandelbrot set.</li>
  
  <li>
      <strong>Rendering Time:</strong> Displays the time taken to render the visualization.
      </li>
  </ul>
    </p>
        `;
  }else if(scriptName === "juliaRemaping.js") {
    optionsContainer.innerHTML = `
                      <div class = "options">
                <div class="row mx-auto" style="max-width:70%">
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label for="cReal" class="form-label">c (real part):</label>
                          <input id="cReal" type="text" class="form-control form-control-sm" placeholder = "c (real part)" value = "` + c.re + `" style="min-width: 150px; max-width: 250px;">
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label for="cImag" class="form-label">c (imaginary part):</label>
                          <input id="cImag" type="text" class="form-control form-control-sm" placeholder = "c (imaginary part)" value = "` + c.im + `" style="min-width: 150px; max-width: 250px;">
                        </div>
                      </div>
                    </div>
                    <label for="iterationsSlider2" class="form-label mb-0" style="margin-right: 10px;">Max Iterations: </label>
                    <input type="range" class="form-range" id="iterationsSlider2"  min="0" max="14" value="` + iterations + `" style = "width:70%">
                    <span id="iterationsValue2" class="badge bg-primary" style="margin-left: 10px; margin-right: 10px;">` + iterations + `</span>
                    <div class = "col-lg-4 col-md-4 col-sm-12 mx-auto">
                    <button type="submit" class="btn btn-block btn-outline-dark" onclick="apply()"><strong>Generate</strong></button>
                    </div>
                            <div id="renderTime" class="">Rendering time: 0 ms</div>

                   </div>
    `;
    descriptionContainer.innerHTML = `
    <p>
     <ul>
          <li><strong>c (Real Part):</strong> Allows you to set the real part of the constant \( c \).</li>
    <li><strong>c (Imaginary Part):</strong> Allows you to set the imaginary part of the constant \( c \).</li>
    <li>
    <strong>Max Iterations:</strong> Allows you to set the maximum number of iterations for the visualization.
      </li>
    <li><strong>Generate Button:</strong> Triggers the generation of the resulting Mandelbrot set.</li>
  
  <li>
      <strong>Rendering Time:</strong> Displays the time taken to render the visualization.
      </li>
  </ul>
    </p>
        `;
  }else if(scriptName === "juliaRectChecking.js") {
    optionsContainer.innerHTML = `
                      <div class = "options">
                <div class="row mx-auto" style="max-width:70%">
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label for="cReal" class="form-label">c (real part):</label>
                          <input id="cReal" type="text" class="form-control form-control-sm" placeholder = "c (real part)" value = "` + cReal + `" style="min-width: 150px; max-width: 250px;">
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label for="cImag" class="form-label">c (imaginary part):</label>
                          <input id="cImag" type="text" class="form-control form-control-sm" placeholder = "c (imaginary part)" value = "` + cImag + `" style="min-width: 150px; max-width: 250px;">
                        </div>
                      </div>
                    </div>
                    <label for="iterationsSlider1" class="form-label mb-0" style="margin-right: 10px;">Max Iterations: </label>
                    <input type="range" class="form-range" id="iterationsSlider1"  min="0" max="300" value="` + maxIter + `" style = "width:70%">
                    <span id="iterationsValue1" class="badge bg-primary" style="margin-left: 10px; margin-right: 10px;">` + maxIter + `</span>
                    <label for="initialRectSize" class="form-label mb-0" style="margin-right: 10px;">Max Rectangle Size (px): </label>
                    <input type="range" class="form-range" id="initialRectSize"  min="10" max="400" value="` + initialRectSize + `" style = "width:70%">
                    <span id="maxValue" class="badge bg-primary" style="margin-left: 10px; margin-right: 10px;">` + initialRectSize + `</span>
                    <label for="minimalRectSize" class="form-label mb-0" style="margin-right: 10px;">Min Rectangle Size (px): </label>
                    <input type="range" class="form-range" id="minimalRectSize"  min="1" max="50" value="` + minimalRectSize + `" style = "width:70%">
                    <span id="minValue" class="badge bg-primary" style="margin-left: 10px; margin-right: 10px;">` + minimalRectSize + `</span>
                     <div class ="col-12 col-md-8">
                     <label for="lowColorPicker" class="me-2">Low Color:
                     <input type="color" id="lowColorPicker" value="` + lowColor + `" class="form-control form-control-color me-3 d-inline-block">
                     </label>
                     <label for="highColorPicker" class="me-2">High Color:
                     <input type="color" id="highColorPicker" value="` + highColor + `" class="form-control form-control-color d-inline-block">
                     </label>
                   </div> 
                    <div class = "col-12 row">
                      <button type="submit" class="btn btn-block btn-outline-dark col-12 col-md-4" onclick="apply()" style = "max-width: 30%;"><strong>Generate</strong></button>
                        <div class="custom-control custom-checkbox col-12 col-md-8" style = "text-align: end; align-content: center;">
                          <input class="custom-control-input" type="checkbox" id="showRectanglesCheckbox" checked>
                          <label for="showRectanglesCheckbox" class="custom-control-label">Show Rectangles</label>
                        </div>
                     </div>
                            <div id="renderTime" class="">Rendering time: 0 ms</div>

                   </div>
    `;

    descriptionContainer.innerHTML = `
<p>
  <ul>
    <li><strong>c (Real Part):</strong> Allows you to set the real part of the constant \( c \).</li>
    <li><strong>c (Imaginary Part):</strong> Allows you to set the imaginary part of the constant \( c \).</li>
    <li><strong>Max Iterations:</strong> Allows you to set the maximum number of iterations for the visualization.</li>
    <li><strong>Max Rectangle Size (px):</strong> Allows you to set the largest rectangles size to be processed.</li>
    <li><strong>Min Rectangle Size (px):</strong> Allows you to set the smallest rectangles size to be processed.</li>
    <li><strong>Low Color:</strong> Determines the color of the points that quickly diverge to infinity.</li>
    <li><strong>High Color:</strong> Adjusts the color of the points where the divergence is slow.</li>
    <li><strong>Generate Button:</strong> Triggers the generation of the resulting Mandelbrot set.</li>
    <li><strong>Rendering Time:</strong> Displays the time taken to render the visualization.</li>

    </ul>
</p>

        `;
  } else if(scriptName === "def"){
    optionsContainer.innerHTML = `
`;
descriptionContainer.innerHTML = `
<p>
    Select one of the rendering algorithms for the Julia set from the dropdown menu below to explore each algorithm in detail.
</p>
    `;
  }
});
