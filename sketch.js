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

  Qslider.addEventListener("input", updateLabels);
  qslider.addEventListener("input", updateLabels);
  mslider.addEventListener("input", updateLabels);

  Qslider.addEventListener("change", applySliders);
  qslider.addEventListener("change", applySliders);
  mslider.addEventListener("change", applySliders);

  initSystem();
}

// ===== SLIDERS =====
function updateLabels() {
  Q = Qslider.value * 1e-6;
  q = qslider.value * 1e-6;
  m = parseFloat(mslider.value);

  Qval.innerText = nf(Q * 1e6, 1, 0);
  qval.innerText = nf(q * 1e6, 1, 0);
  mval.innerText = nf(m, 1, 2);

  computeExtremesOnly();
}

function applySliders() {
  Q = Qslider.value * 1e-6;
  q = qslider.value * 1e-6;
  m = parseFloat(mslider.value);
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

  y = constrain(y, yQ - rMaxVal * scale,
                    yQ - max(rMin, R_phys) * scale);
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

  let hitMin = false;
  let hitMax = false;

  if (r < rSafeMin) {
    r = rSafeMin;
    y = yQ - r * scale;
    v = 0;
    hitMin = true;
  }

  if (r > rMaxVal) {
    r = rMaxVal;
    y = yQ - r * scale;
    v = 0;
    hitMax = true;
  }

  // ✅ ΤΕΛΙΚΟ STEP FIX
  if (!continuousMode && (hitMin || hitMax)) {
    running = false;
  }
}

// ===== OBJECTS =====
function drawCharges() {
  fill('red');
  noStroke();
  ellipse(width / 2, yQ, R_visual);

  fill('blue');
  ellipse(width / 2, y, R_visual);

  if (forcesCheckbox.checked) {
    drawForces();
  }
}

// ===== FORCES =====
function drawForces() {
  let r = (yQ - y) / scale;

  let Fc = k * Q * q / (r * r);
  let Fg = m * g;

  let s = 25;

  stroke('green');
  line(width/2, y, width/2, y - Fc*s);
  arrow(width/2, y - Fc*s, -1, 'green');

  stroke('orange');
  line(width/2, y, width/2, y + Fg*s);
  arrow(width/2, y + Fg*s, 1, 'orange');
}

// ===== ARROW =====
function arrow(x, y, d, c) {
  fill(c);
  noStroke();
  triangle(x-6, y, x+6, y, x, y + d*10);
}

// ===== EQUILIBRIUM =====
function drawEquilibriumLine() {

  let mL = getMargin();

  stroke(0);
  strokeWeight(1);

  drawingContext.setLineDash([6, 6]);
  line(mL, yEq, width, yEq);
  drawingContext.setLineDash([]);

  noStroke();
  fill(0);
  text("Θέση ισορροπίας", mL + 5, yEq - 5);
}


// ===== EXTREMES =====
function drawExtremes() {
  let mL = getMargin();

  let yMin = yQ - rMin * scale;
  let yMax = yQ - rMaxVal * scale;

  drawingContext.setLineDash([3,6]);
  stroke('blue');
  line(mL, yMin, width, yMin);
  stroke('purple');
  line(mL, yMax, width, yMax);
  drawingContext.setLineDash([]);

  fill(60);
  text("r_min", mL+5, yMin-5);
  text("r_max", mL+5, yMax-5);
}

// ===== INFO =====
function drawInfo() {
  textSize(16);

  fill(continuousMode ? 'green' : 'blue');
  text(continuousMode ? "Mode: Continuous" : "Mode: Step", 20, 30);

  let y0 = height - 140;

  fill(0);
  text("d = " + nf(d,1,2), 20, y0);
  text("r_min = " + nf(rMin,1,2), 20, y0+20);
  text("r_eq = " + nf(rEqVal,1,2), 20, y0+40);
  text("r_max = " + nf(rMaxVal,1,2), 20, y0+60);
  text("v = " + nf(v,1,2), 20, y0+80);
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
  Qslider.value = 2;
  qslider.value = 20;
  mslider.value = 0.1;

  updateLabels();

  Q = 2e-6;
  q = 20e-6;
  m = 0.1;

  v = 0;
  running = false;
  continuousMode = false;

  initSystem();
}

// ===== SCALE =====
function adjustScale() {
  scale = height * 0.4;
}

// ===== GROUND =====
function drawGround() {

  let gY = height - 40;
  let mL = getMargin();

  stroke(100);
  strokeWeight(4);
  line(mL, gY, width, gY);

  // ✅ striped ground (λείπει τώρα)
  stroke(140);
  strokeWeight(2);
  for (let x = mL; x < width; x += 12) {
    line(x, gY, x + 6, gY);
  }

  noStroke();
  fill(0);
  text("Έδαφος", mL + 10, gY - 5);
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
