var h=Object.defineProperty;var l=(r,t,e)=>t in r?h(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var s=(r,t,e)=>l(r,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(o){if(o.ep)return;o.ep=!0;const n=e(o);fetch(o.href,n)}})();const d='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.6667 13.6667L18 10.3333L14.6667 7M18 10.3333H8.83333C7.94928 10.3333 7.10143 10.6845 6.47631 11.3096C5.85119 11.9348 5.5 12.7826 5.5 13.6667C5.5 14.5507 5.85119 15.3986 6.47631 16.0237C7.10143 16.6488 7.94928 17 8.83333 17H9.66667"/></svg>',u='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.33333 13.6667L6 10.3333L9.33333 7M6 10.3333H15.1667C16.0507 10.3333 16.8986 10.6845 17.5237 11.3096C18.1488 11.9348 18.5 12.7826 18.5 13.6667C18.5 14.5507 18.1488 15.3986 17.5237 16.0237C16.8986 16.6488 16.0507 17 15.1667 17H14.3333"/></svg>';class c{constructor(){s(this,"canvas");s(this,"ctx");s(this,"undoButton");s(this,"redoButton");s(this,"saveButton");s(this,"sizeInput");s(this,"toolButtons");s(this,"colorButtons");s(this,"colorSelector");s(this,"cursor");s(this,"undoStack",[]);s(this,"redoStack",[]);s(this,"drawing",!1);s(this,"currentTool","brush");s(this,"color","#FFFFFF");s(this,"size",4);s(this,"offscreenCanvas");s(this,"offscreenCtx");this.canvas=document.getElementById("drawingCanvas"),this.ctx=this.canvas.getContext("2d",{willReadFrequently:!0}),this.undoButton=document.getElementById("undo"),this.redoButton=document.getElementById("redo"),this.saveButton=document.getElementById("save"),this.sizeInput=document.querySelector(".brush-size"),this.toolButtons=document.querySelectorAll(".tool-btn"),this.colorButtons=document.querySelectorAll(".color-btn"),this.colorSelector=document.querySelector("#color-selector"),this.cursor=this.createCursor(),this.offscreenCanvas=document.createElement("canvas"),this.offscreenCtx=this.offscreenCanvas.getContext("2d",{willReadFrequently:!0}),this.init()}init(){this.setupUI(),this.setupCanvas(),this.attachEventListeners()}setupUI(){this.undoButton.innerHTML=u,this.redoButton.innerHTML=d}setupCanvas(){const t=new Image;t.src="1.png",t.onload=()=>{this.canvas.width=t.width,this.canvas.height=t.height,this.offscreenCanvas.width=t.width,this.offscreenCanvas.height=t.height,this.ctx.drawImage(t,0,0,t.width,t.height),this.offscreenCtx.drawImage(t,0,0,t.width,t.height),this.saveState()},this.canvas.style.cursor="none"}createCursor(){const t=document.createElement("div");return t.style.position="absolute",t.style.borderRadius="50%",t.style.pointerEvents="none",t.style.zIndex="1000",t.style.border="2px solid rgba(255, 255, 255, 0.5)",t.style.display="none",document.body.appendChild(t),t}attachEventListeners(){this.canvas.addEventListener("mouseenter",()=>{this.cursor.style.display="block"}),this.canvas.addEventListener("mouseleave",()=>{this.cursor.style.display="none"}),this.canvas.addEventListener("mousemove",t=>this.updateCursor(t)),this.sizeInput.addEventListener("input",()=>this.updateBrushSize()),this.canvas.addEventListener("mousedown",t=>this.startDrawing(t)),this.canvas.addEventListener("mouseup",()=>this.stopDrawing()),this.canvas.addEventListener("mousemove",t=>this.draw(t)),this.canvas.addEventListener("mouseleave",()=>this.stopDrawing()),this.toolButtons.forEach(t=>{t.addEventListener("click",()=>this.selectTool(t))}),this.colorButtons.forEach(t=>{t.addEventListener("click",()=>this.selectColor(t))}),this.undoButton.addEventListener("click",()=>this.undo()),this.redoButton.addEventListener("click",()=>this.redo()),this.saveButton.addEventListener("click",()=>this.saveCanvas())}updateCursor(t){const e=t.clientX-this.size/2,i=t.clientY-this.size/2;this.cursor.style.left=`${e}px`,this.cursor.style.top=`${i}px`,this.cursor.style.width=`${this.size}px`,this.cursor.style.height=`${this.size}px`}updateBrushSize(){this.size=Number(this.sizeInput.value)}startDrawing(t){this.drawing=!0,this.ctx.beginPath(),this.ctx.moveTo(t.clientX-this.canvas.offsetLeft,t.clientY-this.canvas.offsetTop)}stopDrawing(){this.drawing&&(this.drawing=!1,this.ctx.closePath(),this.saveState())}draw(t){if(!this.drawing)return;const e=t.clientX-this.canvas.offsetLeft,i=t.clientY-this.canvas.offsetTop;this.ctx.lineWidth=this.size,this.ctx.lineCap="round",this.currentTool==="brush"?(this.ctx.strokeStyle=this.color,this.ctx.lineTo(e,i),this.ctx.stroke(),this.ctx.moveTo(e,i)):this.currentTool==="blur"&&this.applyBlur(e,i)}applyBlur(t,e){console.log(t,e)}selectTool(t){var e;this.toolButtons.forEach(i=>i.classList.remove("active")),t.classList.add("active"),this.currentTool=((e=t.textContent)==null?void 0:e.toLowerCase())||"brush",this.colorSelector.style.display=this.currentTool==="blur"?"none":"flex"}selectColor(t){this.colorButtons.forEach(e=>e.classList.remove("active")),t.classList.add("active"),this.color=window.getComputedStyle(t).backgroundColor}saveState(){this.redoStack=[],this.undoStack.push(this.canvas.toDataURL())}undo(){if(this.undoStack.length>0){this.redoStack.push(this.undoStack.pop());const t=this.undoStack[this.undoStack.length-1]||"1.png";this.loadCanvasFromUrl(t)}}redo(){if(this.redoStack.length>0){const t=this.redoStack.pop();this.undoStack.push(t),this.loadCanvasFromUrl(t)}}loadCanvasFromUrl(t){const e=new Image;e.src=t,e.onload=()=>{this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.ctx.drawImage(e,0,0)}}saveCanvas(){const t=document.createElement("a");t.download="canvas-image.png",t.href=this.canvas.toDataURL(),t.click()}}class v extends c{applyBlur(t,e){const i=this.size/2;this.ctx.save(),this.ctx.filter=`blur(${i}px)`,this.ctx.beginPath(),this.ctx.arc(t,e,i,0,Math.PI*2),this.ctx.clip(),this.ctx.drawImage(this.offscreenCanvas,0,0),this.ctx.restore()}}class p extends c{applyBlur(t,e){const i=this.size,o=.05;for(let n=0;n<10;n++)this.ctx.globalAlpha=o,this.ctx.fillStyle=this.color,this.ctx.beginPath(),this.ctx.arc(t,e,i-n,0,Math.PI*2),this.ctx.fill();this.ctx.globalAlpha=1}}window.onload=()=>{const r=/Chrome/.test(navigator.userAgent)&&/Google Inc/.test(navigator.vendor);r?new v:new p,console.log(r)};