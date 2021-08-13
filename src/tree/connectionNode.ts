import * as vscode from 'vscode';
import * as path from 'path';
import { INode } from './INode';
import { IConnection } from '../common/IConnection';
import { PelionConnection } from '../common/pelionConnection';
import { InfoNode } from './infoNode';
import { DeviceNode } from './deviceNode';
import { logger } from "../logging/logger";

export class ConnectionNode implements INode {

  constructor(public readonly id: string, private readonly connection: IConnection) {}

  public getTreeItem(): vscode.TreeItem {
    return {
      label: "Devices",
      collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
      iconPath: {
        light: path.join(__dirname, '../../resources/light/root.svg'),
        dark: path.join(__dirname, '../../resources/dark/root.svg')
      }
    };
  }

  public async getChildren(): Promise<INode[]> {
    try {
      const res = await PelionConnection.getInstance(this.connection).getDevices();
      logger.debug(res);

      return res.data.data.map<DeviceNode>(device => {
        return new DeviceNode(device.id);
      });
    } catch(err) {
      return [new InfoNode(err)];
    } finally {
      //
    }
  }
}