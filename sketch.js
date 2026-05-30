let Q = 2e-6;
let q = 20e-6;
let m = 0.1;
let g = 10;
let k = 9e9;

let yQ, y, v = 0, a = 0;
let prevV = 0;
let running = false;

let scale = 250;

let yEq;
let vMaxTheory;

let KE = 0, PE = 0, Etotal = 0;

// ===== SETUP =====
function setup() {
  let canvas = createCanvas(windowWidth, windowHeight - 80);
  canvas.parent("canvasContainer");

  initSystem();
}

// ===== INIT =====
function initSystem() {
  yQ = height - 120;

  let d = 0.3;
  y = yQ - d * scale;

  v = 0;
  prevV = 0;
  running = false;

  let rEq = sqrt((k * Q * q) / (m * g));
  yEq = yQ - rEq * scale;

  let r0 = 0.3;
  let U0 = m * g * r0 + k * Q * q / r0;
  let Ueq = m * g * rEq + k * Q * q / rEq;

  vMaxTheory = sqrt((2 / m) * (U0 - Ueq));
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

  computeEnergy();
  drawEnergyDiagram();

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

  if (prevV * v < 0) running = false;

  y = constrain(y, 50, height - 20);
}

// ===== ENERGY =====
function computeEnergy() {
  let r = (yQ - y) / scale;

  KE = 0.5 * m * v * v;
  PE = m * g * r + k * Q * q / r;
  Etotal = KE + PE;
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

// ===== ENERGY DIAGRAM =====
function drawEnergyDiagram() {
  let x0 = 40;
  let y0 = 80;
  let scaleE = 40;

  strokeWeight(6);

  stroke('blue');
  line(x0, y0, x0, y0 + KE * scaleE);

  stroke('red');
  line(x0 + 40, y0, x0 + 40, y0 + PE * scaleE);

  stroke('black');
  line(x0 + 80, y0, x0 + 80, y0 + Etotal * scaleE);

  noStroke();
  fill(0);
  text("K", x0 - 5, y0 + KE * scaleE + 15);
  text("U", x0 + 35, y0 + PE * scaleE + 15);
  text("E", x0 + 75, y0 + Etotal * scaleE + 15);
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
  fill(0);
  noStroke();
  textSize(16);
  text("v_max = " + nf(vMaxTheory, 1, 2) + " m/s", 20, height - 20);
}

// ===== BUTTONS =====
function startSim() { running = true; }
function resumeSim() { running = true; }
function resetSim() { initSystem(); }
