import * as vscode from 'vscode';
import { PelionTreeDataProvider } from "../tree/treeProvider";
import { IConnection } from "../common/IConnection";
import BaseCommand from "../common/baseCommand";
import { Constants } from "../common/constants";
import { v1 as uuidv1 } from 'uuid';
import { Global } from "../common/global";
import { MultiStepInput } from "../common/multiStepInput";

'use strict';

export class setAccessKeyCommand extends BaseCommand {

    readonly TITLE: string = 'Set Pelion Access Key';
    readonly TotalSteps: number = 1;

    async run() {
        const state = { label: 'default' } as Partial<ConnectionState>;
        if (!(await MultiStepInput.run(input => this.setAccessKey(input, state)))) {
            // command cancelled
            return;
        }

        const tree = PelionTreeDataProvider.getInstance();

        let connections = tree.context.globalState.get<{ [key: string]: IConnection }>(Constants.GlobalStateKey);
        if (!connections) connections = {};
    
        const id = uuidv1();
        connections[id] = {
          label: state.label,
          accessKey: state.accessKey
        };

        // securely store access key
        await Global.keytar.setPassword(Constants.ExtensionId, id, state.accessKey);
        
        // refresh tree
        await tree.context.globalState.update(Constants.GlobalStateKey, connections);
        tree.refresh();
    }

    async setAccessKey(input: MultiStepInput, state: Partial<ConnectionState>) {
        state.accessKey = await input.showInputBox({
            title: this.TITLE,
            step: input.CurrentStepNumber,
            totalSteps: this.TotalSteps,
            prompt: 'The Access Key as obtained from Pelion Portal',
            ignoreFocusOut: true,
            value: (typeof state.accessKey === 'string') ? state.accessKey : '',
            validate: async (value) => (!value || !value.trim()) ? 'Access Key is required' : ''
        });
    }
}

interface ConnectionState {
    label: string;
    accessKey: string;
}