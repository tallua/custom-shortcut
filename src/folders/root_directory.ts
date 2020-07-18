
import * as vscode from 'vscode';

import { Shortcut } from '../shortcut_provider';
import { ShortcutFactory } from '../shortcut_factory';

export class RootDirectory implements Shortcut {
    public readonly collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;

    constructor(public readonly pathlist : string[]) {
        console.debug('RootDirectory : creating'); 
    }

    isFolderType() : boolean {
        return true;
    }

    getChilds() : Shortcut[] {
        return ShortcutFactory.createShortcuts(this.pathlist);
    }
}
