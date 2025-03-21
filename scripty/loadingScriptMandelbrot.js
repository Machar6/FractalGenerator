const canvas = document.getElementsByClassName('mandelbrot')[0];
const ctx = canvas.getContext('2d');
const r = 1.7;
let r1 = 3;
let er = 100;
let ER = 2000; 
let ER2 = ER * ER; 
let er2 = er * er; 
let nMax = 500;
let realOffset = -1.3;
let realOffset1 = -0.8;
const escapeRadius = 4;
const xMin = -2.4, xMax = 0.8;
const yMin = -1.6, yMax = 1.6;
const palette = [];
const paletteSize = 256;
let histogram = new Array(nMax + 1).fill(0);
let maxIterations = 300;
let numWorkers = 2;
const chunkHeight = Math.floor(canvas.height / numWorkers);


const width = canvas.width;
const height = canvas.height;



document.getElementById('scriptSelector').addEventListener('change', function () {
    er2 = parseInt(document.getElementById('radiusSlider')?.value) || 100;
    ER = parseInt(document.getElementById('radiusSlider1')?.value) || 2000;
    ER2 = ER * ER;
    nMax = parseInt(document.getElementById('iterationsSlider')?.value) || 500;
    maxIterations = parseInt(document.getElementById('iterationsSlider1')?.value) || 300;
    numWorkers = parseInt(document.getElementById('numWorkers')?.value) || 2;
    histogram = new Array(nMax + 1).fill(0);

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

  if (scriptName === "mandelbrotColorDecomposition.js" || scriptName === "mandelbrotBinaryDecomposition.js") {
    optionsContainer.innerHTML = `
                <div class = "options">                    
                 <label for="radiusSlider" class="form-label mb-0" style="margin-right: 10px;">Escape Radius: </label>
                 <input type="range" class="form-range" id="radiusSlider"  min="2" max="3000" value="` + er2 + `" style = "width:70%">
                 <span id="radiusValue" class="badge bg-primary" style="margin-left: 10px; margin-right: 10px;">` + er2 + `</span>
                  <div class = "col-lg-4 col-md-4 col-sm-12 mx-auto">
                  <button type="submit" class="btn btn-block btn-outline-dark" onclick="apply()"><strong>Generate</strong></button>
                  </div>
                          <div id="renderTime" class="">Rendering time: 0 ms</div>

                 </div>
    `;
    descriptionContainer.innerHTML = `
    <p>
     <ul>
    <li><strong>Escape Radius:</strong> Controls the distance from the origin beyond which points are considered to have "escaped" to infinity.</li>
    <li><strong>Generate Button:</strong> Triggers the generation of the resulting Julia set.</li>
  
  <li>
      <strong>Rendering Time:</strong> Displays the time taken to render the visualization.
      </li>
  </ul>
    </p>
        `;
  } else if (scriptName === "mandelbrotDwellGradient.js" || scriptName === "mandelbrotHistogramColoring.js") {
    optionsContainer.innerHTML = `
<div class = "options">
  <label for="iterationsSlider" class="form-label mb-0" style="margin-right: 10px;">Max Iterations: </label>
  <input type="range" class="form-range" id="iterationsSlider"  min="1" max="1000" value="` + nMax + `" style = "width:70%">
  <span id="iterationsValue" class="badge bg-primary" style="margin-left: 10px; margin-right: 10px;">` + nMax + `</span>
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
    <li><strong>Generate Button:</strong> Triggers the generation of the resulting Julia set.</li>
  
  <li>
      <strong>Rendering Time:</strong> Displays the time taken to render the visualization.
      </li>
  </ul>
    </p>
        `;
  } else if(scriptName === "mandelbrotEscapeTime.js") {
    optionsContainer.innerHTML = `
                      <div class = "options">
                      <div>
                          <label for="iterationsSlider" class="form-label mb-0" style="margin-right: 10px;">Max Iterations: </label>
  <input type="range" class="form-range" id="iterationsSlider"  min="1" max="1000" value="` + nMax + `" style = "width:70%">
  <span id="iterationsValue" class="badge bg-primary" style="margin-left: 10px; margin-right: 10px;">` + nMax + `</span>

                      </div>
                      <div>
                          <label for="radius" class="form-label mb-0" style="margin-right: 10px;">Radius: </label>
  <input type="range" class="form-range" id="radius"  min="2" max="10" value="` + r1 + `" style = "width:70%">
  <span id="radiusValue" class="badge bg-primary" style="margin-left: 10px; margin-right: 10px;">` + r1 + `</span>

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
    <li><strong>Generate Button:</strong> Triggers the generation of the resulting Julia set.</li>
  
  <li>
      <strong>Rendering Time:</strong> Displays the time taken to render the visualization.
      </li>
  </ul>
    </p>
        `;
  }else if(scriptName === "mandelbrotFieldLines.js") {
    optionsContainer.innerHTML = `
                      <div class = "options">
                      <div>  
                      <label for="iterationsSlider" class="form-label mb-0" style="margin-right: 10px;">Max Iterations: </label>
  <input type="range" class="form-range" id="iterationsSlider"  min="1" max="1000" value="` + nMax + `" style = "width:70%">
  <span id="iterationsValue" class="badge bg-primary" style="margin-left: 10px; margin-right: 10px;">` + nMax + `</span>

                        
                      </div>
  <div>
     <label for="radiusSlider1" class="form-label mb-0" style="margin-right: 10px;">Radius: </label>
  <input type="range" class="form-range" id="radiusSlider1"  min="2" max="3000" value="` + ER + `" style = "width:70%">
  <span id="radiusValue1" class="badge bg-primary" style="margin-left: 10px; margin-right: 10px;">` + ER + `</span>
 
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
<li>
<strong>Max Iterations:</strong> Allows you to set the maximum number of iterations for the visualization.
  </li>
      <li><strong>Radius:</strong> Controls the distance from the origin beyond which points are considered to have "escaped" to infinity.</li>

<li><strong>Generate Button:</strong> Triggers the generation of the resulting Julia set.</li>

<li>
  <strong>Rendering Time:</strong> Displays the time taken to render the visualization.
  </li>
</ul>
</p>
    `;
  }else if(scriptName === "mandelbrotSmoothColoring.js") {
    optionsContainer.innerHTML = `
<div class="options">
  <label for="iterationsSlider1" class="form-label mb-0" style="margin-right: 10px;">Max Iterations: </label>
  <input type="range" class="form-range" id="iterationsSlider1" min="1" max="1000" value="` + maxIterations + `" style="width:70%">
  <span id="iterationsValue1" class="badge bg-primary" style="margin-left: 10px; margin-right: 10px;">` + maxIterations + `</span>
  <div class="col-12 row">
    <button type="submit" class="btn btn-block btn-outline-dark col-12 col-md-4" onclick="apply()" style="max-width: 30%;"><strong>Generate</strong></button>
    <div class="col-12 col-md-5" style="display: flex; align-items: center;">
      <select id="paletteSwitch" class="form-control" style="max-width: 35%; margin-top: 10px;">
        <option value="default">Default</option>
        <option value="sinus">Sinus</option>
      </select>
      <span class="info-icon" style="margin-left: 10px; cursor: pointer;" title="Choose a color palette for the vizualization."><img src="dist/img/question.png" alt="" style = "max-width: 15px; margin-left: 5px;">
</span>
    </div>
    <div class="custom-control custom-checkbox col-12 col-md-3" style="text-align: end; align-content: center;">
      <input class="custom-control-input" type="checkbox" id="smoothSwitch" checked>
      <label for="smoothSwitch" class="custom-control-label">Smooth Coloring</label>
    </div>
  </div>
  <div id="renderTime" class="">Rendering time: 0 ms</div>
</div>


     `;
     descriptionContainer.innerHTML = `
     <p>
      <ul>
      <li>
     <strong>Max Iterations:</strong> Allows you to set the maximum number of iterations for the visualization.<br>
<em>Recommendation:
    <ul>
          <li>For a more significant difference in smoothing: 170 iterations.</li>
    </ul>  
    </em>
       </li>
     <li><strong>Generate Button:</strong> Triggers the generation of the resulting Julia set.</li>
 
 <strong>Smooth Coloring Button:</strong> Toggles between classical and smooth coloring modes.
 
   <li>
       <strong>Rendering Time:</strong> Displays the time taken to render the visualization.
       </li>
   </ul>
     </p>
         `;
  }else if(scriptName === "mandelbrotSymmAndMultithreading.js") {
    optionsContainer.innerHTML = `
                    <div class = "options">
                    <label for="iterationsSlider1" class="form-label mb-0" style="margin-right: 10px;">Max Iterations: </label>
                    <input type="range" class="form-range" id="iterationsSlider1"  min="1" max="1000" value="` + maxIterations + `" style = "width:70%">
                    <span id="iterationsValue1" class="badge bg-primary" style="margin-left: 10px; margin-right: 10px;">` + maxIterations + `</span>
                    <label for="numWorkers" class="form-label mb-0" style="margin-right: 10px;">Number of Workers: </label>
                    <input type="range" class="form-range" id="numWorkers"  min="2" max="20" value="` + numWorkers + `" style = "width:70%">
                    <span id="numWorkersValue" class="badge bg-primary" style="margin-left: 10px; margin-right: 10px;">` + numWorkers + `</span>
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
     <li><strong>Number of Workers</strong>: Controls the number of parallel processes (workers) used to divide the rendering task.</li>

 <li><strong>Generate Button:</strong> Triggers the generation of the resulting Julia set.</li>

<li>
   <strong>Rendering Time:</strong> Displays the time taken to render the visualization.
   </li>
</ul>
 </p>
     `;
  }else if(scriptName === "def") {
    optionsContainer.innerHTML = `
                       `;
    descriptionContainer.innerHTML = `

                  <p>
                    Select one of the coloring methods for the Mandelbrot set from the dropdown menu below to explore each method in detail.
                  </p>

        `;
  } 
});
