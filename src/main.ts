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
    this.ctx = this.canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;
    this.undoButton = document.getElementById("undo") as HTMLElement;
    this.redoButton = document.getElementById("redo") as HTMLElement;
    this.saveButton = document.getElementById("save") as HTMLElement;
    this.sizeInput = document.querySelector(".brush-size") as HTMLInputElement;
    this.toolButtons = document.querySelectorAll(".tool-btn");
    this.colorButtons = document.querySelectorAll(".color-btn");
    this.colorSelector = document.querySelector("#color-selector") as HTMLElement;

    this.cursor = this.createCursor();

    this.offscreenCanvas = document.createElement("canvas");
    this.offscreenCtx = this.offscreenCanvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;

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
    this.ctx.moveTo(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);
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
    // Базовый метод, будет переопределен в наследниках
  }

  protected selectTool(button: HTMLElement) {
    this.toolButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    this.currentTool = (button.textContent?.toLowerCase() as "brush" | "blur") || "brush";
    this.colorSelector.style.display = this.currentTool === "blur" ? "none" : "flex";
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
  protected applyBlur(x: number, y: number) {
    const blurRadius = this.size / 2;
    this.ctx.globalAlpha = 0.3;
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, blurRadius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.globalAlpha = 1;
  }
}

window.onload = () => {
  const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  const app = isChrome ? new ChromeDrawingApp() : new SafariDrawingApp();
};
