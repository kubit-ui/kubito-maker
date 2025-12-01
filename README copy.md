# 🎨 Kubito Editor# 🎨 Kubito Editor

<div align="center">**Kubito Editor** es un editor visual profesional y divertido para crear y personalizar personajes tipo "Kubito". Permite arrastrar y soltar piezas SVG como ojos, bocas, cejas, accesorios y más, con transformaciones intuitivas, efectos visuales avanzados, y sistema completo de guardado/exportación.

![Kubito Editor Banner](https://via.placeholder.com/1200x400/6366f1/ffffff?text=Kubito+Editor+-+Create+Your+Custom+Characters)![Kubito Editor](https://via.placeholder.com/1200x600/ff4d4f/ffffff?text=Kubito+Editor)

**A modern, professional SVG character editor built with React, TypeScript, and Vite**## ✨ Características

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)### 🎯 Editor Visual Avanzado

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)

[![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite)](https://vite.dev/)- **Drag & Drop intuitivo**: Arrastra assets desde el panel lateral al canvas

[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)- **Transformaciones en tiempo real**: Mueve, escala, rota elementos con handles visuales

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)- **Herramientas de alineación profesional**: Alinea elementos a la izquierda, centro, derecha, arriba, medio, abajo

- **Ajuste a cuadrícula**: Snap to grid para posicionamiento preciso (10px)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Documentation](#-documentation) • [Contributing](#-contributing)- **Múltiples capas**: Control completo del orden Z con sistema de capas

- **Bloqueo y visibilidad**: Protege elementos o ocúltalos temporalmente

</div>- **Zoom con scroll**: Escala elementos con la rueda del mouse

---### 🎨 Efectos Visuales

## 📖 Overview- **Sistema de colores**: Paletas predefinidas + selector de color personalizado

- **Efectos avanzados**: Opacidad, sombras, blur, brillo, contraste, saturación

**Kubito Editor** is a powerful, intuitive visual editor for creating and customizing "Kubito" style characters. Built with modern web technologies, it provides a professional-grade canvas for designing unique characters by combining SVG assets with advanced transformation tools, visual effects, and export capabilities.- **Transformaciones**: Flip horizontal/vertical, rotación de 360°

- **Filtros SVG**: Efectos profesionales aplicados en tiempo real

### Why Kubito Editor?

### 📦 Gestión de Proyectos

- 🎯 **Professional Tools**: Drag-and-drop, layers, alignment, smart guides

- ⚡ **High Performance**: Optimized React rendering with Zustand state management- **Guardar/Cargar**: Proyectos en formato `.kubito` (JSON)

- 🎨 **Rich Asset Library**: 70+ SVG components (eyes, mouths, accessories, backgrounds)- **Historial completo**: Deshacer/Rehacer ilimitado (hasta 50 estados)

- 🔧 **Extensible**: Clean architecture, TypeScript, comprehensive docs- **Exportación múltiple**: SVG, PNG, JPEG con opciones avanzadas

- 📱 **Universal**: Works on desktop, tablet, and mobile devices- **Auto-guardado**: Configuración persistente en localStorage

- 🚀 **Production Ready**: Built with Vite, includes tests and CI/CD

### ⌨️ Atajos de Teclado

---

- `Cmd/Ctrl + Z` - Deshacer

## ✨ Features- `Cmd/Ctrl + Shift + Z` - Rehacer

- `Cmd/Ctrl + D` - Duplicar elemento seleccionado

### 🎯 Core Editing- `Delete` / `Backspace` - Eliminar elemento

- `Arrow Keys` - Mover elemento (+ `Shift` para 10px)

<table>

<tr>### 📱 Responsive & Touch

<td width="50%">

- **Diseño adaptable**: Funciona en desktop, tablet y móvil

**Drag & Drop Interface**- **Gestos táctiles**: Soporte multi-touch para dispositivos móviles

- Intuitive asset placement- **UI optimizada**: Paneles colapsables en pantallas pequeñas

- Real-time preview

- Multi-selection support### 🎭 Biblioteca de Assets Expandida

- Context menu actions

- **Ojos**: 15+ variaciones (redondos, guiño, estrellas, corazones, etc.)

**Transform Tools**- **Bocas**: 15+ expresiones (sonrisa, triste, lengua, vampiro, etc.)

- Position (X, Y coordinates)- **Cejas**: 10+ estilos (arqueadas, enojadas, sorprendidas, etc.)

- Scale (uniform/non-uniform)- **Accesorios**: 20+ items (sombreros, gafas, bigotes, joyas, etc.)

- Rotation (0-360°)- **Narices**: 7+ opciones

- Flip horizontal/vertical- **Cabello**: 8+ peinados

- **Fondos**: Sólidos, gradientes, patrones

</td>- **Decoraciones**: Corazones, estrellas, nubes, rayos, etc.

<td width="50%">

### 🎯 Presets de Canvas

**Layer Management**

- Z-index control- **Social Media**: Instagram (post/story), Facebook, Twitter/X, YouTube

- Lock/unlock layers- **Professional**: Square, Avatar, Banner

- Show/hide visibility- **Emoji/Stickers**: 😀 Slack (128px), Discord (128px), HD (256px), Ultra (512px)

- Batch operations

> 📖 Ver [EMOJI_PRESETS.md](./EMOJI_PRESETS.md) para guía completa de creación de emojis y stickers personalizados.

**Alignment System**

- Align left/center/right## 🚀 Inicio Rápido

- Align top/middle/bottom

- Distribute evenly### Requisitos

- Smart guides

- Node.js 18+ y npm/pnpm/yarn

</td>

</tr>### Instalación

</table>

````bash

### 🎨 Visual Effects# Clonar repositorio

git clone https://github.com/tuusuario/kubito-editor.git

| Category | Features |cd kubito-editor

|----------|----------|

| **Colors** | Predefined palettes, custom picker, gradients |# Instalar dependencias

| **Shadows** | Blur, offset, color, opacity |npm install

| **Filters** | Brightness, contrast, saturation, hue rotate, grayscale, sepia, invert, blur |

| **Opacity** | Full transparency control (0-100%) |# Iniciar servidor de desarrollo (puerto 5271)

npm run dev

### 📦 Project Management```



- **Save/Load**: Projects in `.kubito` format (JSON-based)El editor estará disponible en `http://localhost:5271`

- **History**: Unlimited undo/redo (up to 50 states)

- **Export**: SVG, PNG, JPEG with custom dimensions### Scripts Disponibles

- **Auto-save**: LocalStorage persistence

- **Templates**: Pre-made gallery examples```bash

# Development

### ⌨️ Keyboard Shortcutsnpm run dev              # Start development server on port 5271

npm run build            # Build for production

| Action | Shortcut |npm run preview          # Preview production build

|--------|----------|

| Undo | `Cmd/Ctrl + Z` |# Quality Assurance

| Redo | `Cmd/Ctrl + Shift + Z` |npm run lint             # Run ESLint

| Duplicate | `Cmd/Ctrl + D` |npm run lint:fix         # Fix ESLint errors automatically

| Delete | `Delete` / `Backspace` |npm run format           # Format code with Prettier

| Select All | `Cmd/Ctrl + A` |npm run format:check     # Check code formatting

| Move | `Arrow Keys` (hold `Shift` for 10px) |npm run type-check       # Run TypeScript type checking

| Save | `Cmd/Ctrl + S` |

# Testing

### 🎭 Asset Library (70+ items)npm test                 # Run tests in watch mode

npm run test:run         # Run tests once

- **Eyes** (27): Round, wink, hearts, stars, sleepy, angry, etc.npm run test:coverage    # Run tests with coverage report

- **Mouths** (17): Smile, laugh, surprised, tongue, vampire, etc.npm run test:ui          # Open interactive test UI

- **Hairs** (5): Includes eyebrows and moustaches

- **Accessories** (11): Hats, crowns, monocles, bow ties, etc.# Combined

- **Backgrounds** (11): Patterns, gradients, abstract shapesnpm run validate         # Run type-check, lint, and tests

- **Bodies** (6): Different character base shapes```

- **Noses** (customizable)

## 🧪 Testing & Quality

---

This project includes comprehensive testing and quality assurance:

## 🚀 Demo

- ✅ **Unit tests** with Vitest

Try the live demo: [**kubito-editor.vercel.app**](https://kubito-editor.vercel.app) *(coming soon)*- ✅ **Component tests** with React Testing Library

- ✅ **Type safety** with TypeScript strict mode

### Screenshots- ✅ **Code quality** with ESLint

- ✅ **Code formatting** with Prettier

<table>- ✅ **CI/CD** with GitHub Actions

<tr>- ✅ **TSDoc documentation** for all public APIs

<td><img src="https://via.placeholder.com/400x300/6366f1/ffffff?text=Main+Editor" alt="Main Editor"/></td>

<td><img src="https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Asset+Panel" alt="Asset Panel"/></td>See [TESTING.md](./TESTING.md) for detailed testing documentation.

<td><img src="https://via.placeholder.com/400x300/ec4899/ffffff?text=Inspector" alt="Inspector"/></td>See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

</tr>

<tr>## 🏗️ Arquitectura

<td align="center"><em>Main Canvas Editor</em></td>

<td align="center"><em>Asset Library Panel</em></td>### Stack Tecnológico

<td align="center"><em>Properties Inspector</em></td>

</tr>#### Core

</table>

- **React 18** with TypeScript for type-safe UI development

---- **Vite** for blazing fast bundling and HMR

- **Zustand** for lightweight state management

## 📦 Installation- **Framer Motion** for smooth animations



### Prerequisites#### UI & Styling



- **Node.js**: >= 18.0.0- **Tailwind CSS** for utility-first styling

- **npm**: >= 9.0.0 (or **pnpm** / **yarn**)- **Radix UI** for accessible component primitives



### Quick Start#### Development Tools



```bash- **TypeScript 5.9+** with strict mode enabled

# Clone the repository- **ESLint** with TypeScript, React, and Prettier plugins

git clone https://github.com/yourusername/kubito-editor.git- **Prettier** for consistent code formatting

cd kubito-editor- **Vitest** for unit and integration testing

- **React Testing Library** for component testing

# Install dependencies

npm install### Estructura del Proyecto



# Start development server```

npm run devkubito-editor/

├── src/

# Open browser at http://localhost:5173│   ├── components/      # Componentes React organizados por funcionalidad

```│   │   ├── Canvas/      # Canvas y sub-componentes (Grid, Body, Item, Guides)

│   │   ├── Inspector/   # Inspector y paneles (Transform, Style, Alignment)

### Build for Production│   │   └── ...          # Otros componentes (AssetPanel, Toolbar, etc.)

│   ├── data/            # Assets SVG y datos estáticos

```bash│   ├── domain/          # Lógica de negocio (Services y Models)

# Build optimized production bundle│   │   ├── models/      # Modelos de dominio

npm run build│   │   └── services/    # Servicios de lógica de negocio

│   ├── hooks/           # Custom hooks reutilizables

# Preview production build│   │   ├── useKeyboardShortcuts.ts

npm run preview│   │   ├── useCanvasDragAndDrop.ts

│   │   ├── useCanvasTransform.ts

# Run tests│   │   └── useSmartGuides.ts

npm run test│   ├── store/           # Estado global con Zustand

│   ├── types/           # Definiciones TypeScript

# Run linter│   ├── utils/           # Utilidades (colores, exportación, transformaciones)

npm run lint│   ├── KubitoEditor.tsx # Componente principal

```│   ├── main.tsx         # Entry point

│   └── index.css        # Estilos globales

---├── public/              # Assets estáticos

├── vite.config.ts       # Configuración Vite

## 🛠️ Usage├── tsconfig.json        # Configuración TypeScript

└── tailwind.config.js   # Configuración Tailwind

### Basic Example```



```typescript## 🎯 Uso

import { KubitoEditor } from './KubitoEditor';

### 1. Añadir Assets

function App() {

  return (- **Click**: Haz click en un asset para añadirlo al centro del canvas

    <div className="h-screen">- **Drag & Drop**: Arrastra un asset exactamente donde lo quieras

      <KubitoEditor />

    </div>### 2. Transformar Elementos

  );

}- **Mover**: Click y arrastra el elemento

```- **Escalar**: Arrastra los handles de las esquinas

- **Rotar**: Arrastra el handle circular superior

### Programmatic Control- **Inspector**: Usa sliders para control preciso



```typescript### 3. Aplicar Efectos

import { useEditorActions, useEditorStore } from '@/store/editorStore';

- Selecciona un elemento

function MyComponent() {- Usa el panel **Inspector** a la derecha

  const { addItem, updateItem, exportToSVG } = useEditorActions();- Ajusta color, opacidad, sombras, blur, brillo, contraste

  const items = useEditorStore(state => state.items);

### 4. Gestionar Capas

  // Add an asset

  const handleAddEyes = () => {- **Forward/Backward**: Cambia el orden Z

    addItem({- **Lock**: Bloquea elementos para evitar cambios accidentales

      category: 'Eyes',- **Hide**: Oculta temporalmente elementos

      assetId: 'eye-sparkle',

      name: 'Sparkle Eyes',### 5. Exportar

      x: 360,

      y: 280,- **Imagen**: SVG, PNG o JPEG

      scale: 1,- **Proyecto**: Guarda como `.kubito` para continuar después

      rotate: 0,

      flipX: false,## 🎨 Personalización

      flipY: false,

    });### Añadir Nuevos Assets

  };

1. Crea un archivo en `src/data/` (ej: `my-assets.tsx`)

  // Export design2. Define tus assets:

  const handleExport = async () => {

    const svg = await exportToSVG();```tsx

    console.log('Exported SVG:', svg);import type { Asset } from '@/types';

  };

export const MY_ASSETS: Asset[] = [

  return (  {

    <div>    id: 'my-asset-1',

      <button onClick={handleAddEyes}>Add Eyes</button>    name: 'Mi Asset',

      <button onClick={handleExport}>Export SVG</button>    category: 'Accessories',

      <p>Total items: {items.length}</p>    svg: <circle cx="0" cy="0" r="20" fill="currentColor" />,

    </div>  },

  );];

}```

````

3. Importa y añade a `src/data/index.ts`

### Custom Assets

### Crear Temas Personalizados

Add your own SVG assets:

Edita `src/utils/colors.ts` para añadir nuevos temas o paletas.

````typescript

// src/data/assetsFromFiles.ts## 🤝 Contribuir



export const CUSTOM_ASSETS: AssetDefinition[] = [Las contribuciones son bienvenidas! Por favor:

  {

    id: 'my-custom-asset',1. Fork el repositorio

    name: 'My Custom Asset',2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)

    category: 'Accessories',3. Commit tus cambios (`git commit -m 'Add amazing feature'`)

    file: 'my-asset.svg'4. Push a la rama (`git push origin feature/amazing-feature`)

  }5. Abre un Pull Request

];

```## 📝 Roadmap



