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

// ===== margin =====
function getMargin() {
  return max(180, width * 0.2);
}

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

  // ===== ΦΥΣΙΚΗ =====
  let rEq = sqrt((k * Q * q) / (m * g));
  rEqVal = rEq;

  let A = m * g;
  let B = k * Q * q;

  let E0 = A * d + B / d;
  let D = E0 * E0 - 4 * A * B;

  let r1 = (E0 + sqrt(D)) / (2 * A);
  let r2 = (E0 - sqrt(D)) / (2 * A);

  // ✅ ΣΩΣΤΟ: το d είναι ένα από τα άκρα
  if (d > rEq) {
    rMaxVal = d;
    rMin = min(r1, r2);
  } else {
    rMin = d;
    rMaxVal = max(r1, r2);
  }

  // ===== SCALE =====
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

  // αποφυγή εξόδου εκτός canvas
  let maxR = height / scale;
  if (rMaxVal > maxR) {
    rMaxVal = maxR;
  }
}

// ===== DRAW =====
function draw() {
  background(230);

  drawGround();
  drawEquilibriumLine();
  drawExtremes();   // ✅ προσθήκη
  if (running) updatePhysics();

  drawCharges();
  drawInfo();
}

// ===== PHYSICS =====
function updatePhysics() {
  
// ❗ STOP αν υπάρχει warning
  if (rMaxVal > 5) {
    running = false;
    return;
  }

  let r = (yQ - y) / scale;

  let Fc = k * Q * q / (r * r);
  let F = Fc - m * g;

  let dt = 0.01;

  prevV = v;
  v += (F / m) * dt;

  y -= v * dt * scale;

  r = (yQ - y) / scale;

  // ✅ r_min
  if (r < rMin) {
    r = rMin;
    v *= -1;
    y = yQ - r * scale;
  }

  // ✅ r_max
  if (r > rMaxVal) {
    r = rMaxVal;
    v *= -1;
    y = yQ - r * scale;
  }

  // ✅ step mode
  if (!continuousMode) {
    if (r <= rMin || r >= rMaxVal) {
      running = false;
    }
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

  let marginLeft = getMargin();

  stroke(0);
  drawingContext.setLineDash([6, 6]);
  line(marginLeft, yEq, width, yEq);
  drawingContext.setLineDash([]);

  noStroke();
  fill(0);
  text("Θέση ισορροπίας", marginLeft + 5, yEq - 5);
}

// ===== INFO =====
function drawInfo() {
let y0 = height - 140;   // warning
let yData = height - 100; // τιμές
  noStroke();
  textSize(16);

  fill(continuousMode ? 'green' : 'blue');
  text(continuousMode ? "Mode: Continuous" : "Mode: Step", 20, 30);

  if (rMaxVal > 5) {
    fill('red');
let y0 = height - 120;   // βάση
  text("⚠ Μεγάλο εύρος ταλάντωσης", 20, y0);
  text("δεν επιτρέπεται κίνηση", 20, y0 + 20);   // ✅ σχετική απόσταση
  }
  yData = y0 + 60;
  fill(0);
text("d = " + nf(d, 1, 2) + " m", 20, yData);
text("r_min = " + nf(rMin, 1, 2) + " m", 20, yData + 20);
text("r_eq  = " + nf(rEqVal, 1, 2) + " m", 20, yData + 40);
text("r_max = " + nf(rMaxVal, 1, 2) + " m", 20, yData + 60);
text("v_max = " + nf(vMaxTheory, 1, 2) + " m/s", 20, yData + 80);
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
  let marginLeft = getMargin();

  stroke(100);
  strokeWeight(4);
  line(marginLeft, yGround, width, yGround);

  stroke(140);
  strokeWeight(2);
  for (let x = marginLeft; x < width; x += 12) {
    line(x, yGround, x + 6, yGround);
  }

  noStroke();
  fill(0);
  text("Έδαφος", marginLeft + 10, yGround - 5);
}
function drawExtremes() {

  let marginLeft = getMargin();

  let yMin = yQ - rMin * scale;
  let yMax = yQ - rMaxVal * scale;

  drawingContext.setLineDash([3, 6]);

  // ✅ r_min (π.χ. καφέ ή μπλε)
  stroke('blue');
  line(marginLeft, yMin, width, yMin);

  // ✅ r_max (π.χ. μωβ ή κόκκινο)
  stroke('purple');
  line(marginLeft, yMax, width, yMax);

  drawingContext.setLineDash([]);

  // labels
  noStroke();
  fill(60);
  textSize(13);

  text("r_min", marginLeft + 5, yMin - 5);
  text("r_max", marginLeft + 5, yMax - 5);
}
