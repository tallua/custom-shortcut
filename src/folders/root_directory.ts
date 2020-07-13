
import * as vscode from 'vscode';
import { Shortcut } from '../shortcut_provider';
import { ShortcutFactory } from '../shortcuts/shortcut_factory';

import { ShortcutDirectory } from './shortcut_directory';

export class RootDirectory implements Shortcut {

    public readonly collapsibleState = vscode.TreeItemCollapsibleState.Expanded;

    constructor(public readonly pathlist : string[]) {
        console.debug('RootDirectory : creating'); 
    }

    isFolderType() : boolean {
        return true;
    }

    getChilds() : Shortcut[] {
        return this.pathlist.map(path => new ShortcutDirectory(path));
    }
}