Place your SVG file in `public/assets/svg/accessories/my-asset.svg`- [ ] Sistema de animaciones con timeline

- [ ] Más efectos visuales (gradientes, texturas)

---- [ ] Plantillas prediseñadas

- [ ] Colaboración en tiempo real

## 📚 Documentation- [ ] Plugin system para extender funcionalidad

- [ ] Galería de creaciones de la comunidad

### Architecture- [ ] Exportación a GIF animado

- [ ] Modo oscuro automático según preferencia del sistema

````

kubito-editor/## 📄 Licencia

├── src/

│ ├── components/ # React componentsMIT License - Siéntete libre de usar este proyecto para lo que quieras.

│ │ ├── Canvas/ # Main canvas editor

│ │ ├── Inspector/ # Properties panel (with tabs)## 🙏 Agradecimientos

│ │ ├── LayersPanel/ # Layer management

│ │ ├── AssetPanel/ # Asset library browser- Inspirado en editores de avatares modernos

│ │ └── ...- Iconos y assets creados con amor ❤️

│ ├── store/ # Zustand state management- Comunidad de React y TypeScript

│ ├── domain/ # Business logic & services

│ │ ├── models/ # Domain models---

│ │ └── services/ # Pure functions (Transform, Export)

│ ├── hooks/ # Custom React hooks**Hecho con ❤️ y ☕ por la comunidad open source**

