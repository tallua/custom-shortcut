
import * as vscode from 'vscode';

import { Shortcut } from '../shortcut_provider';
import { JsonDirectoryScehma } from '../common/json_schema'

export class JsonShortcut implements Shortcut {

    public readonly collapsibleState = vscode.TreeItemCollapsibleState.None;
    public readonly label : string | undefined;
    public readonly command : vscode.Command;

    constructor(public readonly json : JsonDirectoryScehma) {
        console.debug('JsonShortcut : creating : ' + json.name);
        this.label = json.name;

        const url = json.url;
        this.command = {
            command: 'custom-shortcut.open-link',
            title: '',
            arguments: [url]
        };
    }

    isFolderType() : boolean {
        return false;
    }

    getChilds() : Shortcut[] {
        return [];
    }
}
