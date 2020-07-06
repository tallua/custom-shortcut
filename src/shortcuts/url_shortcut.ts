
import * as vscode from 'vscode';
import { Shortcut } from '../shortcut_provider';

import * as fs from 'fs';

export class URLShortcut implements Shortcut {

    public readonly collapsibleState = vscode.TreeItemCollapsibleState.None;
    public readonly label : string | undefined;
    public readonly path : string;
    public readonly command : vscode.Command;

    constructor(public readonly fullpath : string) {
        console.debug('URLShortcut : creating : ' + fullpath);
        this.label = fullpath.split('/').pop();
        this.path = fullpath;

        const url = this.getUrl();
        this.command = {
            command: 'custom-shortcut.open-web',
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

    getUrl() : string {
        const lines = fs.readFileSync(this.path).toString().split(/\r?\n/);
        const types = lines.filter((line : string) => line === '[InternetShortcut]');
        if(types.length === 0) {
            console.error('URLShortcut : not an InternetShortcut : ' + this.fullpath);
            return '';
        }

        const urls = lines.filter((line : string) => line.startsWith('URL='));
        if(urls.length === 0) {
            console.error('URLShortcut : missing URL : ' + this.fullpath);
            return '';
        }

        return urls[0].substring(4);
    }
}
