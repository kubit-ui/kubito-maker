# UnifiedSidebar Component

## 📋 Descripción

El `UnifiedSidebar` es un componente que fusiona todos los paneles laterales de herramientas (Assets, Layers, Inspector) en un único sidebar ubicado en el lado izquierdo de la interfaz.

## ✨ Características

### 🎯 Organización con Pestañas

- **Assets**: Panel de recursos y elementos para agregar al canvas
- **Layers**: Gestión de capas y orden de elementos
- **Inspector**: Propiedades y transformaciones de elementos seleccionados

### 🎨 Interfaz Intuitiva

- **Barra de pestañas vertical** con iconos visuales
- **Transiciones suaves** entre pestañas usando Framer Motion
- **Botón de colapsar/expandir** para maximizar el espacio del canvas
- **Diseño responsive** y adaptado a modo oscuro

### 🔄 Estados

- **Pestaña activa**: Indicada con color azul y sombra
- **Colapsado**: Muestra solo la barra de pestañas
- **Expandido**: Muestra la pestaña activa con todo su contenido

## 🎮 Uso

```tsx
import { UnifiedSidebar } from './components/UnifiedSidebar';

function App() {
  return (
    <div className="flex">
      <UnifiedSidebar />
      <Canvas />
    </div>
  );
}
```

## 🏗️ Estructura

```
UnifiedSidebar/
├── UnifiedSidebar.tsx    # Componente principal
├── index.ts              # Barrel export
└── __tests__/
    └── UnifiedSidebar.test.tsx
```

## 🎨 Iconos de Pestañas

- 🎨 **Assets** - Paleta de recursos
- 📑 **Layers** - Capas y orden
- ⚙️ **Inspector** - Propiedades

## 🚀 Ventajas

1. **Más espacio para el canvas**: El área de edición ocupa todo el espacio central y derecho
2. **Navegación centralizada**: Todas las herramientas en un solo lugar
3. **Reducción de clutter**: Interface más limpia y organizada
4. **Flujo de trabajo mejorado**: Cambio rápido entre herramientas sin perder contexto
5. **Colapsable**: Se puede ocultar completamente para maximizar el canvas

## 💡 Mejoras vs. Layout Anterior

### Antes:

- 3 paneles separados (izquierda, centro, derecha)
- Canvas comprimido entre paneles
- Difícil gestionar en pantallas pequeñas

### Ahora:

- 1 panel unificado (izquierda)
- Canvas maximizado (centro + derecha)
- Mejor uso del espacio disponible
- Experiencia más profesional tipo "IDE"
