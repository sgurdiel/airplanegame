# Airplane Game

A classic web-based airplane game originally developed in JavaScript during the early 2000s, now modernized with TypeScript, Webpack, and Jest. This project demonstrates contemporary web development practices using Domain-Driven Design (DDD) and Hexagonal Architecture patterns.

## Table of Contents

- [Getting Started](#getting-started)
- [Folder Structure](#folder-structure)
- [Architecture](#architecture)
- [Available Scripts](#available-scripts)
- [Development](#development)
- [Testing](#testing)
- [Building](#building)
- [License](#license)

## Getting Started

### Prerequisites

- **Node.js**
- **npm** or **yarn** package manager
- A modern web browser

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development build:
   ```bash
   npm run dev:watch
   ```

4. Open `public/index.html` in your web browser

## Folder Structure

```
airplanegame/
├── src/                   # TypeScript source code
│   ├── App.ts             # Application entry point
│   ├── Game.ts            # Game logic
│   ├── Enemy/             # Enemy domain
│   │   ├── Domain/        # Core interfaces
│   │   └── Infrastructure/# Concrete implementations
│   ├── Player/            # Player domain
│   │   ├── Domain/        # Core interfaces
│   │   └── Infrastructure/# Concrete implementations
│   ├── Hit/               # Collision/hit detection domain
│   │   ├── Domain/        # Core interfaces
│   │   └── Infrastructure/# Concrete implementations
│   └── IO/                # Input/Output and UI domain
│   │   ├── Domain/        # Core interfaces
│   │   └── Infrastructure/# Concrete implementations
├── test/                  # Test suite
│   └── unit/              # Unit tests mirroring src/ structure
├── public/                # Build output and static assets
│   ├── index.html         # Main HTML file
│   ├── css/               # Stylesheets
│   └── js/                # Generated JavaScript bundles
├── templates/             # HTML templates
├── webpack.config.cjs     # Webpack configuration
├── jest.config.ts         # Jest testing configuration
└── package.json           # Project dependencies
```

## Architecture

This project follows two key architectural patterns:

### 1. Domain-Driven Design (DDD)

The codebase is organized around business domains:
- **Enemy**: Airplane enemies and missile mechanics
- **Player**: Player airplane and controls
- **Hit**: Collision and explosion systems
- **IO**: User interface and input handling

### 2. Hexagonal Architecture (Ports and Adapters)

Each domain is separated into two layers:

- **Domain Layer** (`Domain/` directories)
  - Contains TypeScript interfaces that define contracts
  - Represents business logic independent of implementation
  - Examples: `EnemyInterface.ts`, `PlayerInterface.ts`, `EnemyInterface.ts`

- **Infrastructure Layer** (`Infrastructure/` directories)
  - Contains concrete implementations using web technologies
  - DOM adapters handle rendering (`Infrastructure/Dom/` folders)
  - Decoupled from core game logic

This separation enables independent evolution of business logic and presentation layers, with the possibility to swap DOM implementations with Canvas or other rendering engines without modifying core logic.

## Available Scripts

### Development

| Script | Description |
|--------|-------------|
| `npm run dev:watch` | Watch and rebuild on code changes (development mode) |
| `npm run dev:build` | Single development build with source maps |
| `npm run pro:build` | Optimized production build |

### Code Quality

| Script | Description |
|--------|-------------|
| `npm run lint` | Check TypeScript code with ESLint |
| `npm run format` | Auto-format code with Prettier |
| `npm run format:check` | Check code formatting without changes |

### Testing

| Script | Description |
|--------|-------------|
| `npm test` | Run full test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate coverage reports |

## Development

### Setup Development Environment

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development watcher:
   ```bash
   npm run dev:watch
   ```

3. The bundled files will be output to the `public/` directory

### Code Style

The project enforces consistent code style using:
- **ESLint** for linting
- **Prettier** for formatting

Check and fix code before committing:
```bash
npm run lint
npm run format
```

## Testing

Tests are organized in the `test/` directory, mirroring the `src/` structure for easy navigation.

### Run Tests

```bash
npm test              # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

### Test Structure

- Unit tests use **Jest** testing framework
- DOM tests initialize the document in `test/DomDocumentInit.ts`
- Test files follow the `*.test.ts` naming convention

## Building

### Development Build

Creates bundle with source maps for easier debugging:
```bash
npm run dev:build
```

### Production Build

Optimized and minified bundle:
```bash
npm run pro:build
```

Output files are generated in the `public/` directory and ready for deployment.

## Technology Stack

- **TypeScript** - Static typing and enhanced IDE support
- **Webpack** - Module bundler and build system
- **Jest** - Unit testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **HTML5** - Modern web standards

## License

ISC