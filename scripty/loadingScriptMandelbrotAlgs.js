const canvas = document.getElementsByClassName('mandelbrot')[0];
const ctx = canvas.getContext('2d');
const reMin = -2.0;
const reMax = 1.0;
const imMin = -1.5;
const imMax = 1.5;
let maxIterations = 200;
let iterations = 50;
let maxIter = 100;  
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

    maxIterations = parseInt(document.getElementById('iterationsSlider')?.value) || 200;
    maxIter = parseInt(document.getElementById('iterationsSlider1')?.value) || 100;
    iterations = parseInt(document.getElementById('iterationsSlider2')?.value) || 50;
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

if (scriptName === "mandelbrotDistanceEstimation.js" || scriptName === "etaOptim.js") {
    optionsContainer.innerHTML = `
<div class = "options">
  <label for="iterationsSlider" class="form-label mb-0" style="margin-right: 10px;">Max Iterations: </label>
  <input type="range" class="form-range" id="iterationsSlider"  min="1" max="1000" value="` + maxIterations + `" style = "width:70%">
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
         <strong>Max Iterations:</strong> Allows you to set the maximum number of iterations for the visualization.
      </li>

    <li><strong>Low Color:</strong> Determines the color of the points that quickly diverge to infinity.</li>
    <li><strong>High Color:</strong> Adjusts the color of the points where the divergence is slow.</li>
    <li>
    <li><strong>Generate Button:</strong> Triggers the generation of the resulting Mandelbrot set.</li>
  
  <li>
      <strong>Rendering Time:</strong> Displays the time taken to render the visualization.
      </li>
  </ul>
    </p>
        `;
  } else if(scriptName === "mandelbrotEdgeDetection.js") {
    optionsContainer.innerHTML = `
                      <div class = "options">
  <label for="iterationsSlider1" class="form-label mb-0" style="margin-right: 10px;">Max Iterations: </label>
  <input type="range" class="form-range" id="iterationsSlider1"  min="1" max="300" value="` + maxIter + `" style = "width:70%">
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
  }else if(scriptName === "mandelbrotRectCheckingAdvanced.js") {
    optionsContainer.innerHTML = `
                    <div class = "options">
                    <label for="iterationsSlider1" class="form-label mb-0" style="margin-right: 10px;">Max Iterations: </label>
                    <input type="range" class="form-range" id="iterationsSlider1"  min="1" max="300" value="` + maxIter + `" style = "width:70%">
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
  }
  else if(scriptName === "def"){
    optionsContainer.innerHTML = `
`;
descriptionContainer.innerHTML = `
<p>
Select one of the rendering algorithms for the Mandelbrot set from the dropdown menu below to explore each algorithm in detail.
</p>
`;
  }
});
