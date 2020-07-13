
import * as vscode from 'vscode';
import * as fs from 'fs';

import { Shortcut } from '../shortcut_provider';
import { ShortcutFactory } from '../shortcut_factory';

export class ShortcutDirectory implements Shortcut {

    public readonly collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    public readonly label : string | undefined;

    constructor(public readonly fullpath : string) {
        console.debug('ShortcutDirectory : creating : ' + fullpath); 
        this.label = fullpath.split('/').pop();
    }

    isFolderType() : boolean {
        return true;
    }

    getChilds() : Shortcut[] {
        let childs = fs.readdirSync(this.fullpath);
        childs = childs.map((s) => { return this.fullpath + '/' + s; });

        const result : Shortcut[] = ShortcutFactory.createShortcuts(childs);
        console.debug('ShortcutDirectory : ' + result.length + ' childs on : ' 
            + this.fullpath);

        return result;
    }
}
