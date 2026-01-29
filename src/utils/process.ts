// Copyright (c) Andrew Short. All rights reserved.
// Licensed under the MIT License.

import * as child_process from "child_process";
import * as os from "os";
import * as path from "path";
import * as fs from "fs";
import { detectUserShell, ShellInfo, findVisualStudioInstallations } from "./shell";

/**
 * Options for sourceSetupFile function
 */
export interface SourceSetupOptions {
    /**
     * Current working directory for command execution
     */
    cwd?: string;
    
    /**
     * Optional callback for logging output
     */
    onOutput?: (message: string) => void;
    
    /**
     * Optional pixi root directory (Windows specific)
     */
    pixiRoot?: string;
}

/**
 * Executes a setup file and returns the resulting environment variables.
 * @param filename Path to the setup file to source
 * @param env Parent environment to use as base
 * @param options Configuration options for setup file sourcing
 * @returns Promise resolving to parsed environment variables
 */
export function sourceSetupFile(filename: string, env?: any, options?: SourceSetupOptions): Promise<any> {
    return new Promise((resolve, reject) => {
        const onOutput = options?.onOutput || (() => {});
        const cwd = options?.cwd || process.cwd();
        const pixiRoot = options?.pixiRoot || "c:\\pixi_ws";
        
        let exportEnvCommand: string;
        
        if (process.platform === "win32") {
            // On Windows, create a composite environment by sourcing multiple setup scripts
            // Use a temporary batch file to avoid command line length limitations
            const tempDir = os.tmpdir();
            const timestamp = Date.now();
            const tempBatchFile = path.join(tempDir, `ros_env_setup_${timestamp}.bat`);
            
            const setupCommands: string[] = [
                "@echo off",
                "REM Composite ROS 2 environment setup script"
            ];
            
            // 1. Visual Studio console environment (vcvarsall.bat)
            const vsInstallations = findVisualStudioInstallations();
            
            // Add VS environment setup if available (only call the first one found)
            for (const vsPath of vsInstallations) {
                setupCommands.push(`if exist "${vsPath}" (`);
                setupCommands.push(`    call "${vsPath}" x64`);
                setupCommands.push(`    goto :vs_done`);
                setupCommands.push(`)`);
            }
            setupCommands.push(":vs_done");
            
            // 2. Pixi shell hook (if available)
            setupCommands.push("REM Setup Pixi environment");
            setupCommands.push(`if exist "${pixiRoot}" (`);
            setupCommands.push(`    cd /d "${pixiRoot}"`);
            setupCommands.push("    where pixi >nul 2>nul");
            setupCommands.push("    if %errorlevel% equ 0 (");
            setupCommands.push("        echo Setting up Pixi environment from " + pixiRoot);
            setupCommands.push(`        set "PIXI_TEMP_BAT=%TEMP%\\pixi_env_${timestamp}.bat"`);
            setupCommands.push("        pixi shell-hook > \"%PIXI_TEMP_BAT%\" 2>nul");
            setupCommands.push("        if exist \"%PIXI_TEMP_BAT%\" (");
            setupCommands.push("            call \"%PIXI_TEMP_BAT%\"");
            setupCommands.push("            del \"%PIXI_TEMP_BAT%\" >nul 2>nul");
            setupCommands.push("        ) else (");
            setupCommands.push("            echo Pixi shell-hook failed to generate environment file");
            setupCommands.push("        )");
            setupCommands.push("    ) else (");
            setupCommands.push("        echo Pixi command not found in PATH");
            setupCommands.push("    )");
            setupCommands.push(") else (");
            setupCommands.push(`    echo Pixi root directory does not exist: ${pixiRoot}`);
            setupCommands.push(")");
            
            // 3. Source the requested setup file
            setupCommands.push(`call "${filename}"`);
            
            // 4. Output environment variables
            setupCommands.push("set");
            
            // Write the batch file
            const batchContent = setupCommands.join("\r\n");
            
            try {
                fs.writeFileSync(tempBatchFile, batchContent);
                exportEnvCommand = `cmd /c "${tempBatchFile}"`;
                
                onOutput(`Created temporary batch file: ${tempBatchFile}`);
            } catch (writeError) {
                onOutput(`Failed to create temporary batch file: ${writeError}`);
                // Fallback to simple approach
                exportEnvCommand = `cmd /c "call "${filename}" && set"`;
            }
        } else {
            const shellInfo = detectUserShell();
            
            // Special handling for different shells
            switch (shellInfo.name) {
                case "fish":
                    // Fish shell has different syntax
                    exportEnvCommand = `${shellInfo.executable} -c "${shellInfo.sourceCommand} '${filename}'; and env"`;
                    break;
                case "csh":
                case "tcsh":
                    // C shell family
                    exportEnvCommand = `${shellInfo.executable} -c "${shellInfo.sourceCommand} '${filename}' && env"`;
                    break;
                default:
                    // Bash, zsh, sh, and other POSIX-compatible shells
                    // Force login shell for ROS compatibility in containers
                    exportEnvCommand = `${shellInfo.executable} --login -c "${shellInfo.sourceCommand} '${filename}' && env"`;
                    break;
            }
            
            onOutput(`Sourcing Environment using ${shellInfo.name}: ${exportEnvCommand}`);
        }

        const processOptions: child_process.ExecOptions = {
            cwd,
            env,
            // Increase timeout for complex Windows setup chains
            timeout: 60000,
            // Set max buffer size to handle large environment outputs
            maxBuffer: 1024 * 1024, // 1MB
        };
        
        child_process.exec(exportEnvCommand, processOptions, (error, stdout, stderr) => {
            // Clean up temporary batch files on Windows
            if (process.platform === "win32" && exportEnvCommand.includes("ros_env_setup_")) {
                try {
                    const tempFile = exportEnvCommand.match(/"([^"]*ros_env_setup_[^"]*\.bat)"/)?.[1];
                    if (tempFile) {
                        fs.unlinkSync(tempFile);
                        onOutput(`Cleaned up temporary batch file: ${tempFile}`);
                        
                        // Also try to clean up the pixi temp file if it exists
                        const pixiTempFile = tempFile.replace("ros_env_setup_", "pixi_env_");
                        if (fs.existsSync(pixiTempFile)) {
                            fs.unlinkSync(pixiTempFile);
                            onOutput(`Cleaned up pixi temporary batch file: ${pixiTempFile}`);
                        }
                    }
                } catch (cleanupError) {
                    onOutput(`Failed to cleanup temporary files: ${cleanupError}`);
                }
            }
            
            if (error) {
                onOutput(`Shell sourcing error: ${error.message}`);
                if (stderr) {
                    onOutput(`Shell stderr: ${stderr}`);
                }
                reject(error);
                return;
            }

            if (stderr) {
                onOutput(`Shell stderr: ${stderr}`);
            }

            if (stdout) {
                onOutput(`Shell stdout: ${stdout}`);
            }                

            try {
                // Parse environment variables with better error handling
                const stdoutString = typeof stdout === 'string' ? stdout : stdout.toString();
                const parsedEnv = stdoutString
                    .split(os.EOL)
                    .filter((line: string) => line.trim().length > 0) // Filter empty lines
                    .reduce((envObj: Record<string, string>, line: string) => {
                        const equalIndex = line.indexOf("=");
                        
                        // Skip lines that don't contain environment variables
                        if (equalIndex === -1 || equalIndex === 0) {
                            return envObj;
                        }
                        
                        const key = line.substring(0, equalIndex).trim();
                        const value = line.substring(equalIndex + 1);
                        
                        // Skip empty keys or keys with spaces (invalid env vars)
                        if (key && !key.includes(" ")) {
                            envObj[key] = value;
                        }
                        
                        return envObj;
                    }, {});
                
                onOutput(`Successfully parsed ${Object.keys(parsedEnv).length} environment variables`);
                resolve(parsedEnv);
                
            } catch (parseError) {
                onOutput(`Failed to parse environment variables: ${parseError}`);
                reject(parseError);
            }
        });
    });
}
