let Q = 2e-6;
let q = 20e-6;
let m = 0.1;
let g = 10;
let k = 9e9;
let rMin, rEqVal, rMaxVal;
let continuousMode = false;
let yQ, y, v = 0, a = 0;
let prevV = 0;
let running = false;

let scale = 250;

let yEq;
let vMaxTheory;



// ===== SETUP =====
function setup() {
  let canvas = createCanvas(windowWidth, windowHeight - 80);
  canvas.parent("canvasContainer");
document.getElementById("Qslider").oninput = updateFromSliders;
document.getElementById("qslider").oninput = updateFromSliders;
document.getElementById("mslider").oninput = updateFromSliders;
  initSystem();
}

// ===== INIT =====
function initSystem() {

  yQ = height - 120;

  let r0 = 0.3;   // ✅ ΠΡΩΤΑ

  y = yQ - r0 * scale;

  v = 0;
  prevV = 0;
  running = false;

  // r_eq
  let rEq = sqrt((k * Q * q) / (m * g));
  yEq = yQ - rEq * scale;

  // vmax
  let U0 = m * g * r0 + k * Q * q / r0;
  let Ueq = m * g * rEq + k * Q * q / rEq;
  vMaxTheory = sqrt((2 / m) * (U0 - Ueq));

  // r_max από ενέργεια
  let A = m * g;
  let B = k * Q * q;

  let E0 = A * r0 + B / r0;

  let D = E0 * E0 - 4 * A * B;

  let r1 = (E0 + sqrt(D)) / (2 * A);
  let r2 = (E0 - sqrt(D)) / (2 * A);

  let rMax = max(r1, r2);

  // ✅ ΤΩΡΑ τα αποθηκεύεις (όχι πριν!)
  rMin = r0;
  rEqVal = rEq;
  rMaxVal = rMax;
}

// ===== RESIZE =====
function windowResized() {
  resizeCanvas(windowWidth, windowHeight - 80);
  initSystem();
}

// ===== DRAW =====
function draw() {
   background(230);

  drawEquilibriumLine();

  if (running) updatePhysics();

  drawCharges();

  drawInfo();
}

// ===== PHYSICS =====
function updatePhysics() {
  let r = (yQ - y) / scale;

  let Fc = k * Q * q / (r * r);
  let F = Fc - m * g;

  let dt = 0.01;

  prevV = v;
  v += (F / m) * dt;
  y -= v * dt * scale;

 if (!continuousMode && prevV * v < 0) {
  running = false;
}
  y = constrain(y, 50, height - 20);
}



// ===== DRAW OBJECTS =====
function drawCharges() {
  fill('red');
  noStroke();
  ellipse(width / 2, yQ, 20);

  fill('blue');
  ellipse(width / 2, y, 20);

  if (document.getElementById("forcesCheckbox").checked) {
    drawForces();
  }
}

// ===== FORCES =====
function drawForces() {
  let r = (yQ - y) / scale;

  let Fc = k * Q * q / (r * r);
  let Fg = m * g;

  let scaleF = 25;

  strokeWeight(4);

  // Coulomb
  stroke('green');
  line(width / 2, y,
       width / 2, y - Fc * scaleF);
  arrow(width / 2, y - Fc * scaleF, -1, 'green');

  // Weight
  stroke('orange');
  line(width / 2, y,
       width / 2, y + Fg * scaleF);
  arrow(width / 2, y + Fg * scaleF, 1, 'orange');
}

function arrow(x, y, dir, col) {
  fill(col);
  noStroke();
  triangle(x - 6, y, x + 6, y, x, y + dir * 10);
}

// ===== EQUILIBRIUM =====
function drawEquilibriumLine() {
  stroke(0);
  drawingContext.setLineDash([6, 6]);
  line(0, yEq, width, yEq);
  drawingContext.setLineDash([]);

  noStroke();
  fill(0);
  text("Θέση ισορροπίας", 10, yEq - 5);
}

// ===== INFO =====

function drawInfo() {
  noStroke();
  textSize(16);

  // Mode
  fill(continuousMode ? 'green' : 'blue');
  text(continuousMode ? "Mode: Continuous" : "Mode: Step", 20, 30);

  // Legend ✅
  fill(0);
  text("Forces:", 20, 60);

  fill('green');
  text("Fc (Coulomb)", 40, 80);

  fill('orange');
  text("w (Weight)", 40, 100);

  fill(0);
  text("Charges:", 20, 130);

  fill('red');
  text("Q (fixed)", 40, 150);

  fill('blue');
  text("q (moving)", 40, 170);

  // Μετρήσεις κάτω
  fill(0);
  text("r_min = " + nf(rMin, 1, 2) + " m", 20, height - 80);
  text("r_eq  = " + nf(rEqVal, 1, 2) + " m", 20, height - 60);
  text("r_max = " + nf(rMaxVal, 1, 2) + " m", 20, height - 40);

  text("v_max = " + nf(vMaxTheory, 1, 2) + " m/s", 20, height - 20);
}
// ===== BUTTONS =====
function startSim() {
  continuousMode = true;   // ✅ συνεχής λειτουργία
  running = true;
}

function resumeSim() {
  continuousMode = false;  // ✅ βήμα-βήμα
  running = true;
}
function resetSim() { initSystem(); }
function updateFromSliders() {
  // τιμές sliders (Q και q σε μC → C)
  Q = document.getElementById("Qslider").value * 1e-6;
  q = document.getElementById("qslider").value * 1e-6;
  m = parseFloat(document.getElementById("mslider").value);

  // εμφάνιση τιμών
  document.getElementById("Qval").innerText =
    document.getElementById("Qslider").value;

  document.getElementById("qval").innerText =
    document.getElementById("qslider").value;

  document.getElementById("mval").innerText =
    document.getElementById("mslider").value;

  adjustScale();   // ✅ κρίσιμο
  initSystem();    // επανεκκίνηση
}
function adjustScale() {

  let r0 = 0.3; // αρχική απόσταση

  let rEq = sqrt((k * Q * q) / (m * g));

  // μέγιστη απόσταση που μπορεί να φτάσει (~ συμμετρική εκτίμηση)
 
let rMax = max(r0, 2.5 * rEq);
  // αφήνουμε περιθώριο (60% canvas)
  
  scale = (0.8 * height) / (1 + rEq);
}