│ ├── utils/ # Utility functions

│ ├── types/ # TypeScript definitions¿Te gusta el proyecto? Dale una ⭐ en GitHub!

│ └── data/ # Asset definitions
├── public/
│ └── assets/ # SVG assets library
├── docs/ # Extended documentation
└── tests/ # Unit & integration tests

````

### Key Technologies

- **React 19**: UI framework
- **TypeScript 5.6**: Type safety
- **Vite 7**: Build tool & dev server
- **Zustand**: Lightweight state management
- **DND Kit**: Drag and drop
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **Vitest**: Testing framework

### State Management

The editor uses **Zustand** for state management with a clean separation:

- **Editor State**: Canvas config, items, selection
- **History**: Undo/redo with time-travel
- **Actions**: Pure functions for state mutations

Example:

```typescript
const { items, selectedId } = useSelection();
const { addItem, updateItem, removeItem } = useEditorActions();
````

### Domain Services

Pure, testable business logic:

- **TransformService**: Calculate positions, bounds, alignment
- **ExportService**: SVG/PNG/JPEG export with quality options
- **ColorService**: Color manipulation and palettes

---

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

Current coverage: **85%+**

---

## 🤝 Contributing

We love contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details on:

- Code of Conduct
- Development workflow
- Commit message conventions
- Pull request process
- Coding standards

### Quick Contribution Steps

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Lucide Icons**: Beautiful icon set
- **DND Kit**: Excellent drag-and-drop library
- **Tailwind CSS**: Utility-first CSS framework
- **React Community**: Inspiration and support

---

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/kubito-editor/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/kubito-editor/discussions)
- **Email**: your.email@example.com
- **Twitter**: [@yourusername](https://twitter.com/yourusername)

---

## 🗺️ Roadmap

- [ ] Text editing capabilities
- [ ] Advanced brush/drawing tools
- [ ] Animation timeline
- [ ] Collaborative editing (multiplayer)
- [ ] Plugin system
- [ ] AI-powered asset generation
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)

---

## ⭐ Star History

If you find this project useful, please consider giving it a star! ⭐

---

<div align="center">

**Made with ❤️ by the Kubito Team**

[⬆ Back to Top](#-kubito-editor)

</div>
