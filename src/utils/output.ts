// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as vscode from "vscode";

/**
 * Creates a named output channel in VS Code
 * @param channelName The name of the output channel
 * @returns The created output channel
 */
export function createOutputChannel(channelName: string): vscode.OutputChannel {
    return vscode.window.createOutputChannel(channelName);
}

/**
 * Shows an output channel if a configuration key indicates auto-show is enabled
 * @param outputChannel The output channel to show
 * @param section The configuration section (default: "ROS2")
 * @param configKey The configuration key to check (default: "autoShowOutputChannel")
 */
export function showOutputPanelIfConfigured(
    outputChannel: vscode.OutputChannel, 
    section: string = "ROS2",
    configKey: string = "autoShowOutputChannel"
): void {
    const config = vscode.workspace.getConfiguration(section);
    if (config.get<boolean>(configKey, true)) {
        outputChannel.show();
    }
}
