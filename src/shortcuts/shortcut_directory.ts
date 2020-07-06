
import * as vscode from 'vscode';
import { Shortcut } from '../shortcut_provider';
import { FileShortcutFactory } from './file_shortcut_factory';

import * as fs from 'fs';

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

        const shortcuts = childs.map(fullpath => {
            const lstat = fs.lstatSync(fullpath);

            if(lstat.isDirectory()) {
                return new ShortcutDirectory(fullpath);
            } else if(lstat.isFile()) {
                return FileShortcutFactory.getShortcut(fullpath);
            } else {
                return null;
            }
        });

        function nullfilter<TValue>(value : TValue | null | undefined) : value is TValue {
            return value !== null && value !== undefined;
        }

        const result = shortcuts.filter(nullfilter);
        console.debug('ShortcutDirectory : ' + result.length + ' childs on : ' 
            + this.fullpath);

        return result;
    }
}
