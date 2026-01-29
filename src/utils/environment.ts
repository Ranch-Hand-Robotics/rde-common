// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as path from "path";
import * as child_process from "child_process";
import { promises as fsPromises } from "fs";

/**
 * Check if a file or directory exists.
 */
async function exists(filePath: string): Promise<boolean> {
    try {
        await fsPromises.access(filePath);
        return true;
    } catch {
        return false;
    }
}

/**
 * Checks if the Python environment is externally managed (PEP 668).
 * This is common in Ubuntu 24.04+ and other modern Linux distributions.
 */
export async function checkExternallyManagedEnvironment(env: any): Promise<boolean> {
    try {
        // Get the Python installation directory (where stdlib is located)
        const result = await new Promise<string>((resolve, reject) => {
            child_process.exec(`python3 -c "import sysconfig; print(sysconfig.get_path('stdlib'))"`, { env }, (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(stdout.trim());
                }
            });
        });
        
        const stdlibPath = result.trim();
        if (stdlibPath) {
            // On Ubuntu 24.04, EXTERNALLY-MANAGED is in the Python installation directory
            // e.g., /usr/lib/python3.12/EXTERNALLY-MANAGED
            const externallyManagedPath = path.join(stdlibPath, 'EXTERNALLY-MANAGED');
            const existsResult = await exists(externallyManagedPath);
            
            // Also check the parent directory as a fallback
            // e.g., /usr/lib/python3.12/../EXTERNALLY-MANAGED
            if (!existsResult) {
                const altPath = path.join(path.dirname(stdlibPath), 'EXTERNALLY-MANAGED');
                return await exists(altPath);
            }
            
            return existsResult;
        }
        
        return false;
    } catch (err) {
        // If we can't check, assume it's not externally managed
        return false;
    }
}
