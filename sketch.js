let Q = 2e-6;
let q = 20e-6;
let m = 0.1;

let g = 10;
let k = 9e9;

let d = 0.3;   // ✅ αρχική απόσταση

let rMin, rEqVal, rMaxVal;

let continuousMode = false;

let yQ, y, v = 0;
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

  let yGround = height - 40;
  yQ = yGround - 10;

  // --- ΦΥΣΙΚΗ ---
  let rEq = sqrt((k * Q * q) / (m * g));
  rEqVal = rEq;

  let A = m * g;
  let B = k * Q * q;

  let E0 = A * d + B / d;
  let D = E0 * E0 - 4 * A * B;

  let r1 = (E0 + sqrt(D)) / (2 * A);
  let r2 = (E0 - sqrt(D)) / (2 * A);

  // ✅ αποφασίζουμε ποιο είναι min / max
  if (d > rEq) {
    rMaxVal = d;
    rMin = min(r1, r2);
  } else {
    rMin = d;
    rMaxVal = max(r1, r2);
  }

  // ✅ ΚΛΙΜΑΚΑ
  adjustScale();

  // ✅ mapping
  y = yQ - d * scale;
  yEq = yQ - rEq * scale;

  v = 0;
  prevV = 0;
  running = false;

  // vmax
  let Ueq = m * g * rEq + k * Q * q / rEq;
  vMaxTheory = sqrt((2 / m) * (E0 - Ueq));

  enforceLimits();
}

// ===== ΟΡΙΑ =====
function enforceLimits() {

  // αποφυγή σύγκρουσης
  if (rMin < 0.05) {
    rMin = 0.05;
  }

  // αποφυγή εξόδου από οθόνη
  let maxScreen = height / scale;

  if (rMaxVal > maxScreen) {
    rMaxVal = maxScreen;
  }
}

// ===== DRAW =====
function draw() {
  background(230);

  drawGround();

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
}

// ===== OBJECTS =====
function drawCharges() {

  fill('red');
  noStroke();
  ellipse(width / 2, yQ, 20);

  fill('blue');
  ellipse(width / 2, y, 20);
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

  fill(continuousMode ? 'green' : 'blue');
  text(continuousMode ? "Mode: Continuous" : "Mode: Step", 20, 30);

  fill(0);

  text("d = " + nf(d, 1, 2) + " m", 20, height - 100);
  text("r_min = " + nf(rMin, 1, 2) + " m", 20, height - 80);
  text("r_eq  = " + nf(rEqVal, 1, 2) + " m", 20, height - 60);
  text("r_max = " + nf(rMaxVal, 1, 2) + " m", 20, height - 40);

  text("v_max = " + nf(vMaxTheory, 1, 2) + " m/s", 20, height - 20);
}

// ===== BUTTONS =====
function startSim() {
  continuousMode = true;
  running = true;
}

function resumeSim() {
  continuousMode = false;
  running = true;
}

function resetSim() {

  document.getElementById("Qslider").value = 2;
  document.getElementById("qslider").value = 20;
  document.getElementById("mslider").value = 0.1;

  Q = 2e-6;
  q = 20e-6;
  m = 0.1;
  d = 0.3;

  initSystem();
}

// ===== SLIDERS =====
function updateFromSliders() {

  Q = document.getElementById("Qslider").value * 1e-6;
  q = document.getElementById("qslider").value * 1e-6;
  m = parseFloat(document.getElementById("mslider").value);

  initSystem();
}

// ===== SCALE =====
function adjustScale() {

  let range = rMaxVal;

  if (range < 0.1) range = 0.1;

  scale = (0.6 * height) / range;
}

// ===== GROUND =====
function drawGround() {

  let yGround = height - 40;

  stroke(100);
  strokeWeight(4);
  line(0, yGround, width, yGround);

  noStroke();
  fill(0);
  text("Έδαφος", 10, yGround - 5);
}
