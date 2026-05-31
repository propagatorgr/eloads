let Q = 2e-6;
let q = 20e-6;
let m = 0.1;
let targetExtreme = null;
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

 
document.getElementById("Qval").innerText = nf(Q * 1e6, 1, 0);
  document.getElementById("qval").innerText = nf(q * 1e6, 1, 0);
  document.getElementById("mval").innerText = nf(m, 1, 2);


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
  v = 0;   // ✅ εδώ είναι το fix
  y = yQ - r * scale;
}
 if (r > rMaxVal) {
  r = rMaxVal;
  v = 0;   // ✅
  y = yQ - r * scale;
}
if (!continuousMode && targetExtreme !== null) {

  let r = (yQ - y) / scale;

  if (abs(r - targetExtreme) < 0.005) {
    running = false;
    v = 0;
    targetExtreme = null;
  }
}

  // αν πάς προς τα πάνω
  if (v > 0 && r >= rMaxVal) {
    running = false;
    v = 0;
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

  // Coulomb (προς τα πάνω)
  stroke('green');
  line(width / 2, y, width / 2, y - Fc * scaleF);
  arrow(width / 2, y - Fc * scaleF, -1, 'green');

  // Βάρος
  stroke('orange');
  line(width / 2, y, width / 2, y + Fg * scaleF);
  arrow(width / 2, y + Fg * scaleF, 1, 'orange');
}

// ===== ARROW =====
function arrow(x, y, dir, col) {
  fill(col);
  noStroke();
  triangle(x - 6, y, x + 6, y, x, y + dir * 10);
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
  textSize(16);

  // ✅ Mode ένδειξη
  fill(continuousMode ? 'green' : 'blue');
  text(
    continuousMode ? "Mode: Continuous" : "Mode: Step",
    20,
    30
  );

  let y0 = height - 140;
  let yData = height - 100;

  // ✅ collision warning
  if (rMin < R_phys) {
    fill('red');
    text("⚠ Σύγκρουση φορτίων", 20, y0);
    yData = y0 + 40;
  }

  fill(0);

  text("d = " + nf(d, 1, 2) + " m", 20, yData);
  text("r_min = " + nf(rMin, 1, 2) + " m", 20, yData + 20);
  text("r_eq  = " + nf(rEqVal, 1, 2) + " m", 20, yData + 40);
  text("r_max = " + nf(rMaxVal, 1, 2) + " m", 20, yData + 60);

  // ✅ ΤΟ ΚΟΜΜΑΤΙ ΠΟΥ ΛΕΙΠΕ
  text("v = " + nf(v, 1, 2) + " m/s", 20, yData + 80);

  text("v_max = " + nf(vMaxTheory, 1, 2) + " m/s", 20, yData + 100);
}

// ===== BUTTONS =====
function startSim() {
  continuousMode = true;
  running = true;
}



function resumeSim() {

  continuousMode = false;

  let r = (yQ - y) / scale;

  // ✅ αν είσαι κάτω → πήγαινε πάνω
  if (abs(r - rMin) < 1e-4) {
    targetExtreme = rMaxVal;
  }
  // ✅ αν είσαι πάνω → πήγαινε κάτω
  else if (abs(r - rMaxVal) < 1e-4) {
    targetExtreme = max(rMin, R_phys);
  }
  // ✅ ενδιάμεσα → διάλεξε πιο κοντινό
  else if (r < rEqVal) {
    targetExtreme = rMaxVal;
  } else {
    targetExtreme = max(rMin, R_phys);
  }

  running = true;
}
function resetSim() {

  // ✅ επαναφορά sliders (UI)
  document.getElementById("Qslider").value = 2;
  document.getElementById("qslider").value = 20;
  document.getElementById("mslider").value = 0.1;

  // ✅ ενημέρωση labels
  document.getElementById("Qval").innerText = 2;
  document.getElementById("qval").innerText = 20;
  document.getElementById("mval").innerText = 0.1;

  // ✅ επαναφορά φυσικών μεγεθών
  Q = 2e-6;
  q = 20e-6;
  m = 0.1;
  d = 0.3;

  // ✅ reset ταχύτητας
  v = 0;

  // ✅ reset mode
  running = false;
  continuousMode = false;

  // ✅ επανυπολογισμός συστήματος
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

// ===== COMPUTE =====
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

