# rde-common

Common functionality for VSCode extensions by Ranch Hand Robotics.

## Installation

```bash
npm install rde-common
```

## Features

This package provides common utilities for VSCode extensions:

- **Logger**: Structured logging with output channels
- **ConfigurationHelper**: Easy configuration management
- **CommandHelper**: Command registration and execution helpers

## Usage

### Logger

```typescript
import { Logger, LogLevel } from 'rde-common';

const logger = new Logger('My Extension', LogLevel.INFO);

logger.info('Extension activated');
logger.warn('Something might be wrong');
logger.error('An error occurred', error);
logger.debug('Debug information');

// Show the output channel
logger.show();
```

### ConfigurationHelper

```typescript
import { ConfigurationHelper } from 'rde-common';

const config = new ConfigurationHelper('myExtension');

// Get configuration values
const value = config.get<string>('someKey', 'defaultValue');

// Update configuration
await config.update('someKey', 'newValue');

// Watch for changes
const disposable = config.onDidChange((event) => {
  console.log('Configuration changed');
});
```

### CommandHelper

```typescript
import { CommandHelper } from 'rde-common';

const commandHelper = new CommandHelper();

// Register a command
commandHelper.registerCommand('myExtension.doSomething', () => {
  console.log('Command executed');
});

// Register a text editor command
commandHelper.registerTextEditorCommand('myExtension.transform', (editor, edit) => {
  // Modify the editor
});

// Execute a command
await commandHelper.executeCommand('workbench.action.files.save');
```

## Development

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

### Watch Mode

```bash
npm run watch
```

## License

MIT License - Copyright (c) 2026 Ranch Hand Robotics, LLC
