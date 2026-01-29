// Existing utilities
export { Logger, LogLevel } from './logger';
export { ConfigurationHelper } from './configuration';
export { CommandHelper } from './commands';

// Path utilities
export { makeWorkspaceRelative, getWorkspaceRoot } from './paths';

// Extension detection
export { getPackageInfo, IPackageInfo, isLldbExtensionInstalled, isCppToolsExtensionInstalled, isPythonExtensionInstalled, isCursorEditor } from './extensions';

// Shell utilities
export { detectUserShell, getSetupScriptExtension, findVisualStudioInstallations, ShellInfo } from './shell';

// Environment utilities
export { checkExternallyManagedEnvironment } from './environment';

// Process utilities
export { sourceSetupFile, SourceSetupOptions } from './process';

// Output utilities
export { createOutputChannel, showOutputPanelIfConfigured } from './output';
