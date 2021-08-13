import * as vscode from 'vscode';
import * as path from 'path';
import * as cp from "child_process";

import BaseCommand from "../common/baseCommand";
import { Global } from "../common/global";
import { logger } from "../logging/logger";

'use strict';

export class genDevCertsCommand extends BaseCommand {

    async run() {
        //TODO: replace with popup for user to select which folder this certs would be generated

        // determine project root path
        const workspaceRoot = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
            ? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;
        if (!workspaceRoot) {
            return;
        }

        // append example path (TODO - auto-detect based on zephyr west gen)
        const pattern = path.join(workspaceRoot, 'pelion-dm-example');

        // determine creds generator script
        let commandPath = Global.context.asAbsolutePath(path.join('utils', 'dev_init'));
        const output = await this.execShell(`${commandPath} with-credentials -a ${Global.curConnectionAccessKey} -u https://api.us-east-1.mbedcloud.com`, pattern);

        logger.info(output);
    }

    execShell = (cmd: string, path: string) =>
        new Promise<string>((resolve, reject) => {
            cp.exec(cmd, { cwd: path }, (err, out) => {
                if (err) {
                    return resolve(cmd + ' An error has occured!');
                }
                // inform user
                vscode.window.showInformationMessage('Development certificates successfully generated!');
                return resolve(out);
            });
        });
}