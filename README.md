<div align="center">
  
# 🎨 Kubito Maker

**A powerful and intuitive web-based avatar editor for creating unique Kubito characters**

[Demo](#) • [Features](#-features) • [Getting Started](#-getting-started) • [Documentation](#-documentation) • [Contributing](CONTRIBUTING.md)

<!-- Add your screenshot/demo image here -->

![Kubito Maker Screenshot](assets/1.png)

</div>

---

## ✨ Features

### 🎭 Character Customization

- **Rich Asset Library**: Choose from a vast collection of customizable components
  - Eyes, eyebrows, noses, mouths
  - Hairstyles and facial hair
  - Accessories and decorations
  - Multiple body styles
  - Background options
- **Drag & Drop Interface**: Intuitive asset placement with visual feedback
- **Layer Management**: Full control over element stacking and organization
- **Multi-Selection**: Select and manipulate multiple elements simultaneously

### 🎨 Advanced Editing Tools

<!-- Add your editing tools screenshot here -->

- **Color Customization**: Apply custom colors to any asset with an advanced color picker
- **Gradient Editor**: Create stunning gradients with multiple color stops
- **Filters & Effects**: Apply professional filters including:
  - Blur effects
  - Brightness and contrast adjustments
  - Saturation and hue controls
  - Drop shadows
  - And more...
- **Transform Tools**: Precise control over position, rotation, and scale
- **Text Editor**: Add custom text with full typography controls
- **Brush Tool**: Freehand drawing capabilities for custom touches

### 🖼️ Canvas & Workspace

<!-- Add your canvas screenshot here -->

- **Smart Guides**: Automatic alignment guides for precise positioning
- **Ruler & Grid System**: Professional measurement tools with customizable units
- **Zoom Controls**: Smooth zoom from 10% to 400% for detailed work
- **Canvas Presets**: Quick access to common canvas sizes (Square, Portrait, Landscape, etc.)
- **Custom Canvas Sizes**: Define your own canvas dimensions
- **User Guides**: Create custom alignment guides for consistent layouts

### 🎯 Professional Features

- **Undo/Redo System**: Full history management with keyboard shortcuts
- **Keyboard Shortcuts**: Efficient workflow with comprehensive hotkeys
- **Lock & Hide Layers**: Protect and organize your work
- **Mask System**: Apply masks for advanced editing
- **Context Menu**: Quick access to common actions via right-click
- **Inspector Panel**: Detailed property editing for selected elements

### 💾 Import & Export

<!-- Add your export options screenshot here -->

![Export Options](assets/export.png)

- **Multiple Export Formats**:
  - PNG (with transparency support)
  - JPG
  - SVG (vector format)
  - WebP
- **Quality Settings**: Control export quality and file size
- **Project Files (.kubito)**: Complete workspace preservation
  - **Full State Saving**: Saves all canvas elements, brush strokes, canvas configuration, and selected body model
  - **Perfect Restoration**: Load projects exactly as they were saved, including:
    - All canvas items with their positions, colors, and effects
    - Brush strokes and drawings
    - Canvas size and background settings
    - Selected body model (body1, body2, body3, etc.)
    - Layer order and visibility states
  - **Cross-Platform**: Works with both local files and online gallery
- **Online Gallery System**:
  - Share your creations with the community
  - Browse and load designs from other users
  - Like and download community Kubitos
  - All shared projects preserve complete state
- **Local Gallery**: Browse and load pre-made example projects

### 🚀 Performance & UX

- **Responsive Design**: Works seamlessly on desktop and tablet devices
- **Real-time Preview**: Instant visual feedback for all changes
- **Local Storage**: Auto-save functionality to preserve your work
- **Toast Notifications**: Clear feedback for user actions
- **Tips & Tricks Modal**: Built-in help system for new users

---

## 🛠️ Technology Stack

Built with modern web technologies for optimal performance:

- **React 19** - UI framework with latest features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Zustand** - Lightweight state management
- **TailwindCSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Radix UI** - Accessible component primitives
- **DND Kit** - Drag and drop functionality
- **Vitest** - Fast unit testing

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A modern web browser (Chrome, Firefox, Safari, or Edge)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/kubito-maker.git
   cd kubito-maker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**

   Navigate to `http://localhost:5271`

### Building for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` directory.

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

---

## 📖 Documentation

### Project Structure

```
kubito-maker/
├── src/
│   ├── components/        # React components
│   │   ├── Canvas/       # Canvas and rendering
│   │   ├── Toolbar/      # Top toolbar
│   │   ├── Inspector/    # Properties panel
│   │   ├── LayersPanel/  # Layer management
│   │   └── ...           # Other UI components
│   ├── store/            # Zustand state management
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript types
│   ├── domain/           # Business logic
│   └── data/             # Asset data and presets
├── public/
│   ├── assets/           # SVG assets library
│   └── kubito-gallery/   # Example projects
└── tests/                # Test files
```

### Key Concepts

#### Assets

Assets are the building blocks of your Kubito character. They're organized into categories:

- **Bodies**: The base character shape
- **Eyes, Eyebrows, Noses, Mouths**: Facial features
- **Hairs, Moustache**: Hairstyles and facial hair
- **Accessories, Decorations**: Additional elements
- **Backgrounds**: Scene backgrounds

#### Items

When you place an asset on the canvas, it becomes an "item" with properties:

- Position (x, y)
- Rotation and scale
- Color and filters
- Layer order (z-index)
- Lock and visibility states

#### Project Files (.kubito)

Kubito Maker uses a JSON-based format to save complete project states. Each `.kubito` file contains:

```json
{
  "version": "1.0.0",
  "name": "my-kubito-project",
  "items": [...],           // All canvas elements
  "brushStrokes": [...],    // Freehand drawings
  "config": {               // Canvas configuration
    "canvasWidth": 720,
    "canvasHeight": 720,
    "canvasBackground": "#ffffff",
    "gridSize": 20,
    "snapToGrid": false,
    // ... more settings
  },
  "selectedBodyId": "body2", // Active body model
  "createdAt": 1701648000000,
  "updatedAt": 1701648000000
}
```

**Why is this important?**
- **Complete Preservation**: Every aspect of your design is saved
- **Cross-Session Work**: Continue editing exactly where you left off
- **Sharing**: Share full editable projects with others
- **Version Control**: Track changes over time with git-friendly JSON format
- **Portability**: Works across different devices and browsers

#### Layers

The Layers Panel shows all items on your canvas in a hierarchical view, allowing you to:

- Reorder elements
- Lock/unlock items
- Show/hide items
- Select multiple items
- Rename items

### Keyboard Shortcuts

<!-- Add your keyboard shortcuts image here -->

| Action      | Shortcut                |
| ----------- | ----------------------- |
| Undo        | `Cmd/Ctrl + Z`          |
| Redo        | `Cmd/Ctrl + Shift + Z`  |
| Copy        | `Cmd/Ctrl + C`          |
| Paste       | `Cmd/Ctrl + V`          |
| Duplicate   | `Cmd/Ctrl + D`          |
| Delete      | `Delete` or `Backspace` |
| Select All  | `Cmd/Ctrl + A`          |
| Move (1px)  | `Arrow Keys`            |
| Move (10px) | `Shift + Arrow Keys`    |

---

## 🎨 Usage Examples

### Creating Your First Kubito

1. **Select a Body**: Click on a body style from the Body Selector
2. **Add Features**: Drag and drop eyes, nose, mouth from the Asset Panel
3. **Customize Colors**: Select any element and use the color picker in the Inspector
4. **Add Hair**: Choose a hairstyle and position it
5. **Apply Effects**: Use filters to add depth and style
6. **Export**: Click the export button and choose your format

### Saving and Loading Projects

#### Saving Your Work Locally

1. **Click the Export Menu**: Located in the top toolbar
2. **Select "Save Project (.kubito)"**: Downloads a complete project file
3. **Choose a Location**: Save the `.kubito` file to your computer

**What Gets Saved:**
- ✅ All canvas items (bodies, eyes, accessories, etc.)
- ✅ Brush strokes and custom drawings
- ✅ Canvas size and background color
- ✅ Selected body model
- ✅ Layer order and visibility
- ✅ All colors, filters, and effects

#### Loading a Saved Project

1. **Click the File Menu**: In the top toolbar
2. **Select "Load Project"**: Opens file picker
3. **Choose Your .kubito File**: Select the project to load
4. **Everything Restores**: All settings and elements are restored exactly

#### Sharing to Online Gallery

1. **Click "Share" Button**: Located in the top-right toolbar
2. **Fill in Details**:
   - Author name (required)
   - Email (optional)
   - Title (required)
   - Description (optional)
3. **Click "Share to Gallery"**: Uploads your Kubito to the community
4. **Share Complete State**: Everything is preserved for others to view and load

#### Loading from Online Gallery

1. **Click "Gallery" Button**: Opens community gallery modal
2. **Browse Creations**: View designs from other users
3. **Click on a Kubito**: Opens detail view
4. **Choose Action**:
   - **Load**: Imports the complete editable project into your workspace
   - **Download .kubito**: Saves the project file to your computer
5. **Full Restoration**: The loaded project includes all settings, brush strokes, and the exact body model used

### Advanced Techniques

#### Using Masks

<!-- Add mask example image here -->

Masks allow you to clip elements to specific shapes:

1. Select an item
2. Click "Add Mask" in the Inspector
3. Choose a mask shape
4. Adjust mask properties

#### Creating Gradients

<!-- Add gradient example image here -->

1. Select an element
2. Open the Gradient Editor from the Inspector
3. Add color stops
4. Adjust angle and positions
5. Apply to your element

#### Using Smart Guides

Smart Guides automatically appear when dragging items, showing:

- Alignment with other elements
- Equal spacing between elements
- Center alignment with the canvas
- Snap-to-guide functionality

#### Using the Brush Tool

The Brush Tool allows you to draw freehand on your Kubito:

1. **Enable Brush Mode**: Click the brush icon in the toolbar
2. **Adjust Brush Settings**:
   - **Size**: Control brush thickness (1-50px)
   - **Color**: Choose from color picker or use hex values
   - **Opacity**: Set transparency (0-100%)
3. **Draw on Canvas**: Click and drag to create strokes
4. **Brush Strokes Features**:
   - Fully preserved in `.kubito` files
   - Can be moved, scaled, and rotated
   - Individual visibility and lock controls
   - Included when sharing to gallery
5. **Disable Brush Mode**: Click the brush icon again or press `Esc`

**Tips:**
- Brush strokes are saved as separate layers
- Use lower opacity for subtle effects
- Combine with other elements for unique designs
- All brush work is preserved when saving/sharing projects

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- Setting up your development environment
- Code style and standards
- Submitting pull requests
- Reporting bugs
- Suggesting features

### Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run type-check   # Check TypeScript types
npm test             # Run tests
npm run validate     # Run all checks (type, lint, test)
```

---

## 📝 License

This project is licensed under the APACHE 2.0 License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Asset library contributors
- Open source community
- All contributors and users

---

## 📞 Support

- 🐛 [Report a Bug](https://github.com/yourusername/kubito-maker/issues)
- 💡 [Request a Feature](https://github.com/yourusername/kubito-maker/issues)
- 💬 [Discussions](https://github.com/yourusername/kubito-maker/discussions)

---

<div align="center">

Made with ❤️ by the Kubit Team

⭐ Star us on GitHub — it motivates us a lot!

</div>
