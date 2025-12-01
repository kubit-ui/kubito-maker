# Contributing to Kubito Editor

Thank you for your interest in contributing to Kubito Editor! This document provides guidelines and instructions for contributing to the project.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- A code editor (VS Code recommended)

### Setup Development Environment

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd kubito-editor
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## 📝 Development Workflow

### Code Style

We use ESLint and Prettier to maintain code quality:

```bash
# Check code style
npm run lint
npm run format:check

# Auto-fix issues
npm run lint:fix
npm run format
```

### Type Checking

Always ensure TypeScript types are correct:

```bash
npm run type-check
```

### Testing

Write tests for new features and bug fixes:

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage

# Open test UI
npm run test:ui
```

### Before Committing

Run the validation script to ensure everything passes:

```bash
npm run validate
```

This will run type checking, linting, and tests.

## 🏗️ Project Structure

```
src/
├── assets/          # SVG assets for editor
├── components/      # React components
├── data/            # Static data (bodies, presets)
├── store/           # Zustand state management
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── test/            # Test setup files
```

## 📚 Documentation

### TSDoc Comments

All public APIs, functions, and types should have TSDoc comments in English:

```typescript
/**
 * Calculates the bounding box of a canvas item.
 * @param item - The item to calculate bounds for
 * @returns Bounding box with position and dimensions
 */
export const getItemBounds = (item: KubitoItem) => {
  // ...
};
```

### Component Documentation

React components should document their props:

```typescript
/**
 * Canvas component for rendering and editing Kubito items.
 * @component
 */
interface CanvasProps {
  /** Canvas width in pixels */
  width: number;
  /** Canvas height in pixels */
  height: number;
}
```

## ✅ Pull Request Process

1. **Create a branch** from `main`

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**

   ```bash
   npm run validate
   ```

4. **Commit your changes**
   - Use clear, descriptive commit messages
   - Follow conventional commits format

5. **Push and create PR**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **PR Review**
   - Address any feedback
   - Ensure CI passes
   - Wait for maintainer approval

## 🐛 Bug Reports

When reporting bugs, please include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information
- Screenshots if applicable

## 💡 Feature Requests

For feature requests:

- Explain the use case
- Describe the proposed solution
- Consider alternative approaches
- Discuss impact on existing features

## 🔧 Coding Guidelines

### TypeScript

- Use explicit types where beneficial
- Avoid `any` type
- Leverage type inference when obvious
- Use interfaces for object shapes

### React

- Prefer functional components
- Use hooks appropriately
- Keep components focused and small
- Memoize expensive computations

### State Management

- Use Zustand store for global state
- Keep component state local when possible
- Update history for user actions

### Styling

- Use Tailwind CSS utilities
- Follow existing design patterns
- Ensure responsive design
- Test in multiple browsers

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the issue, not the person
- Help create a welcoming environment

## ❓ Questions?

If you have questions:

- Check existing issues and discussions
- Open a new issue for clarification
- Join our community chat (if available)

Thank you for contributing! 🎉
