import * as vscode from 'vscode';
import * as path from 'path';
import { INode } from './INode';
import { IConnection } from '../common/IConnection';
import { InfoNode } from './infoNode';

export class ResourceNode implements INode {

    constructor(public readonly uri: string, private readonly connection: IConnection) {}
  
    public getTreeItem(): vscode.TreeItem {
      return {
        label: this.uri,
        collapsibleState: vscode.TreeItemCollapsibleState.None,
        iconPath: {
          light: path.join(__dirname, '../../resources/light/resource.svg'),
          dark: path.join(__dirname, '../../resources/dark/resource.svg')
        }
      };
    }
  
    public async getChildren(): Promise<INode[]> {    
      return [];
    }
  }