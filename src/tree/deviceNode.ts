import * as vscode from 'vscode';
import * as path from 'path';
import { INode } from './INode';
import { IConnection } from '../common/IConnection';
import { PelionConnection } from '../common/pelionConnection';
import { InfoNode } from './infoNode';
import { ResourceNode } from './resourceNode';
import { logger } from "../logging/logger";

export class DeviceNode implements INode {

    constructor(public readonly deviceId: string, private readonly connection: IConnection) {}
  
    public getTreeItem(): vscode.TreeItem {
      return {
        label: this.deviceId,
        collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
        iconPath: {
          light: path.join(__dirname, '../../resources/light/microcontroller.svg'),
          dark: path.join(__dirname, '../../resources/dark/microcontroller.svg')
        }
      };
    }
  
    public async getChildren(): Promise<INode[]> {
      try {
        const res = await PelionConnection.getInstance().getResources(this.deviceId);
        logger.debug(res);
  
        return res.data.map<ResourceNode>(resource => {
          return new ResourceNode(resource.uri);
        });
      } catch(err) {
        return [new InfoNode(err)];
      } finally {
        //
      }
    }
  }
}