import "./style.css";
import { IconUndo, IconRedo } from "@codexteam/icons";

const undoButton = document.getElementById("undo") as HTMLElement;
const redoButton = document.getElementById("redo") as HTMLElement;
const canvas = document.getElementById("drawingCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const sizeInput = document.querySelector(".brush-size") as HTMLInputElement;
const saveButton = document.getElementById("save") as HTMLElement;
const toolButtons = document.querySelectorAll(".tool-btn");
const colorSelector = document.querySelector("#color-selector") as HTMLElement;
const colorButtons = document.querySelectorAll(".color-btn");

let undoStack: string[] = [];
let redoStack: string[] = [];
let drawing = false;
let currentTool: "brush" | "blur" = "brush";
let color = "#FFFFFF";
let size = 4;
let points: { x: number, y: number }[] = [];

undoButton.innerHTML = IconUndo;
redoButton.innerHTML = IconRedo;

const cursor = document.createElement("div");
cursor.style.position = "absolute";
cursor.style.borderRadius = "50%";
cursor.style.pointerEvents = "none";
cursor.style.zIndex = "1000";
cursor.style.border = "2px solid rgba(255, 255, 255, 0.5)";
cursor.style.display = "none";
document.body.appendChild(cursor);
canvas.style.cursor = "none";
canvas.addEventListener("mouseenter", () => {
  cursor.style.display = "block";
});
canvas.addEventListener("mouseleave", () => {
  cursor.style.display = "none";
});
canvas.addEventListener("mousemove", (e) => {
  const x = e.clientX - size / 2;
  const y = e.clientY - size / 2;
  cursor.style.left = `${x}px`;
  cursor.style.top = `${y}px`;
});

const img = new Image();
img.src = "1.png";
img.onload = function () {
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0, img.width, img.height);
  saveState();
};

toolButtons.forEach((button) => {
  button.addEventListener("click", function () {
    toolButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    currentTool =
      (button.textContent?.toLowerCase() as "brush" | "blur") || "brush";
    if (currentTool === "blur") {
      colorSelector.style.display = "none";
    } else {
      colorSelector.style.display = "flex";
    }
  });
});

colorButtons.forEach((button) => {
  button.addEventListener("click", function () {
    colorButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    color = window.getComputedStyle(button).backgroundColor;
  });
});

sizeInput.addEventListener("input", function () {
  size = Number(this.value);
  cursor.style.width = `${size}px`;
  cursor.style.height = `${size}px`;
});

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseleave", stopDrawing);

function startDrawing(e: MouseEvent) {
  drawing = true;
  points = [];
  const x = e.clientX - canvas.offsetLeft;
  const y = e.clientY - canvas.offsetTop;
  points.push({ x, y });
  ctx.beginPath();
  ctx.moveTo(x, y);
}

function stopDrawing() {
  if (drawing) {
    drawing = false;
    ctx.closePath();

    if (currentTool === "brush") {
      const simplifiedPoints = ramerDouglasPeucker(points, 2);
      redrawSimplifiedLine(simplifiedPoints);
    }

    saveState();
  }
}

function draw(e: MouseEvent) {
  if (!drawing) return;

  const x = e.clientX - canvas.offsetLeft;
  const y = e.clientY - canvas.offsetTop;

  ctx.lineWidth = size;
  ctx.lineCap = "round";

  if (currentTool === "brush") {
    ctx.strokeStyle = color;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.moveTo(x, y);
    points.push({ x, y });
  } else if (currentTool === "blur") {
    const blurRadius = size / 2;
    const blurSize = blurRadius * 2;
    const imageData = ctx.getImageData(
      x - blurRadius,
      y - blurRadius,
      blurSize,
      blurSize
    );
    applyBlur(imageData);
    ctx.putImageData(imageData, x - blurRadius, y - blurRadius);
  }
}

function applyBlur(imageData: ImageData) {
  const pixels = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const neighbors = getNeighborPixels(pixels, width, height, x, y);
      const avg = averageColor(neighbors);
      pixels[index] = avg[0];
      pixels[index + 1] = avg[1];
      pixels[index + 2] = avg[2];
    }
  }
}

function getNeighborPixels(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  x: number,
  y: number
): number[][] {
  const neighbors: number[][] = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const index = (ny * width + nx) * 4;
        neighbors.push([pixels[index], pixels[index + 1], pixels[index + 2]]);
      }
    }
  }
  return neighbors;
}

function averageColor(neighbors: number[][]): number[] {
  const total = [0, 0, 0];
  neighbors.forEach((color) => {
    total[0] += color[0];
    total[1] += color[1];
    total[2] += color[2];
  });
  const count = neighbors.length;
  return [total[0] / count, total[1] / count, total[2] / count];
}

// Алгоритм Рамера-Дугласа-Пекера
function ramerDouglasPeucker(points: { x: number, y: number }[], epsilon: number): { x: number, y: number }[] {
  if (points.length < 3) return points;

  let dmax = 0;
  let index = 0;
  const end = points.length - 1;

  for (let i = 1; i < end; i++) {
    const d = perpendicularDistance(points[i], points[0], points[end]);
    if (d > dmax) {
      index = i;
      dmax = d;
    }
  }

  if (dmax > epsilon) {
    const recResults1 = ramerDouglasPeucker(points.slice(0, index + 1), epsilon);
    const recResults2 = ramerDouglasPeucker(points.slice(index), epsilon);

    return [...recResults1.slice(0, recResults1.length - 1), ...recResults2];
  } else {
    return [points[0], points[end]];
  }
}

function perpendicularDistance(point: { x: number, y: number }, lineStart: { x: number, y: number }, lineEnd: { x: number, y: number }) {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;

  const mag = Math.sqrt(dx * dx + dy * dy);
  const u1 = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / (mag * mag);

  const closestPoint = {
    x: lineStart.x + u1 * dx,
    y: lineStart.y + u1 * dy,
  };

  const dist = Math.sqrt((point.x - closestPoint.x) ** 2 + (point.y - closestPoint.y) ** 2);
  return dist;
}

function redrawSimplifiedLine(simplifiedPoints: { x: number, y: number }[]) {
  ctx.beginPath();
  ctx.moveTo(simplifiedPoints[0].x, simplifiedPoints[0].y);
  for (let i = 1; i < simplifiedPoints.length; i++) {
    ctx.lineTo(simplifiedPoints[i].x, simplifiedPoints[i].y);
  }
  ctx.stroke();
}

undoButton.addEventListener("click", undo);
redoButton.addEventListener("click", redo);

function saveState() {
  redoStack = [];
  undoStack.push(canvas.toDataURL());
}

function undo() {
  if (undoStack.length > 0) {
    redoStack.push(undoStack.pop() as string);
    const imageDataUrl = undoStack[undoStack.length - 1] || img.src;
    loadCanvasFromUrl(imageDataUrl);
  }
}

function redo() {
  if (redoStack.length > 0) {
    const imageDataUrl = redoStack.pop() as string;
    undoStack.push(imageDataUrl);
    loadCanvasFromUrl(imageDataUrl);
  }
}

function loadCanvasFromUrl(url: string) {
  const image = new Image();
  image.src = url;
  image.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
  };
}

saveButton.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "canvas-image.png";
  link.href = canvas.toDataURL();
  link.click();
});
