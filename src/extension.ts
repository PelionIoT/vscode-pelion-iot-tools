'use strict';

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { PelionTreeDataProvider } from './tree/treeProvider';
import { Global } from './common/global';
import { logger } from "./logging/logger";
import { Constants } from "./common/constants";
import { IConnection } from './common/IConnection';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext): Promise<boolean> {
	logger.info(
        `Activating extension '${Constants.ExtensionId}'...`
    );

	// delete all connections (dev-only)
	Global.context = context;
	let connections = Global.context.globalState.get<{ [key: string]: IConnection }>(Constants.GlobalStateKey);
	for (const id of Object.keys(connections)) {
		let connection: IConnection = Object.assign({}, connections[id]);
		delete connections[id];

		Global.context.globalState.update(Constants.GlobalStateKey, connections);
		Global.keytar.deletePassword(Constants.ExtensionId, id);
	}


	let treeProvider: PelionTreeDataProvider = PelionTreeDataProvider.getInstance(context);
	Global.context = context;
		
	// activate commands
	try {
		let commandPath = context.asAbsolutePath(path.join('out', 'commands'));
		let files = fs.readdirSync(commandPath);
		for (const file of files) {
		  if (path.extname(file) === '.map') continue;
		  let baseName = path.basename(file, '.js');
		  let className = baseName + 'Command';
	
		  let commandClass = require(`./commands/${baseName}`);
		  new commandClass[className](context);
		}
	  }
	  catch (err) {
		console.error('Command loading error:', err);
	  }
	// done.
    logger.info(`Extension activated.`);
	return Promise.resolve(true);
}

// this method is called when your extension is deactivated
export function deactivate() {}
