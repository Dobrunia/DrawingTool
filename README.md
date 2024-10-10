Custom Drawing Canvas with Brush and Blur Tool
This project provides a simple, customizable drawing canvas with brush and blur tools. It includes a custom cursor that changes based on the selected tool, and an undo/redo functionality. The component can be easily integrated into any web project.

Features
Brush Tool: Allows the user to draw with a customizable brush size and color.
Blur Tool: Allows the user to apply a blur effect to specific areas of the canvas.
Custom Cursor: Displays a custom cursor that reflects the size and color of the selected brush.
Undo/Redo: Undo or redo your drawing steps.
Save Drawing: Export your drawing as a PNG image.
Dynamic Canvas Size: Adjusts to the size of the background image.
Getting Started
Installation
Clone the repository or download the files:

bash
Копировать код
git clone https://github.com/your-repository.git
cd your-repository
Install the dependencies:

bash
Копировать код
npm install
Start the development server:

bash
Копировать код
npm run dev
Open the browser and navigate to the specified local URL, typically http://localhost:3000.

Usage
Brush Tool:

Select the "Brush" tool by clicking the corresponding button on the toolbar.
Change the brush color by selecting one of the available color buttons.
Adjust the brush size using the size slider.
Blur Tool:

Select the "Blur" tool by clicking the corresponding button.
Adjust the blur radius using the size slider (this controls the area affected by the blur).
Custom Cursor:

A custom cursor will appear on the canvas, reflecting the current brush size and color. This cursor is visible only within the canvas area.
Undo/Redo:

Use the undo and redo buttons to navigate through your drawing history. Each time you stop drawing, the current state is saved, allowing you to undo or redo actions as needed.
Saving the Canvas:

Click the "Save" button to export the current state of the canvas as a PNG file. The file will automatically download to your computer.
Component Structure
index.html: The main HTML file that contains the canvas and toolbar elements.
index.ts: The main TypeScript file that handles all the drawing logic, including the brush and blur tools, undo/redo functionality, and custom cursor.
style.css: Contains styles for the canvas, toolbar, and custom cursor.
Customization
Change Initial Brush Settings
To change the initial brush size, modify the size variable in the index.ts file:

typescript
Копировать код
let size = 20; // Change the initial size here
To change the initial brush color, modify the color variable:

typescript
Копировать код
let color = '#000000'; // Change the initial color here
Adding More Colors
If you want to add more color options for the brush, simply add more buttons in the HTML and style them accordingly in style.css. Then update the logic in index.ts to handle the new colors.

Changing the Canvas Background
To change the default image loaded onto the canvas, update the image source in index.ts:

typescript
Копировать код
const img = new Image();
img.src = 'your-image-path.png'; // Change to your image path
Dependencies
@codexteam/icons: This package provides icons for the undo and redo buttons.
Future Improvements
Add more tools (e.g., eraser, shapes, etc.).
Improve performance for large canvases and high brush sizes.
Add more customization options for brush shapes and patterns.
Contributing
Contributions are welcome! Please follow these steps to contribute:

Fork the repository.
Create a new feature branch (git checkout -b feature-name).
Commit your changes (git commit -am 'Add new feature').
Push to the branch (git push origin feature-name).
Open a pull request.