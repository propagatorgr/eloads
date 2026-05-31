let Q = 2e-6;
let q = 20e-6;
let m = 0.1;

let R_visual = 20;
let R_phys;

let g = 10;
let k = 9e9;

let d = 0.3;

let rMin, rEqVal, rMaxVal;

let continuousMode = false;

let yQ, y, v = 0;
let prevV = 0;
let running = false;

let scale = 250;
let yEq;
let vMaxTheory;

// ===== margin =====
function getMargin() {
  return max(180, width * 0.2);
}

// ===== SETUP =====
function setup() {
  let canvas = createCanvas(windowWidth, windowHeight - 80);
  canvas.parent("canvasContainer");

  document.getElementById("Qslider").addEventListener("input", updateLabels);
  document.getElementById("qslider").addEventListener("input", updateLabels);
  document.getElementById("mslider").addEventListener("input", updateLabels);

  document.getElementById("Qslider").addEventListener("change", applySliders);
  document.getElementById("qslider").addEventListener("change", applySliders);
  document.getElementById("mslider").addEventListener("change", applySliders);

  initSystem();
}

// ===== SLIDERS =====
function updateLabels() {
  Q = document.getElementById("Qslider").value * 1e-6;
  q = document.getElementById("qslider").value * 1e-6;
  m = parseFloat(document.getElementById("mslider").value);

  document.getElementById("Qval").innerText =
    document.getElementById("Qslider").value;

  document.getElementById("qval").innerText =
    document.getElementById("qslider").value;

  document.getElementById("mval").innerText =
    document.getElementById("mslider").value;

  computeExtremesOnly();
}

function applySliders() {
  Q = document.getElementById("Qslider").value * 1e-6;
  q = document.getElementById("qslider").value * 1e-6;
  m = parseFloat(document.getElementById("mslider").value);

  initSystem();
}

// ===== INIT =====
function initSystem() {

  let yGround = height - 40;
  yQ = yGround - 10;

  let rEq = sqrt((k * Q * q) / (m * g));
  rEqVal = rEq;

  let A = m * g;
  let B = k * Q * q;

  let E0 = A * d + B / d;
  let D = E0 * E0 - 4 * A * B;

  let r1 = (E0 + sqrt(D)) / (2 * A);
  let r2 = (E0 - sqrt(D)) / (2 * A);

  if (d > rEq) {
    rMaxVal = d;
    rMin = min(r1, r2);
  } else {
    rMin = d;
    rMaxVal = max(r1, r2);
  }

  adjustScale();

  R_phys = R_visual / scale;

  y = yQ - d * scale;
  yEq = yQ - rEq * scale;

  v = 0;
  running = false;

  let Ueq = m * g * rEq + k * Q * q / rEq;
  vMaxTheory = sqrt((2 / m) * (E0 - Ueq));

  enforceLimits();
}

// ===== LIMITS =====
function enforceLimits() {

  let maxR = 0.7 * height / scale;

  if (rMaxVal > maxR) {
    rMaxVal = maxR;
  }

  // κρατάει το y μέσα
  y = constrain(y, yQ - rMaxVal * scale, yQ - max(rMin, R_phys) * scale);
}

// ===== DRAW =====
function draw() {
  background(230);

  if (running) updatePhysics();

  drawGround();
  drawEquilibriumLine();
  drawExtremes();
  drawCharges();
  drawInfo();
}

// ===== PHYSICS =====
function updatePhysics() {

  if (rMin < R_phys) {
    running = false;
    return;
  }

  if (rMaxVal > 5) {
    running = false;
    return;
  }

  let r = (yQ - y) / scale;

  let Fc = k * Q * q / (r * r);
  let F = Fc - m * g;

  let dt = 0.01;

  v += (F / m) * dt;
  y -= v * dt * scale;

  r = (yQ - y) / scale;

  let rSafeMin = max(rMin, R_phys);

  if (r < rSafeMin) {
    r = rSafeMin;
    v *= -1;
    y = yQ - r * scale;
  }

  if (r > rMaxVal) {
    r = rMaxVal;
    v *= -1;
    y = yQ - r * scale;
  }

  if (!continuousMode) {
    if (r <= rSafeMin || r >= rMaxVal) {
      running = false;
    }
  }
}

// ===== OBJECTS =====
function drawCharges() {

  fill('red');
  noStroke();
  ellipse(width / 2, yQ, R_visual);

  fill('blue');
  ellipse(width / 2, y, R_visual);
}

// ===== EQUILIBRIUM =====
function drawEquilibriumLine() {
  let marginLeft = getMargin();

  stroke(0);
  drawingContext.setLineDash([6, 6]);
  line(marginLeft, yEq, width, yEq);
  drawingContext.setLineDash([]);

  fill(0);
  noStroke();
  text("Θέση ισορροπίας", marginLeft + 5, yEq - 5);
}

// ===== EXTREMES =====
function drawExtremes() {

  let marginLeft = getMargin();

  let yMin = yQ - rMin * scale;
  let yMax = yQ - rMaxVal * scale;

  drawingContext.setLineDash([3, 6]);

  stroke('blue');
  line(marginLeft, yMin, width, yMin);

  stroke('purple');
  line(marginLeft, yMax, width, yMax);

  drawingContext.setLineDash([]);

  noStroke();
  fill(60);

  text("r_min", marginLeft + 5, yMin - 5);
  text("r_max", marginLeft + 5, yMax - 5);
}

// ===== INFO =====
function drawInfo() {

  noStroke();

  let y0 = height - 140;

  if (rMin < R_phys) {
    fill('red');
    text("⚠ Σύγκρουση φορτίων", 20, y0);
  }

  fill(0);
  text("d = " + nf(d, 1, 2), 20, y0 + 20);
  text("r_min = " + nf(rMin, 1, 2), 20, y0 + 40);
  text("r_eq = " + nf(rEqVal, 1, 2), 20, y0 + 60);
  text("r_max = " + nf(rMaxVal, 1, 2), 20, y0 + 80);
}

// ===== BUTTONS =====
function startSim() {
  running = true;
  continuousMode = true;
}

function resumeSim() {
  running = true;
}

function resetSim() {
  d = 0.3;
  initSystem();
}

// ===== SCALE =====
function adjustScale() {
  scale = height * 0.4;
}

// ===== GROUND =====
function drawGround() {
  let yGround = height - 40;
  let marginLeft = getMargin();

  stroke(100);
  line(marginLeft, yGround, width, yGround);

  fill(0);
  noStroke();
  text("Έδαφος", marginLeft + 10, yGround - 5);
}

// ===== COMPUTE ONLY =====
function computeExtremesOnly() {

  let rEq = sqrt((k * Q * q) / (m * g));
  rEqVal = rEq;

  let A = m * g;
  let B = k * Q * q;

  let E0 = A * d + B / d;
  let D = E0 * E0 - 4 * A * B;

  let r1 = (E0 + sqrt(D)) / (2 * A);
  let r2 = (E0 - sqrt(D)) / (2 * A);

  if (d > rEq) {
    rMaxVal = d;
    rMin = min(r1, r2);
  } else {
    rMin = d;
    rMaxVal = max(r1, r2);
  }
}
``
