import * as vscode from 'vscode';

/**
 * Configuration helper for VSCode extensions
 */
export class ConfigurationHelper {
  private readonly configSection: string;

  constructor(configSection: string) {
    this.configSection = configSection;
  }

  /**
   * Get a configuration value
   */
  get<T>(key: string, defaultValue?: T): T | undefined {
    const config = vscode.workspace.getConfiguration(this.configSection);
    const value = config.get<T>(key);
    return value !== undefined ? value : defaultValue;
  }

  /**
   * Update a configuration value
   */
  async update(key: string, value: any, configurationTarget?: vscode.ConfigurationTarget): Promise<void> {
    const config = vscode.workspace.getConfiguration(this.configSection);
    await config.update(key, value, configurationTarget);
  }

  /**
   * Check if a configuration key exists
   */
  has(key: string): boolean {
    const config = vscode.workspace.getConfiguration(this.configSection);
    return config.has(key);
  }

  /**
   * Watch for configuration changes
   */
  onDidChange(callback: (event: vscode.ConfigurationChangeEvent) => void): vscode.Disposable {
    return vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration(this.configSection)) {
        callback(event);
      }
    });
  }
}
