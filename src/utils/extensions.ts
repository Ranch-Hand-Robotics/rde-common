// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as vscode from "vscode";

export interface IPackageInfo {
    name: string;
    version: string;
    aiKey: string;
}

/**
 * Extracts package metadata from an extension's package.json
 * @param extensionId The extension ID (e.g., 'ms-vscode.cpptools')
 * @returns Package information or undefined if not found
 */
export function getPackageInfo(extensionId: string): IPackageInfo | undefined {
    const extension = vscode.extensions.getExtension(extensionId);
    if (!extension) {
        return undefined;
    }
    
    const metadata = extension.packageJSON;
    if (metadata && ("name" in metadata) && ("version" in metadata) && ("aiKey" in metadata)) {
        return {
            name: metadata.name,
            version: metadata.version,
            aiKey: metadata.aiKey,
        };
    }
    return undefined;
}

/**
 * Detects if the vadimcn.vscode-lldb extension is installed
 * @returns true if the LLDB extension is installed, false otherwise
 */
export function isLldbExtensionInstalled(): boolean {
    const lldbExtension = vscode.extensions.getExtension('vadimcn.vscode-lldb');
    return lldbExtension !== undefined;
}

/**
 * Detects if the Microsoft C/C++ extension is installed
 * @returns true if the C/C++ extension is installed, false otherwise
 */
export function isCppToolsExtensionInstalled(): boolean {
    const cppToolsExtension = vscode.extensions.getExtension('ms-vscode.cpptools');
    return cppToolsExtension !== undefined;
}

/**
 * Detects if the Microsoft Python extension is installed
 * @returns true if the Python extension is installed, false otherwise
 */
export function isPythonExtensionInstalled(): boolean {
    const pythonExtension = vscode.extensions.getExtension('ms-python.python');
    return pythonExtension !== undefined;
}

/**
 * Detects if running in Cursor editor
 * @returns true if running in Cursor, false otherwise
 */
export function isCursorEditor(): boolean {
    return vscode.env.appName.includes('Cursor');
}
