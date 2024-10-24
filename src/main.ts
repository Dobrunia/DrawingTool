import "./style.css";
import { IconUndo, IconRedo } from "@codexteam/icons";

class DrawingApp {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private undoButton: HTMLElement;
  private redoButton: HTMLElement;
  private saveButton: HTMLElement;
  private sizeInput: HTMLInputElement;
  private toolButtons: NodeListOf<HTMLElement>;
  private colorButtons: NodeListOf<HTMLElement>;
  private colorSelector: HTMLElement;
  private cursor: HTMLElement;

  private undoStack: string[] = [];
  private redoStack: string[] = [];
  private drawing = false;
  private currentTool: "brush" | "blur" = "brush";
  private color = "#FFFFFF";
  private size = 4;

  private offscreenCanvas: HTMLCanvasElement;
  private offscreenCtx: CanvasRenderingContext2D;

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

    // Создаем offscreen canvas с параметром willReadFrequently
    this.offscreenCanvas = document.createElement("canvas");
    this.offscreenCtx = this.offscreenCanvas.getContext("2d", {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D;

    this.init();
  }

  private init() {
    this.setupUI();
    this.setupCanvas();
    this.attachEventListeners();
  }

  private setupUI() {
    this.undoButton.innerHTML = IconUndo;
    this.redoButton.innerHTML = IconRedo;
  }

  private setupCanvas() {
    const img = new Image();
    img.src = "1.png";
    img.onload = () => {
      this.canvas.width = img.width;
      this.canvas.height = img.height;
      this.offscreenCanvas.width = img.width;
      this.offscreenCanvas.height = img.height;
      this.ctx.drawImage(img, 0, 0, img.width, img.height);
      this.offscreenCtx.drawImage(img, 0, 0, img.width, img.height); // Копируем изображение на offscreen холст
      this.saveState();
    };
    this.canvas.style.cursor = "none";
  }

  private createCursor(): HTMLElement {
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

  private attachEventListeners() {
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

  private updateCursor(e: MouseEvent) {
    const x = e.clientX - this.size / 2;
    const y = e.clientY - this.size / 2;
    this.cursor.style.left = `${x}px`;
    this.cursor.style.top = `${y}px`;
    this.cursor.style.width = `${this.size}px`;
    this.cursor.style.height = `${this.size}px`;
  }

  private updateBrushSize() {
    this.size = Number(this.sizeInput.value);
  }

  private startDrawing(e: MouseEvent) {
    this.drawing = true;
    this.ctx.beginPath();
    this.ctx.moveTo(
      e.clientX - this.canvas.offsetLeft,
      e.clientY - this.canvas.offsetTop
    );
  }

  private stopDrawing() {
    if (this.drawing) {
      this.drawing = false;
      this.ctx.closePath();
      this.saveState();
    }
  }

  private draw(e: MouseEvent) {
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
      this.applyNativeBlur(x, y);
    }
  }

  private applyNativeBlur(x: number, y: number) {
    const blurRadius = this.size / 2;
    this.ctx.save();
    this.ctx.filter = `blur(${blurRadius}px)`;
    this.ctx.beginPath();
    this.ctx.arc(x, y, blurRadius, 0, Math.PI * 2);
    this.ctx.clip();
    this.ctx.drawImage(this.offscreenCanvas, 0, 0);
    this.ctx.restore();
  }

  private selectTool(button: HTMLElement) {
    this.toolButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    this.currentTool =
      (button.textContent?.toLowerCase() as "brush" | "blur") || "brush";
    if (this.currentTool === "blur") {
      this.colorSelector.style.display = "none";
    } else {
      this.colorSelector.style.display = "flex";
    }
  }

  private selectColor(button: HTMLElement) {
    this.colorButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    this.color = window.getComputedStyle(button).backgroundColor;
  }

  private saveState() {
    this.redoStack = [];
    this.undoStack.push(this.canvas.toDataURL());
  }

  private undo() {
    if (this.undoStack.length > 0) {
      this.redoStack.push(this.undoStack.pop() as string);
      const imageDataUrl = this.undoStack[this.undoStack.length - 1] || "1.png";
      this.loadCanvasFromUrl(imageDataUrl);
    }
  }

  private redo() {
    if (this.redoStack.length > 0) {
      const imageDataUrl = this.redoStack.pop() as string;
      this.undoStack.push(imageDataUrl);
      this.loadCanvasFromUrl(imageDataUrl);
    }
  }

  private loadCanvasFromUrl(url: string) {
    const image = new Image();
    image.src = url;
    image.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(image, 0, 0);
    };
  }

  private saveCanvas() {
    const link = document.createElement("a");
    link.download = "canvas-image.png";
    link.href = this.canvas.toDataURL();
    link.click();
  }
}

window.onload = () => {
  new DrawingApp();
};
