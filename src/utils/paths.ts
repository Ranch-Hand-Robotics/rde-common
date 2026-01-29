// Copyright (c) Andrew Short. All rights reserved.
// Licensed under the MIT License.

import * as path from "path";

/**
 * Converts an absolute path to a workspace-relative path.
 * If the path is within the workspace, returns a relative path.
 * Otherwise, returns the original absolute path.
 */
export function makeWorkspaceRelative(absolutePath: string | null | undefined, workspaceRoot: string | null | undefined): string {
    if (!absolutePath || !workspaceRoot) {
        return absolutePath || "";
    }
    
    // Normalize both paths for comparison
    const normalizedAbsolute = path.normalize(absolutePath);
    const normalizedWorkspace = path.normalize(workspaceRoot);
    
    // Check if the path is within the workspace
    // Add path separator to ensure we're matching the full directory name
    const workspaceWithSep = normalizedWorkspace.endsWith(path.sep) 
        ? normalizedWorkspace 
        : normalizedWorkspace + path.sep;
    
    if (normalizedAbsolute.startsWith(workspaceWithSep) || normalizedAbsolute === normalizedWorkspace) {
        const relativePath = path.relative(normalizedWorkspace, normalizedAbsolute);
        return relativePath;
    }
    
    // Path is outside the workspace, return as-is
    return absolutePath;
}

/**
 * Gets the current workspace root directory.
 * Replaces deprecated vscode.workspace.rootPath
 */
export function getWorkspaceRoot(): string | undefined {
    const vscode = require("vscode");
    return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
}
