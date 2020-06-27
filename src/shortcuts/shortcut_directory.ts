
import * as vscode from 'vscode';
import { Shortcut } from '../shortcut_provider';
import { FileShortcut } from './file_shortcut';

import * as fs from 'fs';

export class ShortcutDirectory implements Shortcut {

    public readonly collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    public readonly label : string | undefined;

    constructor(public readonly fullpath : string) { 
        this.label = fullpath.split('/').pop();
    }

    isFolderType() : boolean {
        return true;
    }

    getChilds() : Shortcut[] {
        let childs = fs.readdirSync(this.fullpath);
        childs = childs.map((s) => { return this.fullpath + '/' + s; });
        console.log(childs.length + ' childs found on ' + this.fullpath);

        const shortcuts = childs.map(fullpath => {
            const lstat = fs.lstatSync(fullpath);

            if(lstat.isDirectory()) {
                return new ShortcutDirectory(fullpath);
            } else if(lstat.isFile()) {
                return new FileShortcut(fullpath);
            } else {
                return null;
            }
        });

        function nullfilter<TValue>(value : TValue | null | undefined) : value is TValue {
            return value !== null && value !== undefined;
        }

        const result = shortcuts.filter(nullfilter);
        console.log(result.length + ' childs left on ' + this.fullpath);

        result.forEach(element => {
            if(element.isFolderType()) {
                console.log('folder : ' + element.fullpath);
            } else {
                console.log('file : ' + element.fullpath);
            }
        });

        return result;
    }

    open() : boolean {
        return false;
    }
}
