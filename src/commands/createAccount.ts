import * as vscode from 'vscode';

import BaseCommand from "../common/baseCommand";

'use strict';

export class createAccountCommand extends BaseCommand {

    async run() {
        vscode.env.openExternal(vscode.Uri.parse('https://pelion.com/try/device-management-trial/'));  
    }
}