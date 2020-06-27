
import * as vscode from 'vscode';
import { Shortcut } from '../shortcut_provider';

import * as fs from 'fs';

export class FileShortcut implements Shortcut {

    public readonly collapsibleState = vscode.TreeItemCollapsibleState.None;
    public readonly label : string | undefined;

    constructor(public readonly fullpath : string) { 
        this.label = fullpath.split('/').pop();
    }


    isFolderType() : boolean {
        return false;
    }

    getChilds() : Shortcut[] {
        return [];
    }
}
