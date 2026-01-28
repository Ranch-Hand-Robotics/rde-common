import * as vscode from 'vscode';

/**
 * Command registration helper for VSCode extensions
 */
export class CommandHelper {
  private disposables: vscode.Disposable[] = [];

  /**
   * Register a command
   */
  registerCommand(command: string, callback: (...args: any[]) => any): vscode.Disposable {
    const disposable = vscode.commands.registerCommand(command, callback);
    this.disposables.push(disposable);
    return disposable;
  }

  /**
   * Register a text editor command
   */
  registerTextEditorCommand(
    command: string,
    callback: (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, ...args: any[]) => void
  ): vscode.Disposable {
    const disposable = vscode.commands.registerTextEditorCommand(command, callback);
    this.disposables.push(disposable);
    return disposable;
  }

  /**
   * Execute a command
   */
  async executeCommand<T = any>(command: string, ...args: any[]): Promise<T> {
    return await vscode.commands.executeCommand<T>(command, ...args);
  }

  /**
   * Get all registered commands
   */
  async getCommands(filterInternal: boolean = true): Promise<string[]> {
    return await vscode.commands.getCommands(filterInternal);
  }

  /**
   * Dispose all registered commands
   */
  dispose(): void {
    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];
  }
}
