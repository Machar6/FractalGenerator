const canvas = document.getElementsByClassName('mandelbrot')[0];
const ctx = canvas.getContext('2d');
var  r_c = 50;
let er = 15;
let maxIterations = 200;
let maxIter = 20;
let max = 3;
posunXcomplex = 0;
var alpha = 1;
var beta = 0.3;
var lambdax = 1 / Math.exp(1) + 0.1; 
var lambday = 0;
const reMax = 2;
const imMax = 2;
const reMin = -2;
const imMin = -2;
let exp = 2;
let cRe = -0.7; 
let cIm = 0.27015; 
var cmaxX = 8;
let lowColor = '#ffffff';
let highColor = '#ff0000';



document.getElementById('scriptSelector').addEventListener('change', function () {
    cRe = parseFloat(document.getElementById('cReal')?.value);
    cRe = isNaN(cRe) ? -0.7 : cRe;
    cIm = parseFloat(document.getElementById('cImag')?.value);
    cIm = isNaN(cIm) ? 0.27015 : cIm;
    maxIterations = parseInt(document.getElementById('iterationsSlider')?.value) || 200;
    maxIter = parseInt(document.getElementById('iterationsSlider1')?.value) || 20;
    exp = parseFloat(document.getElementById('exponent')?.value);
    exp = isNaN(exp) ? 2 : exp;
    lowColor = document.getElementById('lowColorPicker')?.value || "#ffffff";
    highColor = document.getElementById('highColorPicker')?.value || "#ff0000";


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

  if (scriptName === "juliaGeneralized.js" || scriptName === "generalized_julia.js") {
    optionsContainer.innerHTML = `
                            <div class = "options">
                <div class="row mx-auto" style="max-width:70%">
                      <div class="col-md-4">
                        <div class="mb-3">
                          <label for="cReal" class="form-label">c (real part):</label>
                          <input id="cReal" type="text" class="form-control form-control-sm" placeholder = "c (real part)" value = "` + cRe + `" style="min-width: 150px; max-width: 250px;">
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="mb-3">
                          <label for="cImag" class="form-label">c (imaginary part):</label>
                          <input id="cImag" type="text" class="form-control form-control-sm" placeholder = "c (imaginary part)" value = "` + cIm + `" style="min-width: 150px; max-width: 250px;">
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="mb-3">
                          <label for="exponent" class="form-label">Exponent:</label>
                          <input id="exponent" type="number" step = "0.1" min = "0" class="form-control form-control-sm" placeholder = "Exponent" value = "` + exp + `" style="min-width: 150px; max-width: 250px;">
                        </div>
                      </div>
                    </div>
                       <div class ="col-12 col-md-8">
                       <label for="lowColorPicker" class="me-2">Low Color:
                       <input type="color" id="lowColorPicker" value="` + lowColor + `" class="form-control form-control-color me-3 d-inline-block">
                       </label>
                       <label for="highColorPicker" class="me-2">High Color:
                       <input type="color" id="highColorPicker" value="` + highColor + `" class="form-control form-control-color d-inline-block">
                       </label>
                     </div>
                 <label for="iterationsSlider" class="form-label mb-0" style="margin-right: 10px;">Max Iterations: </label>
                 <input type="range" class="form-range" id="iterationsSlider"  min="1" max="500" value="` + maxIterations + `" style = "width:70%">
                 <span id="iterationsValue" class="badge bg-primary" style="margin-left: 10px; margin-right: 10px;">` + maxIterations + `</span>
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
       <li><strong>Exponent:</strong> Set the exponent of the generalized Julia set function. </li>
    <li><strong>Low Color:</strong> Determines the color of the points that quickly diverge to infinity.</li>
    <li><strong>High Color:</strong> Adjusts the color of the points where the divergence is slow.</li>
    <li>
    <strong>Max Iterations:</strong> Allows you to set the maximum number of iterations for the visualization.<br>
    <em>Recommendation:    
    <ul>
          <li>Negative exponents: 30 iterations.</li>
           <li>Positive exponents greater than 2: 100 iterations.</li></em>

    </ul>  
    </em>
      </li>
    <li><strong>Generate Button:</strong> Triggers the generation of the resulting Julia set.</li>
  
  <li>
      <strong>Rendering Time:</strong> Displays the time taken to render the visualization.
      </li>
  </ul>
    </p>
        `;
  } else if(scriptName === "juliaSinus.js" || scriptName === "juliaCosinus.js") {
    optionsContainer.innerHTML = `
                      <div class = "options">
                <div class="row mx-auto" style="max-width:70%">
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label for="cReal" class="form-label">c (real part):</label>
                          <input id="cReal" type="text" class="form-control form-control-sm" placeholder = "c (real part)" value = "` + cRe + `" style="min-width: 150px; max-width: 250px;">
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label for="cImag" class="form-label">c (imaginary part):</label>
                          <input id="cImag" type="text" class="form-control form-control-sm" placeholder = "c (imaginary part)" value = "` + cIm + `" style="min-width: 150px; max-width: 250px;">
                        </div>
                      </div>
                    </div>
                    <label for="iterationsSlider1" class="form-label mb-0" style="margin-right: 10px;">Max Iterations: </label>
                    <input type="range" class="form-range" id="iterationsSlider1"  min="1" max="100" value="` + maxIter + `" style = "width:70%">
                    <span id="iterationsValue1" class="badge bg-primary" style="margin-left: 10px; margin-right: 10px;">` + maxIter + `</span>
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
    <li><strong>Low Color:</strong> Determines the color of the points that quickly diverge to infinity.</li>
    <li><strong>High Color:</strong> Adjusts the color of the points where the divergence is slow.</li>
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
  }else if(scriptName === "juliaExponencial.js") {
    optionsContainer.innerHTML = `
                <div class = "options">
                <div class="row mx-auto">
                      <div class="col-md-3">
                        <div class="mb-3">
                          <label for="lambdax" class="form-label">Lambda (real part):</label>
                          <input id="lambdax" type="text" class="form-control form-control-sm" placeholder = "lambda (real part)" value = "` + lambdax + `" style="min-width: 150px; max-width: 250px;">
                        </div>
                      </div>
                      <div class="col-md-3">
                        <div class="mb-3">
                          <label for="lambday" class="form-label">Lambda (imaginary part):</label>
                          <input id="lambday" type="text" class="form-control form-control-sm" placeholder = "lambda (imag part)" value = "` + lambday + `" style="min-width: 150px; max-width: 250px;">
                        </div>
                      </div>
                    
                    <div class="col-md-3">
                        <div class="mb-3">
                          <label for="alpha" class="form-label">Alpha:</label>
                          <input id="alpha" type="text" class="form-control form-control-sm" placeholder = "alpha" value = "` + alpha + `" style="min-width: 150px; max-width: 250px;">
                        </div>
                      </div>
                      <div class="col-md-3">
                        <div class="mb-3">
                          <label for="beta" class="form-label">Beta:</label>
                          <input id="beta" type="text" class="form-control form-control-sm" placeholder = "beta" value = "` + beta + `" style="min-width: 150px; max-width: 250px;">
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
    <li><strong>Lambda (real part):</strong>: Controls the real part of the parameter \( \lambda \).</li>
    <li><strong>Lambda (imaginary part):</strong>: Controls the imaginary part of the parameter \( \lambda \).</li>
    <li><strong>Alpha</strong>: values from 0 to 1 that determines how much the initial value influences the resulting transformation</li>
    <li><strong>Beta</strong>: values from 0 to 1 that determines the influence of the exponential part on the point transformation.</li>
    <li><strong>Low Color:</strong> Determines the color of the points that quickly diverge to infinity.</li>
    <li><strong>High Color:</strong> Adjusts the color of the points where the divergence is slow.</li>
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
  }else if(scriptName === "def"){
    optionsContainer.innerHTML = ` `;

    descriptionContainer.innerHTML = `
   <p>
                     Choose an iteration function for the generalized Julia set from the dropdown menu below to explore each generalization in detail.
  
   </p>
     `;
  }

});
