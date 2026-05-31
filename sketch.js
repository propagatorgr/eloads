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

// ✅ ΚΟΙΝΟ margin για ΟΛΑ
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

  let r0 = 0.3;

  y = yQ - r0 * scale;

  v = 0;
  prevV = 0;
  running = false;

  let rEq = sqrt((k * Q * q) / (m * g));
  yEq = yQ - rEq * scale;

  let U0 = m * g * r0 + k * Q * q / r0;
  let Ueq = m * g * rEq + k * Q * q / rEq;
  vMaxTheory = sqrt((2 / m) * (U0 - Ueq));

  let A = m * g;
  let B = k * Q * q;

  let E0 = A * r0 + B / r0;
  let D = E0 * E0 - 4 * A * B;

  let r1 = (E0 + sqrt(D)) / (2 * A);
  let r2 = (E0 - sqrt(D)) / (2 * A);

  let rMax = max(r1, r2);

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

  y = constrain(y, 50, height - 20);
}

// ===== OBJECTS =====
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

  stroke('green');
  line(width / 2, y, width / 2, y - Fc * scaleF);
  arrow(width / 2, y - Fc * scaleF, -1, 'green');

  stroke('orange');
  line(width / 2, y, width / 2, y + Fg * scaleF);
  arrow(width / 2, y + Fg * scaleF, 1, 'orange');
}

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

  noStroke();
  fill(0);
  text("Θέση ισορροπίας", marginLeft + 5, yEq - 5);
}

// ===== INFO =====
function drawInfo() {

  noStroke();
  textSize(16);

  fill(continuousMode ? 'green' : 'blue');
  text(continuousMode ? "Mode: Continuous" : "Mode: Step", 20, 30);

// ✅ WARNING γιa μεγάλο εύρος
  if (rMaxVal > 5) {
    fill('red');
    text("⚠ Μεγάλο εύρος ταλάντωσης", 20, height - 110);
  }

  fill(0);
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

  document.getElementById("Qval").innerText = 2;
  document.getElementById("qval").innerText = 20;
  document.getElementById("mval").innerText = 0.1;

  Q = 2e-6;
  q = 20e-6;
  m = 0.1;

  adjustScale();
  initSystem();
}
function updateFromSliders() {

  // ✅ παίρνουμε τις τιμές όπως τις δίνει ο χρήστης
  Q = document.getElementById("Qslider").value * 1e-6;
  q = document.getElementById("qslider").value * 1e-6;
  m = parseFloat(document.getElementById("mslider").value);

  // ✅ ενημέρωση labels
  document.getElementById("Qval").innerText =
    document.getElementById("Qslider").value;

  document.getElementById("qval").innerText =
    document.getElementById("qslider").value;

  document.getElementById("mval").innerText =
    document.getElementById("mslider").value;

  // ✅ rendering only (όχι φυσική!)
  adjustScale();
  initSystem();
}


// ===== SCALE =====
function adjustScale() {

  let r0 = 0.3;
  let rEq = sqrt((k * Q * q) / (m * g));

  // εκτίμηση άνω άκρου
  let rMax = max(r0, 3 * rEq);

  // ✅ scale πάνω σε όλο το εύρος
  scale = (0.6 * height) / rMax;
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
  textSize(14);
  text("Έδαφος", marginLeft + 10, yGround - 5);
}

