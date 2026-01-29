// Copyright (c) Andrew Short. All rights reserved.
// Licensed under the MIT License.

import * as fs from "fs";

/**
 * Detected shell information
 */
export interface ShellInfo {
    name: string;
    executable: string;
    scriptExtension: string;
    sourceCommand: string;
}

/**
 * Detects the user's shell on Linux/macOS systems
 */
export function detectUserShell(): ShellInfo {
    if (process.platform === "win32") {
        return {
            name: "cmd",
            executable: "cmd",
            scriptExtension: ".bat",
            sourceCommand: "call"
        };
    }

    // Get shell from environment or fallback to bash
    let shellPath = process.env.SHELL || "/bin/bash";
    
    // Extract shell name from path
    const shellName = shellPath.split("/").pop() || "bash";
    
    // Map shell to appropriate configuration
    switch (shellName) {
        case "zsh":
            return {
                name: "zsh",
                executable: shellPath,
                scriptExtension: ".zsh",
                sourceCommand: "source"
            };
        case "fish":
            return {
                name: "fish",
                executable: shellPath,
                scriptExtension: ".fish",
                sourceCommand: "source"
            };
        case "dash":
        case "sh":
            return {
                name: "sh",
                executable: shellPath,
                scriptExtension: ".sh",
                sourceCommand: "."
            };
        case "tcsh":
        case "csh":
            return {
                name: "csh",
                executable: shellPath,
                scriptExtension: ".csh",
                sourceCommand: "source"
            };
        case "bash":
        default:
            // Default to bash for unknown shells or bash itself
            return {
                name: "bash",
                executable: shellPath,
                scriptExtension: ".bash",
                sourceCommand: "source"
            };
    }
}

/**
 * Gets the appropriate setup script extension for the detected shell
 */
export function getSetupScriptExtension(): string {
    return detectUserShell().scriptExtension;
}

/**
 * Finds Visual Studio installations by reading from the Windows registry
 */
export function findVisualStudioInstallations(): string[] {
    if (process.platform !== "win32") {
        return [];
    }

    const installations: string[] = [];
    const child_process = require("child_process");

    try {
        const vswhereCmd = '"C:\\Program Files (x86)\\Microsoft Visual Studio\\Installer\\vswhere.exe" -all -property installationPath';
        const vswhereResult = child_process.execSync(vswhereCmd, { 
            encoding: 'utf8', 
            timeout: 5000,
            windowsHide: true 
        });
        
        const installPaths = vswhereResult.trim().split('\n').filter((p: string) => p.trim());
        for (const installPath of installPaths) {
            const vcvarsPath = `${installPath.trim()}\\VC\\Auxiliary\\Build\\vcvarsall.bat`;
            if (fs.existsSync(vcvarsPath)) {
                installations.push(vcvarsPath);
            }
        }
    } catch (vswhereError) {
        // Silently fail if vswhere is not available
    }

    // Remove duplicates and return
    return [...new Set(installations)];
}
