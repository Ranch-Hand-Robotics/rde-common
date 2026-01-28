// Mock VSCode API for testing
module.exports = {
  window: {
    createOutputChannel: jest.fn(() => ({
      appendLine: jest.fn(),
      show: jest.fn(),
      dispose: jest.fn(),
    })),
  },
  workspace: {
    getConfiguration: jest.fn(() => ({
      get: jest.fn(),
      has: jest.fn(),
      update: jest.fn(),
    })),
    onDidChangeConfiguration: jest.fn(() => ({
      dispose: jest.fn(),
    })),
  },
  commands: {
    registerCommand: jest.fn(() => ({
      dispose: jest.fn(),
    })),
    registerTextEditorCommand: jest.fn(() => ({
      dispose: jest.fn(),
    })),
    executeCommand: jest.fn(),
    getCommands: jest.fn(),
  },
  ConfigurationTarget: {
    Global: 1,
    Workspace: 2,
    WorkspaceFolder: 3,
  },
};
