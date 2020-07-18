
import * as vscode from 'vscode';
import * as fs from 'fs';

import { Shortcut, ShortcutFolder } from '../shortcut_provider';
import { ShortcutFactory } from '../shortcut_factory';

export class ShortcutDirectory extends ShortcutFolder {
    public readonly label : string | undefined;

    constructor(provider : string, public readonly fullpath : string) {
        super(provider);
        console.debug('ShortcutDirectory : creating : ' + fullpath); 
        this.label = fullpath.split('/').pop();
    }

    getChilds() : Shortcut[] {
        let childs = fs.readdirSync(this.fullpath);
        childs = childs.map((s) => { return this.fullpath + '/' + s; });

        const result : Shortcut[] = ShortcutFactory.createShortcuts(this.provider, childs);
        console.debug('ShortcutDirectory : ' + result.length + ' childs on : ' 
            + this.fullpath);

        return result;
    }
}
