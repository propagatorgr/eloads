let Q = 2e-6;
let q = 20e-6;
let m = 0.1;
let g = 10;
let k = 9e9;

let yQ;
let y;
let v = 0;
let a = 0;

let prevV = 0;
let running = false;

let scale = 300;

let yEq;

// =====================
// p5 SETUP
// =====================
function setup() {
  let canvas = createCanvas(windowWidth, windowHeight - 70);
  canvas.parent("canvasContainer");

  yQ = height - 120;

  resetSimulation();

  let rEq = sqrt((k * Q * q) / (m * g));
  yEq = yQ - rEq * scale;
}
// =====================
// LOOP
// =====================
function draw() {
  background(240);

  drawEquilibriumLine();
  drawCharges();

  if (running) {
    updatePhysics();
  }

  drawInfo();
}

// =====================
// PHYSICS
// =====================
function updatePhysics() {
  let r = (yQ - y) / scale;

  let Fc = k * Q * q / (r * r);
  let F = Fc - m * g;

  a = F / m;

  let dt = 0.01;

  prevV = v;
  v += a * dt;
  y -= v * dt * scale;

  // stop at extrema
  if (prevV * v < 0) {
    running = false;
  }

  // keep in canvas
  y = constrain(y, 50, height - 20);
}

// =====================
// DRAWING
// =====================
function drawCharges() {
  // Q
  fill('red');
  ellipse(width / 2, yQ, 20, 20);

  // q
  fill('blue');
  ellipse(width / 2, y, 20, 20);

  // Forces ✅
  if (document.getElementById("forcesCheckbox").checked) {
    drawForces();
  }
}

function drawForces() {
  let r = (yQ - y) / scale;
  let Fc = k * Q * q / (r * r);
  let Fg = m * g;

  let scaleF = 0.05; // ✅ ΜΕΓΑΛΑ ΒΕΛΗ ΤΩΡΑ

  // Coulomb (πάνω)
  stroke('green');
  strokeWeight(3);
  line(width / 2, y,
       width / 2,
       y - Fc * scaleF);

  drawArrowHead(width / 2, y - Fc * scaleF, -1, 'green');

  // Βάρος (κάτω)
  stroke('orange');
  line(width / 2, y,
       width / 2,
       y + Fg * scaleF);

  drawArrowHead(width / 2, y + Fg * scaleF, 1, 'orange');

  // labels
  noStroke();
  fill('green');
  text("Fc", width / 2 + 8, y - Fc * scaleF);

  fill('orange');
  text("w", width / 2 + 8, y + Fg * scaleF);
}


function drawArrowHead(x, y, dir, col) {
  fill(col);
  noStroke();

  let size = 6;

  triangle(
    x - size, y,
    x + size, y,
    x, y + dir * size
  );
}

function drawEquilibriumLine() {
  stroke(0);
  drawingContext.setLineDash([6, 6]);
  line(0, yEq, width, yEq);
  drawingContext.setLineDash([]);

  noStroke();
  fill(0);
  text("Θέση ισορροπίας", 10, yEq - 5);
}

function drawInfo() {
  fill(0);
  noStroke();

  text("y = " + nf((yQ - y) / scale, 1, 2) + " m", 10, height - 40);
  text("v = " + nf(v, 1, 2), 10, height - 20);
}

// =====================
// CONTROLS (HTML)
// =====================
function startSim() {
  running = true;
}

function resumeSim() {
  running = true;
}

function resetSim() {
  resetSimulation();
}

function resetSimulation() {
  let d = 0.3;

  y = yQ - d * scale;

  v = 0;
  a = 0;
  prevV = 0;

  running = false;
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight - 70);

  yQ = height - 120;

  let rEq = sqrt((k * Q * q) / (m * g));
  yEq = yQ - rEq * scale;
}
