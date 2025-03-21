const canvas = document.getElementsByClassName('mandelbrot')[0];
const ctx = canvas.getContext('2d');
var reMin = -2;
var reMax = 2;
var imMin = -2;
var imMax = 2;
let exp = 2;
var max = 4;
let maxIter = 100;
var lightSourceX = 0.5;
var lightSourceY = 0.5;
var lightIntensity = 0.7;
var shiftX = -0.8;
let lowColor = '#ffffff';
let highColor = '#ff0000';



document.getElementById('scriptSelector').addEventListener('change', function () {
  exp = parseFloat(document.getElementById('exponent')?.value) || 2;
  maxIter = parseFloat(document.getElementById('iterationsSlider')?.value) || 100;
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

  if (scriptName === "mandelbrotGeneralized.js") {
    optionsContainer.innerHTML = `
            <div class = "options">
                      <div class="row col-12 mx-auto">
                        <div class="mb-3 col-12 col-md-6">
                          <label for="exponent" class="form-label">Exponent:</label>
                          <input id="exponent" type="number" step = "0.1" min = "0" class="form-control form-control-sm" placeholder = "Exponent" value = "` + exp + `" style="min-width: 150px; max-width: 250px;">
                        </div>
                        <div class ="col-12 col-md-6" style = "text-align:end">
                       <label for="lowColorPicker" class="me-2">Low Color:
                       <input type="color" id="lowColorPicker" value="` + lowColor + `" class="form-control form-control-color me-3 d-inline-block">
                       </label>
                       <label for="highColorPicker" class="me-2">High Color:
                       <input type="color" id="highColorPicker" value="` + highColor + `" class="form-control form-control-color d-inline-block">
                       </label>
                     </div>
                      </div>
                    </div>
                 <label for="iterationsSlider" class="form-label mb-0" style="margin-right: 10px;">Max Iterations: </label>
                 <input type="range" class="form-range" id="iterationsSlider"  min="1" max="500" value="` + maxIter + `" style = "width:70%">
                 <span id="iterationsValue" class="badge bg-primary" style="margin-left: 10px; margin-right: 10px;">` + maxIter + `</span>
                    
                 <div class = "col-lg-4 col-md-4 col-sm-12 mx-auto">
                  <button type="submit" class="btn btn-block btn-outline-dark" onclick="apply()"><strong>Generate</strong></button>
                  </div>
                    <div id="renderTime" class="">Rendering time: 0 ms</div>
                 </div>
    `;

    descriptionContainer.innerHTML = `
    <p>
     <ul>
       <li><strong>Exponent:</strong> Set the exponent of the generalized Mandelbrot set function. </li>
    <li><strong>Low Color:</strong> Determines the color of the points that quickly diverge to infinity.</li>
    <li><strong>High Color:</strong> Adjusts the color of the points where the divergence is slow.</li>
    <li>
    <strong>Max Iterations:</strong> Allows you to set the maximum number of iterations for the visualization.<br>
        <em>Recommendation:    
    <ul>
          <li>Negative exponents: 20 iterations.</li>
           <li>Positive exponents greater than 2: 100 iterations.</li></em>

    </ul>  
    </em>
      </li>
    <li><strong>Generate Button:</strong> Triggers the generation of the resulting Mandelbrot set.</li>
  
  <li>
      <strong>Rendering Time:</strong> Displays the time taken to render the visualization.
      </li>
  </ul>
    </p>
        `;
    
  } else if (scriptName === "def"){
    optionsContainer.innerHTML = ` `;

    descriptionContainer.innerHTML = `
   <p>
                     Choose an iteration function for the generalized Mandelbrot set from the dropdown menu below to explore each generalization in detail.
  
   </p>

     `;
  }
});
