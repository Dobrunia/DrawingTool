var f=Object.defineProperty;var v=(c,t,e)=>t in c?f(c,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):c[t]=e;var n=(c,t,e)=>v(c,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function e(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(i){if(i.ep)return;i.ep=!0;const o=e(i);fetch(i.href,o)}})();const g='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.6667 13.6667L18 10.3333L14.6667 7M18 10.3333H8.83333C7.94928 10.3333 7.10143 10.6845 6.47631 11.3096C5.85119 11.9348 5.5 12.7826 5.5 13.6667C5.5 14.5507 5.85119 15.3986 6.47631 16.0237C7.10143 16.6488 7.94928 17 8.83333 17H9.66667"/></svg>',p='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.33333 13.6667L6 10.3333L9.33333 7M6 10.3333H15.1667C16.0507 10.3333 16.8986 10.6845 17.5237 11.3096C18.1488 11.9348 18.5 12.7826 18.5 13.6667C18.5 14.5507 18.1488 15.3986 17.5237 16.0237C16.8986 16.6488 16.0507 17 15.1667 17H14.3333"/></svg>';class m{constructor(){n(this,"canvas");n(this,"ctx");n(this,"undoButton");n(this,"redoButton");n(this,"saveButton");n(this,"sizeInput");n(this,"toolButtons");n(this,"colorButtons");n(this,"colorSelector");n(this,"cursor");n(this,"undoStack",[]);n(this,"redoStack",[]);n(this,"drawing",!1);n(this,"currentTool","brush");n(this,"color","#FFFFFF");n(this,"size",4);n(this,"points",[]);n(this,"offscreenCanvas");n(this,"offscreenCtx");n(this,"processedGrid",[]);this.canvas=document.getElementById("drawingCanvas"),this.ctx=this.canvas.getContext("2d",{willReadFrequently:!0}),this.undoButton=document.getElementById("undo"),this.redoButton=document.getElementById("redo"),this.saveButton=document.getElementById("save"),this.sizeInput=document.querySelector(".brush-size"),this.toolButtons=document.querySelectorAll(".tool-btn"),this.colorButtons=document.querySelectorAll(".color-btn"),this.colorSelector=document.querySelector("#color-selector"),this.cursor=this.createCursor(),this.offscreenCanvas=document.createElement("canvas"),this.offscreenCtx=this.offscreenCanvas.getContext("2d",{willReadFrequently:!0}),this.init()}init(){this.setupUI(),this.setupCanvas(),this.attachEventListeners(),this.initializeProcessedGrid()}initializeProcessedGrid(){const t=this.canvas.width,e=this.canvas.height;for(let s=0;s<t;s++){this.processedGrid[s]=[];for(let i=0;i<e;i++)this.processedGrid[s][i]=!1}}setupUI(){this.undoButton.innerHTML=p,this.redoButton.innerHTML=g}setupCanvas(){const t=new Image;t.src="1.png",t.onload=()=>{this.canvas.width=t.width,this.canvas.height=t.height,this.offscreenCanvas.width=t.width,this.offscreenCanvas.height=t.height,this.ctx.drawImage(t,0,0,t.width,t.height),this.saveState()},this.canvas.style.cursor="none"}createCursor(){const t=document.createElement("div");return t.style.position="absolute",t.style.borderRadius="50%",t.style.pointerEvents="none",t.style.zIndex="1000",t.style.border="2px solid rgba(255, 255, 255, 0.5)",t.style.display="none",document.body.appendChild(t),t}attachEventListeners(){this.canvas.addEventListener("mouseenter",()=>{this.cursor.style.display="block"}),this.canvas.addEventListener("mouseleave",()=>{this.cursor.style.display="none"}),this.canvas.addEventListener("mousemove",t=>this.updateCursor(t)),this.sizeInput.addEventListener("input",()=>this.updateBrushSize()),this.canvas.addEventListener("mousedown",t=>this.startDrawing(t)),this.canvas.addEventListener("mouseup",()=>this.stopDrawing()),this.canvas.addEventListener("mousemove",t=>this.draw(t)),this.canvas.addEventListener("mouseleave",()=>this.stopDrawing()),this.toolButtons.forEach(t=>{t.addEventListener("click",()=>this.selectTool(t))}),this.colorButtons.forEach(t=>{t.addEventListener("click",()=>this.selectColor(t))}),this.undoButton.addEventListener("click",()=>this.undo()),this.redoButton.addEventListener("click",()=>this.redo()),this.saveButton.addEventListener("click",()=>this.saveCanvas())}updateCursor(t){const e=t.clientX-this.size/2,s=t.clientY-this.size/2;this.cursor.style.left=`${e}px`,this.cursor.style.top=`${s}px`,this.cursor.style.width=`${this.size}px`,this.cursor.style.height=`${this.size}px`}updateBrushSize(){this.size=Number(this.sizeInput.value)}startDrawing(t){this.drawing=!0,this.points=[],this.addPoint(t.clientX-this.canvas.offsetLeft,t.clientY-this.canvas.offsetTop),this.ctx.beginPath(),this.ctx.moveTo(t.clientX-this.canvas.offsetLeft,t.clientY-this.canvas.offsetTop)}stopDrawing(){this.drawing&&(this.drawing=!1,this.ctx.closePath(),this.saveState())}draw(t){if(!this.drawing)return;const e=t.clientX-this.canvas.offsetLeft,s=t.clientY-this.canvas.offsetTop;this.ctx.lineWidth=this.size,this.ctx.lineCap="round",this.currentTool==="brush"?(this.ctx.strokeStyle=this.color,this.ctx.lineTo(e,s),this.ctx.stroke(),this.ctx.moveTo(e,s)):this.currentTool==="blur"&&(this.addPoint(e,s),this.applyRealtimeBlur())}addPoint(t,e){const s=this.points[this.points.length-1];s&&this.getDistance(s,{x:t,y:e})>5&&this.interpolatePoints(s,{x:t,y:e}),this.points.push({x:t,y:e})}interpolatePoints(t,e){const s=this.getDistance(t,e),i=5;for(let o=0;o<s;o+=i){const r=t.x+(e.x-t.x)*(o/s),a=t.y+(e.y-t.y)*(o/s);this.points.push({x:r,y:a})}}getDistance(t,e){return Math.sqrt(Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2))}applyRealtimeBlur(){this.offscreenCtx.clearRect(0,0,this.offscreenCanvas.width,this.offscreenCanvas.height),this.offscreenCtx.drawImage(this.canvas,0,0),this.points.forEach(t=>{const e=Math.floor(this.size/2),s=e*2;if(this.isAlreadyProcessed(t.x,t.y))return;const i=this.offscreenCtx.getImageData(t.x-e,t.y-e,s,s);for(let o=0;o<10;o++)this.applyGaussianBlur(i);this.offscreenCtx.putImageData(i,t.x-e,t.y-e),this.markAsProcessed(t.x,t.y)}),this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.ctx.drawImage(this.offscreenCanvas,0,0)}isAlreadyProcessed(t,e){const s=Math.floor(t/5),i=Math.floor(e/5);return this.processedGrid[s]&&this.processedGrid[s][i]}markAsProcessed(t,e){const s=Math.floor(t/5),i=Math.floor(e/5);this.processedGrid[s]=this.processedGrid[s]||[],this.processedGrid[s][i]=!0}applyGaussianBlur(t){const e=t.data,s=t.width,i=t.height;for(let o=1;o<i-1;o++)for(let r=1;r<s-1;r++){const a=(o*s+r)*4,l=this.getNeighborPixels(e,s,i,r,o),h=this.averageColor(l);e[a]=h[0],e[a+1]=h[1],e[a+2]=h[2]}}getNeighborPixels(t,e,s,i,o){const r=[];for(let a=-1;a<=1;a++)for(let l=-1;l<=1;l++){const h=i+l,d=o+a;if(h>=0&&h<e&&d>=0&&d<s){const u=(d*e+h)*4;r.push([t[u],t[u+1],t[u+2]])}}return r}averageColor(t){const e=[0,0,0];t.forEach(i=>{e[0]+=i[0],e[1]+=i[1],e[2]+=i[2]});const s=t.length;return[e[0]/s,e[1]/s,e[2]/s]}selectTool(t){var e;this.toolButtons.forEach(s=>s.classList.remove("active")),t.classList.add("active"),this.currentTool=((e=t.textContent)==null?void 0:e.toLowerCase())||"brush",this.currentTool==="blur"?this.colorSelector.style.display="none":this.colorSelector.style.display="flex"}selectColor(t){this.colorButtons.forEach(e=>e.classList.remove("active")),t.classList.add("active"),this.color=window.getComputedStyle(t).backgroundColor}saveState(){this.redoStack=[],this.undoStack.push(this.canvas.toDataURL())}undo(){if(this.undoStack.length>0){this.redoStack.push(this.undoStack.pop());const t=this.undoStack[this.undoStack.length-1]||"1.png";this.loadCanvasFromUrl(t)}}redo(){if(this.redoStack.length>0){const t=this.redoStack.pop();this.undoStack.push(t),this.loadCanvasFromUrl(t)}}loadCanvasFromUrl(t){const e=new Image;e.src=t,e.onload=()=>{this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.ctx.drawImage(e,0,0)}}saveCanvas(){const t=document.createElement("a");t.download="canvas-image.png",t.href=this.canvas.toDataURL(),t.click()}}window.onload=()=>{new m};
