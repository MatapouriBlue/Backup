# Text Editor Integration Guide

## Overview
This standalone text editor provides a visual interface for positioning and formatting text elements on a webpage background. It generates CSS and HTML that can be integrated into any website project.

## Features
- **Visual Text Positioning**: Drag and drop text areas anywhere on the canvas
- **Text Selection**: Drag to select specific text portions for formatting
- **Formatting Tools**: Bold, italic, underline for selected text or entire areas
- **Precise Controls**: Number inputs for exact positioning (X, Y coordinates)
- **Size Control**: Width, height, and font size adjustments
- **Color Control**: Text color picker with transparency/opacity slider
- **Background Control**: Background color picker with transparency/opacity slider
- **Keyboard Shortcuts**: Ctrl+B/I/U for formatting, Ctrl+X/C/V for clipboard
- **Export Options**: Generate CSS and HTML for integration

## Quick Start

### 1. Standalone Usage
Open `standalone_text_editor.html` in any web browser to start using the editor immediately.

### 2. Integration into Existing Projects

#### Option A: Copy Core Components
```html
<!-- Add this CSS to your stylesheet -->
<style>
.text-area {
    position: absolute;
    cursor: move;
    min-width: 100px;
    min-height: 30px;
}

.text-content {
    pointer-events: all;
    background: transparent;
    color: #333;
    min-height: 30px;
    word-wrap: break-word;
    width: 100%;
    height: 100%;
    outline: none;
    user-select: text;
}

.text-content::selection {
    background: rgba(52, 152, 219, 0.3);
}
</style>

<!-- Add text areas to your HTML -->
<div class="text-area" style="left: 100px; top: 50px; width: 400px; height: 80px;">
    <div class="text-content" contenteditable="true">Your text here</div>
</div>
```

#### Option B: Use as Design Tool
1. Use the standalone editor to design your text layout
2. Click "Generate CSS" to get the positioning styles
3. Copy the generated CSS into your project
4. Use "Export HTML" to get the text structure

### 3. Flask Integration
To integrate into a Flask project like the original:

```python
# routes.py
@app.route('/text-editor')
def text_editor():
    return render_template('text_editor.html')
```

Copy the standalone HTML content into your Flask template and customize the styling to match your project theme.

## API Reference

### Core Functions
- `addTextArea()` - Creates a new text area with current settings
- `selectTextArea(element)` - Selects a text area for editing
- `generateCSS()` - Generates CSS for all text areas
- `exportHTML()` - Downloads HTML structure

### Formatting Functions
- `applyBoldToSelection()` - Applies bold to selected text
- `applyItalicToSelection()` - Applies italic to selected text
- `applyUnderlineToSelection()` - Applies underline to selected text
- `applyColorAndOpacity()` - Applies color and transparency settings
- `updateFontSize()` - Updates font size for selected text area

### Clipboard Functions
- `cutText()` - Cuts selected text or entire area
- `copyText()` - Copies selected text or entire area
- `pasteText()` - Pastes from internal clipboard

## Keyboard Shortcuts
- **Ctrl+B**: Bold
- **Ctrl+I**: Italic
- **Ctrl+U**: Underline
- **Ctrl+X**: Cut
- **Ctrl+C**: Copy
- **Ctrl+V**: Paste
- **Delete**: Clear text

## Customization

### Styling
Modify the CSS variables in the `<style>` section to match your project:
- Background gradient
- Text colors
- Button styles
- Selection highlighting

### Background
Change the `.website-display-area` background to match your target design:
```css
.website-display-area {
    background: url('your-background.jpg') center/cover;
    /* or */
    background: linear-gradient(135deg, #your-colors);
}
```

### Integration Tips
1. **Responsive Design**: Add media queries for mobile compatibility
2. **Theme Matching**: Customize colors and fonts to match your project
3. **Performance**: Remove unused features for production
4. **Accessibility**: Add ARIA labels and keyboard navigation

## Browser Support
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (some minor selection differences)
- IE11: Limited support (basic functionality only)

## License
This text editor is part of the Matapouri Blue project and can be freely used and modified for any website project.