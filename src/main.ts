import "./style.css";
import { IconUndo, IconRedo } from "@codexteam/icons";

export class BaseDrawingApp {
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  protected undoButton: HTMLElement;
  protected redoButton: HTMLElement;
  protected saveButton: HTMLElement;
  protected sizeInput: HTMLInputElement;
  protected toolButtons: NodeListOf<HTMLElement>;
  protected colorButtons: NodeListOf<HTMLElement>;
  protected colorSelector: HTMLElement;
  protected cursor: HTMLElement;

  protected undoStack: string[] = [];
  protected redoStack: string[] = [];
  protected drawing = false;
  protected currentTool: "brush" | "blur" = "brush";
  protected color = "#FFFFFF";
  protected size = 4;

  protected offscreenCanvas: HTMLCanvasElement;
  protected offscreenCtx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.getElementById("drawingCanvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d", {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D;
    this.undoButton = document.getElementById("undo") as HTMLElement;
    this.redoButton = document.getElementById("redo") as HTMLElement;
    this.saveButton = document.getElementById("save") as HTMLElement;
    this.sizeInput = document.querySelector(".brush-size") as HTMLInputElement;
    this.toolButtons = document.querySelectorAll(".tool-btn");
    this.colorButtons = document.querySelectorAll(".color-btn");
    this.colorSelector = document.querySelector(
      "#color-selector"
    ) as HTMLElement;

    this.cursor = this.createCursor();

    this.offscreenCanvas = document.createElement("canvas");
    this.offscreenCtx = this.offscreenCanvas.getContext("2d", {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D;

    this.init();
  }

  protected init() {
    this.setupUI();
    this.setupCanvas();
    this.attachEventListeners();
  }

  protected setupUI() {
    this.undoButton.innerHTML = IconUndo;
    this.redoButton.innerHTML = IconRedo;
  }

  protected setupCanvas() {
    const img = new Image();
    img.src = "1.png";
    img.onload = () => {
      this.canvas.width = img.width;
      this.canvas.height = img.height;
      this.offscreenCanvas.width = img.width;
      this.offscreenCanvas.height = img.height;
      this.ctx.drawImage(img, 0, 0, img.width, img.height);
      this.offscreenCtx.drawImage(img, 0, 0, img.width, img.height);
      this.saveState();
    };
    this.canvas.style.cursor = "none";
  }

  protected createCursor(): HTMLElement {
    const cursor = document.createElement("div");
    cursor.style.position = "absolute";
    cursor.style.borderRadius = "50%";
    cursor.style.pointerEvents = "none";
    cursor.style.zIndex = "1000";
    cursor.style.border = "2px solid rgba(255, 255, 255, 0.5)";
    cursor.style.display = "none";
    document.body.appendChild(cursor);
    return cursor;
  }

  protected attachEventListeners() {
    this.canvas.addEventListener("mouseenter", () => {
      this.cursor.style.display = "block";
    });
    this.canvas.addEventListener("mouseleave", () => {
      this.cursor.style.display = "none";
    });
    this.canvas.addEventListener("mousemove", (e) => this.updateCursor(e));
    this.sizeInput.addEventListener("input", () => this.updateBrushSize());
    this.canvas.addEventListener("mousedown", (e) => this.startDrawing(e));
    this.canvas.addEventListener("mouseup", () => this.stopDrawing());
    this.canvas.addEventListener("mousemove", (e) => this.draw(e));
    this.canvas.addEventListener("mouseleave", () => this.stopDrawing());
    this.toolButtons.forEach((button) => {
      button.addEventListener("click", () => this.selectTool(button));
    });
    this.colorButtons.forEach((button) => {
      button.addEventListener("click", () => this.selectColor(button));
    });
    this.undoButton.addEventListener("click", () => this.undo());
    this.redoButton.addEventListener("click", () => this.redo());
    this.saveButton.addEventListener("click", () => this.saveCanvas());
  }

  protected updateCursor(e: MouseEvent) {
    const x = e.clientX - this.size / 2;
    const y = e.clientY - this.size / 2;
    this.cursor.style.left = `${x}px`;
    this.cursor.style.top = `${y}px`;
    this.cursor.style.width = `${this.size}px`;
    this.cursor.style.height = `${this.size}px`;
  }

  protected updateBrushSize() {
    this.size = Number(this.sizeInput.value);
  }

  protected startDrawing(e: MouseEvent) {
    this.drawing = true;
    this.ctx.beginPath();
    this.ctx.moveTo(
      e.clientX - this.canvas.offsetLeft,
      e.clientY - this.canvas.offsetTop
    );
  }

  protected stopDrawing() {
    if (this.drawing) {
      this.drawing = false;
      this.ctx.closePath();
      this.saveState();
    }
  }

  protected draw(e: MouseEvent) {
    if (!this.drawing) return;

    const x = e.clientX - this.canvas.offsetLeft;
    const y = e.clientY - this.canvas.offsetTop;

    this.ctx.lineWidth = this.size;
    this.ctx.lineCap = "round";

    if (this.currentTool === "brush") {
      this.ctx.strokeStyle = this.color;
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
      this.ctx.moveTo(x, y);
    } else if (this.currentTool === "blur") {
      this.applyBlur(x, y);
    }
  }

  protected applyBlur(x: number, y: number) {
    console.log(x, y);
    // Базовый метод, будет переопределен в наследниках
  }

  protected selectTool(button: HTMLElement) {
    this.toolButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    this.currentTool =
      (button.textContent?.toLowerCase() as "brush" | "blur") || "brush";
    this.colorSelector.style.display =
      this.currentTool === "blur" ? "none" : "flex";
  }

  protected selectColor(button: HTMLElement) {
    this.colorButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    this.color = window.getComputedStyle(button).backgroundColor;
  }

  protected saveState() {
    this.redoStack = [];
    this.undoStack.push(this.canvas.toDataURL());
  }

  protected undo() {
    if (this.undoStack.length > 0) {
      this.redoStack.push(this.undoStack.pop() as string);
      const imageDataUrl = this.undoStack[this.undoStack.length - 1] || "1.png";
      this.loadCanvasFromUrl(imageDataUrl);
    }
  }

  protected redo() {
    if (this.redoStack.length > 0) {
      const imageDataUrl = this.redoStack.pop() as string;
      this.undoStack.push(imageDataUrl);
      this.loadCanvasFromUrl(imageDataUrl);
    }
  }

  protected loadCanvasFromUrl(url: string) {
    const image = new Image();
    image.src = url;
    image.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(image, 0, 0);
    };
  }

  protected saveCanvas() {
    const link = document.createElement("a");
    link.download = "canvas-image.png";
    link.href = this.canvas.toDataURL();
    link.click();
  }
}

class ChromeDrawingApp extends BaseDrawingApp {
  protected applyBlur(x: number, y: number) {
    const blurRadius = this.size / 2;
    this.ctx.save();
    this.ctx.filter = `blur(${blurRadius}px)`;
    this.ctx.beginPath();
    this.ctx.arc(x, y, blurRadius, 0, Math.PI * 2);
    this.ctx.clip();
    this.ctx.drawImage(this.offscreenCanvas, 0, 0);
    this.ctx.restore();
  }
}

class SafariDrawingApp extends BaseDrawingApp {
  private kernel: number[] = [];
  private kernelSize = 5;

  constructor() {
    super();
    this.generateGaussianKernel(this.kernelSize, 1.0); // Создаем ядро размытия
  }

  private generateGaussianKernel(size: number, sigma: number) {
    const kernel: number[] = [];
    const mean = size / 2;
    let sum = 0.0;

    for (let x = 0; x < size; x++) {
      const value = Math.exp(-0.5 * Math.pow((x - mean) / sigma, 2)) / (sigma * Math.sqrt(2 * Math.PI));
      kernel.push(value);
      sum += value;
    }

    for (let i = 0; i < size; i++) {
      kernel[i] /= sum;
    }

    this.kernel = kernel;
  }

  protected applyBlur(x: number, y: number) {
    const blurRadius = Math.floor(this.size / 2);
    const startX = Math.max(0, x - blurRadius);
    const startY = Math.max(0, y - blurRadius);
    const width = Math.min(this.size, this.canvas.width - startX);
    const height = Math.min(this.size, this.canvas.height - startY);

    const imageData = this.ctx.getImageData(startX, startY, width, height);
    const blurredData = this.applyGaussianBlur(imageData);
    this.ctx.putImageData(blurredData, startX, startY);
  }

  private applyGaussianBlur(imageData: ImageData): ImageData {
    const pixels = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    const tempData = new Uint8ClampedArray(pixels);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        this.applyKernel(tempData, pixels, x, y, width, height, true);
      }
    }

    const resultData = new Uint8ClampedArray(tempData);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        this.applyKernel(resultData, tempData, x, y, width, height, false);
      }
    }

    return new ImageData(resultData, width, height);
  }

  private applyKernel(
    output: Uint8ClampedArray,
    input: Uint8ClampedArray,
    x: number,
    y: number,
    width: number,
    height: number,
    isHorizontal: boolean
  ) {
    const half = Math.floor(this.kernelSize / 2);
    const kernel = this.kernel;

    const idx = (y * width + x) * 4;
    let r = 0,
      g = 0,
      b = 0,
      a = 0;

    for (let i = -half; i <= half; i++) {
      const weight = kernel[i + half];
      const offsetX = isHorizontal ? i : 0;
      const offsetY = isHorizontal ? 0 : i;
      const pixelX = Math.min(width - 1, Math.max(0, x + offsetX));
      const pixelY = Math.min(height - 1, Math.max(0, y + offsetY));
      const pixelIdx = (pixelY * width + pixelX) * 4;

      r += input[pixelIdx] * weight;
      g += input[pixelIdx + 1] * weight;
      b += input[pixelIdx + 2] * weight;
      a += input[pixelIdx + 3] * weight;
    }

    output[idx] = r;
    output[idx + 1] = g;
    output[idx + 2] = b;
    output[idx + 3] = a;
  }
}


window.onload = () => {
  const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  isChrome ? new ChromeDrawingApp() : new SafariDrawingApp();
};

