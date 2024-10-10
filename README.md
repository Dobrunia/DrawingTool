# Custom Drawing Canvas with Brush and Blur Tool

This project provides a simple, customizable drawing canvas with brush and blur tools. It includes a custom cursor that changes based on the selected tool, and an undo/redo functionality. The component can be easily integrated into any web project.

## Features

- **Brush Tool:** Allows the user to draw with a customizable brush size and color.
- **Blur Tool:** Allows the user to apply a blur effect to specific areas of the canvas.
- **Custom Cursor:** Displays a custom cursor that reflects the size and color of the selected brush.
- **Undo/Redo:** Undo or redo your drawing steps.
- **Save Drawing:** Export your drawing as a PNG image.
- **Dynamic Canvas Size:** Adjusts to the size of the background image.

## Getting Started

### Installation

1. Clone the repository or download the files:

   ```bash
   git clone https://github.com/Dobrunia/DrawingTool
   cd your-repository
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the browser and navigate to the specified local URL, typically `http://localhost:5173`.

### Usage

1. **Brush Tool:**

   - Select the "Brush" tool by clicking the corresponding button on the toolbar.
   - Change the brush color by selecting one of the available color buttons.
   - Adjust the brush size using the size slider.

2. **Blur Tool:**

   - Select the "Blur" tool by clicking the corresponding button.
   - Adjust the blur radius using the size slider (this controls the area affected by the blur).

3. **Custom Cursor:**

   - A custom cursor will appear on the canvas, reflecting the current brush size. This cursor is visible only within the canvas area.

4. **Undo/Redo:**

   - Use the undo and redo buttons to navigate through your drawing history. Each time you stop drawing, the current state is saved, allowing you to undo or redo actions as needed.

5. **Saving the Canvas:**
   - Click the "Save" button to export the current state of the canvas as a PNG file. The file will automatically download to your computer.

## Component Structure

- **`index.html`**: The main HTML file that contains the canvas and toolbar elements.
- **`main.ts`**: The main TypeScript file that handles all the drawing logic, including the brush and blur tools, undo/redo functionality, and custom cursor.
- **`style.css`**: Contains styles for the canvas, toolbar, and custom cursor.

## Customization

### Change Initial Brush Settings

To change the initial brush color, modify the `color` variable:

```typescript
let color = "#ffffff";
```

### Adding More Colors

If you want to add more color options for the brush, simply add more buttons in the HTML and style them accordingly in `style.css`. Then update the logic in `main.ts` to handle the new colors.

### Changing the Canvas Background

To change the default image loaded onto the canvas, update the image source in `main.ts`:

```typescript
const img = new Image();
img.src = "1.png";
```

## Dependencies

- **@codexteam/icons**: This package provides icons for the undo and redo buttons.

## License

Feel free to reach out if you have any questions or issues using this component!
